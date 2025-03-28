import {
    Buffer
} from 'buffer';
import {
    createCipheriv,
    createDecipheriv,
    randomFill,
    scrypt,
    scryptSync
} from 'crypto';
import fs from 'fs';

const algorithm = 'aes-192-cbc';

// CryptoHandler class for encryption and decryption
export class CryptoHandler {

    constructor() { }
    readJsonFile(filePath) {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const plainText = JSON.stringify(jsonData);
        return plainText;
    }

    readTextFile(filePath) {
        const textData = fs.readFileSync(filePath, 'utf8');
        return textData;
    }

    encryptString(textData, password) {
        return new Promise((resolve, reject) => {
            scrypt(password, 'salt', 24, (err, key) => {
                if (err) return reject(err);
                randomFill(Buffer.alloc(16), (err, iv) => {
                    if (err) return reject(err);
                    const cipher = createCipheriv(algorithm, key, iv);
                    let encrypted = cipher.update(textData, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    // Salvar o iv junto com o texto criptografado (em hex)
                    const result = iv.toString('hex') + ':' + encrypted;
                    resolve(result);
                });
            });
        });
    }


    decryptString(encryptedData, password) {
        const [ivHex, encryptedText] = encryptedData.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const key = scryptSync(password, 'salt', 24);
        const decipher = createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }


    saveEncryptedData(filePath, encryptedData) {
        fs.writeFileSync(filePath, encryptedData, 'utf8');
    }
}