const SVG = 'http://www.w3.org/2000/svg';
const NODE_WIDTH = 166;
const NODE_HEIGHT = 54;
const COLUMN_STEP = 232;
const ROW_STEP = 78;
const MAX_DEPTH = 3;
const MAX_FUNCTIONS = 22;
const MAX_UNRESOLVED = 8;
const MAX_CALLS = 48;

let graphSequence = 0;

function svgElement(name, attributes = {}, value) {
  const element = document.createElementNS(SVG, name);
  for (const [key, attribute] of Object.entries(attributes)) {
    element.setAttribute(key, attribute);
  }
  if (value !== undefined) element.textContent = value;
  return element;
}

function indexCalls(graph, knownFunctions) {
  const callsByCaller = new Map();
  for (const call of graph.calls) {
    if (!knownFunctions.has(call.from)) continue;
    if (!callsByCaller.has(call.from)) callsByCaller.set(call.from, []);
    callsByCaller.get(call.from).push(call);
  }
  return callsByCaller;
}

function shortestPath(callsByCaller, entryId, targetId) {
  const parents = new Map([[entryId, null]]);
  const pending = [entryId];
  for (let index = 0; index < pending.length; index += 1) {
    const current = pending[index];
    if (current === targetId) {
      const path = [];
      for (let edge = parents.get(current); edge; edge = parents.get(edge.from)) {
        path.push(edge);
      }
      return path.reverse();
    }
    for (const call of callsByCaller.get(current) ?? []) {
      if (call.to == null || parents.has(call.to)) continue;
      parents.set(call.to, call);
      pending.push(call.to);
    }
  }
  return null;
}

export function findPath(graph, entryId, targetId) {
  const knownFunctions = new Set(graph.functions.map(({ id }) => id));
  if (!knownFunctions.has(entryId) || !knownFunctions.has(targetId)) return null;
  return shortestPath(indexCalls(graph, knownFunctions), entryId, targetId);
}

function makeFunctionVertex(fn, depth) {
  return { key: `function:${fn.id}`, fn, depth };
}

function overview(callsByCaller, functions, entryId, options, path) {
  const vertices = new Map([[entryId, makeFunctionVertex(functions.get(entryId), 0)]]);
  const pending = [entryId];
  let truncated = false;
  for (let index = 0; index < pending.length; index += 1) {
    const from = pending[index];
    const depth = vertices.get(from).depth + 1;
    for (const call of callsByCaller.get(from) ?? []) {
      if (!functions.has(call.to) || vertices.has(call.to)) continue;
      if (depth > MAX_DEPTH || vertices.size >= MAX_FUNCTIONS) {
        truncated = true;
        continue;
      }
      vertices.set(call.to, makeFunctionVertex(functions.get(call.to), depth));
      pending.push(call.to);
    }
  }

  const preferred = new Set(path?.map(({ id }) => id));
  if (options.selectedCallId != null) preferred.add(options.selectedCallId);
  const reachableCalls = pending.flatMap((id) => callsByCaller.get(id) ?? []);
  const orderedCalls = [
    ...reachableCalls.filter((call) => preferred.has(call.id)),
    ...reachableCalls.filter((call) => !preferred.has(call.id)),
  ];
  const resolved = [];
  const unresolved = [];

  for (const call of orderedCalls) {
    const source = vertices.get(call.from);
    if (vertices.has(call.to)) {
      resolved.push({ call, source, target: vertices.get(call.to) });
    } else if (call.to == null) {
      unresolved.push({ call, source });
    }
  }

  const unresolvedPriority = ({ call }) => {
    if (preferred.has(call.id)) return 0;
    if (call.reasonCode === 'dynamic' || call.reasonCode === 'ambiguous') {
      return /^[\p{ID_Start}_][\p{ID_Continue}]*$/u.test(call.label) ? 1 : 2;
    }
    return 3;
  };
  unresolved.sort((first, second) => unresolvedPriority(first) - unresolvedPriority(second));
  const unresolvedEdges = unresolved.slice(0, MAX_UNRESOLVED).map(({ call, source }) => ({
    call,
    source,
    target: {
      key: `unresolved:${call.id}`,
      call,
      depth: Math.min(source.depth + 1, MAX_DEPTH),
    },
  }));
  truncated ||= unresolved.length > MAX_UNRESOLVED;

  // Keep at least one incoming edge for each discovered function before filling the edge budget.
  const firstIncoming = new Map();
  for (const edge of resolved) {
    if (edge.source.depth + 1 !== edge.target.depth) continue;
    if (!firstIncoming.has(edge.target.key)) firstIncoming.set(edge.target.key, edge);
  }
  const edgePool = new Set([
    ...resolved.filter(({ call }) => preferred.has(call.id)),
    ...firstIncoming.values(),
    ...unresolvedEdges,
    ...resolved,
  ]);
  truncated ||= edgePool.size > MAX_CALLS;
  const edges = [...edgePool].slice(0, MAX_CALLS);
  return {
    vertices: [...vertices.values(), ...edges.filter(({ call }) => call.to == null).map(({ target }) => target)],
    edges,
    truncated,
  };
}

function pathView(functions, entryId, path) {
  const vertices = [makeFunctionVertex(functions.get(entryId), 0)];
  const edges = path.map((call, index) => {
    const source = vertices[index];
    const target = makeFunctionVertex(functions.get(call.to), index + 1);
    vertices.push(target);
    return { call, source, target };
  });
  return { vertices, edges, truncated: false };
}

function layout(vertices, availableHeight) {
  const columns = new Map();
  for (const vertex of vertices) {
    if (!columns.has(vertex.depth)) columns.set(vertex.depth, []);
    columns.get(vertex.depth).push(vertex);
  }
  const lastColumn = Math.max(...columns.keys());
  const longestColumn = Math.max(...Array.from(columns.values(), ({ length }) => length));
  const innerWidth = lastColumn * COLUMN_STEP + NODE_WIDTH;
  const width = innerWidth + 82;
  const height = Math.max(availableHeight, (longestColumn - 1) * ROW_STEP + NODE_HEIGHT + 60);
  for (const [depth, column] of columns) {
    const left = (width - innerWidth) / 2 + depth * COLUMN_STEP;
    const top = (height - (column.length - 1) * ROW_STEP - NODE_HEIGHT) / 2;
    column.forEach((vertex, row) => {
      vertex.x = left;
      vertex.y = top + row * ROW_STEP;
    });
  }
  return { width, height };
}

function activate(element, key, label, pressed, callback) {
  element.setAttribute('tabindex', '0');
  element.setAttribute('role', 'button');
  element.setAttribute('aria-label', label);
  element.setAttribute('aria-pressed', pressed);
  element.dataset.graphControl = key;
  element.append(svgElement('title', {}, label));
  element.addEventListener('click', callback);
  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (!event.repeat) callback();
  });
}

function ellipsis(value, limit) {
  let width = 0;
  let visible = '';
  for (const character of value) {
    width += /[\u1100-\u11ff\u2e80-\ua4cf\uac00-\ud7af\uf900-\ufaff\uff01-\uff60]/u.test(character) ? 2 : 1;
    if (width > limit) return `${visible}…`;
    visible += character;
  }
  return visible;
}

function location(file, line) {
  return `${file.split('/').at(-1)}:${line}`;
}

function drawVertex(vertex, options) {
  const { x, y, fn, call } = vertex;
  const entry = fn?.id === options.entryId;
  const selected = fn ? fn.id === options.selectedFunctionId : call.id === options.selectedCallId;
  const group = svgElement('g', {
    class: [
      'atlas-graph__vertex',
      entry ? 'is-entry' : '',
      !fn ? 'is-unresolved' : '',
      selected ? 'is-selected' : '',
    ].filter(Boolean).join(' '),
    transform: `translate(${x} ${y})`,
  });
  if (fn) group.dataset.functionId = fn.id;
  else group.dataset.unresolvedCallId = call.id;

  const fullName = fn?.qualname ?? call.label;
  const shortName = fn?.kind === 'method' ? fullName.split('.').slice(-2).join('.') : fn?.name ?? call.label;
  const detail = fn ? location(fn.file, fn.line) : '해석되지 않은 호출';
  const label = fn
    ? `${entry ? '진입점 ' : '함수 '}${fullName}, ${fn.file} ${fn.line}줄`
    : `해석되지 않은 호출 ${call.label}, ${call.file} ${call.line}줄`;
  activate(group, vertex.key, label, selected, () => {
    if (fn) options.onFunction?.(fn.id);
    else options.onCall?.(call.id);
  });

  group.append(
    svgElement('rect', { class: 'atlas-graph__card', width: NODE_WIDTH, height: NODE_HEIGHT, rx: 8 }),
    svgElement('rect', { class: 'atlas-graph__glyph-box', x: 10, y: 12, width: 23, height: 23, rx: 5 }),
    svgElement('text', { class: 'atlas-graph__glyph', x: 21.5, y: 28 }, fn ? (entry ? '↦' : 'ƒ') : '?'),
    svgElement('text', { class: 'atlas-graph__name', x: 41, y: 23 }, ellipsis(shortName, 16)),
    svgElement('text', { class: 'atlas-graph__location', x: 41, y: 39 }, ellipsis(detail, 19)),
  );
  return group;
}

function edgeGeometry(source, target, offset) {
  const middleY = NODE_HEIGHT / 2;
  if (source === target) {
    const x = source.x + NODE_WIDTH;
    const y = source.y + middleY;
    const loop = x + 36 + Math.abs(offset);
    return `M ${x} ${y - 11 - offset} C ${loop} ${y - 29 - offset} ${loop} ${y + 30 + offset} ${x + 3} ${y + 13 + offset}`;
  }

  const y1 = source.y + middleY + offset;
  const y2 = target.y + middleY + offset;
  if (source.x === target.x) {
    const x = source.x + NODE_WIDTH;
    const bend = x + 33 + Math.abs(offset);
    return `M ${x} ${y1} C ${bend} ${y1} ${bend} ${y2} ${x + 3} ${y2}`;
  }

  const forward = source.x < target.x;
  const x1 = source.x + (forward ? NODE_WIDTH : 0);
  const x2 = target.x + (forward ? -3 : NODE_WIDTH + 3);
  const bend = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${bend} ${y1} ${bend} ${y2} ${x2} ${y2}`;
}

function drawEdge(edge, options, pathIds, markers, offset) {
  const { call, source, target } = edge;
  const selected = call.id === options.selectedCallId;
  const highlighted = pathIds.has(call.id);
  const unresolved = call.to == null;
  const group = svgElement('g', {
    class: [
      'atlas-graph__edge',
      selected ? 'is-selected' : '',
      highlighted ? 'is-route' : '',
      unresolved ? 'is-unresolved' : '',
    ].filter(Boolean).join(' '),
  });
  group.dataset.callId = call.id;
  const destination = target.fn?.qualname ?? `${call.label} (해석되지 않음)`;
  const label = `${source.fn.qualname} → ${destination}, ${call.file} ${call.line}줄`;
  activate(group, `call:${call.id}`, label, selected, () => options.onCall?.(call.id));

  const shape = edgeGeometry(source, target, offset);
  const marker = selected || highlighted ? markers.route : unresolved ? markers.unresolved : markers.normal;
  group.append(
    svgElement('path', { class: 'atlas-graph__edge-line', d: shape, 'marker-end': `url(#${marker})` }),
    svgElement('path', { class: 'atlas-graph__edge-hit', d: shape }),
  );
  return group;
}

function defineMarkers(svg) {
  const definitions = svgElement('defs');
  const instance = ++graphSequence;
  const ids = {};
  for (const type of ['normal', 'route', 'unresolved']) {
    const id = `atlas-${instance}-arrow-${type}`;
    const marker = svgElement('marker', {
      id,
      markerUnits: 'userSpaceOnUse',
      viewBox: '0 0 9 10',
      refX: 8.5,
      refY: 5,
      markerWidth: 8,
      markerHeight: 9,
      orient: 'auto',
    });
    marker.append(svgElement('path', { class: `atlas-graph__marker atlas-graph__marker--${type}`, d: 'M 0 0 L 9 5 L 0 10 z' }));
    definitions.append(marker);
    ids[type] = id;
  }
  svg.append(definitions);
  return ids;
}

function edgeOffsets(edges) {
  const groups = new Map();
  for (const edge of edges) {
    if (!groups.has(edge.source)) groups.set(edge.source, new Map());
    const destinations = groups.get(edge.source);
    if (!destinations.has(edge.target)) destinations.set(edge.target, []);
    destinations.get(edge.target).push(edge);
  }
  const offsets = new Map();
  for (const destinations of groups.values()) {
    for (const edgesBetweenNodes of destinations.values()) {
      const step = Math.min(12, 32 / Math.max(1, edgesBetweenNodes.length - 1));
      edgesBetweenNodes.forEach((edge, index) => {
        offsets.set(edge, (index - (edgesBetweenNodes.length - 1) / 2) * step);
      });
    }
  }
  return offsets;
}

function emptyGraph(container, message) {
  const empty = document.createElement('p');
  empty.className = 'atlas-graph__empty';
  empty.textContent = message;
  container.replaceChildren(empty);
  return { visibleNodes: 0, visibleCalls: 0, truncated: false };
}

export function renderGraph(container, graph, options = {}) {
  const functions = new Map(graph.functions.map((fn) => [fn.id, fn]));
  const entryId = options.entryId ?? graph.entries[0]?.id ?? graph.functions[0]?.id;
  const mode = options.mode ?? 'overview';
  const activeKey = container.contains(document.activeElement) ? document.activeElement.dataset.graphControl : undefined;
  const sameView = container.dataset.graphEntry === entryId && container.dataset.graphMode === mode;
  const previousScroll = [container.scrollLeft, container.scrollTop];
  container.classList.add('atlas-graph');
  container.dataset.graphEntry = entryId ?? '';
  container.dataset.graphMode = mode;

  if (!functions.has(entryId)) return emptyGraph(container, '지도에 표시할 함수가 없습니다.');
  const callsByCaller = indexCalls(graph, functions);
  const targetId = options.selectedFunctionId ?? entryId;
  const path = shortestPath(callsByCaller, entryId, targetId);
  if (mode === 'path' && path == null) {
    return emptyGraph(container, '이 진입점에서 선택한 함수까지 확인된 호출 경로가 없습니다.');
  }
  const view = mode === 'path'
    ? pathView(functions, entryId, path)
    : overview(callsByCaller, functions, entryId, options, path);

  const { width, height } = layout(view.vertices, container.clientHeight);
  const svg = svgElement('svg', {
    class: 'atlas-graph__canvas',
    width,
    height,
    role: 'group',
    'aria-label': mode === 'path' ? '선택한 함수까지의 호출 경로' : '진입점에서 시작하는 호출 그래프',
  });
  const markers = defineMarkers(svg);
  const pathIds = new Set(path?.map(({ id }) => id));
  const offsets = edgeOffsets(view.edges);
  const emphasized = ({ call }) => call.id === options.selectedCallId || pathIds.has(call.id);
  const drawOrder = [...view.edges.filter((edge) => !emphasized(edge)), ...view.edges.filter(emphasized)];
  for (const edge of drawOrder) svg.append(drawEdge(edge, options, pathIds, markers, offsets.get(edge)));
  for (const vertex of view.vertices) svg.append(drawVertex(vertex, { ...options, entryId }));
  container.replaceChildren(svg);

  const controls = [...svg.querySelectorAll('[data-graph-control]')];
  controls.find((element) => element.dataset.graphControl === activeKey)?.focus({ preventScroll: true });
  if (sameView) {
    [container.scrollLeft, container.scrollTop] = previousScroll;
  } else {
    container.scrollLeft = 0;
    container.scrollTop = Math.max(0, (height - container.clientHeight) / 2);
  }
  return { visibleNodes: view.vertices.length, visibleCalls: view.edges.length, truncated: view.truncated };
}
