/** Binary inspection only. This module never executes, modifies or extracts input. */
const CRC_TABLE = Uint32Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
export function crc32(bytes){let crc=0xffffffff;for(const b of bytes)crc=CRC_TABLE[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
export const hex = (n,width=8) => '0x'+Number(n).toString(16).toUpperCase().padStart(width,'0');
export function entropy(bytes){if(!bytes.length)return null;const counts=new Uint32Array(256);for(const b of bytes)counts[b]++;let h=0;for(const n of counts)if(n){const p=n/bytes.length;h-=p*Math.log2(p);}return h;}
function uimage(bytes,offset){
  const remaining=bytes.length-offset;if(remaining<64)return {offset,type:'uImage',status:'truncated',detail:'64바이트 헤더보다 짧음'};
  const view=new DataView(bytes.buffer,bytes.byteOffset+offset,64); const size=view.getUint32(12,false);const expectedHeader=view.getUint32(4,false),expectedData=view.getUint32(24,false);
  const header=bytes.slice(offset,offset+64);header.fill(0,4,8);const actualHeader=crc32(header);const enough=size<=remaining-64;
  const actualData=enough?crc32(bytes.subarray(offset+64,offset+64+size)):null;
  const comp=['없음','gzip','bzip2','LZMA','LZO','LZ4','Zstd'][bytes[offset+31]]||`알 수 없음 (${bytes[offset+31]})`;
  const rawName=bytes.subarray(offset+32,offset+64);const zero=rawName.indexOf(0);const name=new TextDecoder().decode(zero<0?rawName:rawName.subarray(0,zero));
  return {offset,type:'uImage',status:!enough?'truncated':actualHeader===expectedHeader&&actualData===expectedData?'checksum-ok':'checksum-mismatch',
    detail:!enough?'선언한 데이터 길이보다 파일이 짧음':actualHeader===expectedHeader&&actualData===expectedData?'헤더·데이터 CRC32 일치':'헤더 또는 데이터 CRC32 불일치',
    fields:{name,payloadSize:size,payloadOffset:offset+64,endOffset:offset+64+size,timestamp:view.getUint32(8,false),load:hex(view.getUint32(16,false)),entry:hex(view.getUint32(20,false)),os:bytes[offset+28],arch:bytes[offset+29],imageType:bytes[offset+30],compression:comp,expectedHeader:hex(expectedHeader),actualHeader:hex(actualHeader),expectedData:hex(expectedData),actualData:actualData===null?'검증 불가':hex(actualData)}};
}
function squashfs(bytes,offset){
  if(bytes.length-offset<96)return {offset,type:'SquashFS',status:'truncated',detail:'96바이트 슈퍼블록보다 짧음'};
  const v=new DataView(bytes.buffer,bytes.byteOffset+offset,96); const major=v.getUint16(28,true),minor=v.getUint16(30,true),block=v.getUint32(12,true),log=v.getUint16(22,true),used=v.getBigUint64(40,true),comp=v.getUint16(20,true);
  const version=major===4&&minor===0,validBlock=block>=4096&&block<=1048576&&2**log===block;
  const fits=used>=96n&&used<=BigInt(bytes.length-offset),validComp=comp>=1&&comp<=6;
  const status=!version?'unsupported':!fits?'invalid-size':!validBlock||!validComp?'invalid-fields':'header-plausible';
  return {offset,type:'SquashFS',status,detail:status==='header-plausible'?'v4.0 슈퍼블록 필드·크기 확인':!version?'v4.0 이외 형식은 상세 검사하지 않음':!fits?'bytes_used가 파일 범위를 벗어남':'블록 크기 또는 압축 ID 확인 필요',fields:{version:`${major}.${minor}`,inodes:v.getUint32(4,true),blockSize:block,blockLog:log,bytesUsed:used.toString(),compression:['','zlib','LZMA','LZO','XZ','LZ4','Zstd'][comp]||`알 수 없음 (${comp})`,timestamp:v.getUint32(8,true)}};
}
export function inspectFirmware(bytes,options={}){
  const findings=[];let totalMatches=0;const maxMatches=options.maxMatches??300;
  for(let i=0;i<bytes.length;i++){
    let type='';const b=bytes[i];
    if(b===0x27&&bytes[i+1]===0x05&&bytes[i+2]===0x19&&bytes[i+3]===0x56)type='uImage';
    else if(b===0x68&&bytes[i+1]===0x73&&bytes[i+2]===0x71&&bytes[i+3]===0x73)type='SquashFS';
    else if(b===0x7f&&bytes[i+1]===0x45&&bytes[i+2]===0x4c&&bytes[i+3]===0x46)type='ELF';
    else if(b===0x1f&&bytes[i+1]===0x8b&&bytes[i+2]===8)type='gzip';
    if(!type)continue;totalMatches++;if(findings.length>=maxMatches)continue;
    findings.push(type==='uImage'?uimage(bytes,i):type==='SquashFS'?squashfs(bytes,i):{offset:i,type,status:'signature',detail:'시그니처 후보. 내부 구조는 검사하지 않음'});
  }
  const windowSize=Math.max(4096,Math.ceil(bytes.length/256));const windows=[];
  for(let i=0;i<bytes.length;i+=windowSize)windows.push({offset:i,size:Math.min(windowSize,bytes.length-i),entropy:entropy(bytes.subarray(i,i+windowSize))});
  return {version:1,size:bytes.length,entropy:entropy(bytes),windowSize,windows,findings,totalMatches,truncatedFindings:totalMatches>maxMatches};
}
export function compareBytes(a,b,maxRanges=2000){
  const total=Math.max(a.length,b.length),common=Math.min(a.length,b.length);let changed=0,start=-1,totalRanges=0;const ranges=[];const buckets=[];
  const bucketSize=Math.max(1,Math.ceil(total/128));for(let i=0;i<Math.ceil(total/bucketSize);i++)buckets.push({offset:i*bucketSize,size:Math.min(bucketSize,total-i*bucketSize),changed:0});
  for(let i=0;i<total;i++){
    const different=i>=common||a[i]!==b[i];if(different){changed++;buckets[Math.floor(i/bucketSize)].changed++;if(start<0)start=i;}
    if(start>=0&&(!different||i===total-1)){const end=different&&i===total-1?i+1:i;totalRanges++;if(ranges.length<maxRanges)ranges.push({start,end,length:end-start,kind:start>=common?(a.length>b.length?'A에만 존재':'B에만 존재'):'같은 위치의 바이트 차이'});start=-1;}
  }
  return {sizeA:a.length,sizeB:b.length,comparedLength:total,changed,unchanged:common-(changed-Math.abs(a.length-b.length)),ranges,totalRanges,truncatedRanges:totalRanges>maxRanges,buckets,identical:changed===0};
}
export function hexRows(bytes,start=0,length=256){
  start=Math.max(0,Math.floor(start/16)*16);const rows=[];for(let p=start;p<Math.min(bytes.length,start+length);p+=16){const data=bytes.subarray(p,p+16);rows.push({offset:hex(p),hex:[...data].map(x=>x.toString(16).padStart(2,'0').toUpperCase()).join(' '),ascii:[...data].map(x=>x>=32&&x<=126?String.fromCharCode(x):'.').join('')});}return rows;
}
export function demoFirmware(){
  const bytes=new Uint8Array(65536);for(let i=64;i<8192;i++)bytes[i]=i%256;
  const v=new DataView(bytes.buffer);v.setUint32(0,0x27051956);v.setUint32(8,1794499200);v.setUint32(12,8128);v.setUint32(16,0x80010000);v.setUint32(20,0x80010000);v.setUint32(24,crc32(bytes.subarray(64,8192)));bytes[28]=5;bytes[29]=5;bytes[30]=2;bytes[31]=0;bytes.set(new TextEncoder().encode('MIEL SYNTHETIC DEMO'),32);v.setUint32(4,crc32(bytes.subarray(0,64)));
  const o=16384;v.setUint32(o,0x73717368,true);v.setUint32(o+4,12,true);v.setUint32(o+12,131072,true);v.setUint16(o+20,4,true);v.setUint16(o+22,17,true);v.setUint16(o+28,4,true);v.setBigUint64(o+40,4096n,true);
  return bytes;
}
