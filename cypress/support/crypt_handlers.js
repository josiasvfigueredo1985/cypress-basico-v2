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

    encryptString(textData, password) {
        return new Promise((resolve, reject) => {
            // First, we'll generate the key. The key length is dependent on the algorithm.
            // In this case for aes192, it is 24 bytes (192 bits).
            scrypt(password, 'salt', 24, (err, key) => {
                if (err) return reject(err);
                // Then, we'll generate a random initialization vector
                randomFill(new Uint8Array(16), (err, iv) => {
                    if (err) return reject(err);
                    const cipher = createCipheriv(algorithm, key, iv);
                    let encrypted = cipher.update(textData, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    resolve(encrypted);
                });
            });
        });
    }

    decryptString(encryptedData, password) {
        // Use the async `crypto.scrypt()` instead.
        const key = scryptSync(password, 'salt', 24);
        // The IV is usually passed along with the ciphertext.
        const iv = Buffer.alloc(16, 0); // Initialization vector.
        const decipher = createDecipheriv(algorithm, key, iv);
        // Encrypted using same algorithm, key and iv.
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    saveEncryptedData(filePath, encryptedData) {
        fs.writeFileSync(filePath, encryptedData, 'utf8');
    }
}