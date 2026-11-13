const dayMilliseconds = 86_400_000;
const sampleMonth = '2027-04';
const initialDay = '10';
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const samples = [
  { id: 'sample-1', title: '참고 자료 수집', start: '2027-04-01', end: '2027-04-06', completed: true },
  { id: 'sample-2', title: '회의 안건 정리', start: '2027-04-04', end: '2027-04-08' },
  { id: 'sample-3', title: '발표 초안 제출', start: '2027-04-07', end: '2027-04-10' },
  { id: 'sample-4', title: '디자인 시안 검토', start: '2027-04-11', end: '2027-04-16' },
  { id: 'sample-5', title: '기획 문서 작성', start: '2027-04-08', end: '2027-04-21', starred: true },
  { id: 'sample-6', title: '예시 화면 제작', start: '2027-04-15', end: '2027-04-25' },
  { id: 'sample-7', title: '공개 자료 점검', start: '2027-04-23', end: '2027-04-30' },
  { id: 'sample-8', title: '프로젝트 정리', start: '2027-04-25', end: '2027-05-04' },
];

const byId = id => document.getElementById(id);
const slider = byId('demo-day');
const editor = byId('editor');
const form = byId('editor-form');
const fields = form.elements;
let events = samples.map(event => ({ ...event }));
let month = sampleMonth;
let current = `${sampleMonth}-${initialDay}`;
let editingId = null;
let hideCompleted = false;
let nextId = 1;

function dayTime(date) {
  return Date.parse(`${date}T00:00:00Z`);
}

function addDays(date, days) {
  return new Date(dayTime(date) + days * dayMilliseconds).toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  return (dayTime(to) - dayTime(from)) / dayMilliseconds;
}

function shiftMonth(offset) {
  const date = new Date(dayTime(`${month}-01`));
  date.setUTCMonth(date.getUTCMonth() + offset);
  month = date.toISOString().slice(0, 7);
  renderCalendar();
}

function dateLabel(date) {
  const [, number, day] = date.split('-').map(Number);
  return `${number}월 ${day}일`;
}

function deadlineLabel(event) {
  if (event.completed) return '완료';
  const days = daysBetween(current, event.end);
  if (days === 0) return '당일';
  if (days < 0) return `${-days}일 지남`;
  return `D-${days}`;
}

function urgencyPercent(event) {
  const days = Math.min(21, Math.max(0, daysBetween(current, event.end)));
  return `${((21 - days) / 21) * 100}%`;
}

function node(tag, className = '', content = '') {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = content;
  return element;
}

function button(className, content, label, handler) {
  const element = node('button', className, content);
  element.type = 'button';
  if (label) element.setAttribute('aria-label', label);
  element.addEventListener('click', handler);
  return element;
}

function spanLabel(event) {
  if (event.start === event.end) return dateLabel(event.start);
  return `${dateLabel(event.start)} ~ ${dateLabel(event.end)}`;
}

function renderCalendar() {
  const [year, monthNumber] = month.split('-').map(Number);
  byId('month-title').textContent = `${year}년 ${monthNumber}월`;
  const calendar = byId('calendar');
  const first = `${month}-01`;
  const firstWeekday = new Date(dayTime(first)).getUTCDay();
  const last = new Date(Date.UTC(year, monthNumber, 0)).toISOString().slice(0, 10);
  const heading = node('div', 'cal-weekdays');
  heading.append(...weekdays.map(day => node('span', '', day)));
  const weeks = document.createDocumentFragment();
  for (let weekStart = addDays(first, -firstWeekday); weekStart <= last; weekStart = addDays(weekStart, 7)) {
    const weekEnd = addDays(weekStart, 6);
    const week = node('div', 'cal-week');
    const columns = node('div', 'cal-day-columns');
    columns.setAttribute('aria-hidden', 'true');
    const dates = node('div', 'cal-dates');
    const lanes = node('div', 'cal-lanes');
    for (let column = 0; column < 7; column++) {
      const date = addDays(weekStart, column);
      columns.append(node('span'));
      const day = node('div', 'cal-day');
      day.classList.toggle('outside', !date.startsWith(`${month}-`));
      day.classList.toggle('current', date === current);
      const number = node('time', '', String(Number(date.slice(-2))));
      number.dateTime = date;
      number.setAttribute('aria-label', dateLabel(date));
      if (date === current) number.setAttribute('aria-current', 'date');
      day.append(number);
      dates.append(day);
    }
    const laneEnd = [];
    const visibleEvents = events.filter(event => event.start <= weekEnd && event.end >= weekStart && (!hideCompleted || !event.completed));
    visibleEvents.sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
    for (const event of visibleEvents) {
      const start = Math.max(0, daysBetween(weekStart, event.start));
      const end = Math.min(6, daysBetween(weekStart, event.end));
      let lane = laneEnd.findIndex(value => value < start);
      if (lane < 0) lane = laneEnd.length;
      laneEnd[lane] = end;
      const due = deadlineLabel(event);
      const label = `${event.title}, ${spanLabel(event)}, ${due}`;
      const bar = button('cal-bar', '', label, () => openEditor(event));
      bar.title = label;
      bar.classList.toggle('complete', Boolean(event.completed));
      bar.dataset.continuedStart = String(event.start < weekStart);
      bar.dataset.continuedEnd = String(event.end > weekEnd);
      bar.style.gridColumn = `${start + 1} / ${end + 2}`;
      bar.style.gridRow = String(lane + 1);
      bar.style.setProperty('--urgency', urgencyPercent(event));
      const prefix = event.completed ? '✓ ' : event.starred ? '★ ' : '';
      bar.append(node('span', 'cal-bar-title', prefix + event.title), node('span', 'cal-bar-due', due));
      lanes.append(bar);
    }
    week.append(columns, dates, lanes);
    weeks.append(week);
  }
  calendar.replaceChildren(heading, weeks);
}

function eventRow(event) {
  const row = node('li', 'event-row');
  row.classList.toggle('complete', Boolean(event.completed));
  const dot = node('span', 'event-dot');
  if (!event.completed) dot.style.setProperty('--urgency', urgencyPercent(event));
  const title = button('row-name', event.title, `${event.title} 편집`, () => openEditor(event));
  const meta = node('span', 'row-meta', `${spanLabel(event)} · ${deadlineLabel(event)}`);
  const text = node('div', 'row-text');
  meta.classList.toggle('overdue', !event.completed && event.end < current);
  text.append(title, meta);
  const pin = button('row-action icon-button', event.starred ? '★' : '☆', `${event.title} ${event.starred ? '별표 해제' : '별표'}`, () => {
    event.starred = !event.starred;
    render();
    document.querySelector(`[data-event-star="${event.id}"]`)?.focus({ preventScroll: true });
  });
  pin.dataset.eventStar = event.id;
  pin.setAttribute('aria-pressed', String(Boolean(event.starred)));
  const completed = button('row-action icon-button', event.completed ? '↶' : '✓', `${event.title} ${event.completed ? '완료 취소' : '완료 처리'}`, () => {
    event.completed = !event.completed;
    render();
    if (event.completed) byId('completed-count').focus({ preventScroll: true });
    else document.querySelector(`[data-event-star="${event.id}"]`)?.focus({ preventScroll: true });
  });
  row.append(dot, text, pin, completed);
  return row;
}

function renderList() {
  const active = events.filter(event => !event.completed).sort((a, b) => (
    Number(Boolean(b.starred)) - Number(Boolean(a.starred)) || a.end.localeCompare(b.end)
  ));
  const completed = events.filter(event => event.completed);
  byId('active-events').replaceChildren(...active.map(eventRow));
  byId('event-count').textContent = `${active.length}개`;
  byId('empty-events').hidden = active.length > 0;
  byId('completed-events').replaceChildren(...completed.map(eventRow));
  byId('completed-count').textContent = `완료한 일정 (${completed.length})`;
  byId('completed-list').hidden = completed.length === 0;
}

function render() {
  const label = dateLabel(current);
  byId('reference').textContent = label;
  slider.setAttribute('aria-valuetext', label);
  renderCalendar();
  renderList();
}

function openEditor(event) {
  editingId = event?.id ?? null;
  const defaultDate = current.startsWith(`${month}-`) ? current : `${month}-01`;
  byId('editor-title').textContent = event ? '일정 편집' : '일정 추가';
  byId('delete-event').hidden = !event;
  fields.title.value = event?.title ?? '';
  fields.start.value = event?.start ?? defaultDate;
  fields.end.value = event?.end ?? defaultDate;
  fields.title.setCustomValidity('');
  fields.end.setCustomValidity('');
  editor.showModal();
  fields.title.focus();
}

slider.addEventListener('input', () => {
  current = `${sampleMonth}-${slider.value.padStart(2, '0')}`;
  month = sampleMonth;
  render();
});
byId('previous').addEventListener('click', () => shiftMonth(-1));
byId('next').addEventListener('click', () => shiftMonth(1));
byId('reference-month').addEventListener('click', () => {
  month = sampleMonth;
  renderCalendar();
});
byId('theme').addEventListener('click', event => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  event.currentTarget.textContent = dark ? '라이트 모드' : '다크 모드';
  event.currentTarget.setAttribute('aria-pressed', String(dark));
});
byId('hide-completed').addEventListener('click', event => {
  hideCompleted = !hideCompleted;
  event.currentTarget.textContent = hideCompleted ? '완료 보이기' : '완료 숨기기';
  event.currentTarget.setAttribute('aria-pressed', String(hideCompleted));
  renderCalendar();
});
byId('reset').addEventListener('click', () => {
  events = samples.map(event => ({ ...event }));
  slider.value = initialDay;
  month = sampleMonth;
  current = `${sampleMonth}-${initialDay}`;
  hideCompleted = false;
  byId('completed-list').open = false;
  byId('hide-completed').textContent = '완료 숨기기';
  byId('hide-completed').setAttribute('aria-pressed', 'false');
  render();
});
byId('add-event').addEventListener('click', () => openEditor());
byId('close-editor').addEventListener('click', () => editor.close());
byId('delete-event').addEventListener('click', () => {
  if (!editingId) return;
  events = events.filter(event => event.id !== editingId);
  editor.close();
  render();
  byId('add-event').focus({ preventScroll: true });
});
form.addEventListener('input', () => {
  fields.title.setCustomValidity('');
  fields.end.setCustomValidity('');
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const title = fields.title.value.trim();
  const start = fields.start.value;
  const end = fields.end.value;
  fields.title.setCustomValidity(title ? '' : '일정 이름을 입력해 주세요.');
  fields.end.setCustomValidity(start <= end ? '' : '마감일은 시작일과 같거나 늦어야 해요.');
  if (!form.reportValidity()) return;
  const draft = { title, start, end };
  const existing = events.find(item => item.id === editingId);
  if (existing) Object.assign(existing, draft);
  else events.push({ ...draft, id: `demo-${nextId++}` });
  if (!existing) month = start.slice(0, 7);
  editor.close();
  render();
  byId('add-event').focus({ preventScroll: true });
});
render();
