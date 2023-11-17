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
      body: {
        name: nameValidator.required(),
        description: descriptionValidator.required(),
        categoryId: idValidator.required(),
      },
    }),
    async ({ res, db, input: { body } }) => {
      const [newProduct] = await db("products").insert(body).returning("*")

      res.send(newProduct)
    },
  ],
  GET: [
    validate({
      page: pageValidator,
    }),
    async ({ res, db }) => {
      const products = await db("products")

      res.send(products)
    },
  ],
})

export default handle
