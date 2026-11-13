import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { analyzeProject } from '../src/analyzer.js';

const fixture = new URL('./fixtures/local-project/', import.meta.url);
const fixturePaths = ['app.py', 'shop/__init__.py', 'shop/audit.py', 'shop/prices.py', 'shop/sales.py'];
const localFiles = Object.fromEntries(await Promise.all(fixturePaths.map(async path => [
  path,
  await readFile(new URL(path, fixture), 'utf8'),
])));
const project = JSON.parse(await readFile(new URL('../example/project.json', import.meta.url), 'utf8'));

function definition(graph, qualname) {
  const node = graph.functions.find(node => node.qualname === qualname);
  assert.ok(node, 'Expected definition for ' + qualname);
  return node;
}

function call(graph, caller, target, location, evidence) {
  const from = definition(graph, caller);
  const to = definition(graph, target);
  const [file, line] = location;
  const edge = graph.calls.find(edge => (
    edge.from === from.id && edge.to === to.id && edge.file === file && edge.line === line
  ));
  assert.ok(edge, 'Expected ' + caller + ' → ' + target + ' at ' + file + ':' + line);
  assert.ok(edge.code.includes(evidence), 'Call preview should contain ' + evidence);
  return edge;
}

test('resolves local names, module and symbol aliases, and a relative import without merging namesakes', () => {
  const graph = analyzeProject(localFiles);
  const sales = definition(graph, 'shop.sales.total');
  const audit = definition(graph, 'shop.audit.total');
  assert.notEqual(sales.id, audit.id);
  assert.deepEqual([sales.file, sales.line], ['shop/sales.py', 4]);
  assert.deepEqual([audit.file, audit.line], ['shop/audit.py', 1]);
  assert.match(sales.code, /def total\(\):/);
  assert.match(audit.code, /return 2/);

  call(graph, 'app.main', 'shop.sales.run', ['app.py', 8], 'sales.run()');
  call(graph, 'app.main', 'shop.audit.total', ['app.py', 9], 'audit_total()');
  call(graph, 'shop.sales.run', 'shop.sales.total', ['shop/sales.py', 9], 'total()');
  call(graph, 'shop.sales.total', 'shop.prices.price', ['shop/sales.py', 5], 'base_price()');
});

test('infers methods from local construction, self, a named class and cls', () => {
  const graph = analyzeProject(localFiles);
  const invoice = 'shop.sales.Invoice.';
  const method = definition(graph, invoice + 'calculate');
  assert.deepEqual([method.file, method.line], ['shop/sales.py', 13]);
  assert.match(method.code, /def calculate\(self\):/);

  call(graph, 'app.main', invoice + 'calculate', ['app.py', 10], 'invoice.calculate()');
  call(graph, invoice + 'calculate', invoice + '_calculate_subtotal', ['shop/sales.py', 14], 'self._calculate_subtotal()');
  call(graph, invoice + '_calculate_subtotal', invoice + 'with_tax', ['shop/sales.py', 17], 'Invoice.with_tax(total())');
  call(graph, invoice + 'example', invoice + 'with_tax', ['shop/sales.py', 25], 'cls.with_tax(1)');
});

test('finds the main guard and reports dynamic calls with their source rather than guessing', () => {
  const graph = analyzeProject(localFiles);
  const main = definition(graph, 'app.main');
  assert.ok(graph.entries.some(entry => entry.id === main.id), 'The guarded main function is an entry');
  const guard = graph.calls.find(edge => edge.to === main.id && edge.file === 'app.py' && edge.line === 17);
  assert.ok(guard, 'The module guard should call main');

  for (const [line, evidence] of [[11, 'callback()'], [12, 'getattr(invoice_type, method_name)()']]) {
    const candidates = graph.calls.filter(edge => edge.from === main.id && edge.file === 'app.py' && edge.line === line);
    assert.ok(candidates.some(edge => edge.to === null && edge.reason && edge.code.includes(evidence)));
    assert.ok(candidates.every(edge => edge.to === null), 'No dynamic call should resolve to an unrelated definition');
  }
});

test('leaves shadowed imports and conflicting assignments unresolved', () => {
  const graph = analyzeProject({
    'services.py': 'def execute():\n    return 1\n',
    'main.py': [
      'from services import execute',
      '',
      'def shadowed(execute):',
      '    return execute()',
      '',
      'def reassigned(flag):',
      '    worker = execute',
      '    if flag:',
      '        worker = flag',
      '    return worker()',
    ].join('\n'),
  });
  for (const [functionName, line] of [['shadowed', 4], ['reassigned', 10]]) {
    const node = definition(graph, 'main.' + functionName);
    const edge = graph.calls.find(edge => edge.from === node.id && edge.line === line);
    assert.ok(edge, 'Expected a call in ' + functionName);
    assert.equal(edge.to, null);
  }
});

test('resolves a parent-relative submodule from a src-layout package', () => {
  const graph = analyzeProject({
    'src/pkg/__init__.py': '',
    'src/pkg/common.py': 'def execute():\n    return 1\n',
    'src/pkg/feature/__init__.py': '',
    'src/pkg/feature/run.py': [
      'from .. import common as deps',
      '',
      'def run():',
      '    return deps.execute()',
    ].join('\n'),
  });
  call(graph, 'pkg.feature.run.run', 'pkg.common.execute', ['src/pkg/feature/run.py', 4], 'deps.execute()');
});

test('rejects relative imports beyond a package root and recognizes a selected package folder', () => {
  const graph = analyzeProject({
    'lib.py': 'def execute():\n    return 1\n',
    'app.py': 'from .lib import execute\n\ndef run():\n    return execute()\n',
    'pkg/__init__.py': '',
    'pkg/feature.py': 'from ..lib import execute\n\ndef run():\n    return execute()\n',
  });
  for (const qualname of ['app.run', 'pkg.feature.run']) {
    const node = definition(graph, qualname);
    const edge = graph.calls.find(edge => edge.from === node.id && edge.line === 4);
    assert.ok(edge);
    assert.equal(edge.to, null);
  }

  const selectedPackage = analyzeProject({
    '__init__.py': '',
    'lib.py': 'def execute():\n    return 1\n',
    'app.py': 'from .lib import execute\n\ndef run():\n    return execute()\n',
  });
  call(selectedPackage, 'app.run', 'lib.execute', ['app.py', 4], 'execute()');
});

test('traces all three example paths at the pinned source lines', () => {
  const graph = analyzeProject(project.files);
  assert.equal(project.commit, '73c775a66303f25cbf03b0c2e3c14e71253f198a');
  const module = 'add_trailing_comma._main.';
  const mainFile = 'add_trailing_comma/_main.py';
  const expected = [
    { target: 'add_trailing_comma._ast_helpers.ast_parse', file: 'add_trailing_comma/_ast_helpers.py', definition: 10, call: 29, code: 'ast_parse(contents_text)' },
    { target: 'add_trailing_comma._data.visit', file: 'add_trailing_comma/_data.py', definition: 41, call: 33, code: 'visit(FUNCS, ast_obj)' },
    { target: 'add_trailing_comma._token_helpers.fix_brace', file: 'add_trailing_comma/_token_helpers.py', definition: 113, call: 47, code: 'fix_brace(' },
  ];
  assert.equal(project.paths.length, expected.length);
  call(graph, module + 'main', module + 'fix_file', [mainFile, 98], 'fix_file(filename, args)');
  call(graph, module + 'fix_file', module + '_fix_src', [mainFile, 70], '_fix_src(contents_text)');
  for (const [index, end] of expected.entries()) {
    assert.deepEqual(project.paths[index].nodes, [module + 'main', module + 'fix_file', module + '_fix_src', end.target]);
    const target = definition(graph, end.target);
    assert.deepEqual([target.file, target.line], [end.file, end.definition]);
    call(graph, module + '_fix_src', end.target, [mainFile, end.call], end.code);
  }
});
