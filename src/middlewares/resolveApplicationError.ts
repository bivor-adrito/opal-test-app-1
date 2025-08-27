import { config } from '@config/config';
import { logger } from '@config/logger';
import { captureException } from '@config/sentry';
import { ApiError } from '@helper/utils/api.error';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware to resolve application errors and send a proper response with status code and message extracted from the instance.
 * Use it with the processUncaughtException middleware, example shown
 *
 * @param {Error} err - The error object caught by the middleware.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express `next` function to pass control to the next middleware.
 *
 * @example
 * // Registering the middleware in an Express app
 * import express from 'express';
 * import { processUncaughtException } from './middleware';
 * import { resolveApplicationError } from '@middlewares/resolveApplicationError';
 *
 * const app = express();
 *
 * // Before starting the server and after registering all the routes
 * app.use(processUncaughtException);
 * app.use(resolveApplicationError);
 */
export const resolveApplicationError = async (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = StatusCodes.OK;

    const message: string = err.message;
    const isAppInDevelopmentMode = config.env === 'development';

    // Prepare response object
    const response = {
        code: statusCode,
        message,
        ...(isAppInDevelopmentMode && { stack: err.stack }),
    };

    if (isAppInDevelopmentMode) {
        logger.error(err);
    }

    if (err?.statusCode !== StatusCodes.NOT_MODIFIED) {
        captureException(err);
    }

    res.status(statusCode).send(response);
};
