import mw from "@/api/middlewares/mw"
import validate from "@/api/middlewares/validate"
import {
  descriptionValidator,
  idValidator,
  nameValidator,
  pageValidator,
} from "@/utils/validators"
import webConfig from "@/web/config"

const handle = mw({
  POST: [
    validate({
      body: {
        name: nameValidator.required(),
        description: descriptionValidator.required(),
        categoryId: idValidator.required(),
      },
    }),
    async ({ res, input: { body }, models: { ProductModel } }) => {
      const newProduct = await ProductModel.query().insertAndFetch(body)

      res.send(newProduct)
    },
  ],
  GET: [
    validate({
      query: {
        page: pageValidator.required(),
      },
    }),
    async ({
      res,
      input: {
        query: { page },
      },
      models: { ProductModel },
    }) => {
      const query = ProductModel.query()
      const products = await query
        .clone()
        .withGraphFetched("category")
        .limit(webConfig.pagination.limit)
        .offset((page - 1) * webConfig.pagination.limit)
      const [{ count }] = await query.clone().count()

      res.send({
        result: products,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handle
