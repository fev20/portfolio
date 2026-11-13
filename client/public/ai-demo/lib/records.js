export const fields=['id','title','category','status','period','role','work','result','tech','evidence','evidenceStatus','next','notes','updatedAt'];
export const statuses=['계획','진행 중','완료','보류','확인 필요'];
export const evidenceStatuses=['대화 기록','자료 기재','원본 증빙 연결','본인 확인 완료'];
export function safeURL(url){try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}}
export function validateRecords(records){
  if(!Array.isArray(records))throw new Error('기록 목록을 읽지 못했습니다.');
  const ids=new Set();return records.map((raw,i)=>{
    if(!raw||typeof raw!=='object')throw new Error(`${i+1}번째 기록 형식 오류`);const record={};
    for(const field of fields){if(raw[field]!=null&&typeof raw[field]!=='string')throw new Error(`${i+1}번째 ${field}는 텍스트여야 합니다.`);record[field]=raw[field]||'';if(record[field].length>50000)throw new Error('필드가 너무 깁니다.');}
    if(!record.id||!record.title.trim())throw new Error('기록 ID와 제목은 비워둘 수 없습니다.');if(ids.has(record.id))throw new Error('목록에 중복된 기록 ID가 있습니다.');ids.add(record.id);
    if(!statuses.includes(record.status)||!evidenceStatuses.includes(record.evidenceStatus))throw new Error('지원하지 않는 상태값이 있습니다.');
    if(raw.sources!=null&&!Array.isArray(raw.sources))throw new Error('출처 목록 형식 오류');
    record.sources=(raw.sources||[]).slice(0,100).map(s=>{if(typeof s?.name!=='string'||typeof s?.url!=='string'||!safeURL(s.url))throw new Error('출처 이름과 HTTP(S) 주소를 확인하세요.');return{name:s.name.slice(0,1000),url:safeURL(s.url)};});return record;
  });
}
export function mergeRecords(current,incoming){const map=new Map(current.map(r=>[r.id,r]));for(const r of incoming)map.set(r.id,r);return [...map.values()];}
