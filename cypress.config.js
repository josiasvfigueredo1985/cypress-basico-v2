require('dotenv').config(); // Carregar variáveis do .env
const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        env: {
            SECRET_KEY: process.env.SECRET_KEY || Cypress.env('SECRET_KEY'),
            ENVIRONMENT: process.env.ENVIRONMENT || Cypress.env('ENVIRONMENT'),
        },
        setupNodeEvents(on, config) {
            require('./cypress/plugins/index')(on, config);
        },
    }
});
