import fs from 'fs';
import path from 'path';
import { logger } from '@config/logger';

/**
 * Ensures that a path exists, creates it if doesn't.
 * @param assetsPath the path we want to make sure exists
 * @returns assetPath Promise string
 */
export const ensureAssetsFolder = async (assetsPath: string) => {
  try {
    // Check if the folder exists
    fs.accessSync(assetsPath);
    return assetsPath;
  } catch {
    // If the folder does not exist, create it
    fs.mkdirSync(assetsPath, { recursive: true });
    return assetsPath;
  }
};

/**
 * Given the path deletes a local file.
 * @param filePath the path of the local file we want to delete
 */
export const deleteLocalFile = (filePath: string) => {
  const resolvedPath = path.resolve(filePath);

  fs.unlink(resolvedPath, (err) => {
    if (err) {
      logger.error(`Error deleting file at ${resolvedPath}:`, err);
      return Promise.reject(err);
    } else {
      logger.info(`File deleted successfully at ${resolvedPath}`);
    }
  });
};
