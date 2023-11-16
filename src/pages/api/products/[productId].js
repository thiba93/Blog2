import throwIfNotFound from "@/api/helpers/throwIfNotFound"
import mw from "@/api/middlewares/mw"
import validate from "@/api/middlewares/validate"
import { descriptionValidator, nameValidator } from "@/utils/validators"

const handle = mw({
  GET: [
    async ({ req, res }) => {
      const { productId } = req.query
      const product = db[productId]

      throwIfNotFound(product)

      res.send(product)
    },
  ],
  PATCH: [
    validate({
      name: nameValidator,
      description: descriptionValidator,
    }),
    async ({ req, res }) => {
      const { productId } = req.query
      const input = req.body

      throwIfNotFound(product)

      const updatedProduct = { ...product, ...input }

      res.send(updatedProduct)
    },
  ],
  DELETE: [
    async ({ req, res }) => {
      const { productId } = req.query
      const db = await ()
      const { [productId]: product, ...otherProducts } = db
      throwIfNotFound(product)

      res.send(product)
    },
  ],
})

export default handle
