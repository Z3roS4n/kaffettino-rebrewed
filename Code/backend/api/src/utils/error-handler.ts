import fastify, { FastifyReply } from "fastify";

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
 * Sends a standardized error response using Fastify's reply interface.
 *
 * @param reply - The Fastify reply instance used to send the response.
 * @param param1 - An object containing error details.
 * @param param1.code - The error code to be sent in the response.
 * @param param1.error - The error object or message to be logged and included in the response.
 * @param param1.message - An optional custom error message to be sent in the response.
 * @returns The Fastify reply instance with the error object sent.
 */
export default function sendError(
  reply: FastifyReply,
  { code, error, message }: IError
): FastifyReply {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorObject: IError = {
    code: code,
  };

  if (error) console.log(errorMessage);
  if (message) errorObject.message = message;
  else errorObject.message = errorCodes[code];

  return reply.send(errorObject);
}
