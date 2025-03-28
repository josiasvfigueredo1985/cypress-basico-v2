
describe.only('Test Crypt file', () => {
    let obj = null
    before(() => {
        cy.task('readEncryptedData').then((jsonString) => {
            obj = jsonString
        });
    });

    it.only('should read encrypted fixture', () => {
        expect(obj.email).to.eq('hello@cypress.io');
    });

});

