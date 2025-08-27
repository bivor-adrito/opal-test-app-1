import { logger } from '@config/logger';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

router.get('/_status', async (_req: Request, res: Response) => {
  logger.success('All Ok! Github-Action\n App running...');
  res.status(StatusCodes.OK).send('All Ok! Github-Action');
});



export default router;
