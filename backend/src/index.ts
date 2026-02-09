import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database';
import bookingsRouter from './routes/bookings';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear JSON en el body

// Inicializar base de datos
initDatabase();

// Rutas
app.get('/', (req: Request, res: Response) => {
  res.json({ message: ' Booking API funcionando correctamente' });
});

app.use('/api/bookings', bookingsRouter);

// Manejo de errores 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
