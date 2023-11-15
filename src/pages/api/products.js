import throwIfDuplicate from "@/api/helpers/throwIfDuplicate"
import mw from "@/api/middlewares/mw"
import readDatabase from "@/db/readDatabase"
import writeDatabase from "@/db/writeDatabase"

const handle = mw({
  POST: [
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

      res.send(db)
    },
  ],
})

export default handle
