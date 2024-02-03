import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
  emailValidator,
  passwordValidator,
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
  PUT: [
    validate({
      query: {
        userId: idValidator.required(),
      },
      body: {
        email: emailValidator.optional(),
        password: passwordValidator.optional(),
      },
    }),
    async ({
      send,
      input: {
        query: { userId },
        body,
      },
      models: { UserModel },
    }) => {
      if (body.password) {
        // Compare this snippet from src/pages/api/users/%5BuserId%5D.js:
      }

      const updatedUser = await UserModel.query()
        .patchAndFetchById(userId, body)
        .throwIfNotFound()

      send(updatedUser)
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
