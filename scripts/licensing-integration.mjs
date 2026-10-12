import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {generateKeyPairSync} from 'node:crypto';
if(process.env.DATABASE_URL||process.env.DODO_PAYMENTS_API_KEY)throw new Error('Run this check only without real provider/database credentials.');
process.env.DODO_PAYMENTS_API_KEY='fixture-not-a-real-key';process.env.DODO_PRODUCT_ID='pdt_fixture';process.env.DODO_PAYMENTS_ENV='test_mode';
process.env.LICENSE_SIGNING_PRIVATE_KEY=generateKeyPairSync('rsa',{modulusLength:2048}).privateKey.export({format:'pem',type:'pkcs8'}).toString();
const realFetch=globalThis.fetch;let activations=0;
const payments=new Map([['pay_fixture',{payment_id:'pay_fixture',status:'succeeded',product_cart:[{product_id:'pdt_fixture'}],metadata:{}}],['pay_other',{payment_id:'pay_other',status:'succeeded',product_cart:[{product_id:'pdt_other'}]}]]);
const licenses=new Map([['lic_fixture',{id:'lic_fixture',key:'fixture-key',payment_id:'pay_fixture',product_id:'pdt_fixture',source:'auto',status:'active',activations_limit:1}],['lic_other',{id:'lic_other',key:'foreign-key',payment_id:'pay_other',product_id:'pdt_other',source:'auto',status:'active'}]]);
globalThis.fetch=async(input,init)=>{
 const url=String(input);if(!url.startsWith('https://test.dodopayments.com/'))return realFetch(input,init);
 const path=new URL(url).pathname;const body=init?.body?JSON.parse(init.body):{};
 if(path.startsWith('/payments/'))return Response.json(payments.get(path.split('/').at(-1))??{}, {status:payments.has(path.split('/').at(-1))?200:404});
 if(path.startsWith('/license_keys/'))return Response.json(licenses.get(path.split('/').at(-1))??{}, {status:licenses.has(path.split('/').at(-1))?200:404});
 if(path==='/licenses/activate'){activations++;return Response.json({id:'lki_fixture',product:{product_id:'pdt_fixture'}});}
 if(path==='/licenses/validate')return Response.json({valid:body.license_key==='fixture-key'});
 if(path==='/licenses/deactivate')return new Response(null,{status:204});
 throw new Error('Unexpected provider request: '+path);
};
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const dodo=await server.ssrLoadModule('/src/lib/dodo.ts'),license=await server.ssrLoadModule('/src/lib/license.ts');
 await assert.rejects(()=>dodo.importProviderLicense('lic_other'));
 await dodo.handleDodoEvent({type:'payment.succeeded',data:{payment_id:'pay_fixture'}},'evt-paid');
 await dodo.handleDodoEvent({type:'license_key.created',data:{id:'lic_fixture'}},'evt-key');
 await dodo.handleDodoEvent({type:'license_key.created',data:{id:'lic_fixture'}},'evt-key');
 assert.equal((await license.activateDevice({licenseKey:'unknown-key',instanceId:'a'.repeat(64)})).ok,false);
 assert.equal((await license.activateDevice({licenseKey:'fixture-key',instanceId:'a'.repeat(64)})).ok,true);
 assert.equal((await license.activateDevice({licenseKey:'fixture-key',instanceId:'a'.repeat(64)})).ok,true);assert.equal(activations,1);
 assert.equal((await license.validateDevice({licenseKey:'fixture-key',instanceId:'b'.repeat(64)})).valid,false);
 await license.deactivateDevice({licenseKey:'fixture-key',instanceId:'a'.repeat(64)});
 assert.equal((await license.validateDevice({licenseKey:'fixture-key',instanceId:'a'.repeat(64)})).valid,false);
 await dodo.handleDodoEvent({type:'refund.succeeded',data:{payment_id:'pay_fixture'}},'evt-refund');
 await dodo.handleDodoEvent({type:'license_key.created',data:{id:'lic_fixture'}},'evt-key-late');
 assert.equal((await license.activateDevice({licenseKey:'fixture-key',instanceId:'a'.repeat(64)})).ok,false);
 const handler=await server.ssrLoadModule('/src/lib/license-handler.ts');
 assert.equal((await handler.licenseHandler('activate')({request:new Request('https://example.test',{method:'POST',body:'{}'})})).status,400);
 console.log('PASS: mock provider and local DB — wrong product/unpaid keys rejected, duplicate events safe, repeat activation reuses instance, wrong device and refunded licenses blocked. No real purchase.');
}finally{globalThis.fetch=realFetch;await server.close();}
process.exit(0);
