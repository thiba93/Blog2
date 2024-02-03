export const up = async (db) => {
    await db.schema.alterTable("users", (table) => {
      table.text("pseudo").unique()
    })
  }
  
  export const down = async (db) => {
    await db.schema.alterTable("users", (table) => {
      table.dropColumn("pseudo")
    })
  }
  