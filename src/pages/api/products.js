import throwIfDuplicate from "@/api/helpers/throwIfDuplicate"
import mw from "@/api/middlewares/mw"
import validate from "@/api/middlewares/validate"
import readDatabase from "@/db/readDatabase"
import writeDatabase from "@/db/writeDatabase"
import { descriptionValidator, nameValidator } from "@/utils/validators"

const handle = mw({
  POST: [
    validate({
      name: nameValidator,
      description: descriptionValidator,
    }),
    async (req, res) => {
      const input = req.body
      const db = await readDatabase()
      const id = Math.max(...Object.keys(db), 0) + 1
      const newProduct = { id, ...input }

      throwIfDuplicate(db, newProduct, "name")

      await writeDatabase(db, { [id]: newProduct })

      res.send(newProduct)
    },
  ],
  GET: [
    async (req, res) => {
      const db = await readDatabase()

      setTimeout(() => res.send(Object.values(db)), 3000)
    },
  ],
})

export default handle
