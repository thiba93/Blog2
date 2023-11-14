import { readFile } from "node:fs/promises"

const readDatabase = async () =>
  JSON.parse(await readFile("./db.json", { encoding: "utf-8" }))

export default readDatabase
