// CAC-TAT.spec.js created with Cypress
///<reference types="Cypress" />

// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Central de Atendimento ao Cliente TAT', function () {
    //beforeEach(() => cy.visit('./src/index.html'))
    //Another semantic
    beforeEach(function () {
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })
    it('preenche os campos obrigatórios e envia o formulário', () => {
        const longText = 'Este é um teste executado utilizando Cypress! Este texto é apenas uma amostra de digitação da ferramenta de automação Cypress'
        cy.get('#firstName').should('be.visible').type('Josias', { delay: 0 })
        cy.get('#lastName').should('be.visible').type('Valentim', { delay: 0 })
        cy.get('#email').should('be.visible').type('josiasvalentim@gmail.com', { delay: 0 })
        cy.get('#open-text-area').should('be.visible').type(longText, { delay: 0 })
        cy.contains('button[type="submit"]', 'Enviar').should('be.visible').click()
        cy.get('.success').should('be.visible')
    })
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').should('be.visible').type('Josias', { delay: 0 })
        cy.get('#lastName').should('be.visible').type('Valentim', { delay: 0 })
        cy.get('#email').should('be.visible').type('josiasvalentimgmail.com', { delay: 0 })
        cy.get('#phone').should('be.visible').type('31983853232', { delay: 0 })
        cy.get('#open-text-area').should('be.visible').type('Este é um teste executado utilizando Cypress!', { delay: 0 })
        cy.contains('.button', 'Enviar').should('be.visible').click()
        cy.get('.error').should('be.visible')
    });
    it('digita alfanumérico no campo de telefone', () => {
        cy.get('#phone').should('be.visible').type('teste01telefone', { delay: 0 }).should('be.empty')
    });
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').should('be.visible').type('Josias', { delay: 0 })
        cy.get('#lastName').should('be.visible').type('Valentim', { delay: 0 })
        cy.get('#email').should('be.visible').type('josiasvalentimgmail.com', { delay: 0 })
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').should('be.visible').type('Este é um teste executado utilizando Cypress!', { delay: 0 })
        cy.contains('.button', 'Enviar').should('be.visible').click()
        cy.get('.error').should('be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Josias', { delay: 0 }).should('have.value', 'Josias')
            .clear().should('have.value', '')
        cy.get('#lastName').type('Valentim', { delay: 0 }).should('have.value', 'Valentim')
            .clear().should('have.value', '')
        cy.get('#email').type('josiasvalentim@gmail.com', { delay: 0 }).should('have.value', 'josiasvalentim@gmail.com')
            .clear().should('have.value', '')
        cy.get('#phone').type('31983853232', { delay: 0 }).should('have.value', '31983853232')
            .clear().should('have.value', '')
        cy.get('#open-text-area').type('Teste', { delay: 0 }).should('have.value', 'Teste')
            .clear().should('have.value', '')
    });
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        //cy.get('button[type="submit"]').should('be.visible').click()
        cy.contains('.button', 'Enviar').should('be.visible').click()
        cy.get('.error').should('be.visible')
    });
    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
        cy.fillMandatoryFieldsAndSubmit2('Josias', 'Valentim', 'josiasteste@gmail.com', 'teste', 'Enviar')
        cy.get('.success').should('be.visible')
    });
    it('envia o formuário com sucesso usando um comando customizado com parametros', () => {
        cy.fillMandatoryFieldsAndSubmit2('Josias', 'Valentim', 'josiasteste@gmail.com', 'teste', 'Enviar')
        cy.get('.success').should('be.visible')
    });
    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('select').select('YouTube').should('have.value', 'youtube')
    });
    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    });
    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    });
    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[value="feedback"]').check().should('have.value', 'feedback')
        cy.get('input[type="radio"][value="feedback"]').check().should('be.checked')
    });
    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {//usng $ means that all the elements of radio type will be selected
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    });
    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]').check().should('be.checked')//check all the checkbox with the defined type
        cy.get('input[type="checkbox"]').last().uncheck().should('not.be.checked')
    });
    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json')
            .then(input => {
                //Verify the input file name
                //Must use console.log to verify the input info with the inspector mode
                console.log(input[0].files[0])
                expect(input[0].files[0].name).to.equal('example.json')
                expect(input[0].files[0].size).to.equal(155)
                expect(input[0].files[0].type).to.equal('application/json')
            })
    });
    it('seleciona um arquivo simulando um drag-and-drop - Then', () => {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .then(input => {//using then to validation
                expect(input[0].files[0].name).to.equal('example.json')
            })
    });

    it('seleciona um arquivo simulando um drag-and-drop - Should', () => {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(($input) => {//using should to validation
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json', { encoding: null }).as('example')
        cy.get('#file-upload')
            .selectFile('@example')//@ means that is an alias file name
            .then(input => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    });
    it('selecione múltiplos arquivos para upload - Then', () => {
        cy.get('input[type="file"]')
            .selectFile([
                'cypress/fixtures/example.json',
                'cypress/fixtures/example.txt'
            ])
            .then(input => {
                console.log(input)
                expect(input[0].files[0].name).to.eql('example.json')
                expect(input[0].files[1].name).to.eql('example.txt')
            })
    });

    it('selecione múltiplos arquivos para upload - Should', () => {
        cy.get('input[type="file"]')
            .selectFile([
                'cypress/fixtures/example.json',
                'cypress/fixtures/example.txt'
            ])
            .should(function (input) {
                console.log(input)
                expect(input[0].files[0].name).to.eql('example.json')
                expect(input[0].files[1].name).to.eql('example.txt')
            })
    });
    // This is´nt working anymore, waiting for the response from Walmyr
    it('selecione múltiplos arquivos para upload simulando drag and drop', () => {
        cy.get('input[type="file"]')
            .selectFile([
                'cypress/fixtures/example.json',
                'cypress/fixtures/example.txt'
            ], { action: 'drag-drop' })
            .then(input => {
                console.log(input)
                expect(input[0].files[0].name).to.eql('example.json')
                expect(input[0].files[1].name).to.eql('example.txt')
            })
    });
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    });
    it.only('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('a[href="privacy.html"]')
            .invoke('removeAttr', 'target').
            click()
            .title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
        cy.contains('Talking About Testing')
            .should('be.visible')
    });

}) 