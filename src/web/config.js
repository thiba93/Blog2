import { ValidationError, number, object } from "yup"

const validationSchema = object({
  pagination: object({
    limit: number().max(20).required(),
    maxDisplayed: number().max(5).required(),
  }).noUnknown(),
})
let config = null

try {
  config = validationSchema.validateSync(
    {
      pagination: {
        limit: 5,
        maxDisplayed: 3,
      },
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
