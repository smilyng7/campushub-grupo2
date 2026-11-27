# Portal público (Next.js)

Portal de CampusHub creado con Next.js App Router. El catálogo, los detalles de
laboratorio y la consulta de reservas se renderizan en el servidor con datos del
API compartido.

## Requisitos

- Node.js y npm
- API de desarrollo (`api-mock`) ejecutándose en `http://localhost:3000`

Inicia el API desde `api-mock` con `npm install` y `npm start`. Luego, desde esta
carpeta, instala dependencias con `npm install` y ejecuta:

```bash
npm run dev
```

El portal queda en `http://localhost:3001`.

## Rutas públicas

- `/laboratorios`: catálogo de laboratorios actualizado en cada petición.
- `/laboratorios/[id]`: información del laboratorio y reservas aprobadas de la
  semana en curso (lunes a domingo).
- `/reserva/[codigo]`: estado de una reserva, por ejemplo `/reserva/RES-0001`.
  Un código inexistente devuelve una página 404.

Cada ruta incluye título y descripción SEO renderizados en el HTML.
