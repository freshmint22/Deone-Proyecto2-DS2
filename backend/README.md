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

## Environment variables

- `PORT` — optional, default used in code
- `MONGO_URI` — MongoDB connection string (in production). Tests use in-memory MongoDB.
- `JWT_SECRET` — secret used to sign tokens. When not provided, a default is used for tests only.

## Run locally

1. Install dependencies:
   - cd backend
   - npm install

2. Start server (development):
   - npm run dev

3. Run tests:
   - npm test

The project uses `mongodb-memory-server` for integration tests, so you do not need a running MongoDB instance when running tests.

## Manual smoke test (PowerShell / curl)

Start the server locally (`npm run dev`) and then in another terminal run (PowerShell example):

```powershell
# Register (should return 201 and token)
curl -Method POST -Uri http://localhost:3000/api/auth/register -Body (ConvertTo-Json @{ name='Test User'; email='manual.user@correounivalle.edu.co'; password='password123' }) -ContentType 'application/json'

# Login (should return 200 and token)
curl -Method POST -Uri http://localhost:3000/api/auth/login -Body (ConvertTo-Json @{ email='manual.user@correounivalle.edu.co'; password='password123' }) -ContentType 'application/json'
```

## Notes

- Tests currently pass locally (see `tests/auth.test.js`). If CI fails, check the workflow and `package-lock.json` file (we added it to support `npm ci`).
- If you need me to add examples to the root `README.md` or expand the API docs (OpenAPI/Swagger), tell me and I can add it.
# Backend - DeOne Proyecto2 DS2

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
