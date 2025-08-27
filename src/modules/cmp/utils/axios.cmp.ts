import { config as envConfig } from '@config/config';
import { logger } from '@config/logger';
import axios from 'axios';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}
const isOpalCall = true;
/**
 * Axios instance of API calls to CMP.
 * The Bearer Auth token is attached to its header.
 * @example
 * const { data } = await cmpApiInstance.get<Asset>(url);
 */
export const cmpApiInstance = axios.create({
    baseURL: envConfig.urls.cmpBase,
});

/**
 * Generates Access Token
 * @returns Access Token String
 */
export const getCmpAccessToken = async () => {
    const config = {
        method: 'POST',
        url: `${envConfig.urls.cmpAccessToken}/o/oauth2/v1/token`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            client_id: envConfig.client.id,
            client_secret: envConfig.client.secret,
            grant_type: 'client_credentials',
        },
    };

    try {
        const { data } = await axios.request<TokenResponse>(config);
        return data.access_token;
    } catch (error) {
        return null;
    }
};

cmpApiInstance.interceptors.request.use(
    async (config) => {
        logger.success(`CMP API call request ${config.method} ${config.url} successful`);

        if (!isOpalCall) {
            const authToken = await getCmpAccessToken();
            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }
        }

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
