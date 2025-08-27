import { Worker, Queue, Job } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '@config/config';
import { EventData } from '@modules/webhook/types/webhook.event.types';
import { logger } from '@config/logger';
import { logMethod } from '@helper/decorators/log.method';
import { ApiError } from '@helper/utils/api.error';
import { StatusCodes } from 'http-status-codes';
import { captureException } from '@config/sentry';

type CallbackConsumer = (eventData: EventData) => Promise<void>;

/**
 * Abstract Queuing Service class.
 * An instance of this class cannot be created.
 * Use the static functions of this class.
 * @example
 * QueuingService.publishJob(payload)
 */
export abstract class QueuingService {
    public static readonly QUEUE_NAME = config.redis.queueName ?? 'garbage_collector';
    public static readonly connectionConfiguration  = {
        host: config.redis.host,
        port: 6379,
        password: config.redis.password,
        tls: {
            rejectUnauthorized: false,
        },
        maxRetriesPerRequest: null,
        
    };

    private static readonly connection = new IORedis(this.connectionConfiguration);
    private static readonly queue = new Queue(this.QUEUE_NAME, {
        connection: this.connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 500,
            },
        },
    });
    private static callbackFn: CallbackConsumer;

    /**
     * Returns the number of jobs in the queue, in different category.
     * @returns Promise<void>
     */
    public static async getQueueJobLog() {
        return await QueuingService.queue.getJobCounts();
    }

    /**
     * Publishes a job to the queue.
     * @param payload - The payload to be published.
     * @returns Promise<void>
     */
    @logMethod(QueuingService.getQueueJobLog)
    public static async publishJob(payload: EventData) {
        await this.queue.add(payload.event_name, payload);
    }

    /**
     * Consumer function that consumes a job from the queue.
     * @param job Job to be consumed
     * @param callbackFn A callback function that will be executed
     * when a job is consumed.
     */
    @logMethod(() => Promise.resolve('Consuming task...'))
    private static async consumeJob(job: Job<EventData>) {
        try {
            await this.callbackFn(job.data);
        } catch (error) {
            if (error instanceof ApiError) {
                const status = error.statusCode;

                if (status === StatusCodes.NOT_MODIFIED) {
                    logger.error(error);
                    return;
                }
            }

            throw error;
        }
    }

    /**
     * Sets up a worker
     * @param callbackFn A callback function that will be executed
     * when a job is consumed.
     */
    public static setWorker(callbackFn: CallbackConsumer) {
        this.callbackFn = callbackFn;
        const worker = new Worker(this.QUEUE_NAME, this.consumeJob, { connection: this.connectionConfiguration });

        worker.on('completed', (job) => {
            logger.info(`${job.id} has completed!`);
        });

        worker.on('failed', (job, err) => {
            logger.error(err);

            if (job?.attemptsMade == job?.opts.attempts) {
                captureException(err);
                logger.error(`Job ${job?.id} has failed after ${job?.attemptsMade} attempts`);
            }
        });
    }
}
