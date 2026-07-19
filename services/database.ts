import * as SQLite from 'expo-sqlite';
import { Sale } from '../types/index';

const DATABASE_NAME = 'oxygen_tank.db';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        companyName TEXT NOT NULL,
        saleDate TEXT NOT NULL,
        productName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        saleAmount REAL NOT NULL,
        paymentMethod TEXT NOT NULL,
        signature TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_saleDate ON sales(saleDate);
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database init error:', error);
  }
};

export const insertSale = async (sale: Sale) => {
  if (!db) await initDatabase();
  try {
    await db!.runAsync(
      `INSERT INTO sales (id, companyName, saleDate, productName, quantity, saleAmount, paymentMethod, signature, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sale.id,
        sale.companyName,
        sale.saleDate,
        sale.productName,
        sale.quantity,
        sale.saleAmount,
        sale.paymentMethod,
        sale.signature || '',
        sale.createdAt,
        sale.updatedAt,
      ]
    );
    return true;
  } catch (error) {
    console.error('Insert sale error:', error);
    return false;
  }
};

export const updateSale = async (id: string, sale: Partial<Sale>) => {
  if (!db) await initDatabase();
  try {
    const updates = Object.keys(sale)
      .filter((key) => key !== 'id')
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.keys(sale)
      .filter((key) => key !== 'id')
      .map((key) => (sale as any)[key]);

    await db!.runAsync(
      `UPDATE sales SET ${updates}, updatedAt = ? WHERE id = ?`,
      [...values, new Date().toISOString(), id]
    );
    return true;
  } catch (error) {
    console.error('Update sale error:', error);
    return false;
  }
};

export const deleteSale = async (id: string) => {
  if (!db) await initDatabase();
  try {
    await db!.runAsync('DELETE FROM sales WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Delete sale error:', error);
    return false;
  }
};

export const getAllSales = async (): Promise<Sale[]> => {
  if (!db) await initDatabase();
  try {
    const result = await db!.getAllAsync('SELECT * FROM sales ORDER BY saleDate DESC');
    return result as Sale[];
  } catch (error) {
    console.error('Get all sales error:', error);
    return [];
  }
};

export const getSalesByDate = async (date: string): Promise<Sale[]> => {
  if (!db) await initDatabase();
  try {
    const result = await db!.getAllAsync(
      'SELECT * FROM sales WHERE saleDate = ? ORDER BY createdAt DESC',
      [date]
    );
    return result as Sale[];
  } catch (error) {
    console.error('Get sales by date error:', error);
    return [];
  }
};

export const getSaleById = async (id: string): Promise<Sale | null> => {
  if (!db) await initDatabase();
  try {
    const result = await db!.getFirstAsync(
      'SELECT * FROM sales WHERE id = ?',
      [id]
    );
    return (result as Sale) || null;
  } catch (error) {
    console.error('Get sale by id error:', error);
    return null;
  }
};
