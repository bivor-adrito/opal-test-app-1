import * as Sentry from '@sentry/node';
import { config } from './config';

export function initializeSentry() {
  Sentry.init({
    dsn: config.sentry.dsn,
    tracesSampleRate: 1.0,
    stackParser: Sentry.defaultStackParser,
    maxValueLength: 100000,
    beforeSend(event) {
      event.tags = {
        ...event.tags,
        project: config.sentry.tag,
      };
      return event;
    },
  });
}

export function captureException(error: unknown) {
  Sentry.captureException(error);
}
