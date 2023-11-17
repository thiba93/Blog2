import throwIfNotFound from "@/api/helpers/throwIfNotFound"
import mw from "@/api/middlewares/mw"
import validate from "@/api/middlewares/validate"
import {
  descriptionValidator,
  idValidator,
  nameValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        productId: idValidator.required(),
      },
    }),
    async ({
      res,
      db,
      input: {
        query: { productId },
      },
    }) => {
      const [product] = await db("products").where({ id: productId })

      throwIfNotFound(product)

      res.send(product)
    },
  ],
  PATCH: [
    validate({
      query: {
        productId: idValidator.required(),
      },
      body: {
        name: nameValidator,
        description: descriptionValidator,
      },
    }),
    async ({
      db,
      res,
      input: {
        query: { productId },
        body,
      },
    }) => {
      const product = await db("products").where({ id: productId })

      throwIfNotFound(product)

      const [updatedProduct] = await db("products")
        .update(body)
        .where({ id: productId })
        .returning("*")

      res.send(updatedProduct)
    },
  ],
  DELETE: [
    validate({
      query: {
        productId: idValidator.required(),
      },
    }),
    async ({
      res,
      db,
      input: {
        query: { productId },
      },
    }) => {
      const product = await db("products").where({ id: productId })

      throwIfNotFound(product)

      await db("products").delete().where({ id: productId })

      res.send(product)
    },
  ],
})

export default handle
