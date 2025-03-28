import { CryptoHandler } from '../support/crypt_handlers.js';

export default (on, config) => {
    on('task', {
        async readEncryptedData() {
            const password = 'admin123'
            const cryptoHandler = new CryptoHandler();
            const directoryPath = './cypress/fixtures/not_encrypted/example.json';
            const fileData = cryptoHandler.readJsonFile(directoryPath);
            console.log('Retorno texto plano:\n', fileData)
            //const encryptedData = await cryptoHandler.encryptString(fileData, password);
            const encryptedData = await cryptoHandler.readTextFile('./cypress/fixtures/example-encrypted.txt');
            console.log('Retorno encriptado:\n', encryptedData)
            // cryptoHandler.saveEncryptedData('./cypress/fixtures/example-encrypted.txt', encryptedData);
            const decrypted = cryptoHandler.decryptString(encryptedData, password)
            console.log('Retorno decriptado:\n', decrypted)
            const obj = JSON.parse(decrypted)
            console.log('Retorno json:\n', obj)
            return obj;
        }
    });
};
