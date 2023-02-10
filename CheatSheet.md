Instalação e inicialização do Cypress 🌲
Na raiz do projeto, execute o comando npm install cypress@9.5.1 --save-dev (ou npm i cypress@9.5.1 -D para a versão curta)
Logo após, execute o comando npx cypress open para abrir o Cypress pela primeira vez
Por fim, com o Test Runner aberto, delete os exemplos criados automaticamente, crie um arquivo chamado CAC-TAT.spec.js e feche o Test Runner.
Obs. 2: Quando inicializado pela primeira vez, o Cypress automaticamente cria o arquivo cypress.json e o diretório cypress/, com os sub-diretórios fixtures/, integration/, plugins/ e support/, com seus respetivos arquivos (com exceção dos exemplos, que acabamos de deletar).

Configurações extra
Atualize o arquivo cypress.json conforme abaixo.
Essa config permite alterar a resolução da tela e simular dispositivos móveis
{
  "pluginsFile": false,
  "viewportHeight": 880,
  "viewportWidth": 1280
}
👨‍🏫 Com isso, estamos "dizendo ao Cypress" que:

Não vamos usar o arquivo de plugins (o qual é criado automaticamente e não precisaremos durante o curso)
Iremos sobrescrever a altura e largura do viewport padrão do Cypress
Delete o diretório cypress/plugins/, visto que este não será necessário durante o curso.
A configuração abaixo é exibida na lista do NPM SCRIPTS para execução direta, pois é basicamente o disparo da linha de comando configurada no json
"scripts": {
    "cy:open": "cypress open", -> Abre e executa os testes nas configurações padrão
    "cy:open:mobile": "cypress open --config viewportWidth=410 viewportHeight=860", -> abre e executa os testes sobrescrevendo as configurações padrão
    "test": "cypress run",-> somente executa o teste nas configurações padrão, porém em modo headless
    "test:mobile": "cypress run --config viewportWidth=410 viewportHeight=860" -> executa o teste em modo headless com configurações personalizadas
  },