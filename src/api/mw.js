import { createContext } from "@/api/createContext"
import { HttpNotFoundError, HttpPublicError, PublicError } from "@/api/errors"
import { HTTP_ERRORS } from "@/pages/api/constants"
import { NotFoundError } from "objection"

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

    await handleNext(ctx)
  }
  const ctx = createContext(req, res, next)

  try {
    await next()
  } catch (err) {
    const error = (() => {
      if (err instanceof NotFoundError) {
        return new HttpNotFoundError()
      }

      return err
    })()

    if (!(error instanceof PublicError)) {
      res
        .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
        .send({ error: "Something went wrong." })

      // eslint-disable-next-line no-console
      console.error(error)

      return
    }

    if (error instanceof HttpPublicError) {
      res.status(error.statusCode)
    }

    res.send({ error: error.message })
  } finally {
    await ctx.db.destroy()
  }
}

export default mw
