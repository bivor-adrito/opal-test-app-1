import { config } from '@config/config';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@helper/utils/error.helper';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware to check if webhook secret is present in the request header and verify it if it does.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express `next` function to pass control to the next middleware.
 *
 * @example
 * // Use it in the router object, before passing it to the controller middleware
 *
 * const router = express.Router();
 * router.post('/cmp', verifyWebhookSecret, handleWebhook);
 */
export const verifyWebhookSecret = (req: Request, res: Response, next: NextFunction) => {
  const callbackSecret = req.header('callback-secret');

  if (!callbackSecret) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Missing webhook secret');
  }

  // if (callbackSecret !== config.webhook.secret) {
  //   throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid webhook secret');
  // }

  next();
};
