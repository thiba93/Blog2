import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import hashPassword from "@/db/hashPassword"
import { emailValidator, passwordValidator } from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      body: {
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    async ({
      send,
      input: {
        body: { email, password },
      },
      models: { UserModel },
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (user) {
        send(true)

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await UserModel.query().insert({
        email,
        passwordHash,
        passwordSalt,
      })

      send(true)
    },
  ],
})

export default handle
