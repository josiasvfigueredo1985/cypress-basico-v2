import { CryptoHandler, processFiles } from "../support/crypt_handlers";


it('Test Crypt file', () => {
 // Example usage
const secretKey = '6368616e676531323334353637383930'; // Use a fixed 256-bit secret key (hex)
const cryptoHandler = new CryptoHandler(secretKey);
// Directory containing the JSON files
const directoryPath = './cypress/fixtures/'; // Replace with your directory path
// Process the files in the specified directory
processFiles(directoryPath, cryptoHandler).catch(err => console.error(err));

    cy.fixture('example').then((example) => {
        cy.wrap('hello@cypress.io').should('be.eq', example.email)
    })
}
)