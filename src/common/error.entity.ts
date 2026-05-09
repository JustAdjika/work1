import type { statusCode } from "./types/utilities.types.ts"

export class ApiError extends Error {
  status: statusCode

  constructor(message: string, status: statusCode) {
    super(message)
    this.status = status
  }
}