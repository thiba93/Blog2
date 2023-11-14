import { merge } from "@corex/deepmerge"
import { writeFile } from "node:fs/promises"

const writeDatabase = (db, newDb) =>
  writeFile("./db.json", JSON.stringify(!newDb ? db : merge([db, newDb])))

export default writeDatabase
