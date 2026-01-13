import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

// Generic type for items stored in DB
export interface DbItem {
  id: number;
  data: string; // JSON string
}

const TABLE_NAME = 'content_JSON';

// Get database connection
export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return openDatabase({ name: 'kentec-training.db', location: 'default' });
};

// Create table if not exists
export const createTable = async (db: SQLiteDatabase): Promise<void> => {
  const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL
  );`;
  await db.executeSql(query);
};

// CREATE - Insert single item
export const insertItem = async (db: SQLiteDatabase, data: object): Promise<number> => {
  const jsonString = JSON.stringify(data);
  const query = `INSERT INTO ${TABLE_NAME} (data) VALUES (?);`;
  const result = await db.executeSql(query, [jsonString]);
  return result[0].insertId;
};

// CREATE - Insert multiple items (from API response)
export const insertItems = async (db: SQLiteDatabase, items: object[]): Promise<void> => {
  for (const item of items) {
    await insertItem(db, item);
  }
};

// READ - Get all items
export const getAllItems = async <T>(db: SQLiteDatabase): Promise<T[]> => {
  const results = await db.executeSql(`SELECT id, data FROM ${TABLE_NAME};`);
  const items: T[] = [];

  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      items.push({ id: row.id, ...JSON.parse(row.data) } as T);
    }
  });

  return items;
};

// READ - Get single item by ID
export const getItemById = async <T>(db: SQLiteDatabase, id: number): Promise<T | null> => {
  const results = await db.executeSql(`SELECT id, data FROM ${TABLE_NAME} WHERE id = ?;`, [id]);

  if (results[0].rows.length > 0) {
    const row = results[0].rows.item(0);
    return { id: row.id, ...JSON.parse(row.data) } as T;
  }

  return null;
};

// UPDATE - Update item by ID
export const updateItem = async (db: SQLiteDatabase, id: number, data: object): Promise<void> => {
  const jsonString = JSON.stringify(data);
  await db.executeSql(`UPDATE ${TABLE_NAME} SET data = ? WHERE id = ?;`, [jsonString, id]);
};

// DELETE - Delete item by ID
export const deleteItem = async (db: SQLiteDatabase, id: number): Promise<void> => {
  await db.executeSql(`DELETE FROM ${TABLE_NAME} WHERE id = ?;`, [id]);
};

// DELETE - Clear all items
export const clearAllItems = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql(`DELETE FROM ${TABLE_NAME};`);
};

// DROP - Delete table completely
export const dropTable = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql(`DROP TABLE IF EXISTS ${TABLE_NAME};`);
};
