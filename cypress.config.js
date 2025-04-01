const { defineConfig } = require('cypress');

if (!process.env.CI) {
    require('dotenv').config();
}

module.exports = defineConfig({
    e2e: {
        env: {
            SECRET_KEY: process.env.SECRET_KEY,
            ENVIRONMENT: process.env.ENVIRONMENT,
        },
        setupNodeEvents(on, config) {
            require('./cypress/plugins/index')(on, config);
        },
    }
});
