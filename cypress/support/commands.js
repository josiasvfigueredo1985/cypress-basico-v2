
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', project => {
    cy.get('#firstName').should('be.visible').type('Josias', { delay: 0 })
    cy.get('#lastName').should('be.visible').type('Valentim', { delay: 0 })
    cy.get('#email').should('be.visible').type('josiasvalentim@gmail.com', { delay: 0 })
    cy.get('#open-text-area').should('be.visible').type('Este é um teste executado utilizando Cypress!', { delay: 0 })
    cy.contains('.button', 'Enviar').should('be.visible').click()
})

Cypress.Commands.add('fillMandatoryFieldsAndSubmit2', (nome, lastname, email, hcwhyText, buttonName) => {
    cy.get('#firstName').should('be.visible').type(nome, { delay: 0 })
    cy.get('#lastName').should('be.visible').type(lastname, { delay: 0 })
    cy.get('#email').should('be.visible').type(email, { delay: 0 })
    cy.get('#open-text-area').should('be.visible').type(hcwhyText, { delay: 0 })
    cy.contains('.button', buttonName).should('be.visible').click()
})


Cypress.Commands.add('getDecryptedJsonData', (jsonName) => {
    const password = Cypress.env('password');
    const env = Cypress.env('current_env');
    const dirPath = Cypress.env('directoryPath');
    const localFolder = Cypress.env('localFolder');

    const CryptoUtils = new CryptoUtils();

    if (env === 'LOCAL') {
        return cy.wrap(null).then(() => {
            return CryptoUtils.encryptLocalFiles(dirPath, localFolder, password) // Criptografa arquivos locais
                .then(() => CryptoUtils.readTextFile(`${dirPath}${jsonName}.txt`))
                .then(encryptedData => CryptoUtils.decryptString(encryptedData, password))
                .then(decrypted => {
                    const obj = JSON.parse(decrypted);
                    return obj;
                })
                .catch(error => {
                    console.warn('Error while executing getDecryptedJsonData command:', error);
                    throw error;
                });
        });
    } else if (env === 'CI') {
        console.log('Running in CI environment. Skipping encryption, only decrypting data.');
        return cy.wrap(null).then(() => {
            return CryptoUtils.readTextFile(`${dirPath}${jsonName}.txt`)
                .then(encryptedData => CryptoUtils.decryptString(encryptedData, password))
                .then(decrypted => {
                    const obj = JSON.parse(decrypted);
                    return obj;
                })
                .catch(error => {
                    console.warn('Error while decrypting in CI environment:', error);
                    throw error;
                });
        });
    } else {
        console.warn(`Not local or CI environment: ${env}. Skipping file operations.`);
        return cy.wrap(null);
    }
});
