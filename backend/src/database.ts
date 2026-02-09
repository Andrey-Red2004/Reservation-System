import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || './database.sqlite';

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log(' Conectado a SQLite database');
  }
});

// Crear tabla de reservas si no existe
export const initDatabase = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      userName TEXT NOT NULL,
      userEmail TEXT,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed',
      notes TEXT,
      resourceId TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creando tabla:', err);
    } else {
      console.log(' Tabla reservations lista');
    }
  });
};
