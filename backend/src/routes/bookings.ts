import { Router, Request, Response } from 'express';
import { db } from '../database';
import type { Reservation, CreateReservationDTO, UpdateReservationDTO } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/bookings - Listar todas las reservas
router.get('/', (req: Request, res: Response) => {
  const { status, date } = req.query;
  
  let query = 'SELECT * FROM reservations';
  const params: any[] = [];
  
  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  
  if (date) {
    const datePrefix = status ? ' AND' : ' WHERE';
    query += `${datePrefix} DATE(start) = DATE(?)`;
    params.push(date);
  }
  
  query += ' ORDER BY start ASC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/bookings/:id - Obtener una reserva por ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM reservations WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json(row);
  });
});

// POST /api/bookings - Crear nueva reserva
router.post('/', (req: Request, res: Response) => {
  const data: CreateReservationDTO = req.body;
  
  // Validaciones básicas
  if (!data.userName || !data.start || !data.end) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  
  if (new Date(data.end) <= new Date(data.start)) {
    return res.status(400).json({ error: 'Fin debe ser posterior al inicio' });
  }
  
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const query = `
    INSERT INTO reservations (id, userName, userEmail, start, end, notes, resourceId, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `;
  
  db.run(
    query,
    [id, data.userName, data.userEmail || null, data.start, data.end, data.notes || null, data.resourceId || null, now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Retornar la reserva creada
      db.get('SELECT * FROM reservations WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
});

// PUT /api/bookings/:id - Actualizar reserva
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateReservationDTO = req.body;
  
  const updates: string[] = [];
  const params: any[] = [];
  
  if (data.userName !== undefined) {
    updates.push('userName = ?');
    params.push(data.userName);
  }
  if (data.userEmail !== undefined) {
    updates.push('userEmail = ?');
    params.push(data.userEmail);
  }
  if (data.start !== undefined) {
    updates.push('start = ?');
    params.push(data.start);
  }
  if (data.end !== undefined) {
    updates.push('end = ?');
    params.push(data.end);
  }
  if (data.notes !== undefined) {
    updates.push('notes = ?');
    params.push(data.notes);
  }
  if (data.status !== undefined) {
    updates.push('status = ?');
    params.push(data.status);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }
  
  updates.push('updatedAt = ?');
  params.push(new Date().toISOString());
  params.push(id);
  
  const query = `UPDATE reservations SET ${updates.join(', ')} WHERE id = ?`;
  
  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    // Retornar la reserva actualizada
    db.get('SELECT * FROM reservations WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// DELETE /api/bookings/:id - Cancelar/Eliminar reserva
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { hardDelete } = req.query;
  
  if (hardDelete === 'true') {
    // Eliminar permanentemente
    db.run('DELETE FROM reservations WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      res.json({ message: 'Reserva eliminada permanentemente' });
    });
  } else {
    // Soft delete (cambiar status a cancelled)
    db.run(
      'UPDATE reservations SET status = ?, updatedAt = ? WHERE id = ?',
      ['cancelled', new Date().toISOString(), id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva cancelada' });
      }
    );
  }
});

export default router;
