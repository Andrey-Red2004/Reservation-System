// Script temporal para cambiar todas las reservas confirmadas a pendientes
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

try {
  const result = db.prepare(`UPDATE reservations SET status = 'pending' WHERE status = 'confirmed'`).run();
  console.log(`✅ ${result.changes} reservas cambiadas a estado 'pending'`);
} catch (err: any) {
  console.error('❌ Error:', err.message);
  process.exit(1);
} finally {
  db.close();
}
