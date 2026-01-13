# SQLite Setup for Kentec Training App

## Packages Installed

```bash
npm install --save react-native-sqlite-storage
npm install --save-dev @types/react-native-sqlite-storage
```

**Versions installed:**
- `react-native-sqlite-storage@6.0.1`
- `@types/react-native-sqlite-storage@6.0.5`

## Configuration Files

### react-native.config.js

Created at project root to enable native SQLite with FTS5 support on Android:

```javascript
module.exports = {
  dependencies: {
    'react-native-sqlite-storage': {
      platforms: {
        android: {
          sourceDir:
            '../node_modules/react-native-sqlite-storage/platforms/android-native',
          packageImportPath: 'import io.liteglue.SQLitePluginPackage;',
          packageInstance: 'new SQLitePluginPackage()',
        },
      },
    },
  },
};
```

## Database Service

Created `src/services/database.ts` with the following helper functions:

| Function | Description |
|----------|-------------|
| `getDatabase()` | Opens/returns the singleton database connection |
| `closeDatabase()` | Closes the database connection |
| `executeSql(sql, params)` | Executes raw SQL queries |
| `createTable(tableName, columns)` | Creates a table if it doesn't exist |
| `dropTable(tableName)` | Drops a table if it exists |
| `insert(tableName, data)` | Inserts a record, returns insertId |
| `update(tableName, data, whereClause, whereArgs)` | Updates records |
| `deleteRow(tableName, whereClause, whereArgs)` | Deletes records |
| `query<T>(sql, params)` | Returns array of typed results |
| `queryOne<T>(sql, params)` | Returns single result or null |

## Platform-Specific Setup

### iOS

Run from project root:
```bash
cd ios && pod install && cd ..
```

### Android

Auto-linking handles configuration. Rebuild with:
```bash
npm run android
```

## Usage Example

```typescript
import {
  getDatabase,
  createTable,
  insert,
  query,
  closeDatabase,
} from './src/services/database';

// Initialize database and create table
await createTable(
  'users',
  'id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT'
);

// Insert data
const userId = await insert('users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Query data
const users = await query<{ id: number; name: string; email: string }>(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);

// Close when done
await closeDatabase();
```

## Database Location

The database file `kentectraining.db` is stored in the default location:
- **iOS**: Library directory
- **Android**: App's private data directory

## References

- [GitHub - react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage)
- [npm - react-native-sqlite-storage](https://www.npmjs.com/package/react-native-sqlite-storage)
