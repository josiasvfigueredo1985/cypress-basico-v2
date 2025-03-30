import fs from 'fs';


// FileUtils class for files operations
export class FileUtils {

    static readJsonFile(filePath) {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const plainText = JSON.stringify(jsonData);
        return plainText;
    }

    static async readTextFile(filePath) {
        const textData = await fs.readFileSync(filePath, 'utf8');
        return textData;
    }

    static saveFileWithData(filePath, data) {
        fs.writeFileSync(filePath, data, 'utf8');
    }

    static async listFileNames(directoryPath) {
        try {
            const fileNames = await fs.readdirSync(directoryPath);
            return fileNames
        } catch (err) {
            console.error(`Error when listing files in given directory path ${directoryPath}:`, err);
        }
    }

}