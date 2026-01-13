import SQLite, {
  SQLiteDatabase,
  ResultSet,
} from 'react-native-sqlite-storage';

// Enable promise-based API
SQLite.enablePromise(true);

const DATABASE_NAME = 'kentectraining.db';

let db: SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabase({
    name: DATABASE_NAME,
    location: 'default',
  });
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
  }
};

export const executeSql = async (
  sql: string,
  params: (string | number | null)[] = [],
): Promise<ResultSet> => {
  const database = await getDatabase();
  const [result] = await database.executeSql(sql, params);
  return result;
};

export const createTable = async (
  tableName: string,
  columns: string,
): Promise<void> => {
  await executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
};

export const dropTable = async (tableName: string): Promise<void> => {
  await executeSql(`DROP TABLE IF EXISTS ${tableName}`);
};

export const insert = async (
  tableName: string,
  data: Record<string, string | number | null>,
): Promise<number> => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');

  const result = await executeSql(
    `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
    values,
  );
  return result.insertId;
};

export const update = async (
  tableName: string,
  data: Record<string, string | number | null>,
  whereClause: string,
  whereArgs: (string | number | null)[] = [],
): Promise<number> => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map(key => `${key} = ?`).join(', ');

  const result = await executeSql(
    `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`,
    [...values, ...whereArgs],
  );
  return result.rowsAffected;
};

export const deleteRow = async (
  tableName: string,
  whereClause: string,
  whereArgs: (string | number | null)[] = [],
): Promise<number> => {
  const result = await executeSql(
    `DELETE FROM ${tableName} WHERE ${whereClause}`,
    whereArgs,
  );
  return result.rowsAffected;
};

export const query = async <T>(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<T[]> => {
  const result = await executeSql(sql, params);
  const rows: T[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    rows.push(result.rows.item(i));
  }
  return rows;
};

export const queryOne = async <T>(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<T | null> => {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
};
