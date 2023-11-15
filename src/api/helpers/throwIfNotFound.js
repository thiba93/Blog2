import { HttpNotFoundError } from "@/api/errors"

const throwIfNotFound = (resource) => {
  if (!resource) {
    throw new HttpNotFoundError()
  }
}

export default throwIfNotFound
