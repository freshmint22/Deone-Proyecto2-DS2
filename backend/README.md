# Backend — API & testing

This document describes the authentication endpoints implemented for the student registration HU and how to run the backend tests locally.

## Purpose

This backend exposes endpoints to register and login users. The student registration HU requires that only institutional emails ending in `@correounivalle.edu.co` are allowed to register.

## Endpoints

Base path: `/api/auth`

- POST `/register`
  - Description: Register a new user (student, commerce, admin). Only institutional emails are allowed.
  - Body (JSON):
    - name: string (required)
    - email: string (required, must be `@correounivalle.edu.co`)
    - password: string (required)
    - role: string (optional, one of `estudiante`, `comercio`, `admin`; defaults to `estudiante`)
  - Success response (201):
    - JSON body contains `user` (without password) and `token` (JWT)
    - Example:
      {
        "message": "Usuario registrado exitosamente",
        "user": { "_id": "<id>", "name": "Test User", "email": "test.user@correounivalle.edu.co", "role": "estudiante" },
        "token": "<jwt>"
      }
  - Common error responses:
    - 400 Bad Request: missing fields or non-institutional email
    - 409 Conflict: email already registered

- POST `/login`
  - Description: Log in with email and password.
  - Body (JSON):
    - email: string (required)
    - password: string (required)
  - Success response (200): returns `user` (without password) and `token`.
  - Common error responses:
    - 400 Bad Request: missing fields
    - 401 Unauthorized: invalid credentials

  - Ejemplo (Respuesta exitosa 200):
    # Backend — DeOne (Proyecto 2, DS2)

    Documento en español con instrucciones para ejecutar, probar y usar los endpoints principales del backend.

    Contenido
    - Propósito
    - Requisitos y variables de entorno
    - Instalación y scripts
    - Endpoints principales
      - Autenticación (registro / login)
      - Catálogo (GET /api/products)
    - Seed (carga inicial de productos)
    - Pruebas (Jest + mongodb-memory-server)
    - Notas y recomendaciones

    ## Propósito

    Este backend expone endpoints para gestionar autenticación de usuarios (registro/login) y un catálogo simple de productos. Está orientado a las historias de usuario del proyecto y a pruebas automáticas.

    ## Requisitos y variables de entorno

    - Node.js 18+ recomendado
    - Variables de entorno en `.env` (usar `.env.example` como plantilla):
      - `PORT` (opcional) — puerto donde corre la API (por defecto en el código si no está definido).
      - `MONGO_URI` — connection string de MongoDB (en producción). Para pruebas locales se usa MongoDB en memoria.
      - `JWT_SECRET` — secreto para firmar JWT (en CI se provee una variable). Si no está definido, los tests usan un valor por defecto interno.

    ## Instalación y scripts

    1) Instalar dependencias:

    ```powershell
    cd backend
    npm install
    ```

    2) Scripts útiles en `backend/package.json`:

    - `npm run dev` — iniciar en modo desarrollo (nodemon)
    - `npm start` — iniciar (node server.js)
    - `npm test` — ejecutar tests con Jest
    - `npm run seed` — ejecutar script de carga inicial de productos

    ## Endpoints principales

    Base path: `/api`

    1) Autenticación — `/api/auth`

    - POST `/api/auth/register`
      - Descripción: Registrar un nuevo usuario. Solo se permiten correos institucionales `@correounivalle.edu.co`.
      - Body JSON: `{ name, email, password, role? }` (role puede ser `estudiante`, `comercio`, `admin` — por defecto `estudiante`).
      - Respuestas: `201` con `{ message, user, token }` o errores `400/409/500` según el caso.

    - POST `/api/auth/login`
      - Descripción: Inicio de sesión con `email` y `password`.
      - Body JSON: `{ email, password }`.
      - Respuestas: `200` con `{ message, user, token }` o `400/401/500`.
      - Nota: incluir el token en `Authorization: Bearer <token>` para rutas protegidas.

    2) Catálogo — `/api/products`

    - GET `/api/products`
      - Descripción: Devuelve la lista de productos. Soporta búsqueda y filtrado por query params.
      - Query params:
        - `name` (opcional): búsqueda parcial y case-insensitive sobre `nombre`.
        - `category` (opcional): búsqueda parcial y case-insensitive sobre `categoria`.
      - Ejemplos:
        - Obtener todos: `GET /api/products`
        - Filtrar por nombre: `GET /api/products?name=camis`
        - Filtrar por categoría: `GET /api/products?category=ropa`
        - Ambos filtros: `GET /api/products?name=camiseta&category=ropa`
      - Respuesta (200): `{ success: true, data: [ ...products ] }`.
      - Errores habituales: `500` (problema interno / DB).

      - Observaciones: la búsqueda usa regex parcial case-insensitive. Para colecciones grandes considera agregar paginación (`limit`/`page`) e índices en MongoDB para `nombre` y `categoria`.

    ## Seed (carga inicial)

    Hay un script de seed para insertar productos de ejemplo:

    ```powershell
    cd backend
    npm run seed
    ```

    El script utiliza `MONGO_URI` para conectarse. Antes de ejecutarlo asegúrate de que la variable esté configurada.

    ## Pruebas

    La suite de tests usa Jest y `mongodb-memory-server` para aislar la base de datos en memoria.

    - Ejecutar tests:

    ```powershell
    cd backend
    npm test
    ```

    - Los tests cubren:
      - Registro/login (integración)
      - Middleware de autenticación
      - Endpoints del catálogo (GET /api/products) incluyendo filtrado por `name`/`category`.

    ## Notas y recomendaciones

    - CI: Asegúrate de que en los workflows de GitHub Actions exista la variable `JWT_SECRET` y se use `npm ci` con `package-lock.json` para reproducibilidad.
    - Seguridad: valida y limita los parámetros de query si expones expresiones regulares a usuarios (para evitar ataques de regex o abusos). Se recomienda `express-validator` o sanitización adicional.
    - Rendimiento: añade paginación y/o índices para campos de búsqueda si esperas que la colección crezca.
    - Documentación adicional: si quieres, puedo generar un archivo OpenAPI/Swagger con la especificación de estos endpoints.

    ---

    Si quieres, ordeno y añado ejemplos concretos (requests/responses) para cada endpoint o genero un `openapi.yaml`. ¿Qué prefieres? 

Instrucciones para correr el backend localmente.

1. Instalar dependencias

```powershell
cd backend
npm install
```

2. Copiar .env.example -> .env y completar variables

3. Ejecutar en dev

```powershell
npm run dev
```

4. Ejecutar tests

```powershell
npm test
```
