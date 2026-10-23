const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const elementos = new Map();
function elemento(id) {
  if (!elementos.has(id)) elementos.set(id, { textContent: '', value: '', hidden: false, disabled: false, className: '', setAttribute() {}, removeAttribute() {}, focus() {}, addEventListener() {} });
  return elementos.get(id);
}
let chamadas = 0;
let resposta;
const contexto = vm.createContext({document:{ getElementById: elemento }, AbortSignal, fetch:async () => { chamadas++; if (resposta instanceof Error) throw resposta; return resposta; }});
vm.runInContext(readFileSync('script.js', 'utf8'), contexto);
async function buscar(cep){contexto.entradaTeste=cep;await vm.runInContext('buscarCEP(entradaTeste)',contexto);assert.equal(elemento('buscar').disabled,false);}
(async()=>{
 resposta={ok:true,json:async()=>({cep:'01001-000',logradouro:'Praça da Sé',bairro:'Sé',localidade:'São Paulo',uf:'SP',ddd:'11'})};
 await buscar('01001-000'); assert.equal(elemento('rua').textContent,'Praça da Sé');assert.equal(elemento('resultado').hidden,false);console.log('PASS: CEP válido e atualização do DOM');
 const antes=chamadas;await buscar('123');assert.equal(chamadas,antes);assert.match(elemento('mensagem').textContent,/8 números/);assert.equal(elemento('resultado').hidden,true);console.log('PASS: formato inválido, sem requisição e sem resultado anterior');
 resposta={ok:true,json:async()=>({erro:true})};await buscar('99999999');assert.match(elemento('mensagem').textContent,/não encontrado/);console.log('PASS: CEP inexistente');
 resposta=new Error('Offline');await buscar('01001000');assert.match(elemento('mensagem').textContent,/conexão/);console.log('PASS: falha de rede e recuperação do botão');
 resposta={ok:false};await buscar('01001000');assert.match(elemento('mensagem').textContent,/Não foi possível/);console.log('PASS: falha HTTP');
})().catch(erro=>{console.error(erro);process.exitCode=1;});
