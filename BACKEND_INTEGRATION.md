# Sistema de Reservas - Conectado al Backend

## ✅ Cambios realizados

### 1. Backend creado (Express + SQLite + TypeScript)
- API REST en `http://localhost:3000/api/bookings`
- Base de datos SQLite (`backend/database.sqlite`)
- Endpoints completos para CRUD de reservas

### 2. Frontend conectado al backend
- Nuevo servicio API: `src/services/api.ts`
- Context actualizado para usar HTTP en vez de localStorage
- Todas las funciones ahora son **asíncronas** (`async/await`)

---

## 🚀 Cómo ejecutar

### Terminal 1: Backend
```powershell
cd backend
npm install          # Solo la primera vez
npm run dev          # Arranca en http://localhost:3000
```

### Terminal 2: Frontend
```powershell
npm run dev          # Arranca en http://localhost:5173
```

---

## 📡 Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/bookings` | Listar reservas (query: `?status=confirmed&date=2026-01-15`) |
| `GET` | `/api/bookings/:id` | Obtener una reserva |
| `POST` | `/api/bookings` | Crear reserva |
| `PUT` | `/api/bookings/:id` | Actualizar reserva |
| `DELETE` | `/api/bookings/:id` | Cancelar (soft delete) |
| `DELETE` | `/api/bookings/:id?hardDelete=true` | Eliminar permanentemente |

---

## 🧪 Probar la API con cURL

### Crear una reserva:
```powershell
curl -X POST http://localhost:3000/api/bookings `
  -H "Content-Type: application/json" `
  -d '{
    \"userName\": \"Juan Pérez\",
    \"userEmail\": \"juan@example.com\",
    \"start\": \"2026-01-20T10:00:00.000Z\",
    \"end\": \"2026-01-20T10:30:00.000Z\"
  }'
```

### Listar todas las reservas:
```powershell
curl http://localhost:3000/api/bookings
```

### Listar solo confirmadas:
```powershell
curl "http://localhost:3000/api/bookings?status=confirmed"
```

---

## 🔄 Migrar datos existentes (opcional)

Si tenías reservas en localStorage, puedes migrarlas manualmente:

1. Abre la consola del navegador (F12)
2. Ejecuta:
```javascript
const old = JSON.parse(localStorage.getItem('poc_bookings_v1') || '[]');
console.log(old); // Copia estos datos
```
3. Crea las reservas una por una con el formulario o POST a la API

---

## 📁 Estructura del proyecto

```
poc-react-learn/
├── backend/                    ← Servidor API
│   ├── src/
│   │   ├── index.ts           ← Entry point
│   │   ├── database.ts        ← SQLite setup
│   │   ├── types.ts           ← Tipos compartidos
│   │   └── routes/
│   │       └── bookings.ts    ← Endpoints de reservas
│   ├── database.sqlite        ← Base de datos (se crea automáticamente)
│   └── package.json
│
├── src/                        ← Frontend React
│   ├── services/
│   │   └── api.ts             ← ⭐ NUEVO: Cliente HTTP
│   ├── state/
│   │   └── bookingsContext.tsx ← ⭐ MODIFICADO: Usa API en vez de localStorage
│   ├── components/
│   │   ├── NewBookingForm.tsx  ← ⭐ MODIFICADO: async/await
│   │   ├── EditBookingForm.tsx ← ⭐ MODIFICADO: async/await
│   │   └── BookingList.tsx     ← ⭐ MODIFICADO: async/await
│   └── ...
```

---

## 🎯 Próximos pasos

1. ✅ Backend funcionando
2. ✅ Frontend conectado
3. ⏭️ Crear panel de administración (nuevo proyecto React)
4. ⏭️ Agregar autenticación (JWT)
5. ⏭️ Deploy (backend en Railway/Render, frontend en Vercel)

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Revisa la consola del navegador (F12 → Console)
- Asegúrate de que CORS esté habilitado (ya está configurado)

### Las reservas no aparecen
- La base de datos inicia vacía
- Crea una nueva reserva con el formulario
- Verifica en `backend/database.sqlite` con un visor SQLite

### Errores de TypeScript
- Ejecuta `npm install` en ambas carpetas (backend y raíz)
- Reinicia el servidor Vite (Ctrl+C → `npm run dev`)
