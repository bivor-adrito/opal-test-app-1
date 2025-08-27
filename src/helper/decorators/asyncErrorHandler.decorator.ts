import { handleApiError } from '@helper/utils/error.helper';

/**
 * A decorator that wraps an asynchronous method with error handling logic.
 * If an error occurs during the execution of the method, it is passed to the `handleApiError` function.
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
 *   `@asyncErrorHandler`
 *   async fetchData() {
 *     // Asynchronous logic
 *   }
 * }
 */
export function asyncErrorHandler(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  if (typeof originalMethod !== 'function') {
    throw new Error('ErrorHandler decorator can only be applied to methods.');
  }

  descriptor.value = async function (...args: unknown[]) {
    try {
      return await originalMethod.apply(target, args);
    } catch (error) {
      throw handleApiError(error);
    }
  };
}
