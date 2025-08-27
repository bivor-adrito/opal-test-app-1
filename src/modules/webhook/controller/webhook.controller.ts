import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { executionTimeLogger } from '@helper/decorators/execution.time.logger';
import { EventData } from '../types/webhook.event.types';
import { config } from '@config/config';
import { QueuingService } from '@modules/queue/queue.service';
import { eventFactory } from '../utils/event.factory';

class WebhookController {
    private static readonly acceptedAssetTypes = ['image', 'raw_file', 'video'];

    private static responseReturn(res: Response) {
        res.status(StatusCodes.OK).json({ message: 'Event processed successfully' });
    }

    /**
     * Middleware to handle webhook events
     *
     * @param {Request} req - The Express request object. It contains the event data in it's body.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express `next` function to pass control to the next middleware.
     *
     * @example
     * // Use it in the router object
     *
     * const router = express.Router();
     * router.post('/cmp', verifyWebhookSecret, handleWebhook);
     */
    @executionTimeLogger
    public static async handleWebhook(req: Request<unknown, unknown, EventData>, res: Response, next: NextFunction) {
        try {
            const eventData = req.body;

            if (!this.acceptedAssetTypes.includes(eventData.data.asset.type)) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Asset type not allowed' });
                return;
            }

            if (config.redis.queueName != null && config.env !== 'development') {
                await QueuingService.publishJob(eventData);
                this.responseReturn(res);
                return;
            }
            await eventFactory(eventData);
            this.responseReturn(res);
        } catch (error) {
            next(error);
        }
    }
}

export default WebhookController.handleWebhook;
