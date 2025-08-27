import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';


export const deleteLocalFile = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Resolve the full path to avoid issues with relative paths
        const resolvedPath = path.resolve(filePath);

        fs.unlink(resolvedPath, (err) => {
            if (err) {
                console.error(`Error deleting file at ${resolvedPath}:`, err);
                reject(err);
            } else {
                console.log(`File deleted successfully at ${resolvedPath}`);
                resolve();
            }
        });
    });
};

export const parseEtagGuid = (input: string): string => {
    const regex = /{([A-Z0-9\-]+)}/; // Regex to capture the value inside the curly braces
    const match = input.match(regex);

    if (match && match[1]) {
        return match[1];
    }

    return '';
};

export const readJsonFile = (filePath: string): any => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        return jsonData;
    } catch (error) {
        console.error('Error reading or parsing the JSON file:', error);
        return null;
    }
};

export const getObjectByField = (data: any[], field: string, value: string): any => {
    return data.find((item) => item[field] === value);
};

export const asyncForEach = async <T>(
    array: Array<T>,
    callback: (item: T, index: number, array: Array<T>) => Promise<void>
): Promise<void> => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

export const ensureAssetsFolder = async () => {
    const assetsPath = path.join(__dirname, '../assets');

    try {
        // Check if the folder exists
        await fs.accessSync(assetsPath);
        return assetsPath;
        console.log('Assets folder already exists.');
    } catch {
        // If the folder does not exist, create it
        await fs.mkdirSync(assetsPath, { recursive: true });
        return assetsPath;
        console.log('Assets folder created.');
    }
};

export async function parseXmlToObj<T>(xml: string): Promise<T> {
    try {
        const result = await parseStringPromise(xml, { explicitArray: false });
        return result as T;
    } catch (error) {
        console.error('Error parsing XML:', error);
        throw error;
    }
}

export function arrayToCommaSeparatedString(arr: any[]): string {
    return arr.join(', ');
}

export function generateFileName(assetInfo: any) {
    if (!assetInfo) {
        return 'default_file_name.ext';
    }

    let fileName = '';

    if (assetInfo?.title.includes('.')) {
        fileName = `${assetInfo.title.split('.')[0]}.${assetInfo.file_extension}`;
    } else {
        fileName = `${assetInfo.title}.${assetInfo.file_extension}`;
    }

    return fileName || 'default_file_name.ext';
}

export function getMediaIdFromUrl(url?: string) {
    const urlParams = new URLSearchParams(url);
    const mediaId = urlParams.get('mediaId') as string;

  
    return { mediaId };
  }
