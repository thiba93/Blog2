export const up = async (db) => {
  await db.schema.alterTable("users", (table) => {
    table.text("role").defaultTo("user")
    table.text("isEnabled").defaultTo("enabled")
  })
}

export const down = async (db) => {
  await db.schema.alterTable("users", (table) => {
    table.dropColumn("role")
    table.dropColumn("isEnabled")
  })
}
