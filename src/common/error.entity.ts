import type { statusCode } from "./types/utilities.types.ts"
import type { Request } from 'express';

export class ApiError extends Error {
  status: statusCode

  constructor(message: string, status: statusCode, request?: Request) {
    const newMessage = request ? `${request.method} ${request.baseUrl}${request.path}: ${message}` : message;

    super(newMessage)
    this.status = status
  }
}