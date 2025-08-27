import { config as envConfig } from '@config/config';
import { logger } from '@config/logger';
import { getCmpAccessToken } from '@modules/cmp/utils/axios.cmp';
import axios from 'axios';
// import { getCmpAccessToken } from '@modules/cmp/utils/axios.cmp';

/**
 * Axios instance of API calls to Accessify
 * The Bearer Auth token is attached to its header.
 * @example
 * const { data } = await accessifyApiInstance.get<Asset>(url);
 */

export const accessifyApiInstance = axios.create({
    baseURL: envConfig.urls.accessifyUrl,
});

accessifyApiInstance.interceptors.request.use(
    async (config) => {
        logger.success(`Accessify API call request ${config.method} ${config.url} successful`);

        const authToken = await getCmpAccessToken();
        logger.info(`Accessify API call request ${config.method} ${config.url} with token ${authToken}`);
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => {
        logger.error(`Accessify API request ${error.method} ${error.url} failed`);
        throw error;
    }
);

accessifyApiInstance.interceptors.response.use(
    (response) => {
        logger.success(`Accessify API call response ${response.config.method} ${response.config.url} successful`);
        return response;
    },
    (error) => {
        logger.error(`Accessify API call response ${error.config.method} ${error.config.url} failed`);
        throw error;
    }
);
