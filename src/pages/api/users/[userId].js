import validate from "@/api/middlewares/validate";
import mw from "@/api/mw";
import { idValidator } from "@/utils/validators";
import { emailValidator } from "@/utils/validators"; 
import { passwordValidator } from "@/utils/validators";

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
      const user = await UserModel.query()
        .findById(userId)
        .throwIfNotFound();

      send(user);
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
        // Ajoutez ici d'autres validateurs pour les champs que vous souhaitez mettre à jour
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
      // Assurez-vous de traiter le mot de passe correctement (hashage) avant de le stocker si le mot de passe est fourni
      if (body.password) {
        // Hashage du mot de passe ici
      }

      const updatedUser = await UserModel.query()
        .patchAndFetchById(userId, body)
        .throwIfNotFound();

      send(updatedUser);
    },
  ],
});

export default handle;
