import config from "@/api/config"
import webConfig from "@/web/config"
import { HttpAuthenticationError } from "@/api/errors"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import hashPassword from "@/db/hashPassword"
import { emailValidator } from "@/utils/validators"
import jsonwebtoken from "jsonwebtoken"
import { string } from "yup"
import { NextResponse } from "next/server"
import ms from "ms"
import genCookies from "@/api/utils/genCookies"

const handle = mw({
  POST: [
    validate({
      body: {
        email: emailValidator.required(),
        password: string().required(),
      },
    }),
    async ({
      send,
      res,
      input: {
        body: { email, password },
      },
      models: { UserModel },
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (!user) {
        throw new HttpAuthenticationError()
      }

      const [passwordHash] = await hashPassword(password, user.passwordSalt)

      if (passwordHash !== user.passwordHash) {
        throw new HttpAuthenticationError()
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            session: {
              user: {
                id: user.id,
              },
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn },
      )

      res.setHeader(
        "set-cookie",
        genCookies({
          name: webConfig.security.session.jwtKey,
          value: jwt,
          expires: ms(config.security.jwt.expiresIn),
          path: "/",
          sameSite: "strict",
        }),
      )
      send(true)
    },
  ],
})

export default handle
