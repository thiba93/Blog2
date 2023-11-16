import { HttpPublicError, PublicError } from "@/api/errors"
import config from "@/config"
import { HTTP_ERRORS } from "@/pages/api/constants"
import knex from "knex"

const mw = (methodHandlers) => async (req, res) => {
  const handlers = methodHandlers[req.method.toUpperCase()]

  if (!handlers) {
    res.status(HTTP_ERRORS.NOT_FOUND).send({ error: "Method not allowed" })

    return
  }

  const db = knex(config.db)
  let currentHandlerIndex = -1
  const next = async () => {
    currentHandlerIndex += 1
    const handleNext = handlers[currentHandlerIndex]

    await handleNext(ctx)
  }
  const ctx = {
    req,
    res,
    next,
    db,
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
