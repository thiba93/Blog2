import knexfile from "@@/knexfile.mjs"
import { ValidationError, boolean, object, string } from "yup"

const validationSchema = object({
  isDevMode: boolean().default(false),
  db: object({
    client: string().oneOf(["pg"]).required(),
    connection: string().required(),
  }).noUnknown(),
})
let config = null

try {
  config = validationSchema.validateSync(
    {
      isDevMode: process.env.NODE_ENV === "development",
      db: knexfile,
    },
    { abortEarly: false },
  )
} catch (err) {
  if (!(err instanceof ValidationError)) {
    throw err
  }

  // eslint-disable-next-line no-console
  console.error(
    `Error: Missing values for config\n\t${err.errors.join("\n\t")}`.trim(),
  )
  process.exit(1)
}

export default config
