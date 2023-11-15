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

export class HttpDuplicateError extends HttpPublicError {
  statusCode = HTTP_ERRORS.DUPLICATE

  constructor(resource, key, value) {
    super(
      !resource
        ? "Resource already exists"
        : `Duplicated resource ${resource} on \`${key}\`=\`${value}\``,
    )
  }
}
