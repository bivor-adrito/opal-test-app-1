import axios from 'axios';
import { StatusCodes } from 'http-status-codes';


/**
 * Throw it in case of an error and if you want to send a certain Status code and Message as Api response.
 * @example
 * throw new ApiError(500, "Something went wrong!")
 * @param statusCode Error code in number
 * @param message Error message in string
 * @param stack Error stack, optional, if not provided usual Error stack is going to be printed
 */
export class ApiError extends Error {
  constructor(public statusCode: number, message: string, stack = '') {
    super(message);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * A helper function that takes and error and throws proper Api error with status code and message.
 * If the parameter is an AxiosError status code and message is extracted from that Error.
 * @param error An error that happened during API call
 */
export const handleApiError = (error: unknown) => {
  const fallbackErrorStatus = StatusCodes.BAD_GATEWAY;
  const fallbackErrorMessage = 'An Api error happened';

  if (axios.isAxiosError(error)) {
    const status = error.status || fallbackErrorStatus;
    const message = error.message || fallbackErrorMessage;

    throw new ApiError(status, message);
  }

  throw new ApiError(fallbackErrorStatus, fallbackErrorMessage);
};
