export const up = async (db) => {
    await db.schema.createTable('comment', (table) => {
      table.increments('commentId').primary();
      table.integer('productId').notNullable().references('id').inTable('products'); // Correction ici
      table.integer('userId').notNullable().references('id').inTable('users'); // Assurez-vous que c'est correct également
      table.text('comments');
    });
  };
  
  export const down = async (db) => {
    await db.schema.dropTableIfExists('comment');
  };
  