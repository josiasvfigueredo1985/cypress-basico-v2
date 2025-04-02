// cypress/integration/encryption_spec.js
describe('Teste de Criptografia e Descriptografia de Arquivos', () => {

    it('Deve descriptografar um arquivo específico em CI e validar conteúdo', () => {
        const fileName = 'test_encrypted'; // Nome do arquivo sem a extensão .txt

        cy.task('processFile', { fileName }) // Chama para descriptografar
            .then((jsonData) => {
                expect(jsonData).to.exist; // Verifica se os dados existem
                expect(jsonData).to.have.property('email', 'hello@cypress.io'); // Valida se um campo é igual ao esperado
                cy.log(JSON.stringify(jsonData)); // Exibir os dados JSON
            });
    });

    it('Deve descriptografar um arquivo específico em CI e validar JSON', () => {
        const fileName = 'user_test'; // Nome do arquivo sem a extensão .txt

        cy.task('processFile', { fileName }) // Chama para descriptografar
            .then((jsonData) => {
                expect(jsonData).to.exist; // Verifica se os dados existem
                expect(jsonData).to.have.property('name', 'John Doe'); // Valida se um campo é igual ao esperado
                expect(jsonData).to.have.property('age', 35); // Valida se  um campo é igual ao esperado
                cy.log(JSON.stringify(jsonData)); // Exibir os dados JSON
            });
    });

    it('Deve descriptografar um arquivo específico em CI e validar JSON 2', () => {
        const fileName = 'user_test'; // Nome do arquivo sem a extensão .txt

        cy.task('processFile', { fileName, encrypt: false }) // Não cryptografa, somente faz a leitira pelo nome do arquivo
            .then((jsonData) => {
                expect(jsonData).to.exist; // Verifica se os dados existem
                expect(jsonData).to.have.property('name', 'John Doe'); // Valida se um campo é igual ao esperado
                expect(jsonData).to.have.property('age', 35); // Valida se um campo é igual ao esperado
                cy.log(JSON.stringify(jsonData)); // Exibir os dados JSON
            });
    });
});