import { HttpDuplicateError } from "@/api/errors"

const throwIfDuplicate = (db, currentResource, key) => {
  const hasDuplicate = Object.values(db).some(
    (resource) => resource[key] === currentResource[key],
  )

  if (hasDuplicate) {
    throw new HttpDuplicateError("product", key, currentResource[key])
  }
}

export default throwIfDuplicate
