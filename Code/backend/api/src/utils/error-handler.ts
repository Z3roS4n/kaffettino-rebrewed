import fastify from "fastify";

interface IError {
  code: number;
  error?: unknown;
  message?: string;
}

export const errorCodes: Record<number, string> = {
  200: "OK - Request successful",
  201: "Created - Resource created successfully",
  400: "Bad Request - Invalid input data",
  401: "Unauthorized - Missing or invalid session token",
  402: "Payment Required - Insufficient wallet balance",
  403: "Forbidden - Insufficient permissions",
  404: "Not Found - Resource not found",
  409: "Conflict - Resource already exists or violates constraints",
  422: "Unprocessable Entity - Validation failed or semantic error",
  429: "Too Many Requests - Rate limit exceeded",
  500: "Internal Server Error - Unexpected server-side failure",
  503: "Service Unavailable - Server temporarily unavailable or under maintenance",
};

/**
 * Constructs and returns a standardized error object based on the provided parameters.
 *
 * @param {IError} params - The error details.
 * @param {number} params.code - The error code representing the type of error.
 * @param {string} [params.error] - An optional error string describing the error.
 * @param {string} [params.message] - An optional custom error message. If not provided, a default message from `errorCodes` is used based on the code.
 * @returns {IError} The constructed error object containing the code, error, and message.
 */
export default function sendError({ code, error, message }: IError): IError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorObject: IError = {
    code: code,
  };

  if (error) console.log(errorMessage);
  if (message) errorObject.message = message;
  else errorObject.message = errorCodes[code];

  return errorObject;
}
