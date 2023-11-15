import { HttpArgumentsError } from "@/api/errors"
import { ValidationError, object } from "yup"

const validate = (validationSchema) => async (req, res, next) => {
  try {
    const sanitizedBody = await object(validationSchema)
      .noUnknown()
      .validate(req.body, {
        abortEarly: false,
      })

    // eslint-disable-next-line require-atomic-updates
    req.body = sanitizedBody

    await next()
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new HttpArgumentsError(err.errors)
    }

    throw err
  }
}

export default validate
