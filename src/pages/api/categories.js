import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { nameValidator, pageValidator } from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      body: {
        name: nameValidator.required(),
      },
    }),
    async ({ res, input: { body }, models: { CategoryModel } }) => {
      const newCategory = await CategoryModel.query().insertAndFetch(body)

      res.send(newCategory)
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
      models: { CategoryModel },
    }) => {
      const query = CategoryModel.query()
      const categories = await query.clone().page(page)
      const [{ count }] = await query.clone().count()

      res.send({
        result: categories,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handle
