import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import hashPassword from "@/db/hashPassword"
import { AVERAGE_PASSWORD_HASHING_DURATION } from "@/pages/api/constants"
import sleep from "@/utils/sleep"
import { emailValidator, passwordValidator,userIdValidator } from "@/utils/validators"
import { pageValidator } from "@/utils/validators"
import auth from "@/api/middlewares/auth"

const handle = mw({
  GET: [
    validate({
      query: {
        page: pageValidator.required(),
      },
    }),
    async ({ send, input: { query: { page } }, models: { UserModel } }) => {
      const query = UserModel.query();
      const users = await query.page(page);
      const [{ count }] = await query.clone().count();

      send(users, { count });
    },
  ],
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
        await sleep(AVERAGE_PASSWORD_HASHING_DURATION)

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
  DELETE: [
    validate({
      query: {
        userId: userIdValidator.required(), // Assurez-vous d'avoir un validateur pour l'ID de l'utilisateur
      },
    }),
    async ({ send, input: { query: { userId } }, models: { UserModel } }) => {
      await UserModel.query().deleteById(userId);
      send({ message: 'User deleted successfully' });
    },
  ],
  // Ajoutez cette méthode PUT dans votre gestionnaire existant dans src/pages/api/users.js

PUT: [
  validate({
    query: {
      userId: userIdValidator.required(),
    },
    body: {
      email: emailValidator, // Assurez-vous que ces validateurs existent et sont appropriés
      password: passwordValidator, // Vous voudrez peut-être hasher le mot de passe avant de le stocker
      // Ajoutez des validateurs pour d'autres champs si nécessaire
    },
  }),
  async ({ send, input: { query: { userId }, body }, models: { UserModel } }) => {
    const updatedUser = await UserModel.query().patchAndFetchById(userId, body);
    send(updatedUser);
  },
],

});


export default handle
