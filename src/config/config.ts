import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define schema for environment variables validation
const envVarsSchema = z
    .object({
        NODE_ENV: z.enum(['production', 'development', 'test']),
        PORT: z.string().default('8000'),

        APP_CLIENT_ID: z.string().nonempty(),
        APP_CLIENT_SECRET: z.string().nonempty(),
        WEBHOOK_SECRET: z.string().nonempty(),

        ACCESS_TOKEN_BASE_URL: z.string().nonempty(),
        CMP_BASE_URL: z.string().nonempty(),
        ACCESSIFY_URL: z.string().nonempty(),

        BYNDER_BASE_URL: z.string().nonempty(),
        BYNDER_PERMANENT_ACCESS_TOKEN: z.string().nonempty(),
        BYNDER_WAITING_ROOM: z.string().nonempty(),
        BYNDER_BRAND_ID: z.string().nonempty(),
        BYNDER_USE_EXTERNAL_TAG: z.string().nonempty(),
        BYNDER_USE_HARD_CODED_META_PROPERTY: z.string().nonempty(),

        REDIS_HOST: z.string().nonempty(),
        REDIS_PASSWORD: z.string().nonempty(),

        SENTRY_DSN: z.string().nonempty(),
        SENTRY_TAG: z.string().nonempty(),

        _config_delete_behavior: z.string(),
        QUEUE_NAME: z.string().optional(),
    })
    .passthrough(); // Allow additional properties

// Validate and parse environment variables
const envVars = envVarsSchema.parse(process.env);

// Export configuration as an object
export const config = {
    env: envVars.NODE_ENV,
    port: parseInt(envVars.PORT, 10),
    client: {
        id: envVars.APP_CLIENT_ID,
        secret: envVars.APP_CLIENT_SECRET,
    },
    webhook: {
        secret: envVars.WEBHOOK_SECRET,
    },
    bynder: {
        bynderPermanentAccessToken: envVars.BYNDER_PERMANENT_ACCESS_TOKEN,
        waitingRoom: envVars.BYNDER_WAITING_ROOM,
        brandId: envVars.BYNDER_BRAND_ID,
        useExternalTag: envVars.BYNDER_USE_EXTERNAL_TAG == 'YES',
        useHardCodedMetaProperties: envVars.BYNDER_USE_HARD_CODED_META_PROPERTY == 'YES',
    },
    urls: {
        cmpBase: envVars.CMP_BASE_URL,
        cmpAccessToken: envVars.ACCESS_TOKEN_BASE_URL,
        bynderBase: envVars.BYNDER_BASE_URL,
        accessifyUrl: `${envVars.ACCESSIFY_URL}/value`,
    },
    redis: {
        host: envVars.REDIS_HOST,
        password: envVars.REDIS_PASSWORD,
        queueName: envVars.QUEUE_NAME,
    },
    sentry: {
        dsn: envVars.SENTRY_DSN,
        tag: envVars.SENTRY_TAG,
    },
    config: {
        deleteBehavior: envVars._config_delete_behavior,
    },
};
