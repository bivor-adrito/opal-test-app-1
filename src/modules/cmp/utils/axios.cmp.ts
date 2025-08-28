import { config as envConfig } from '@config/config';
import { logger } from '@config/logger';
import axios from 'axios';


/**
 * Axios instance of API calls to CMP.
 * The Bearer Auth token is attached to its header.
 * @example
 * const { data } = await cmpApiInstance.get<Asset>(url);
 */
export const cmpApiInstance = axios.create({
    baseURL: envConfig.urls.cmpBase,
});



cmpApiInstance.interceptors.request.use(
    async (config) => {
        logger.success(`CMP API call request ${config.method} ${config.url} successful`);

        return config;
    },
    (error) => {
        logger.error(`CMP API request ${error.method} ${error.url} failed`);
        throw error;
    }
);

cmpApiInstance.interceptors.response.use(
    (response) => {
        logger.success(`CMP API call response ${response.config.method} ${response.config.url} successful`);
        return response;
    },
    (error) => {
        logger.error(`CMP API call response ${error.config.method} ${error.config.url} failed`);
        error.message = 'CMP API: ' + error.response.data.message;
        throw error;
    }
);
