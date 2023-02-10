// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
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