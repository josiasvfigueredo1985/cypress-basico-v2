const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

module.exports = (on, config) => {
    on('task', {
        processFile({ fileName, encrypt = true  }) {
            console.log('Configs    --->>>', config.env);
            const secretKey = config.env.SECRET_KEY;
            const environment = config.env.ENVIRONMENT;
            const notEncryptedFolder = './cypress/not_encrypted';
            const encryptedFolder = './cypress/encrypted';

            return new Promise((resolve, reject) => {
                if (!secretKey) {
                    return reject(new Error('❌ ERROR: SECRET_KEY is not defined!'));
                }

                if (environment === 'LOCAL' || environment === 'Test' || encrypt) {
                    // Encrypt all files in the ./cypress/not_encrypted folder
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

                                    try {
                                        // Encrypt data
                                        const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();

                                        // Save the encrypted file as <original_name>.txt
                                        const outputFilePath = path.join(encryptedFolder, `${path.basename(file, path.extname(file))}.txt`);
                                        fs.writeFile(outputFilePath, encryptedData, (writeErr) => {
                                            if (writeErr) {
                                                return fileReject(writeErr);
                                            }
                                            fileResolve(null);
                                        });
                                    } catch (encryptErr) {
                                        return fileReject(encryptErr);
                                    }
                                });
                            });
                        });

                        Promise.all(encryptPromises)
                            .then(() => {
                                if (fileName) {
                                    const filePath = path.join(encryptedFolder, `${fileName}.txt`);

                                    fs.readFile(filePath, 'utf8', (readErr, encryptedData) => {
                                        if (readErr) {
                                            return reject(readErr);
                                        }

                                        try {
                                            // Decrypt data
                                            const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                                            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                                            if (!decryptedData) {
                                                throw new Error('Decryption failed. Check your SECRET_KEY!');
                                            }

                                            // Return JSON data
                                            const jsonData = JSON.parse(decryptedData);
                                            resolve(jsonData);
                                        } catch (jsonErr) {
                                            reject(new Error(`❌ ERROR: Decryption failed. Invalid key or corrupted data! - ${jsonErr.message}`));
                                        }
                                    });
                                } else {
                                    resolve(`✅ All files have been encrypted and saved in ${encryptedFolder}`);
                                }
                            })
                            .catch((error) => reject(error));
                    });
                } else if (environment === 'CI') {
                    // Decrypt the requested file in CI environment
                    const filePath = path.join(encryptedFolder, `${fileName}.txt`);

                    fs.readFile(filePath, 'utf8', (readErr, encryptedData) => {
                        if (readErr) {
                            return reject(new Error(`❌ ERROR: Failed to read file ${filePath} - ${readErr.message}`));
                        }

                        try {
                            console.log("🔍 Encrypted Data:", encryptedData);

                            // Decrypt data
                            const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                            if (!decryptedData) {
                                throw new Error("Decryption failed. Check your SECRET_KEY!");
                            }

                            console.log("✅ Decryption successful!");

                            // Parse and return JSON data
                            const jsonData = JSON.parse(decryptedData);
                            resolve(jsonData);
                        } catch (error) {
                            reject(new Error(`❌ ERROR: Decryption failed. Invalid key or corrupted data! - ${error.message}`));
                        }
                    });
                } else {
                    reject(new Error(`❌ ERROR: Environment ${environment} is not supported.`));
                }
            });
        },
    });
};