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

        // CMP_BASE_URL: z.string().nonempty(),
    })
    .passthrough(); // Allow additional properties

// Validate and parse environment variables
const envVars = envVarsSchema.parse(process.env);

// Export configuration as an object
export const config = {
    env: envVars.NODE_ENV,
    port: parseInt(envVars.PORT, 10),

    urls: {
        cmpBase: 'https://api.cmp.optimizely.com',
    },
};
