// Script para ver el contenido de la base de datos
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('❌ Error al conectar:', err);
    process.exit(1);
  }
  console.log('✅ Conectado a la base de datos\n');
});

db.all('SELECT * FROM reservations', [], (err, rows) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }

  console.log(`📊 Total de reservas: ${rows.length}\n`);
  
  if (rows.length === 0) {
    console.log('📭 No hay reservas en la base de datos');
  } else {
    rows.forEach((row: any, index: number) => {
      console.log(`\n───── Reserva ${index + 1} ─────`);
      console.log(`ID:        ${row.id}`);
      console.log(`Nombre:    ${row.userName}`);
      console.log(`Email:     ${row.userEmail || 'N/A'}`);
      console.log(`Inicio:    ${new Date(row.start).toLocaleString('es-CR')}`);
      console.log(`Fin:       ${new Date(row.end).toLocaleString('es-CR')}`);
      console.log(`Estado:    ${row.status}`);
      console.log(`Creado:    ${new Date(row.createdAt).toLocaleString('es-CR')}`);
    });
  }

  db.close();
});
