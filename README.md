# Encontre seu endereço

Atividade 2 — Minha Página Consome uma API: Fetch, JSON e DOM.

Site em HTML, CSS e JavaScript que consulta endereços brasileiros pelo CEP.
Abra `index.html` em um navegador com acesso à internet. Não há dependências.

## Planejamento da funcionalidade

| O que decidir | Minha escolha | Trecho relacionado |
|---|---|---|
| Tema | Encontre seu endereço | título da página |
| API escolhida | ViaCEP | fetch(`https://viacep.com.br/ws/${cep}/json/`) |
| Dados buscados | CEP, rua, bairro, cidade, estado e DDD | await resposta.json() |
| Elementos atualizados | cep-resultado, rua, bairro, cidade, estado, ddd e mensagem | document.getElementById('rua').textContent = dados.logradouro |
| Mensagem em caso de falha | Não foi possível consultar o CEP agora. Verifique sua conexão e tente novamente. | catch (erro) |

A função async buscarCEP usa await fetch dentro de try/catch, verifica resposta.ok e dados.erro, transforma a resposta em JSON e atualiza o DOM. O submit usa preventDefault para evitar recarregamento. Uma nova busca limpa resultados anteriores; consultas ficam bloqueadas durante o carregamento e expiram após 10 segundos.

## Testar manualmente

1. Digite 01001-000 e busque: deve aparecer Praça da Sé, Sé, São Paulo, SP.
2. Digite 123: deve pedir 8 números sem enviar uma requisição.
3. Digite 99999-999: deve informar que o CEP não foi encontrado.
4. Desative a conexão e busque 01001-000: deve aparecer a mensagem de falha e o botão deve voltar a funcionar.

Os testes automatizados de cenários com respostas controladas podem ser executados com `node testes.cjs`. Não substituem um teste com a API real.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie index.html, style.css, script.js e os demais arquivos desta pasta.
2. Em Settings > Pages, selecione Deploy from a branch, branch main e pasta / (root).
3. Aguarde a publicação e copie a URL exibida pelo GitHub.
4. Entregue ao professor o link do repositório e o link do GitHub Pages.

Repositório: https://github.com/EnderPico/atividade-2-cep

Site: https://enderpico.github.io/atividade-2-cep/

Documentação da API: https://viacep.com.br/

## Verificação realizada

Em 23/10/2026, passaram 5 cenários automatizados: CEP válido, formato inválido, CEP inexistente, falha de rede e falha HTTP. Os testes executam a função real com DOM e respostas simulados. A consulta real por este ambiente falhou na resolução de DNS; a verificação visual no navegador e a consulta online ainda precisam ser realizadas.
