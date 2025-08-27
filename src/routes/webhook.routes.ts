// import { handleWebhook } from '@modules/webhook/webhook.controller';
import express from 'express';

import handleWebhook from '@modules/webhook/controller/webhook.controller';
import { verifyWebhookSecret } from '@middlewares/webhookAuth';

const router = express.Router();

router.post('/cmp', verifyWebhookSecret, handleWebhook);

export default router;
