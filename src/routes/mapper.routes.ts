// import { handleWebhook } from '@modules/webhook/webhook.controller';
import express from 'express';

import handleMapper from '@modules/mapper/mapper.controller';

const router = express.Router();

router.post('/', handleMapper);

export default router;
