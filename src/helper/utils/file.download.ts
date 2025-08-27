import { logger } from '@config/logger';
import axios from 'axios';

/**
 * Use it to download files
 * @example
 *  const { data } = await fileDownloadInstance.get(downloadUrl, { responseType: 'stream' });
 */
export const fileDownloadInstance = axios.create();

fileDownloadInstance.interceptors.request.use(
  (config) => {
    logger.success(`File Download API call request ${config.method} ${config.url?.substring(0, 50)} successful`);
    return config;
  },
  (error) => {
    logger.error(`File Download API request ${error.method} ${error.url?.substring(0, 50)} failed`);
    throw error;
  }
);

fileDownloadInstance.interceptors.response.use(
  (response) => {
    logger.success(
      `File Download API call response ${response.config.method} ${response.config.url?.substring(0, 50)}... successful`
    );
    return response;
  },
  (error) => {
    logger.error(
      `File Download API call response ${error.config.method} ${error.config.url.substring(0, 50)}... failed`
    );
    throw error;
  }
);
