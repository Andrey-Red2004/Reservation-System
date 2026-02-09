// Ver todas las reservas en la base de datos
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

try {
  const reservations = db.prepare(`SELECT id, userName, status FROM reservations`).all();
  console.log('📋 Reservas en la base de datos:');
  console.table(reservations);
} catch (err: any) {
  console.error('❌ Error:', err.message);
} finally {
  db.close();
}
