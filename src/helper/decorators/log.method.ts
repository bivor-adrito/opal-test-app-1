import { logger } from '@config/logger';

/**
 * A decorator that logs a message before and after the method is called.
 * @param message The message to log. Can be a string or an Object
 * @param logAfter When should the message be logged. If true, it will log after the method is called. Otherwise before
 * @returns A method decorator that logs method name, provided message, and return value.
 */
export function logMethod<T>(message: () => Promise<T>, logAfter: boolean = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const log = async () => {
            const messageToLog = await message();
            logger.info(`[LOG] Method: ${propertyKey}`);
            logger.info(messageToLog);
        };

        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            if (!logAfter) {
                log();
            }
            const result = await originalMethod.apply(target, args);

            if (logAfter) {
                log();
            }

            return result;
        };

        return descriptor;
    };
}
