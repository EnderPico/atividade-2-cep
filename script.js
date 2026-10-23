const formulario = document.getElementById('formulario');
const campoCEP = document.getElementById('cep');
const mensagem = document.getElementById('mensagem');
const botao = document.getElementById('buscar');
const painel = document.getElementById('painel');

// O submit chama esta função sem recarregar a página.
async function buscarCEP(entrada) {
  const cep = entrada.trim().replace('-', '');
  document.getElementById('resultado').hidden = true;
  document.getElementById('vazio').hidden = false;
  mensagem.className = '';
  campoCEP.removeAttribute('aria-invalid');
  if (!/^\d{8}$/.test(cep)) {
    mensagem.textContent = 'Digite um CEP válido com 8 números. Exemplo: 01001-000.';
    mensagem.className = 'error';
    campoCEP.setAttribute('aria-invalid', 'true');
    campoCEP.focus();
    return;
  }
  botao.disabled = true;
  campoCEP.disabled = true;
  document.getElementById('exemplo').disabled = true;
  painel.setAttribute('aria-busy', 'true');
  mensagem.textContent = 'Buscando seu endereço…';
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(10000)
    });
    if (!resposta.ok) throw new Error('Falha na consulta');
    const dados = await resposta.json();
    if (dados.erro) {
      mensagem.textContent = 'CEP não encontrado. Confira os números e tente novamente.';
      mensagem.className = 'error';
      return;
    }
    if (!dados.cep || !dados.localidade || !dados.uf) throw new Error('Resposta incompleta');
    // textContent insere os dados JSON no DOM com segurança.
    document.getElementById('cep-resultado').textContent = dados.cep;
    document.getElementById('rua').textContent = dados.logradouro || 'Endereço da localidade';
    document.getElementById('bairro').textContent = dados.bairro || 'Não informado';
    document.getElementById('cidade').textContent = dados.localidade;
    document.getElementById('estado').textContent = dados.estado ? `${dados.estado} (${dados.uf})` : dados.uf;
    document.getElementById('ddd').textContent = dados.ddd || 'Não informado';
    document.getElementById('vazio').hidden = true;
    document.getElementById('resultado').hidden = false;
    mensagem.textContent = 'Endereço encontrado!';
  } catch (erro) {
    mensagem.textContent = 'Não foi possível consultar o CEP agora. Verifique sua conexão e tente novamente.';
    mensagem.className = 'error';
  } finally {
    botao.disabled = false;
    campoCEP.disabled = false;
    document.getElementById('exemplo').disabled = false;
    painel.setAttribute('aria-busy', 'false');
  }
}
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  buscarCEP(campoCEP.value);
});
document.getElementById('exemplo').addEventListener('click', () => {
  campoCEP.value = '01001-000';
  buscarCEP(campoCEP.value);
});
