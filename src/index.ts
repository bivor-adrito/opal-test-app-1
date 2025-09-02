import { config } from '@config/config';
import { logger } from '@config/logger';
import { parseXmlToObj } from '@helper/common/common.helper';

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

    @tool({
        name: 'cmp_app_status',
        description:
            'Get the status of the CMP application. From the rss feed make a table of all the incident related to CMP. The CMP incidents includes CMP in the title. The columns will be title, description, and incident link.',
        parameters: [],
    })
    async cmpAppStatus(): Promise<any> {
        // Example implementation - replace with actual logic to fetch campaigns

        const axios = require('axios');

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://status.optimizely.com/history.rss',
            headers: {},
        };

        const axiosInstance = axios.create(config);

        const response = await axiosInstance.request(config);
        // Convert XML to JSON
        const jsonData = await parseXmlToObj<any>(response.data);

        // Extract RSS items
        const items = jsonData?.rss?.channel?.item || [];

        // Filter CMP-related incidents
        const cmpIncidents = items.filter((item: any) => item.title && item.title.toLowerCase().includes('cmp'));

        // Format the incidents for table display
        const formattedIncidents = cmpIncidents.map((item: any) => ({
            title: item.title || 'N/A',
            description: item.description || 'N/A',
            incident_link: item.link || 'N/A',
            pub_date: item.pubDate || 'N/A',
        }));

        return {
            total_incidents: formattedIncidents.length,
            cmp_incidents: formattedIncidents,
            raw_data: jsonData, // For debugging purposes
        };
    }
}
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
