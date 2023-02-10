# Cypress Básico V2
Curso básico de Cypress
___
## Pré-requisitos
[Cypress](https://www.cypress.io/) (Versão utilizada neste projeto: `9.5.1`)

[Node.js](https://nodejs.org/en/) (Versão utilizada neste projeto: `v16.19.0`)

[NPM](https://www.npmjs.com/) (Versão utilizada neste projeto: `8.15.1`)

[Git](https://git-scm.com/) (Versão utilizada neste projeto: `2.39.1.windows.1`)

[VS Code](https://code.visualstudio.com/) (Versão utilizada neste projeto: `1.75`)


> **Obs.:** Ao instalar o Node.js, o npm é automaticamente instalado.
___
## Instalação
1- Fazer o fork do [projeto](https://github.com/wlsf82/cypress-basico-v2)

2- Instalar o Node.js, em seguida verificar a instalação(Nodejs e NPM) com os comandos `node -v` e `npm -v`

3- Instalar o VS Code (Ou uma IDE de sua preferência que execute js)

4- Navegar até a pasta raíz do projeto e executar o seguinte comando para instalar o Cypress: `npm install cypress@9.5.1 --save-dev` (ou `npm i cypress@9.5.1 -D` para a versão curta)

5- Em seguida execute o comando `npx cypress open` para abrir o Cypress pela primeira vez

6- Com o Test Runner aberto, delete os exemplos criados automaticamente, crie um arquivo chamado CAC-TAT.spec.js 
e feche o Test Runner.

> **Obs.:**: Quando inicializado pela primeira vez, o Cypress automaticamente cria o arquivo cypress.json e o diretório cypress/, com os sub-diretórios fixtures/, integration/, plugins/ e support/, com seus respetivos arquivos (com exceção dos exemplos, que acabamos de deletar).
___
## Testes
Este projeto utiliza o [Cypress.io](https://cypress.io) para os testes _end-to-end_, onde você pode executá-los tanto em modo interativo, como em modo _headless_.

Além disso, durante a integração e deploy contínuo, as execuções dos testes são gravadas no serviço [_Cypress Cloud_](https://cloud.cypress.io/projects/dyjimv/runs).

### Modo _headless_

Execute `npm test` (ou `npm t`, para a versão curta) para rodar todos os testes em modo _headless_.

### Modo interativo

Execute `npm run cy:open` para abrir a _Cypress App_ e executar os testes em modo interativo.
___
## Configuraçãon de scripts de execução NPM
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
___
## Configuração do arquivo package.json
A configuração abaixo é exibida na lista do NPM SCRIPTS para execução direta, pois é basicamente o disparo da linha de comando configurada no package.json

"scripts": {

    "cy:open": "cypress open", -> Abre e executa os testes nas configurações padrão

    "cy:open:mobile": "cypress open --config viewportWidth=410 viewportHeight=860", -> abre e executa os testes sobrescrevendo as configurações padrão

    "test": "cypress run",-> somente executa o teste nas configurações padrão, porém em modo headless

    "test:mobile": "cypress run --config viewportWidth=410 viewportHeight=860" -> executa o teste em modo headless com configurações personalizadas
    
  }
___
## Dicas de extensões para o VS Code
1- Para adicionar ou retirar o método "only" de cada teste, é recomendada a extensão Cypress Helper

2- Para facilitar na escrita dos códigos, é recomendada a extensão Cypress Snippets

3- Para melhor funcionamento das integrações entre o código e a escrita, é recomendada a extensão Intellicode
___