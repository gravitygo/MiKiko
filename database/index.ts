import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from './schema';

const DATABASE_NAME = 'mikiko.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(CREATE_TABLES);
  await seedDefaultData(database);
}

async function seedDefaultData(database: SQLite.SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();

  const existingCategories = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories WHERE is_default = 1'
  );

  if (!existingCategories || existingCategories.count === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await database.runAsync(
        `INSERT OR IGNORE INTO categories (id, name, icon, color, type, budget_amount, is_default, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, 1, ?, ?)`,
        [cat.id, cat.name, cat.icon, cat.color, cat.type, now, now]
      );
    }
  }

  const existingAccounts = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM accounts'
  );

  if (!existingAccounts || existingAccounts.count === 0) {
    for (const acc of DEFAULT_ACCOUNTS) {
      await database.runAsync(
        `INSERT OR IGNORE INTO accounts (id, name, type, balance, icon, color, is_default, created_at, updated_at)
         VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?)`,
        [acc.id, acc.name, acc.type, acc.icon, acc.color, acc.isDefault ? 1 : 0, now, now]
      );
    }
  }
}

export async function closeDatabase(): Promise<void> {
  if (!db) return;
  await db.closeAsync();
  db = null;
}

export { CREATE_TABLES, DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from './schema';

