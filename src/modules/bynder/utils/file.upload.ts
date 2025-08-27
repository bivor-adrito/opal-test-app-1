import { logger } from '@config/logger';
import axios from 'axios';

/**
 * Use it to upload file to Showpad
 * @example
 * await fileUploadInstance.put(uploadUrl, fileContent, { headers });
 */
export const fileUploadInstance = axios.create();

fileUploadInstance.interceptors.request.use(
  (config) => {
    logger.success(`File Upload API call request ${config.method} ${config.url?.substring(0, 50)}... successful`);
    return config;
  },
  (error) => {
    logger.error(`File Upload API request ${error.method} ${error.url?.substring(0, 50)}... failed`);
    throw error;
  }
);

fileUploadInstance.interceptors.response.use(
  (response) => {
    logger.success(
      `File Upload API call response ${response.config.method} ${response.config.url?.substring(0, 50)}... successful`
    );
    return response;
  },
  (error) => {
    logger.error(`File Upload API call response ${error.config.method} ${error.config.url.substring(0, 50)}... failed`);
    throw error;
  }
);
