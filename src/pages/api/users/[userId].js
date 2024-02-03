import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        userId: idValidator.required(),
      },
    }),
    async ({
      send,
      input: {
        query: { userId },
      },
      models: { UserModel },
    }) => {
      const user = await UserModel.query().findById(userId).throwIfNotFound()

      send(user)
    },
  ],
  DELETE: [
    validate({
      query: {
        userId: idValidator.required(),
      },
    }),
    async ({ send, input: { query: { userId } }, models: { UserModel } }) => {
      await UserModel.query().deleteById(userId)
      send({ success: true, message: "User deleted successfully" })
    },
  ],
  
})

export default handle
