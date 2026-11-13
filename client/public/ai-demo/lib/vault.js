/** Conservative, read-only Obsidian audit. No filesystem or network access. */
export const normalize = value => String(value).normalize('NFC');
export const key = value => normalize(value).toLocaleLowerCase('en-US');
const blank = value => value.replace(/[^\n]/g, ' ');
const base = path => path.split('/').at(-1);
const stem = path => base(path).replace(/\.md$/i, '');
const dir = path => path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
const isExternal = value => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
export function cleanPath(path) {
  const parts = [];
  for (const part of normalize(path).replaceAll('\\', '/').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') { if (!parts.length) return null; parts.pop(); }
    else parts.push(part);
  }
  return parts.join('/');
}
function visibleText(text) {
  // A stateful mask preserves line positions without interpreting comment markers in code.
  const lines=text.split('\n');let fence=null,comment=null,html=false;
  for(let row=0;row<lines.length;row++){
    const line=lines[row],marker=line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if(fence){
      if(marker&&marker[1][0]===fence[0]&&marker[1].length>=fence.length&&!marker[2].trim())fence=null;
      lines[row]=blank(line);continue;
    }
    if(!comment&&marker){fence=marker[1];lines[row]=blank(line);continue;}
    if(!comment&&/^ {0,3}<(?:div|table|pre|script|style|section|article|details|iframe)\b/i.test(line))html=true;
    if(html){lines[row]=blank(line);if(/<\/(?:div|table|pre|script|style|section|article|details|iframe)>/i.test(line))html=false;continue;}
    if(!comment&&/^(?: {4}|\t)/.test(line)){lines[row]=blank(line);continue;}
    let out='',i=0;
    while(i<line.length){
      if(comment){const end=line.indexOf(comment,i);if(end<0){out+=' '.repeat(line.length-i);i=line.length;}else{out+=' '.repeat(end+comment.length-i);i=end+comment.length;comment=null;}continue;}
      if(line.startsWith('<!--',i)){out+='    ';i+=4;comment='-->';continue;}
      if(line.startsWith('%%',i)){out+='  ';i+=2;comment='%%';continue;}
      if(line[i]==='`'){
        let run=1;while(line[i+run]==='`')run++;const delimiter='`'.repeat(run);let end=line.indexOf(delimiter,i+run);
        while(end>=0&&(line[end-1]==='`'||line[end+run]==='`'))end=line.indexOf(delimiter,end+run);
        if(end>=0){out+=' '.repeat(end+run-i);i=end+run;continue;}
      }
      out+=line[i++];
    }
    lines[row]=out;
  }
  return lines.join('\n');
}
function aliasesFrom(text) {
  const fm = text.match(/^\uFEFF?---\s*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)\s*(?:\r?\n|$)/);
  if (!fm) return { aliases: [], end: 0, warning: '' };
  const m = fm[1].match(/^aliases[ \t]*:[ \t]*(.*)$/m); if (!m) return { aliases: [], end: fm[0].length, warning: '' };
  let raw = m[1].trim(), values = [], warning = '';
  const unquote = s => s.trim().replace(/^(['"])([\s\S]*)\1$/, '$2');
  if (raw.startsWith('[')) {
    if (!raw.endsWith(']')) warning = '여러 줄 YAML 별칭은 수동 확인이 필요합니다.';
    else values = (raw.slice(1, -1).match(/"(?:\\.|[^"\\])*"|'(?:''|[^'])*'|[^,]+/g) || []).map(unquote);
  } else if (!raw || raw.startsWith('#')) {
    const tail = fm[1].slice(m.index + m[0].length);
    for (const line of tail.split('\n')) {
      if (!line.trim()) continue;
      const item = line.match(/^\s*-\s+(.+)$/);
      if (item) values.push(unquote(item[1])); else break;
    }
  } else warning = 'aliases는 YAML 목록 형식이어야 합니다.';
  return { aliases: values.filter(Boolean).map(normalize), end: fm[0].length, warning };
}
function mdDestinations(text) {
  const found = []; // Inline destinations, including balanced parentheses and optional titles.
  const re = /!?\[(?!\[)(?:\\.|[^\]\\])*\]\(/g; let m;
  while ((m = re.exec(text))) {
    let i = re.lastIndex, start = i, depth = 1, angle = text[i] === '<', dest = '';
    if (angle) { i++; start = i; while (i < text.length && text[i] !== '>' && text[i] !== '\n') i++; if(text[i] !== '>') continue; dest = text.slice(start,i); }
    else {
      while (i < text.length && depth > 0 && text[i] !== '\n') {
        if (text[i] === '\\') { i += 2; continue; }
        if (text[i] === '(') depth++;
        if (text[i] === ')') { depth--; if (!depth) break; }
        if (/\s/.test(text[i]) && depth === 1) break;
        i++;
      }
      dest = text.slice(start, i).replace(/\\([()])/g, '$1');
    }
    if (dest) found.push({ raw: dest, index: m.index, kind: 'markdown' });
  }
  // Reference definitions are inspected once; uses are not counted again.
  for (const match of text.matchAll(/^ {0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gm)) found.push({raw:match[1]||match[2],index:match.index,kind:'reference'});
  return found;
}
export function parseNote(path, text) {
  const fm = aliasesFrom(text); const visible = visibleText(text); const content = visible.slice(fm.end);
  const headingStack = [], headings = [];
  for (const match of content.matchAll(/^ {0,3}(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/gm)) {
    const level = match[1].length; const title = normalize(match[2].replace(/[*_`]/g,'').trim());
    while(headingStack.length && headingStack.at(-1).level >= level) headingStack.pop();
    headings.push({title, level, chain:[...headingStack.map(h=>h.title),title]}); headingStack.push({title,level});
  }
  for (const match of content.matchAll(/^([^\n]+)\n(?:={3,}|-{3,})\s*$/gm)) headings.push({title:normalize(match[1].trim()),level:1,chain:[normalize(match[1].trim())]});
  const blocks = [...content.matchAll(/(?:^|\s)\^([a-zA-Z0-9-]+)\s*$/gm)].map(m=>m[1]);
  const refs = [];
  for (const m of visible.matchAll(/!?\[\[([^\]\n]+)\]\]/g)) {
    let slashes=0;for(let i=m.index-1;i>=0&&visible[i]==='\\';i--)slashes++;
    if(slashes%2)continue;
    refs.push({raw:m[1].split(/\\?\|/)[0].trim(),index:m.index,kind:'wiki'});
  }
  refs.push(...mdDestinations(visible));
  for (const r of refs) { r.line = visible.slice(0,r.index).split('\n').length; delete r.index; }
  return {path:normalize(path),name:stem(path),aliases:fm.aliases,headings,blocks,refs,warning:fm.warning,
    fingerprint:content.replace(/^#\s+.*$/m,'').replace(/\s+/g,' ').trim()};
}
function pushMap(map, k, value) { const list=map.get(k)||[]; if(!list.includes(value)) list.push(value); map.set(k,list); }
function decode(value){try{return decodeURIComponent(value);}catch{return value;}}
function headingKey(s){return key(s).replace(/[*_`]/g,'').replace(/\s+/g,' ').trim();}
export function auditVault(files, options={}) {
  const all = new Map(); const diagnostics=[];
  for(const file of files) {
    const p=cleanPath(file.path); if(!p || p.split('/').some(x=>x.startsWith('.'))) continue;
    if(all.has(p)) diagnostics.push({path:p,detail:'동일 경로의 입력이 중복되어 첫 파일만 검사했습니다.'}); else all.set(p,{...file,path:p});
  }
  const notes = [...all.values()].filter(f=>/\.md$/i.test(f.path)&&typeof f.text==='string').map(f=>parseNote(f.path,f.text));
  const noteMap=new Map(notes.map(n=>[n.path,n])); const names=new Map(), aliases=new Map(), casePaths=new Map();
  for(const path of all.keys()) {pushMap(names,key(base(path)),path);if(/\.md$/i.test(path))pushMap(names,key(stem(path)),path);pushMap(casePaths,key(path),path);}
  for(const n of notes) for(const a of n.aliases) pushMap(aliases,key(a),n.path);
  const excluded=(options.excludeFolders||[]).map(cleanPath).filter(Boolean);
  const skip=p=>excluded.some(e=>p===e||p.startsWith(e+'/'));
  function resolve(source,ref) {
    const raw=ref.raw.trim(); if(!raw||isExternal(raw))return null;
    const split=raw.indexOf('#'); const target=decode(split<0?raw:raw.slice(0,split)); const anchor=decode(split<0?'':raw.slice(split+1));
    if(target.startsWith('?'))return null;
    let candidates=[]; const exacts=[]; let fallback=false;
    if(!target) candidates=[source];
    else {
      let paths=[];
      if(target.startsWith('./')||target.startsWith('../')) paths=[cleanPath(dir(source)+'/'+target)];
      else if(target.startsWith('/'))paths=[cleanPath(target)];
      else if(target.includes('/')) paths=[cleanPath(target),cleanPath(dir(source)+'/'+target)];
      else paths=[cleanPath(dir(source)+'/'+target),cleanPath(target)];
      for(const p of paths.filter(Boolean)) for(const x of /\.md$/i.test(p)?[p]:[p,p+'.md']) if(all.has(x))exacts.push(x);
      if(!target.includes('/')) candidates=[...(names.get(key(target))||[])];
      else candidates=[...new Set(exacts)];
      if(!candidates.length && exacts.length)candidates=[...new Set(exacts)];
      if(!candidates.length){for(const p of paths.filter(Boolean)) for(const x of [p,p+'.md']) candidates.push(...casePaths.get(key(x))||[]);fallback=!!candidates.length;}
    }
    candidates=[...new Set(candidates)];
    const common={source,line:ref.line,target:raw,kind:ref.kind,candidates};
    if(!candidates.length) {
      const a=aliases.get(key(target))||[];
      if(a.length)return {...common,status:'alias',candidates:a,detail:'별칭과 일치합니다. 실제 파일 이름을 대상으로 사용하세요.'};
      const attachment=/\.[a-z0-9]{1,8}$/i.test(target)&&!target.toLowerCase().endsWith('.md');
      return {...common,status:options.complete?'missing':'unresolved',detail:options.complete?'가져온 폴더에서 대상을 찾지 못했습니다.':attachment?'선택하지 않은 첨부파일일 수 있습니다.':'선택하지 않은 노트일 수 있습니다.'};
    }
    if(candidates.length>1)return {...common,status:'ambiguous',detail:'여러 경로가 일치합니다. 폴더를 포함한 링크를 확인하세요.'};
    const destination=candidates[0]; const n=noteMap.get(destination);
    if(fallback || (target&&!target.includes('/')&&!exacts.includes(destination)&&normalize(target)!==base(destination)&&normalize(target)!==stem(destination)))return {...common,destination,status:'case',detail:'대소문자 또는 경로 표기가 다릅니다. 기기 간 호환성을 확인하세요.'};
    if(anchor&&n) {
      if(anchor.startsWith('^')) {if(!n.blocks.includes(anchor.slice(1)))return {...common,destination,status:'anchor',detail:'해당 블록 ID를 찾지 못했습니다.'};}
      else {
        const wanted=anchor.split('#').map(headingKey);
        let matched=n.headings.filter(h=>wanted.length===1?headingKey(h.title)===wanted[0]:h.chain.slice(-wanted.length).map(headingKey).join('#')===wanted.join('#'));
        // Slug anchors may come from other Markdown editors; do not certify them.
        if(!matched.length)return {...common,destination,status:'anchor',detail:'제목을 찾지 못했거나 지원 범위 밖의 제목 문법입니다.'};
        if(matched.length>1)return {...common,destination,status:'anchor',detail:'같은 제목이 여러 개입니다. 상위 제목을 포함해 확인하세요.'};
      }
    }
    return {...common,destination,status:'ok',detail:''};
  }
  const links=[]; for(const n of notes){if(skip(n.path))continue;for(const ref of n.refs){const r=resolve(n.path,ref);if(r)links.push(r);} if(n.warning)diagnostics.push({path:n.path,detail:n.warning});}
  const edgeSet=new Set(),edges=[];
  for(const l of links) if(l.destination&&noteMap.has(l.destination)&&l.source!==l.destination){const k=l.source+'\0'+l.destination;if(!edgeSet.has(k)){edgeSet.add(k);edges.push({source:l.source,target:l.destination});}}
  const indegree=new Map(),outdegree=new Map();for(const e of edges){indegree.set(e.target,(indegree.get(e.target)||0)+1);outdegree.set(e.source,(outdegree.get(e.source)||0)+1);}
  const duplicates=[]; const nameGroups=new Map(),bodyGroups=new Map();
  for(const n of notes){if(skip(n.path))continue; for(const id of [n.name,...n.aliases])pushMap(nameGroups,key(id).replace(/[\s_-]/g,''),n.path); if(n.fingerprint.length>=80)pushMap(bodyGroups,n.fingerprint,n.path);}
  const seen=new Set(); for(const [label,groups] of [['이름·별칭',nameGroups],['본문 동일',bodyGroups]])for(const [id,paths] of groups) if(paths.length>1){const k=label+paths.slice().sort().join('\0');if(!seen.has(k)){seen.add(k);duplicates.push({type:label,label:label==='본문 동일'?'공백·첫 제목 제외 본문 동일':id,paths});}}
  const nodes=notes.filter(n=>!skip(n.path)).map(n=>({id:n.path,name:n.name,aliases:n.aliases,incoming:indegree.get(n.path)||0,outgoing:outdegree.get(n.path)||0}));
  return {version:1,createdAt:new Date().toISOString(),scope:options.complete?'folder':'selection',notes:nodes,edges:edges.filter(e=>!skip(e.source)&&!skip(e.target)),links,issues:links.filter(l=>l.status!=='ok'),duplicates,isolated:nodes.filter(n=>!n.incoming&&!n.outgoing).map(n=>n.id),diagnostics,
    summary:{notes:nodes.length,files:all.size,links:links.length,edges:edges.length,issues:links.filter(l=>l.status!=='ok').length,duplicates:duplicates.length,isolated:nodes.filter(n=>!n.incoming&&!n.outgoing).length}};
}
export function shortestPath(edges,start,end){
  if(start===end)return [start];const adj=new Map();for(const e of edges){pushMap(adj,e.source,e.target);pushMap(adj,e.target,e.source);}
  const queue=[start],parent=new Map([[start,null]]);for(let i=0;i<queue.length;i++){for(const to of adj.get(queue[i])||[]){if(parent.has(to))continue;parent.set(to,queue[i]);if(to===end){const path=[to];while(parent.get(path[0])!==null)path.unshift(parent.get(path[0]));return path;}queue.push(to);}}return [];
}
