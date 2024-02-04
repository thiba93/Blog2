import mw from "@/api/mw"
import validate from "@/api/middlewares/validate"
import { textValidator, userIdValidator } from "@/utils/validators"
const handle = mw({
  POST: [
    validate({
      body: {
        text: textValidator.required(),
        userId: userIdValidator.required(),
      },
    }),
    async ({ send, input: { body }, models: { CommentModel } }) => {
      const newComment = await CommentModel.query().insertAndFetch(body)
      send(newComment)
    },
  ],
})

export default handle
