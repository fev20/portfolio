(() => {
  const byId = id => document.getElementById(id);
  const ui = Object.fromEntries(['program', 'description', 'step', 'run', 'pause', 'reset', 'pc', 'count', 'status', 'exit',
    'instructions', 'last', 'registers', 'filename', 'source', 'memory-range', 'memory', 'memory-detail'].map(id => [id, byId(id)]));
  const programs = JSON.parse(byId('program-data').textContent);
  const addresses = new Map();
  const sourceRows = new Map();
  const registerRows = [];
  let machine;
  let program;
  let timer = null;
  let latestMemory = null;
  let activeInstruction;
  let activeSource;

  function element(tag, value, className) {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = value;
    if (className) node.className = className;
    return node;
  }

  for (const example of programs) ui.program.add(new Option(example.title, example.id));
  for (const [index, label] of ABI.entries()) {
    const row = element('div');
    const value = element('dd');
    row.append(element('dt', `x${index} ${label}`), value);
    ui.registers.append(row);
    registerRows.push({row, value});
  }

  function setup() {
    stop();
    program = programs.find(example => example.id === ui.program.value);
    machine = new Machine(program);
    latestMemory = null;
    ui.description.textContent = program.description;
    ui.filename.textContent = program.filename;
    addresses.clear();
    sourceRows.clear();
    ui.instructions.replaceChildren();
    ui.source.replaceChildren();
    for (const addr of program.instructions) {
      const word = machine.fetch(addr);
      const row = element('div', undefined, 'instruction-row');
      row.append(element('span', `0x${hex(addr, 5)}`), element('span', hex(word)),
        element('span', assembly(decode(word), addr)));
      addresses.set(addr, row);
      ui.instructions.append(row);
    }
    program.source.trimEnd().split('\n').forEach((text, index) => {
      const row = element('div', undefined, 'source-row');
      row.append(element('span', index + 1), element('span', text));
      sourceRows.set(index + 1, row);
      ui.source.append(row);
    });
    ui.instructions.scrollTop = 0;
    ui.source.scrollTop = 0;
    render();
  }

  function highlight(previous, next, viewport) {
    previous?.classList.remove('current');
    previous?.removeAttribute('aria-current');
    if (!next) return undefined;
    next.classList.add('current');
    next.setAttribute('aria-current', 'step');
    const view = viewport.getBoundingClientRect();
    const item = next.getBoundingClientRect();
    if (item.top < view.top) viewport.scrollTop += item.top - view.top - 8;
    if (item.bottom > view.bottom) viewport.scrollTop += item.bottom - view.bottom + 8;
    return next;
  }

  function describeLast(event) {
    if (!event) return '명령을 실행하면 이곳에 변화가 표시됩니다.';
    const changes = [event.note];
    if (event.register) {
      const {index, before, value} = event.register;
      changes.push(`${ABI[index]}: 0x${hex(before)} → 0x${hex(value)}`);
    }
    if (event.memory) changes.push(`${event.memory.size}바이트 ${event.memory.kind}`);
    return [event.instruction?.name ?? '트랩', ...changes.filter(Boolean)].join(' · ');
  }

  function showMemory() {
    const lastAddress = latestMemory?.address ?? 0x12000;
    const stackAddress = machine.registers[2] || 0x20000;
    const position = {'result': 0x12000, 'last': lastAddress & ~7, 'stack': Math.max(0x1f000, stackAddress - 16) & ~7}[ui['memory-range'].value];
    const start = Math.min(position, machine.memory.length - 32);
    ui.memory.replaceChildren();
    for (let offset = 0; offset < 32; offset += 8) {
      const address = start + offset;
      const row = element('div', undefined, 'memory-row');
      row.append(element('span', `0x${hex(address, 5)}`));
      for (let byte = address; byte < address + 8; byte++) {
        const visible = machine.segments.some(segment => (segment.flags & 4) && byte >= segment.address && byte < segment.address + segment.size);
        const active = latestMemory && byte >= latestMemory.address && byte < latestMemory.address + latestMemory.size;
        row.append(element('span', visible ? hex(machine.memory[byte], 2) : '–', active ? 'active' : ''));
      }
      ui.memory.append(row);
    }
    ui['memory-detail'].textContent = latestMemory ? `최근 접근 · 0x${hex(latestMemory.address)} · ${latestMemory.size}바이트 ${latestMemory.kind}` : '메모리 접근 기록이 없습니다.';
  }

  function render() {
    const halted = machine.exit !== null || machine.trap !== null;
    ui.pc.textContent = halted ? '—' : `0x${hex(machine.pc)}`;
    ui.count.textContent = machine.count;
    ui.status.textContent = machine.trap ? '트랩' : machine.exit !== null ? '실행 완료' : timer !== null ? '실행 중' : machine.count ? '정지' : '준비';
    ui.exit.textContent = machine.exit === null ? '—' : String(machine.exit | 0);
    ui.step.disabled = halted || timer !== null;
    ui.run.disabled = halted || timer !== null;
    ui.pause.disabled = timer === null;
    activeInstruction = highlight(activeInstruction, halted ? undefined : addresses.get(machine.pc), ui.instructions);
    activeSource = highlight(activeSource, halted ? undefined : sourceRows.get(program.lines[machine.pc]), ui.source);
    for (const [index, {row, value}] of registerRows.entries()) {
      value.textContent = hex(machine.registers[index]);
      row.classList.toggle('changed', machine.last?.register?.index === index);
    }
    ui.last.textContent = describeLast(machine.last);
    showMemory();
  }

  function stop() {
    if (timer !== null) clearInterval(timer);
    timer = null;
  }

  function advance() {
    const event = machine.step();
    if (event?.memory) latestMemory = event.memory;
    if (machine.exit !== null || machine.trap !== null) stop();
    render();
  }

  ui.program.addEventListener('change', setup);
  ui.reset.addEventListener('click', setup);
  ui.step.addEventListener('click', advance);
  ui.run.addEventListener('click', () => { timer = setInterval(advance, 48); render(); });
  ui.pause.addEventListener('click', () => { stop(); render(); });
  ui['memory-range'].addEventListener('change', showMemory);
  setup();
})();
