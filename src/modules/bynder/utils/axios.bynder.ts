import { config } from '@config/config';
import { logger } from '@config/logger';
import axios from 'axios';

/**
 * Axios instance of API calls to Showpad.
 * The Bearer Auth token is attached to its header.
 * @example
 * const { data } = await showpadApiInstance.get<Asset>(url);
 */
export const bynderApiInstance = axios.create({
  baseURL: config.urls.bynderBase,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    timeout: 3000,
    Authorization: `Bearer ${config.bynder.bynderPermanentAccessToken}`,
  },
});

bynderApiInstance.interceptors.request.use(
  (config) => {
    logger.success(`Bynder API call request ${config.method} ${config.url} successful`);
    return config;
  },
  (error) => {
    logger.error(`Bynder API request ${error.method} ${error.url} failed`);
    throw error;
  }
);

bynderApiInstance.interceptors.response.use(
  (response) => {
    logger.success(`Bynder API call response ${response.config.method} ${response.config.url} successful`);
    return response;
  },
  (error) => {
    logger.error(`Bynder API call response ${error.config.method} ${error.config.url} failed`);
    error.message = 'BYNDER API: ' + error.response.data.detail;
    throw error;
  }
);
