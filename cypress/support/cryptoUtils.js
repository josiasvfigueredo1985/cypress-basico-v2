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
import path from 'path';
import { FileUtils } from './fileUtils';


const algorithm = 'aes-192-cbc';

// CryptoUtils class for encryption and decryption
export class CryptoUtils {

    constructor() { }

    encryptString(textData, password) {
        return new Promise((resolve, reject) => {
            scrypt(password, 'salt', 24, (err, key) => {
                if (err) return reject(err);
                randomFill(Buffer.alloc(16), (err, iv) => {
                    if (err) return reject(err);
                    const cipher = createCipheriv(algorithm, key, iv);
                    let encrypted = cipher.update(textData, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
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


    async encryptLocalFiles(directoryPath, localFolder, password) {
        const newFileExtension = '.txt'
        const fileExtension = '.json'
        // Read all files from not_encrypted folder
        const fileNames = await FileUtils.listFileNames(path.join(directoryPath, localFolder));
        // LOOP
        for (const fileName of fileNames) {
            const localFilePath = path.join(directoryPath, localFolder, fileName);
            // Read json file
            const jsonData = FileUtils.readJsonFile(localFilePath);
            // Encrypt data
            const encryptedData = await this.encryptString(jsonData, password);
            // Save it into fixtures folder with same name, different extension
            const ciFilePath = path.join(directoryPath, fileName.replace(fileExtension, newFileExtension));
            FileUtils.saveFileWithData(ciFilePath, encryptedData)
        }
    }
}