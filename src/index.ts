import { config } from '@config/config';
import { logger } from '@config/logger';

import { processUncaughtException } from '@middlewares/processUncaughtError';
import { resolveApplicationError } from '@middlewares/resolveApplicationError';
import { CmpAssetService } from '@modules/cmp/services/cmp.service';
import { ParameterType, tool, ToolsService } from '@optimizely-opal/opal-tools-sdk';
import appRoutes from '@routes/app.routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import 'module-alias/register';

const app = express();
const port = config.port;

app.use(helmet()); //? Security

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

//? Webhook routes

app.use('/', appRoutes); // Health and Status route

app.use(processUncaughtException);
app.use(resolveApplicationError);
new ToolsService(app);
class Tools {
    @tool({
        name: 'campaign_list_tool',
        description: 'List all campaigns from a marketing platform',
        authRequirements: {
            provider: 'OptiID',
            scopeBundle: 'scheme',
            required: true,
        },
        parameters: [
            {
                name: 'platform',
                type: ParameterType.String,
                description: 'The marketing platform to fetch campaigns from (e.g., "google", "facebook", "cmp")',
                required: true,
            },
        ],
    })
    async listCampaigns(parameters: any, authData?: any): Promise<any> {
        // Example implementation - replace with actual logic to fetch campaigns
        if (!parameters.platform) {
            throw new Error('Platform is required');
        }
        if (!authData) {
            throw new Error('Authentication data is required');
        }

        const headers = {
            Accept: 'application/json',
            'x-auth-token-type': 'opti-id',
            Authorization: 'Bearer ' + authData.credentials.access_token,
            'Accept-Encoding': 'gzip',
            'x-request-id': '<unique-id>',
            'x-org-sso-id': authData.credentials.org_sso_id,
        };
        // Simulate fetching campaigns from the specified platform
        const campaigns = await CmpAssetService.fetchAllCampaigns(headers);
        return {
            campaigns,
        };
    }
}
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
