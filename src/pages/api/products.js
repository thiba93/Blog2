import mw from "@/api/middlewares/mw"
import validate from "@/api/middlewares/validate"
import {
  descriptionValidator,
  idValidator,
  nameValidator,
} from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      name: nameValidator.required(),
      description: descriptionValidator.required(),
      categoryId: idValidator.required(),
    }),
    async ({ req, res, db }) => {
      const input = req.body
      const [newProduct] = await db("products").insert(input).returning("*")

      res.send(newProduct)
    },
  ],
  GET: [
    async ({ res, db }) => {
      const products = await db("products")

      res.send(products)
    },
  ],
})

export default handle
