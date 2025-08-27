import { logger } from '@config/logger';

/**
 * A decorator function that enforces a class to follow the Singleton pattern.
 * Ensures that only one instance of the class can be created. If an attempt
 * is made to instantiate the class again, it returns the existing instance.
 *
 * @example
 * // Use without the `` wrapped
 * `@singleton`
 * class ConfigSettings {
 *   constructor() {
 *     console.log('ConfigSettings instantiated');
 *   }
 * }
 *
 * const instance1 = new ConfigSettings();
 * const instance2 = new ConfigSettings();
 *
 * // Logs:
 * // "MyService instantiated"
 * // Logs an error: "You cannot instantiate a singleton twice!"
 *
 * console.log(instance1 === instance2); // true
 */
export function singleton<T extends new (...args: any[]) => any>(ctr: T): T {
  let instance: T;

  return class {
    constructor(...args: any[]) {
      if (instance) {
        logger.error('You cannot instantiate a singleton twice!');
        return instance;
      }

      instance = new ctr(...args);
      return instance;
    }
  } as T;
}
