import { HttpNotFoundError } from "@/api/errors"
import mw from "@/api/middlewares/mw"
import readDatabase from "@/db/readDatabase"
import writeDatabase from "@/db/writeDatabase"

const throwIfNotFound = (resource) => {
  if (!resource) {
    throw new HttpNotFoundError()
  }
}
const handle = mw({
  GET: [
    async (req, res) => {
      const { productId } = req.query
      const db = await readDatabase()
      const product = db[productId]

      throwIfNotFound(product)

      res.send(product)
    },
  ],
  PATCH: [
    async (req, res) => {
      const { productId } = req.query
      const input = req.body
      const db = await readDatabase()
      const product = db[productId]

      throwIfNotFound(product)

      const updatedProduct = { ...product, ...input }

      await writeDatabase(db, { [updatedProduct.id]: updatedProduct })

      res.send(updatedProduct)
    },
  ],
  DELETE: [
    async (req, res) => {
      const { productId } = req.query
      const db = await readDatabase()
      const { [productId]: product, ...otherProducts } = db

      throwIfNotFound(product)

      await writeDatabase(JSON.stringify(otherProducts))

      res.send(product)
    },
  ],
})

export default handle
