const fs = require('fs');
const crypto = require('crypto');
const path = require('path');


// CryptoHandler class for encryption and decryption
export class CryptoHandler {
    constructor(secretKey) {
        this.secretKey = Buffer.from(secretKey, 'hex');
        this.algorithm = 'aes-256-cbc';
        this.iv = crypto.randomBytes(16);
    }

    // Encrypt the given text and return the encrypted string
    encrypt(text) {
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${this.iv.toString('hex')}:${encrypted}`; // Store IV with the encrypted text
    }

    // Decrypt the given encrypted data
    decrypt(encryptedData) {
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedText = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    // Encrypt and save a JSON file
    async encryptJsonFile(inputFilePath, outputFilePath) {
        const data = fs.readFileSync(inputFilePath, 'utf8');
        const encryptedData = this.encrypt(data);
        fs.writeFileSync(outputFilePath, encryptedData);
        console.log(`Encrypted JSON file saved at: ${outputFilePath}`);
    }

    // Decrypt and read a JSON file
    async decryptJsonFile(inputFilePath) {
        const encryptedData = fs.readFileSync(inputFilePath, 'utf8');
        const decryptedData = this.decrypt(encryptedData);
        return JSON.parse(decryptedData); // Return the JSON object
    }
}

// Function to process files in a given directory
export async function processFiles(directoryPath, cryptoHandler) {
    const files = fs.readdirSync(directoryPath); // Read all files in the directory
    const notEncryptedFiles = []; // Array to hold names of files that are not encrypted

    // Loop through each file in the directory
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        // Check if the file is a JSON file
        if (path.extname(file) === '.json') {
            try {
                // Try to decrypt the file to check if it's already encrypted
                await cryptoHandler.decryptJsonFile(filePath);
            } catch (error) {
                // If decryption fails, it means the file is not encrypted
                notEncryptedFiles.push(file); // Add to not encrypted files list
            }
        }
    }

    // Process each not encrypted file
    for (const file of notEncryptedFiles) {
        const filePath = path.join(directoryPath, file);
        const encryptedFilePath = path.join(directoryPath, `encrypted_${file}`); // Define encrypted file name
        await cryptoHandler.encryptJsonFile(filePath, encryptedFilePath); // Encrypt and save the file

        // Move original not encrypted file to the "not_encrypted" folder
        const notEncryptedDir = path.join(directoryPath, 'not_encrypted');
        if (!fs.existsSync(notEncryptedDir)) {
            fs.mkdirSync(notEncryptedDir); // Create the "not_encrypted" directory if it doesn't exist
        }
        fs.renameSync(filePath, path.join(notEncryptedDir, file)); // Move original file
    }
}

// // Example usage
// const secretKey = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit secret key
// const cryptoHandler = new CryptoHandler(secretKey);

// // Directory containing the JSON files
// const directoryPath = './cypress/fixtures/'; // Replace with your directory path

// // Process the files in the specified directory
//  processFiles(directoryPath, cryptoHandler);