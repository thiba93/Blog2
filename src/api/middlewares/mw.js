import config from "@/api/config"
import { HttpNotFoundError, HttpPublicError, PublicError } from "@/api/errors"
import BaseModel from "@/db/models/BaseModel"
import ProductModel from "@/db/models/ProductModel"
import { HTTP_ERRORS } from "@/pages/api/constants"
import knex from "knex"
import { NotFoundError } from "objection"

const mw = (methodHandlers) => async (req, res) => {
  const handlers = methodHandlers[req.method.toUpperCase()]

  if (!handlers) {
    res.status(HTTP_ERRORS.NOT_FOUND).send({ error: "Method not allowed" })

    return
  }

  const db = knex(config.db)

  if (config.isDevMode) {
    db.on("query", ({ sql, bindings }) => console.info({ sql, bindings }))
  }

  BaseModel.knex(db)

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
    models: {
      ProductModel,
    },
  }

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
    await db.destroy()
  }
}

export default mw
