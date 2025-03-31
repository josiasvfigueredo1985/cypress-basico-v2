const { defineConfig } = require('cypress');
const dotenv = require('dotenv');


dotenv.config(); // Load dotenv variables

module.exports = defineConfig({
    e2e: {
        env: {
            crypto_password: process.env.CYPRESS_CRYPTO_PASSWORD,
            current_env: process.env.CUR_ENV,
            directoryPath: "./cypress/fixtures/",
            localFolder: "not_encrypted"
        }
    }
});
