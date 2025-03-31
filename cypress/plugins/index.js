// cypress/plugins/index.js
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

module.exports = (on, config) => {
    on('task', {
        processFile({ fileName }) {
            console.log('Configs    --->>>', config.env)
            const secretKey = config.env.SECRET_KEY;
            const environment = config.env.ENVIRONMENT; // Ler o ambiente
            const notEncryptedFolder = './cypress/not_encrypted';
            const encryptedFolder = './cypress/encrypted';

            return new Promise((resolve, reject) => {
                if (environment === 'LOCAL' | environment === 'Test') {
                    // Criptografar todos os arquivos na pasta ./cypress/not_encrypted
                    fs.readdir(notEncryptedFolder, (err, files) => {
                        if (err) {
                            return reject(err);
                        }

                        const encryptPromises = files.map((file) => {
                            return new Promise((fileResolve, fileReject) => {
                                const filePath = path.join(notEncryptedFolder, file);

                                fs.readFile(filePath, 'utf8', (readErr, data) => {
                                    if (readErr) {
                                        return fileReject(readErr);
                                    }

                                    // Criptografar os dados
                                    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();

                                    // Salvar os dados criptografados com o formato <nome_original>.txt
                                    const outputFilePath = path.join(encryptedFolder, `${path.basename(file, path.extname(file))}.txt`);
                                    fs.writeFile(outputFilePath, encryptedData, (writeErr) => {
                                        if (writeErr) {
                                            return fileReject(writeErr);
                                        }
                                        fileResolve(null);
                                    });
                                });
                            });
                        });

                        Promise.all(encryptPromises)
                            .then(() => {
                                // Após criptografar, descriptografar o arquivo fornecido (se houver)
                                if (fileName) {
                                    const filePath = path.join(encryptedFolder, `${fileName}.txt`);

                                    fs.readFile(filePath, 'utf8', (readErr, encryptedData) => {
                                        if (readErr) {
                                            return reject(readErr);
                                        }

                                        // Descriptografar os dados
                                        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                                        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                                        try {
                                            // Retornar os dados em formato JSON
                                            const jsonData = JSON.parse(decryptedData);
                                            resolve(jsonData);
                                        } catch (jsonErr) {
                                            reject(jsonErr);
                                        }
                                    });
                                } else {
                                    resolve(`Todos os arquivos foram criptografados e salvos na pasta ${encryptedFolder}`);
                                }
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    });
                } else if (environment === 'CI') {
                    // Descriptografar o arquivo fornecido
                    const filePath = path.join(encryptedFolder, `${fileName}.txt`);

                    fs.readFile(filePath, 'utf8', (readErr, encryptedData) => {
                        if (readErr) {
                            return reject(readErr);
                        }

                        // Descriptografar os dados
                        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                        try {
                            // Retornar os dados em formato JSON
                            const jsonData = JSON.parse(decryptedData);
                            resolve(jsonData);
                        } catch (jsonErr) {
                            reject(jsonErr);
                        }
                    });
                } else {
                    reject(new Error(`Ambiente ${environment} não suportado.`));
                }
            });
        },
    });
};