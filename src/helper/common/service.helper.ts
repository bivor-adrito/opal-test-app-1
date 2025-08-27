import { handleApiError } from '@helper/utils/error.helper';

export type PaginatedData<D> = {
    data: D[];
    pagination: { next: string | null };
  };

/**
 * Extend it to implement API Service classes.
 * @example
 * class ApiService extends Service {
 *  public example(){
 *    this.errorHandler(() => {
 *      // Do something...
 *    })
 *
 *    this.getAllPaginatedData(() => {
 *      // Call API that returns paginated data...
 *    })
 *  }
 * }
 *
 * Provides following functions as inheritable utility
 * @function errorHandler
 * @function getAllPaginatedData
 */

export abstract class Service {
  /**
   * Handles any errors that might get thrown during a function execution.
   * Can use asyncErrorHandler Decorator instead, much more cleaner.
   * @param fn Executable callback function that we want to wrap in try catch block
   * @returns Callback functions return type, or throws an ApiError incase of an error
   * @example
   * this.errorHandler(() => {
   *  return await apiInstance.get('/url')
   * })
   */
  public static async errorHandler<T>(fn: () => Promise<T>) {
    try {
      return await fn();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Returns all paginated data in an array.
   * Pass the Api call function and the initial url and it will take it from there.
   * The return data type of the Api call function must be PaginatedData type
   * @param callbackFn Api call function that will return the response data in PaginatedData format.
   * Check the type for reference. It takes an url string as parameter.
   * @param currentUrl Initial url string for the first Api call.
   * Example - `/v3/asset-lineages?asset_id=${assetId}&offset=0&page_size=10`
   * @returns An array of the response data type of the callbackFn return type
   * @example
   * return await this.getAllPaginatedData<AssetLineage>(async (url) => await apiInstance.get(url), initialUrl);
   */
  protected static async getAllPaginatedData<T>(
    callbackFn: (url: string, headers?: any) => Promise<PaginatedData<T>>,
    currentUrl: string,
    headers?: any
  ): Promise<T[]> {
    const { data, pagination } = await this.errorHandler<PaginatedData<T>>(async () => {
      return await callbackFn(currentUrl, headers);
    });

    if (pagination.next != null) {
      const nextItrData = await this.getAllPaginatedData(callbackFn, pagination.next, headers );
      return [...data, ...nextItrData];
    }

    return data;
  }
}
