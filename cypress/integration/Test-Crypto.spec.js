
describe.only('Test Crypt file', () => {
    let str = null
    before(() => {
        cy.task('readEncryptedData').then((jsonString) => {
            str = jsonString
        });
    });

    it.only('should read encrypted fixture', () => {
        expect(str).to.include('hello@cypress.io');
    });

});

