export const up = async (db) => {
    await db.schema.createTable("comments", (table) => {
      table.increments("commentId").primary()
      table.integer("productId").notNullable().references("id").inTable("products")
      table.integer("userId").notNullable().references("id").inTable("users")
      table.text("comment")
    })
  }
  export const down = async (db) => {
    await db.schema.dropTableIfExists("comments")
  }
  