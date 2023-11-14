/* eslint-disable max-classes-per-file */
import { HTTP_ERRORS } from "@/pages/api/constants"

export class PublicError extends Error {}

export class HttpPublicError extends PublicError {}

export class HttpNotFoundError extends HttpPublicError {
  statusCode = HTTP_ERRORS.NOT_FOUND

  constructor(message = "Not found") {
    super(message)
  }
}
