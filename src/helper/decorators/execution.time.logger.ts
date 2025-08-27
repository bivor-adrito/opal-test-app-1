import { logger } from '@config/logger';

/**
 * A decorator that wraps an asynchronous method and logs the time it needed to be executed when called.
 * The duration provided is in milliseconds.
 *
 * @param {unknown} target - The prototype of the class or the instance on which the method is defined.
 * @param {string} propertyKey - The name of the method being decorated.
 * @param {PropertyDescriptor} descriptor - The property descriptor of the method.
 *
 * @throws {Error} If the decorator is applied to a non-function property.
 *
 * @example
 * class MyService {
 *    // Use without `` wrapped
 *   `@executionTimeLogger`
 *   static async fetchData() {
 *     // Asynchronous logic
 *   }
 * }
 *
 * await MyService.fetchData()
 *
 * // Will log the following
 * // Operation finished
 * // duration: 5996
 */
export function executionTimeLogger(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  if (!originalMethod || typeof originalMethod !== 'function') {
    throw new Error('ExecutionTimeLogger decorator can only be applied to methods.');
  }

  descriptor.value = async function (...args: unknown[]) {
    const start = Date.now();
    const logComplete = logger.logWithDuration(start);

    const result = await originalMethod.apply(target, args);
    logComplete('Operation finished');

    return result;
  };

  return descriptor;
}
