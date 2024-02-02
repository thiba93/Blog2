export const up = async (db) => {
    await db.schema.alterTable('users', (table) => {
      table.integer('postCount').defaultTo(0);
      table.integer('commentCount').defaultTo(0);
      table.integer('profileView').defaultTo(0);
    });
  };
  
  export const down = async (db) => {
    await db.schema.alterTable('users', (table) => {
      table.dropColumn('postCount');
      table.dropColumn('commentCount');
      table.dropColumn('profileView');
    });
  };
  