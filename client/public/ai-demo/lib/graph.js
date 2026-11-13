const NS='http://www.w3.org/2000/svg';
function el(name,attrs={}){const n=document.createElementNS(NS,name);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;}
export function drawGraph(container,report,selected,onSelect,path=[],mode='local'){
  container.replaceChildren();const all=new Map(report.notes.map(n=>[n.id,n]));
  const neighbours=new Set([selected,...path]);for(const e of report.edges)if(e.source===selected||e.target===selected){neighbours.add(e.source);neighbours.add(e.target);}
  const ranked=[...report.notes].sort((a,b)=>(neighbours.has(b.id)-neighbours.has(a.id))||((b.incoming+b.outgoing)-(a.incoming+a.outgoing))||a.name.localeCompare(b.name,'ko'));
  const pool=mode==='all'?ranked:ranked.filter(n=>neighbours.has(n.id));
  const nodes=pool.slice(0,mode==='all'?90:40).map((n,i)=>({...n,x:360+230*Math.cos(i*2.399),y:240+170*Math.sin(i*2.399),vx:0,vy:0}));
  const map=new Map(nodes.map(n=>[n.id,n]));const edges=report.edges.filter(e=>map.has(e.source)&&map.has(e.target));
  const center=map.get(selected);if(center){center.x=360;center.y=240;}
  for(let step=0;step<100;step++){
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.max(30,Math.hypot(dx,dy)),f=900/(d*d);a.vx+=dx/d*f;b.vx-=dx/d*f;a.vy+=dy/d*f;b.vy-=dy/d*f;
    }
    for(const e of edges){const a=map.get(e.source),b=map.get(e.target),dx=b.x-a.x,dy=b.y-a.y,d=Math.max(1,Math.hypot(dx,dy)),f=(d-105)*.006;a.vx+=dx/d*f;b.vx-=dx/d*f;a.vy+=dy/d*f;b.vy-=dy/d*f;}
    for(const n of nodes){n.vx+=(360-n.x)*.001;n.vy+=(240-n.y)*.001;n.vx*=.72;n.vy*=.72;n.x=Math.max(55,Math.min(665,n.x+n.vx));n.y=Math.max(40,Math.min(440,n.y+n.vy));}
  }
  const svg=el('svg',{viewBox:'0 0 720 490',role:'group','aria-label':`노트 관계도. ${nodes.length}개 노트 표시. 같은 정보는 오른쪽 목록에서도 볼 수 있습니다.`});
  const pathEdges=new Set();for(let i=1;i<path.length;i++){pathEdges.add(path[i-1]+'\0'+path[i]);pathEdges.add(path[i]+'\0'+path[i-1]);}
  for(const e of edges){const a=map.get(e.source),b=map.get(e.target);const hi=pathEdges.has(e.source+'\0'+e.target);svg.append(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:hi?'#bd8b47':'#d8d2e6','stroke-width':hi?2.8:1,opacity:hi?1:.7}));}
  for(const n of nodes){const active=n.id===selected,inPath=path.includes(n.id),near=neighbours.has(n.id);const r=active?13:Math.min(10,5+Math.sqrt(n.incoming+n.outgoing));const g=el('g',{class:'node',role:'button',tabindex:'0','aria-label':n.name,transform:`translate(${n.x},${n.y})`});
    g.append(el('circle',{r:r+5,fill:active?'#e5def5':'transparent'}));g.append(el('circle',{r,fill:active?'#7660b4':inPath?'#c89d57':near?'#aaa0ce':'#c7c1da',stroke:'#fff','stroke-width':2}));
    const text=el('text',{x:r+6,y:4});text.textContent=n.name.length>20?n.name.slice(0,19)+'…':n.name;
    const labelled=nodes.length<=20||active||inPath||(near&&nodes.indexOf(n)<12);if(!labelled)text.setAttribute('visibility','hidden');
    g.append(text);const title=el('title');title.textContent=n.id;g.append(title);
    g.addEventListener('mouseenter',()=>text.setAttribute('visibility','visible'));g.addEventListener('mouseleave',()=>{if(!labelled)text.setAttribute('visibility','hidden');});
    g.addEventListener('focus',()=>text.setAttribute('visibility','visible'));g.addEventListener('blur',()=>{if(!labelled)text.setAttribute('visibility','hidden');});
    g.addEventListener('click',()=>onSelect(n.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(n.id);}});svg.append(g);
  }
  container.append(svg);const legend=document.createElement('div');legend.className='graph-legend';legend.textContent=`${nodes.length} / ${report.notes.length}개 노트 · ${mode==='local'?'선택 노트 주변':'전체 개요'} · 이름은 점에 마우스를 올려 확인`;container.append(legend);
}
