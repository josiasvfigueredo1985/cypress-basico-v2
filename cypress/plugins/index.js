const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

module.exports = (on, config) => {
    const notEncryptedFolder = './cypress/not_encrypted';
    const encryptedFolder = './cypress/encrypted';

    const readFile = (filePath) => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };

    const writeFile = (filePath, data) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    };

    const encryptData = (data, secretKey) => {
        return CryptoJS.AES.encrypt(data, secretKey).toString();
    };

    const decryptData = (encryptedData, secretKey) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedData || decryptedData === "") {
            throw new Error('Decryption failed. Check your SECRET_KEY!');
        }
        return JSON.parse(decryptedData);
    };

    const encryptFile = async (fileName, secretKey) => {
        const filePath = path.join(notEncryptedFolder, fileName);
        const data = await readFile(filePath);
        const encryptedData = encryptData(data, secretKey);
        const outputFilePath = path.join(encryptedFolder, `${path.basename(fileName, path.extname(fileName))}.txt`);
        await writeFile(outputFilePath, encryptedData);
    };

    const processFiles = async (files, secretKey) => {
        const encryptPromises = files.map(file => encryptFile(file, secretKey));
        await Promise.all(encryptPromises);
    };

    on('task', {
        async processFile({ fileName, encrypt = true }) {
            console.log('Configs    --->>>', config.env);
            const secretKey = config.env.SECRET_KEY;
            const environment = config.env.ENVIRONMENT;
            if (!secretKey) {
                throw new Error('❌ ERROR: SECRET_KEY is not defined!');
            }
            if (environment === 'LOCAL' || environment === 'Test') {
                console.log(`Encryption on ${environment} ${encrypt ? 'started...' : 'skipped, decrypting started...'}`);
                const filePath = path.join(encryptedFolder, `${fileName}.txt`);
                if (encrypt) {
                    const files = await fs.promises.readdir(notEncryptedFolder);
                    await processFiles(files, secretKey);
                    console.log(`✅ All files have been encrypted and saved in ${encryptedFolder}`);
                }
                const encryptedData = await readFile(filePath);
                return decryptData(encryptedData, secretKey);
            } else if (environment === 'CI') {
                const filePath = path.join(encryptedFolder, `${fileName}.txt`);
                console.log(`Decryption on ${environment} started...`);
                const encryptedData = await readFile(filePath);
                return decryptData(encryptedData, secretKey);
            } else {
                throw new Error(`❌ ERROR: Environment ${environment} is not supported.`);
            }
        },
    });
};