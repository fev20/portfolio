import example from '../example/project.json';
import { findPath, renderGraph } from './graph.js';

const byId = (id) => document.getElementById(id);
const ui = Object.fromEntries(['open-example','folder','status','empty','workspace','project-kind','project-title','project-source','stats','guides','entry','search','result-count','results','overview','path','route','graph','graph-caption','evidence-heading','details'].map(id => [id, byId(id)]));
const kinds = { function:'함수', method:'메서드', module:'모듈' };
const ignored = new Set(['.git','.venv','venv','.tox','.nox','.mypy_cache','.pytest_cache','__pycache__','node_modules','site-packages','build','dist']);
const LIMIT_FILES = 800;
const LIMIT_BYTES = 12 * 1024 * 1024;
const LIMIT_FILE = 768 * 1024;
let state = null;
let worker = null;
let serial = 0;

function element(tag, options = {}, ...children) {
  const node = document.createElement(tag);
  Object.assign(node, options);
  node.append(...children);
  return node;
}

function link(text, href, className = '') {
  return element('a', { className, href, target:'_blank', rel:'noopener noreferrer' }, text);
}

function status(message = '', error = false) {
  ui.status.textContent = message;
  ui.status.classList.toggle('error', error);
}

function begin(message) {
  worker?.terminate();
  worker = null;
  ui.workspace.setAttribute('aria-busy', 'true');
  status(message);
  return ++serial;
}

function failed(token, message) {
  if (token !== serial) return;
  ui.workspace.removeAttribute('aria-busy');
  status(message, true);
}

function analyze(token, files, project) {
  if (token !== serial) return;
  try {
    const active = new Worker(new URL('./analysis-worker.js', import.meta.url));
    worker = active;
    active.onmessage = ({ data }) => {
      if (data.token !== serial) return;
      active.terminate();
      worker = null;
      if (data.error) failed(token, data.error);
      else if (!data.graph.functions.some(fn => fn.kind !== 'module') && data.graph.calls.length === 0) {
        failed(token, '표시할 함수나 호출이 없습니다. Python 소스에 함수 정의 또는 호출이 있는지 확인하세요.');
      } else {
        try { showProject(project, data.graph); }
        catch { failed(token, '지도 화면을 만들지 못했습니다. 다른 Python 폴더를 시도해 주세요.'); }
      }
    };
    active.onerror = () => {
      active.terminate();
      if (worker === active) worker = null;
      failed(token, '분석 작업을 시작하지 못했습니다. 이 데모를 정적 HTTP 서버에서 열어 주세요.');
    };
    active.postMessage({ token, files });
  } catch {
    failed(token, '이 브라우저에서 분석 작업을 시작할 수 없습니다.');
  }
}

ui['open-example'].addEventListener('click', () => {
  const token = begin('공개 예제의 호출 관계를 읽는 중입니다…');
  analyze(token, example.files, { title:example.title, example });
});

ui.folder.addEventListener('change', async () => {
  const selected = Array.from(ui.folder.files);
  ui.folder.value = '';
  if (!selected.length) return;
  const token = begin('선택한 폴더의 Python 소스를 읽는 중입니다…');
  const title = selected[0].webkitRelativePath.split('/')[0] || '내 Python 프로젝트';
  const candidates = selected.flatMap(file => {
    const pieces = file.webkitRelativePath.split('/').slice(1);
    if (!pieces.length || !/\.py$/.test(file.name) || pieces.some(part => !part || part === '.' || part === '..') || pieces.slice(0,-1).some(part => ignored.has(part))) return [];
    return [[pieces.join('/'), file]];
  });
  if (!candidates.length) return failed(token, '선택한 폴더에서 분석할 .py 파일을 찾지 못했습니다.');
  if (candidates.length > LIMIT_FILES || candidates.some(([, file]) => file.size > LIMIT_FILE) || candidates.reduce((sum, [, file]) => sum + file.size, 0) > LIMIT_BYTES) {
    return failed(token, '분석 한도는 Python 파일 800개, 파일당 768 KiB, 전체 12 MiB입니다. 소스가 들어 있는 하위 폴더를 선택해 주세요.');
  }
  try {
    const entries = await Promise.all(candidates.map(async ([path, file]) => {
      const bytes = await file.arrayBuffer();
      const encoding = /^\s*#.*?coding[:=]\s*([-\w.]+)/m.exec(new TextDecoder().decode(bytes.slice(0, 256)).split(/\r?\n/, 2).join('\n'))?.[1];
      let decoder = new TextDecoder();
      if (encoding && !/^utf[-_]?8(?:[-_]sig)?$/i.test(encoding)) {
        const label = /^(latin[-_]?1|iso[-_]?8859[-_]?1)$/i.test(encoding) ? 'iso-8859-1' : encoding.replaceAll('_','-');
        try { decoder = new TextDecoder(label); } catch { /* use UTF-8 if the browser does not know the declared encoding */ }
      }
      return [path, decoder.decode(bytes)];
    }));
    analyze(token, Object.fromEntries(entries), { title });
  } catch {
    failed(token, '선택한 파일을 읽지 못했습니다. 폴더에 접근할 수 있는지 확인해 주세요.');
  }
});

function permalink(file, line) {
  const info = state.project.example;
  if (!info) return null;
  const path = [info.sourceRoot, file].filter(Boolean).join('/').split('/').filter(Boolean).map(encodeURIComponent).join('/');
  return `${info.repository}/blob/${info.commit}/${path}#L${line}`;
}

function showProject(project, graph) {
  const lookup = new Map(graph.functions.map(fn => [fn.id, fn]));
  const guides = (project.example?.paths || []).map(path => ({
    label:path.label, nodes:path.nodes.map(name => graph.functions.find(fn => fn.qualname === name)?.id)
  })).filter(path => path.nodes.every(Boolean));
  const root = guides[0]?.nodes[0] || graph.entries[0]?.id || graph.functions[0]?.id;
  const entries = graph.entries.slice();
  if (guides.length && !entries.some(item => item.id === root)) entries.unshift({ id:root, reason:'공개 예제 CLI 진입점' });
  const byFrom = new Map(), byTo = new Map();
  let unresolved = 0;
  for (const call of graph.calls) {
    if (!byFrom.has(call.from)) byFrom.set(call.from, []);
    byFrom.get(call.from).push(call);
    if (!call.to) unresolved++;
    else {
      if (!byTo.has(call.to)) byTo.set(call.to, []);
      byTo.get(call.to).push(call);
    }
  }
  state = { project, graph, lookup, byFrom, byTo, entries, guides, entryId:root, selectedFunctionId:root, selectedCallId:null, mode:'overview' };
  ui.empty.hidden = true;
  ui.workspace.hidden = false;
  ui.workspace.removeAttribute('aria-busy');
  ui['project-kind'].textContent = project.example ? '01 / 공개 예제' : '02 / 이 탭의 로컬 프로젝트';
  ui['project-title'].textContent = project.title;
  ui['project-source'].replaceChildren();
  if (project.example) {
    const info = project.example;
    ui['project-source'].append(link('GitHub 원본', info.repository), link(info.commit.slice(0, 12), `${info.repository}/commit/${info.commit}`), link(`${info.license} 라이선스`, './example/LICENSE.txt'), '포함 범위: Python 패키지 소스');
  } else {
    ui['project-source'].textContent = '현재 탭에서만 볼 수 있습니다. 새로고침하면 선택한 폴더와 지도가 초기화됩니다.';
  }
  ui.stats.replaceChildren(...[
    [Object.keys(graph.files).length, '파일'], [graph.functions.filter(fn => fn.kind !== 'module').length, '함수·메서드'],
    [graph.calls.length - unresolved, '확인된 호출'], [unresolved, '미해결 호출']
  ].map(([value, label]) => element('span', {}, element('strong', {}, value.toLocaleString('ko')), ' ' + label)));
  ui.guides.hidden = !guides.length;
  ui.guides.replaceChildren(element('strong', {}, '예제 경로'));
  for (const guide of guides) {
    const button = element('button', { type:'button' }, guide.label);
    button.addEventListener('click', () => {
      state.entryId = guide.nodes[0];
      ui.entry.value = state.entryId;
      selectFunction(guide.nodes.at(-1), 'path');
    });
    ui.guides.append(button);
  }
  fillEntries();
  ui.search.value = '';
  redraw();
  const diagnostics = graph.diagnostics || [];
  status(diagnostics.length ? `구문을 읽지 못한 위치 ${diagnostics.length}곳이 있습니다. 첫 위치: ${diagnostics[0].file}:${diagnostics[0].line}. 읽을 수 있는 부분으로 지도를 만들었습니다.` : '');
  ui['project-title'].focus();
}

function fillEntries() {
  const auto = element('optgroup', { label:'자동으로 찾은 진입점' });
  const manual = element('optgroup', { label:'직접 선택' });
  const listed = new Set();
  for (const { id, reason } of state.entries) {
    const fn = state.lookup.get(id);
    if (!fn || listed.has(id)) continue;
    auto.append(element('option', { value:id }, `${fn.qualname} · ${reason}`));
    listed.add(id);
  }
  for (const fn of state.graph.functions) {
    if (!listed.has(fn.id)) manual.append(element('option', { value:fn.id }, `${fn.qualname} · ${fn.file}:${fn.line}`));
  }
  ui.entry.replaceChildren(...[auto, manual].filter(group => group.children.length));
  ui.entry.value = state.entryId;
}

function renderResults() {
  const query = ui.search.value.trim().toLowerCase();
  const functions = state.graph.functions.filter(fn => (fn.kind !== 'module' || query) &&
    (!query || fn.qualname.toLowerCase().includes(query) || fn.file.toLowerCase().includes(query)));
  const limit = 180;
  ui['result-count'].textContent = `${functions.length}개${functions.length > limit ? ` · 처음 ${limit}개 표시` : ''}`;
  ui.results.replaceChildren(...functions.slice(0, limit).map(fn => {
    const button = element('button', { type:'button', className:'result', title:fn.qualname },
      element('b', {}, fn.name), element('small', {}, `${fn.file}:${fn.line}`));
    button.dataset.resultId = fn.id;
    if (fn.id === state.selectedFunctionId && !state.selectedCallId) button.setAttribute('aria-current', 'true');
    button.addEventListener('click', () => {
      selectFunction(fn.id, 'path');
      Array.from(ui.results.children).find(item => item.dataset.resultId === fn.id)?.focus({ preventScroll:true });
    });
    return button;
  }));
  if (!functions.length) ui.results.append(element('p', { className:'muted' }, '일치하는 함수가 없습니다.'));
}

function snippet(title, item, context = 0) {
  const code = element('pre', { className:'code' });
  const source = state.graph.files[item.file]?.split(/\r\n|\n|\r/);
  const start = Math.max(1, item.line - context);
  const finalLine = Math.max(item.line, item.endLine || item.line);
  const end = Math.min(source?.length ?? Infinity, finalLine + context, start + 47);
  const lines = source ? source.slice(start - 1, end) : (item.code || '').split('\n').slice(0, 48);
  const codeText = element('code');
  lines.forEach((line, index) => {
    const number = start + index;
    const label = element('span', { className:'line-number' }, String(number));
    label.setAttribute('aria-hidden', 'true');
    codeText.append(element('span', { className:`code-line${number === item.line ? ' marked' : ''}` }, label, line || ' '));
  });
  code.append(codeText);
  const block = element('details', { className:'snippet', open:true },
    element('summary', {}, title),
    element('p', { className:'snippet-location' }, `${item.file}:${item.line}${finalLine !== item.line ? `–${finalLine}` : ''}`),
    code);
  if (finalLine > end) block.append(element('p', { className:'muted' }, '미리보기는 앞부분 48줄까지 표시합니다.'));
  const href = permalink(item.file, item.line);
  if (href) block.append(link('이 줄의 GitHub 원문 ↗', href, 'permalink'));
  return block;
}

function edgeName(call, outgoing) {
  const other = state.lookup.get(outgoing ? call.to : call.from);
  return other?.qualname || `${call.label} · 미해결`;
}

function edgeList(title, calls, outgoing) {
  if (!calls.length) return null;
  function buttons(list) {
    return element('div', { className:'edge-list' }, ...list.map(call => {
      const button = element('button', { type:'button', className:`edge-item${call.to ? '' : ' unresolved'}` },
        element('b', {}, edgeName(call, outgoing)), element('small', {}, `${call.file}:${call.line}`));
      button.addEventListener('click', () => selectCall(call.id, true));
      return button;
    }));
  }
  const list = element('div', {}, element('h4', { className:'detail-label' }, `${title} · ${calls.length}`), buttons(calls.slice(0, 18)));
  if (calls.length > 18) {
    const rest = element('details', { className:'snippet' }, element('summary', {}, `나머지 ${calls.length - 18}개 보기`));
    rest.addEventListener('toggle', () => {
      if (rest.open && rest.children.length === 1) rest.append(buttons(calls.slice(18)));
    });
    list.append(rest);
  }
  return list;
}

function renderDetails() {
  const fn = state.lookup.get(state.selectedFunctionId);
  const call = state.selectedCallId && state.graph.calls.find(item => item.id === state.selectedCallId);
  if (call) {
    const from = state.lookup.get(call.from), to = state.lookup.get(call.to);
    ui.details.replaceChildren(
      element('h4', { className:'detail-title' }, `${from?.name || '?'} → ${to?.name || call.label}`),
      element('p', { className:call.to ? 'detail-meta' : 'warning' }, call.to ? '확인된 호출' : `해석되지 않은 호출 · ${call.reason || '대상을 정적으로 확정할 수 없습니다.'}`),
      snippet('호출 위치', call, 2)
    );
    if (to) ui.details.append(snippet('호출 대상의 정의', to));
    if (from) {
      const back = element('button', { className:'backlink', type:'button' }, `${from.name} 함수의 근거 보기`);
      back.addEventListener('click', () => { selectFunction(from.id, state.mode); ui['evidence-heading'].focus(); });
      ui.details.append(back);
    }
  } else if (fn) {
    ui.details.replaceChildren(element('h4', { className:'detail-title' }, fn.qualname),
      element('p', { className:'detail-meta' }, kinds[fn.kind] || '함수'),
      snippet(fn.kind === 'module' ? '모듈 시작 위치' : '정의 위치', fn),
      ...[edgeList('호출하는 곳', state.byFrom.get(fn.id) || [], true), edgeList('이 함수를 호출한 곳', state.byTo.get(fn.id) || [], false)].filter(Boolean));
  } else {
    ui.details.replaceChildren(element('p', { className:'muted' }, '함수 또는 연결선을 선택해 주세요.'));
  }
  ui.details.scrollTop = 0;
}

function selectFunction(id, mode) {
  state.selectedFunctionId = id;
  state.selectedCallId = null;
  state.mode = mode;
  redraw();
}

function selectCall(id, focus = false) {
  state.selectedCallId = id;
  redraw();
  if (focus) ui['evidence-heading'].focus();
}

function drawMap() {
  ui.overview.setAttribute('aria-pressed', String(state.mode === 'overview'));
  ui.path.setAttribute('aria-pressed', String(state.mode === 'path'));
  const from = state.lookup.get(state.entryId), to = state.lookup.get(state.selectedFunctionId);
  const route = state.mode === 'path' && from && to ? findPath(state.graph, from.id, to.id) : null;
  ui.route.textContent = state.mode === 'path' && from && to
    ? (route ? [from.name, ...route.map(call => state.lookup.get(call.to)?.name)].join(' → ') : `${from.name} → ${to.name}: 확인된 경로 없음`)
    : from ? `진입점: ${from.qualname}` : '';
  const rendered = renderGraph(ui.graph, state.graph, {
    entryId:state.entryId, selectedFunctionId:state.selectedFunctionId, selectedCallId:state.selectedCallId, mode:state.mode,
    onFunction(id) {
      selectFunction(id, state.mode);
      if (matchMedia('(max-width: 1120px)').matches) ui['evidence-heading'].focus();
    },
    onCall(id) { selectCall(id, matchMedia('(max-width: 1120px)').matches); }
  });
  ui['graph-caption'].textContent = rendered ? `노드 ${rendered.visibleNodes} · 연결 ${rendered.visibleCalls}${rendered.truncated ? ' · 일부만 표시 중. 함수 검색으로 더 찾아보세요.' : ''} · 지도가 넓으면 가로로 스크롤하세요.` : '';
}

function redraw() {
  renderResults();
  drawMap();
  renderDetails();
}

ui.entry.addEventListener('change', () => {
  state.entryId = ui.entry.value;
  selectFunction(state.entryId, 'overview');
});
ui.search.addEventListener('input', renderResults);
ui.overview.addEventListener('click', () => { state.mode = 'overview'; state.selectedCallId = null; redraw(); });
ui.path.addEventListener('click', () => { state.mode = 'path'; state.selectedCallId = null; redraw(); });
if (!('webkitdirectory' in ui.folder)) {
  ui.folder.disabled = true;
  ui.folder.parentElement.setAttribute('aria-disabled','true');
  ui['privacy-note'].textContent = '이 브라우저는 폴더 선택을 지원하지 않습니다. 공개 예제는 열 수 있습니다.';
}
