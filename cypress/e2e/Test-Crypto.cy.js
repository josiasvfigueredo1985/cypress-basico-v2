
describe.only('Test Crypt file', () => {

    it.only('should read encrypted JSON fixture', async () => {

        cy.getDecryptedJsonData('test_encrypted').then(obj => {
            expect(obj.email).to.eq('hello@cypress.io');
            expect(obj.characters).to.includes('Jessie');
        });

    });
});

