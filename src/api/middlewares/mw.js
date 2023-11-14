import { HttpPublicError, PublicError } from "@/api/errors"
import { HTTP_ERRORS } from "@/pages/api/constants"

const mw = (methodHandlers) => async (req, res) => {
  const handlers = methodHandlers[req.method.toUpperCase()]

  if (!handlers) {
    res.status(HTTP_ERRORS.NOT_FOUND).send({ error: "Method not allowed" })

    return
  }

  let currentHandlerIndex = -1
  const next = async () => {
    currentHandlerIndex += 1
    const handleNext = handlers[currentHandlerIndex]

    await handleNext(req, res, next)
  }

  try {
    await next()
  } catch (err) {
    if (!(err instanceof PublicError)) {
      res
        .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
        .send({ error: "Something went wrong." })

      // eslint-disable-next-line no-console
      console.error(err)

      return
    }

    if (err instanceof HttpPublicError) {
      res.status(err.statusCode)
    }

    res.send({ error: err.message })
  }
}

export default mw
