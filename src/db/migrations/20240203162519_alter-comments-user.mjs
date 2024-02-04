export const up = async (db) => {
    await db.schema.alterTable("products", (table) => {
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
    })
  }
  
  export const down = async (db) => {
    await db.schema.alterTable("products", (table) => {
      table.dropColumn("userId")
    })
  }
  