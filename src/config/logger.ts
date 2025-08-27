import pino from 'pino';

interface CustomLogger extends pino.Logger {
    success(msg: string, data?: object): void;
    logWithDuration(start: number): (msg: string, data?: object) => void;
}
const defaultPinoConfig = {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
            errorLikeObjectKeys: ['err', 'error'],
        },
    },
    redact: {
        paths: ['*.password', '*.secret', '*.token', '*.key'],
        remove: true,
    },
};

function getHumanReadableDuration(duration: number): string {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}, ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
}

const getLogger = (options = {}): CustomLogger => {
    const config = {
        ...defaultPinoConfig,
        ...options,
    };

    const logger = pino(config) as CustomLogger;

    logger.success = function (msg: string, data = {}) {
        return this.info({ msg, success: true, ...data });
    };

    logger.logWithDuration = function (start: number) {
        return (msg: string, data = {}) => {
            const durationInMS = Date.now() - start;
            const duration = getHumanReadableDuration(durationInMS);
            return this.info({ msg, duration, ...data });
        };
    };

    return logger;
};

export const logger = getLogger();
