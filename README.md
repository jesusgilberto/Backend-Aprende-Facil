# Backend Aprende Facil

Pequeño backend Express + MongoDB organizado por módulos (feature-based).

Instrucciones rápidas:

1. Copia `.env.example` a `.env` y ajusta las variables.

2. Instala dependencias:

```bash
npm install
```

3. En desarrollo:

```bash
npm run dev
```

Rutas iniciales:

-   `POST /api/auth/login` -> login (body: `{ identifier?, email?, username?, password }`)
-   `POST /api/users` -> register (body: `{ username, firstName, lastName, age?, email, password }`)
-   `GET /api/users/me` -> perfil (require header `Authorization: Bearer <token>`)

Notas:

-   Para `login` puedes enviar `identifier` con username o email, o usar `email` o `username` directamente junto con `password`.
-   `age` es opcional en el registro.
