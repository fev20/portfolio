import {auditVault} from './lib/vault.js';
import {inspectFirmware,compareBytes} from './lib/firmware.js';
self.onmessage=async({data})=>{try{let result;
  if(data.type==='audit')result=auditVault(data.files,data.options);
  else if(data.type==='firmware'){const bytes=new Uint8Array(data.buffer);result=inspectFirmware(bytes);const hash=await crypto.subtle.digest('SHA-256',bytes);result.sha256=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');}
  else if(data.type==='compare')result=compareBytes(new Uint8Array(data.a),new Uint8Array(data.b));
  else throw new Error('지원하지 않는 작업입니다.');
  self.postMessage({result});
}catch(error){self.postMessage({error:error.message});}};
