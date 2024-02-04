import mw from "@/api/mw"
import auth from "@/api/middlewares/auth"
import validate from "@/api/middlewares/validate"
import { textValidator } from "@/utils/validators"
const handle = mw({
  POST: [
    auth, 
    validate({
      body: {
        comment: textValidator.required(),
      },
    }),
    async ({ send, input: { body }, models: { CommentModel }, userId,productId}) => {
      const newComment = await CommentModel.query().insertAndFetch({
        ...body,
        userId,
        productId
      })

      send(newComment)
    },
  ],
})

export default handle