import { parser } from '@lezer/python';

const DYNAMIC = '실행 시점에 결정되는 호출';
const OUTSIDE = '선택한 소스에서 정의를 찾을 수 없음';
const AMBIGUOUS = '이름이 가리키는 대상을 하나로 확정할 수 없음';
const CONSTRUCTOR = '소스에 직접 정의한 생성자가 없음';
const REASON_CODES = new Map([
  [DYNAMIC, 'dynamic'], [OUTSIDE, 'external'],
  [AMBIGUOUS, 'ambiguous'], [CONSTRUCTOR, 'constructor'],
]);
const IGNORE_NODES = new Set(['Comment', '⚠']);
const COMPREHENSIONS = new Set([
  'ComprehensionExpression', 'ArrayComprehensionExpression',
  'DictionaryComprehensionExpression', 'SetComprehensionExpression',
]);

function children(node) {
  const result = [];
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (!IGNORE_NODES.has(child.name)) result.push(child);
  }
  return result;
}

function sourceIndex(file, source, moduleName) {
  const starts = [0];
  for (const match of source.matchAll(/\r\n|\n|\r/g)) {
    starts.push(match.index + match[0].length);
  }
  function line(offset) {
    let low = 0;
    let high = starts.length;
    while (low + 1 < high) {
      const mid = (low + high) >>> 1;
      if (starts[mid] > offset) high = mid;
      else low = mid;
    }
    return low + 1;
  }
  function location(node) {
    const from = node?.from ?? 0;
    // The grammar can include the last statement's newline in a body.
    let end = node?.to ?? from;
    while (end > from && /[\r\n]/.test(source[end - 1])) end--;
    const startLine = line(from);
    const endLine = line(Math.max(from, end - 1));
    return {
      file, line: startLine, endLine,
      code: source.slice(starts[startLine - 1], starts[endLine]).replace(/[\r\n]+$/, ''),
    };
  }
  const isPackage = /(?:^|\/)__init__\.py$/.test(file);
  return {
    file, source, name: moduleName, isPackage, location, line,
    text: (node) => node ? source.slice(node.from, node.to) : '',
    package: isPackage ? moduleName : moduleName.split('.').slice(0, -1).join('.'),
  };
}

function moduleNameFor(file, stripSrc) {
  const parts = file.replace(/\.py$/, '').split('/');
  if (stripSrc && parts[0] === 'src' && parts.length > 1) parts.shift();
  if (parts.at(-1) === '__init__') parts.pop();
  return parts.join('.');
}

function scopeFor(kind, parent, record) {
  return { kind, parent, record, bindings: new Map() };
}

function bind(scope, name, at, conditional, value) {
  if (!name) return;
  if (!scope.bindings.has(name)) scope.bindings.set(name, []);
  scope.bindings.get(name).push({ at, conditional, value });
  if (scope.kind === 'guard') bind(scope.parent, name, at, true, value);
}

function splitNames(nodes, separator) {
  const groups = [[]];
  for (const node of nodes) {
    if (node.name === separator) groups.push([]);
    else groups.at(-1).push(node);
  }
  return groups;
}

function recordImports(node, module, scope, conditional) {
  const tokens = children(node);
  const importAt = tokens.findIndex((child) => child.name === 'import');
  if (importAt < 0) return;
  const fromImport = tokens[0].name === 'from';
  const names = tokens.slice(importAt + 1).filter((token) => !['(', ')'].includes(token.name));
  let base;
  let invalidRelative = false;
  if (fromImport) {
    const from = tokens.slice(1, importAt).map(module.text).join('');
    const relative = from.match(/^\.+/)?.[0].length ?? 0;
    if (relative) {
      const parent = module.package ? module.package.split('.') : [];
      const packageDepth = parent.length + (module.rootPackage ? 1 : 0);
      invalidRelative = relative > packageDepth;
      base = [...parent.slice(0, Math.max(0, parent.length - relative + 1)), from.slice(relative)]
        .filter(Boolean).join('.');
    } else {
      base = from;
    }
  }
  for (const group of splitNames(names, ',')) {
    const aliasAt = group.findIndex((token) => token.name === 'as');
    const path = group.slice(0, aliasAt < 0 ? undefined : aliasAt).map(module.text).join('');
    if (!path) continue;
    if (path === '*') {
      bind(scope, '*', node.to, conditional, { kind: 'unknown' });
      continue;
    }
    const localName = aliasAt >= 0 ? module.text(group[aliasAt + 1]) : path.split('.')[0];
    let value;
    if (invalidRelative) value = { kind: 'unknown', reason: OUTSIDE };
    else if (fromImport) value = { kind: 'imported', base, name: path };
    else value = { kind: 'module', name: aliasAt >= 0 ? path : localName, loaded: new Set([path]) };
    bind(scope, localName, node.to, conditional, value);
  }
}

function targetNames(node, module) {
  if (!node) return [];
  if (node.name === 'VariableName') return [module.text(node)];
  if (['TupleExpression', 'ArrayExpression', 'ParenthesizedExpression'].includes(node.name)) {
    return children(node).flatMap((child) => targetNames(child, module));
  }
  return [];
}

function memberKey(node, module) {
  if (node?.name !== 'MemberExpression') return null;
  const [base, dot, property] = children(node);
  if (base?.name !== 'VariableName' || dot?.name !== '.' || property?.name !== 'PropertyName') {
    return null;
  }
  return `\0${module.text(base)}.${module.text(property)}`;
}

function recordAssignment(node, module, scope, conditional) {
  const tokens = children(node);
  const operator = node.name === 'UpdateStatement' ? 'UpdateOp' : 'AssignOp';
  const groups = splitNames(tokens, operator);
  const destinations = groups.length === 1 ? groups : groups.slice(0, -1);
  const rhs = groups.length > 1 ? groups.at(-1) : [];
  for (const destination of destinations) {
    const targets = destination.filter((token) => token.name !== 'TypeDef');
    const rhsExpr = rhs.length === 1 ? rhs[0] : null;
    const simple = node.name === 'AssignStatement' && targets.length === 1
      && targets[0].name === 'VariableName';
    const value = simple && rhsExpr
      ? { kind: 'expression', node: rhsExpr, module, scope, before: node.from }
      : { kind: 'unknown' };
    for (const name of targets.flatMap((target) => targetNames(target, module))) {
      bind(scope, name, node.to, conditional, value);
    }
    for (const target of targets) {
      bind(scope, memberKey(target, module), node.to, conditional, { kind: 'unknown' });
    }
  }
}

function isMainGuard(node, module) {
  const condition = children(node).find((child) => child.name !== 'if');
  function check(expression) {
    if (expression?.name === 'ParenthesizedExpression') {
      return check(children(expression).find((child) => !['(', ')'].includes(child.name)));
    }
    if (expression?.name !== 'BinaryExpression') return false;
    const [left, operator, right, extra] = children(expression);
    if (extra || module.text(operator) !== '==') return false;
    function isMain(name, value) {
      return name?.name === 'VariableName' && module.text(name) === '__name__'
        && value?.name === 'String' && /^(['"])__main__\1$/.test(module.text(value));
    }
    return isMain(left, right) || isMain(right, left);
  }
  return check(condition);
}

function decoratorsOf(wrapper, module) {
  return (wrapper ? children(wrapper) : [])
    .filter((node) => node.name === 'Decorator')
    .map((node) => children(node)
      .filter((child) => !['At', 'ArgList'].includes(child.name))
      .map(module.text).join(''));
}

function parameterNames(paramList, module) {
  if (!paramList) return [];
  return splitNames(children(paramList), ',')
    .map((group) => group.find((node) => !['(', ')', '*', '**', '/'].includes(node.name)))
    .filter((node) => node?.name === 'VariableName')
    .map(module.text);
}

function functionParent(scope) {
  // Python method bodies close over surrounding function scopes, not class namespaces.
  while (scope.kind === 'class') scope = scope.parent;
  return scope;
}

function qualified(scope, module, name) {
  const prefix = scope.record?.qualname ?? module.name;
  return prefix ? `${prefix}.${name}` : name;
}

function parseModule(module, state) {
  const { functions, pending, explicitEntries, diagnostics } = state;
  const top = parser.parse(module.source).topNode;
  top.cursor().iterate((node) => {
    if (node.type.isError && diagnostics.length < 150) {
      diagnostics.push({ file: module.file, line: module.line(node.from) });
    }
  });
  module.scope = scopeFor('module', null, null);
  const moduleEntry = /(?:^|\/)__main__\.py$/.test(module.file);
  let moduleNode;

  function moduleOwner() {
    if (moduleNode) return moduleNode;
    moduleNode = {
      id: `${module.file}:module`,
      name: moduleEntry ? '__main__.py' : '모듈 실행',
      qualname: moduleEntry ? module.name : `${module.name || '__init__'}.<module>`,
      module: module.name, kind: 'module',
      ...module.location(module.firstModuleCall),
    };
    functions.push(moduleNode);
    return moduleNode;
  }

  function addDefinition(node, scope, owner, conditional, wrapper) {
    const nameNode = node.getChild('VariableName');
    const body = node.getChild('Body');
    const name = module.text(nameNode);
    if (!nameNode || !body || !name) return;
    const qualname = qualified(scope, module, name);
    const isClass = node.name === 'ClassDefinition';
    const isMethod = !isClass && scope.kind === 'class';
    const record = {
      id: `${module.file}:def:${node.from}`, name, qualname,
      module: module.name, kind: isMethod ? 'method' : 'function',
      ...module.location(node),
    };
    const inner = scopeFor(isClass ? 'class' : 'function', functionParent(scope), record);
    if (isClass) {
      bind(scope, name, node.to, conditional, { kind: 'class', scope: inner });
    } else {
      const decorators = decoratorsOf(wrapper, module);
      const isProperty = decorators.some((item) => item === 'property' || /\.(setter|deleter)$/.test(item));
      bind(scope, name, node.to, conditional, isProperty
        ? { kind: 'unknown' }
        : { kind: 'function', record });
      functions.push(record);
      if (scope.kind === 'module' && /^(main|cli)$/.test(name)) {
        explicitEntries.named.push({ id: record.id, reason: '진입 함수 이름' });
      }
      const params = parameterNames(node.getChild('ParamList'), module);
      const receiver = isMethod && !decorators.includes('staticmethod');
      for (const [index, param] of params.entries()) {
        const kind = decorators.includes('classmethod') ? 'class' : 'instance';
        bind(inner, param, 0, false, receiver && index === 0
          ? { kind, scope }
          : { kind: 'unknown' });
      }
    }
    // Defaults, annotations, class bases, and decorator arguments belong to the outer context.
    for (const child of children(node)) {
      if (child.name !== 'Body') scan(child, scope, owner, conditional);
    }
    scan(body, inner, isClass ? owner : record, false);
  }

  function addGuard(node, scope, owner, conditional) {
    const body = node.getChild('Body');
    if (!body) return false;
    const entry = {
      id: `${module.file}:guard:${node.from}`,
      name: '__main__ 가드', qualname: module.name,
      module: module.name, kind: 'module', ...module.location(node),
    };
    functions.push(entry);
    explicitEntries.guards.push({ id: entry.id, reason: '__main__ 가드' });
    const guardScope = scopeFor('guard', scope, null);
    for (const child of children(node)) {
      const entryBody = child.from === body.from && child.name === 'Body';
      scan(child, entryBody ? guardScope : scope, entryBody ? entry : owner, !entryBody || conditional);
    }
    return true;
  }

  function scan(node, scope, owner, conditional = false) {
    const kind = node.name;
    if (kind === 'DecoratedStatement') {
      for (const child of children(node)) {
        if (child.name === 'Decorator') scan(child, scope, owner, conditional);
        else addDefinition(child, scope, owner, conditional, node);
      }
      return;
    }
    if (kind === 'FunctionDefinition' || kind === 'ClassDefinition') {
      addDefinition(node, scope, owner, conditional);
      return;
    }
    if (kind === 'ImportStatement') {
      recordImports(node, module, scope, conditional);
      return;
    }
    if (kind === 'IfStatement' && scope.kind === 'module' && !owner && isMainGuard(node, module)) {
      if (addGuard(node, scope, owner, conditional)) return;
    }
    if (kind === 'AssignStatement' || kind === 'UpdateStatement' || kind === 'NamedExpression') {
      recordAssignment(node, module, scope, conditional);
    }
    if (kind === 'ScopeStatement' || kind === 'DeleteStatement' || kind === 'TypeDefinition') {
      for (const child of children(node)) {
        if (child.name === 'VariableName') {
          bind(scope, module.text(child), kind === 'ScopeStatement' ? 0 : node.to, conditional, { kind: 'unknown' });
        }
        if (kind === 'DeleteStatement') {
          bind(scope, memberKey(child, module), node.to, conditional, { kind: 'unknown' });
        }
      }
    }
    if (kind === 'LambdaExpression' || COMPREHENSIONS.has(kind)) {
      const inner = scopeFor('expression', functionParent(scope), null);
      const tokens = children(node);
      if (kind === 'LambdaExpression') {
        for (const name of parameterNames(node.getChild('ParamList'), module)) {
          bind(inner, name, 0, false, { kind: 'unknown' });
        }
      } else {
        for (let index = 0; index < tokens.length; index++) {
          if (tokens[index].name !== 'for') continue;
          let target = index + 1;
          while (target < tokens.length && tokens[target].name !== 'in') {
            for (const name of targetNames(tokens[target], module)) {
              bind(inner, name, 0, false, { kind: 'unknown' });
            }
            target++;
          }
        }
      }
      for (const child of tokens) {
        scan(child, child.name === 'ParamList' ? scope : inner, owner, conditional);
      }
      return;
    }
    const tokens = children(node);
    if (kind === 'ForStatement') {
      const first = tokens.findIndex((child) => child.name === 'for') + 1;
      const last = tokens.findIndex((child) => child.name === 'in');
      const body = node.getChild('Body');
      if (last > first && body) {
        for (const name of tokens.slice(first, last).flatMap((child) => targetNames(child, module))) {
          bind(scope, name, body.from, true, { kind: 'unknown' });
        }
      }
    }
    if (kind === 'WithStatement' || kind === 'TryStatement') {
      for (let index = 0; index < tokens.length - 1; index++) {
        if (tokens[index].name === 'as' && tokens[index + 1].name === 'VariableName') {
          bind(scope, module.text(tokens[index + 1]), tokens[index + 1].to, true, { kind: 'unknown' });
        }
      }
    }
    if (kind === 'CapturePattern' || kind === 'AsPattern') {
      const name = tokens.at(-1);
      if (name?.name === 'VariableName' && module.text(name) !== '_') {
        bind(scope, module.text(name), node.to, true, { kind: 'unknown' });
      }
    }
    if (kind === 'CallExpression') {
      const callee = tokens[0];
      if (callee && callee.name !== 'ArgList') {
        if (!owner) module.firstModuleCall ??= node;
        pending.push({ module, scope, owner: owner ?? moduleOwner(), node, callee });
      }
    }
    const branch = ['IfStatement', 'WhileStatement', 'ForStatement', 'WithStatement',
      'TryStatement', 'MatchStatement', 'MatchClause'].includes(kind);
    for (const child of tokens) scan(child, scope, owner, conditional || branch);
  }

  scan(top, module.scope, null);
  if (moduleEntry && !explicitEntries.guards.some((entry) => entry.id.startsWith(`${module.file}:guard:`))) {
    explicitEntries.scripts.push({ id: moduleOwner().id, reason: '__main__.py 실행' });
  }
}

function activeBinding(scope, name, before) {
  const records = scope.bindings.get(name);
  let last;
  let star;
  let loaded = new Set();
  for (const record of records ?? []) {
    if (record.at > before) continue;
    if (record.value.kind === 'module' && last?.value.kind === 'module'
        && record.value.name === last.value.name && !last.conditional && !record.conditional) {
      for (const path of record.value.loaded) loaded.add(path);
    } else {
      loaded = new Set(record.value.loaded);
    }
    if (record.conditional && (last?.value !== record.value)) {
      last = { ...record, value: { kind: 'unknown', reason: AMBIGUOUS } };
    } else {
      last = record;
    }
  }
  for (const record of scope.bindings.get('*') ?? []) {
    if (record.at <= before) star = record;
  }
  if (star && (!last || star.at > last.at)) return { value: { kind: 'unknown', reason: AMBIGUOUS } };
  if (!last && records?.length && ['function', 'expression'].includes(scope.kind)) {
    return { value: { kind: 'unknown', reason: DYNAMIC } };
  }
  return last?.value.kind === 'module' ? { ...last, value: { ...last.value, loaded } } : last;
}

function resolver(modules, packages) {
  const unresolved = (reason = DYNAMIC) => ({ kind: 'unknown', reason });
  const fullName = (base, name) => base ? `${base}.${name}` : name;

  function moduleMember(base, name, seen, explicitlyImported = false) {
    const definitions = modules.get(base.name) ?? [];
    if (definitions.length > 1) return unresolved(AMBIGUOUS);
    const binding = definitions[0] && activeBinding(definitions[0].scope, name, Infinity);
    if (binding) return bindingValue(binding, seen);
    const path = fullName(base.name, name);
    const loaded = base.loaded ?? new Set();
    if (!explicitlyImported && ![...loaded].some((entry) => entry === path || entry.startsWith(`${path}.`))) {
      return unresolved(OUTSIDE);
    }
    if (modules.has(path) || packages.has(path)) return { kind: 'module', name: path, loaded };
    return unresolved(OUTSIDE);
  }

  function bindingValue(binding, seen) {
    const value = binding.value;
    if (seen.size >= 64 || seen.has(value)) return unresolved(AMBIGUOUS);
    if (value.kind !== 'imported' && value.kind !== 'expression') return value;
    seen.add(value);
    try {
      if (value.kind === 'imported') {
        return moduleMember({ name: value.base }, value.name, seen, true);
      }
      return expression(value.node, value.module, value.scope, value.before, seen);
    } finally {
      seen.delete(value);
    }
  }

  function lookup(name, scope, before, seen) {
    for (let level = scope; level; level = level.parent) {
      const limit = level === scope || ['expression', 'guard'].includes(scope.kind) ? before : Infinity;
      const binding = activeBinding(level, name, limit);
      if (binding) return bindingValue(binding, seen);
    }
    return unresolved(OUTSIDE);
  }

  function expression(node, module, scope, before, seen, depth = 0) {
    if (!node || depth > 64) return unresolved();
    if (node.name === 'VariableName') return lookup(module.text(node), scope, before, seen);
    if (node.name === 'ParenthesizedExpression') {
      const inner = children(node).find((child) => !['(', ')'].includes(child.name));
      return expression(inner, module, scope, before, seen, depth + 1);
    }
    if (node.name === 'CallExpression') {
      const callee = expression(node.firstChild, module, scope, before, seen, depth + 1);
      return callee.kind === 'class' ? { kind: 'instance', scope: callee.scope } : unresolved();
    }
    if (node.name !== 'MemberExpression') return unresolved();
    const [base, dot, property] = children(node);
    if (dot?.name !== '.' || property?.name !== 'PropertyName') return unresolved();
    const overwritten = memberKey(node, module);
    if (overwritten) {
      for (let level = scope; level; level = level.parent) {
        const limit = level === scope || ['expression', 'guard'].includes(scope.kind) ? before : Infinity;
        const mutation = activeBinding(level, overwritten, limit);
        const receiver = activeBinding(level, module.text(base), limit);
        if (mutation?.at !== undefined && mutation.at >= (receiver?.at ?? 0)) {
          return unresolved(mutation.value.reason);
        }
        if (receiver) break;
      }
    }
    const owner = expression(base, module, scope, before, seen, depth + 1);
    const name = module.text(property);
    if (owner.kind === 'module') return moduleMember(owner, name, seen);
    if (owner.kind === 'class' || owner.kind === 'instance') {
      const binding = activeBinding(owner.scope, name, Infinity);
      return binding ? bindingValue(binding, seen) : unresolved();
    }
    return unresolved(owner.reason === AMBIGUOUS ? AMBIGUOUS : DYNAMIC);
  }

  return ({ module, node, scope, callee }) => {
    const value = expression(callee, module, scope, node.from, new Set());
    if (value.kind !== 'class') return value;
    const constructor = activeBinding(value.scope, '__init__', Infinity);
    return constructor ? bindingValue(constructor, new Set()) : unresolved(CONSTRUCTOR);
  };
}

/**
 * Build a call graph from project-relative paths and Python source text.
 * Scope and import resolution is deliberately static; the input is never executed.
 */
export function analyzeProject(inputFiles) {
  const files = Object.fromEntries(Object.entries(inputFiles)
    .filter(([file, source]) => /\.py$/.test(file) && typeof source === 'string')
    .map(([file, source]) => [file.replaceAll('\\', '/').replace(/^\.\//, ''), source])
    .sort(([left], [right]) => left.localeCompare(right, 'en')));
  const functions = [];
  const pending = [];
  const diagnostics = [];
  const explicitEntries = { guards: [], scripts: [], named: [] };
  const modules = new Map();
  const packages = new Set();
  const stripSrc = !Object.hasOwn(files, 'src/__init__.py');
  const rootPackage = Object.hasOwn(files, '__init__.py');
  const allModules = Object.entries(files).map(([file, source]) => {
    const name = moduleNameFor(file, stripSrc);
    const module = sourceIndex(file, source, name);
    module.rootPackage = rootPackage && !(stripSrc && file.startsWith('src/'));
    if (!modules.has(name)) modules.set(name, []);
    modules.get(name).push(module);
    const parts = name.split('.');
    for (let index = 1; index < parts.length; index++) packages.add(parts.slice(0, index).join('.'));
    return module;
  });
  for (const module of allModules) parseModule(module, { functions, pending, explicitEntries, diagnostics });
  const resolve = resolver(modules, packages);
  const calls = pending.map((candidate) => {
    const { module, node, owner, callee } = candidate;
    const target = resolve(candidate);
    const reason = target.reason ?? DYNAMIC;
    return {
      id: `${module.file}:call:${node.from}:${node.to}`, from: owner.id,
      to: target.kind === 'function' ? target.record.id : null,
      label: module.text(callee).replace(/\s+/g, ' ').trim(),
      ...module.location(node),
      ...(target.kind === 'function' ? {} : { reason, reasonCode: REASON_CODES.get(reason) }),
    };
  });
  let entries = [...explicitEntries.guards, ...explicitEntries.scripts, ...explicitEntries.named];
  if (!entries.length) {
    const inbound = new Set(calls.filter((call) => call.from !== call.to).map((call) => call.to));
    const roots = functions.filter((fn) => !inbound.has(fn.id));
    entries = (roots.length ? roots : functions).slice(0, 12)
      .map((fn) => ({ id: fn.id, reason: roots.length ? '소스 내 호출자가 없는 후보' : '소스에서 찾은 후보' }));
  }
  return { functions, calls, entries, files, diagnostics };
}
