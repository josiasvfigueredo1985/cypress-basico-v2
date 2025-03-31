// cypress/integration/encryption_spec.js
describe('Teste de Criptografia e Descriptografia de Arquivos', () => {

    it('Deve criptografar todos os arquivos na pasta ./cypress/not_encrypted em LOCAL', () => {
        cy.task('processFile', { fileName: '' }) // Chama para criptografar
            .then((result) => {
                cy.log(result); // Exibir mensagem de sucesso
            });
    });

    it('Deve descriptografar um arquivo específico em CI e validar conteúdo', () => {
        const fileName = 'test_encrypted'; // Nome do arquivo sem a extensão .txt

        cy.task('processFile', { fileName }) // Chama para descriptografar
            .then((jsonData) => {
                expect(jsonData).to.exist; // Verifica se os dados existem
                expect(jsonData).to.have.property('email', 'hello@cypress.io'); // Valida se um campo é igual ao esperado
                cy.log(JSON.stringify(jsonData)); // Exibir os dados JSON
            });
    });
});