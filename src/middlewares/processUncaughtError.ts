import { ApiError } from '@helper/utils/error.helper';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

/**
 * Middleware to process uncaught exceptions and transform them into a standardized `ApiError` object.
 * Ensures that any non-`ApiError` instance is converted before passing it to the next middleware.
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
 *
 * const app = express();
 *
 * // Before starting the server and after registering all the routes
 * app.use(processUncaughtException);
 */
export const processUncaughtException = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode: number = err instanceof ApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || getReasonPhrase(statusCode);
    error = new ApiError(statusCode, message, err.stack);
  }

  next(error);
};
