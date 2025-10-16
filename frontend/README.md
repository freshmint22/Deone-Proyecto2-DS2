Front-end inicial para Deone-Proyecto2-DS2

Estructura creada para implementar los requerimientos funcionales y atributos de calidad.

Requerimientos funcionales (resumen):
- Registro y autenticación de usuarios (estudiantes y comercios) con correo institucional.
- Gestión de catálogo: CRUD de productos por comercios; visualización por estudiantes.
- Carrito de pedidos y checkout (integración de pago futura).
- Gestión de pedidos: notificaciones, estados (recibido, en preparación, listo para entrega), historial.
- Búsqueda y filtrado por categoría, precio, disponibilidad.
- Notificaciones y alertas para estudiantes y comercios.
- Reportes y estadísticas para comercios (ventas, productos más vendidos, pedidos recientes).

Atributos de calidad:
- Seguridad: manejo seguro de credenciales y sesiones.
- Usabilidad: UI intuitiva.
- Rendimiento, escalabilidad y disponibilidad.
- Mantenibilidad: código modular y documentado.

Estructura de carpetas creada:
- src/
  - components/
  - pages/
  - services/
  - hooks/
  - styles/
  - assets/
  - utils/
- public/
- tests/

Siguientes pasos:
- Añadir `package.json` y archivos de arranque si se desea usar React/Vite/Create React App.
- Crear componentes base: Header, Footer, ProductCard, ProductList, Cart, Login, Register.
- Implementar rutas y conexión con backend.

HU1 - Registro de estudiante (Frontend)
-------------------------------------

Flujo de registro:
- Página: `src/pages/Register.jsx` con formulario: nombre, correo institucional, contraseña, confirmar contraseña.
- Validaciones en cliente:
  - Nombre obligatorio.
  - Correo debe pertenecer al dominio institucional (por defecto `edu.co`, variable en `Register.jsx`).
  - Contraseña mínimo 6 caracteres.
  - Contraseñas deben coincidir.
- Al enviar, se hace POST a `/api/auth/register` a través de `src/services/auth.js`.
- Respuestas:
  - En éxito: mostrar alerta de éxito y limpiar formulario.
  - En error: mostrar alerta con el mensaje recibido del backend.

Notas de desarrollo:
- Tests de validación están en `frontend/tests/register.test.jsx` (usar Testing Library + Jest).
- Para ejecutar el frontend se sugiere usar Vite; instalar dependencias con `npm install` dentro de `frontend/`.
- Variables de entorno: `VITE_API_URL` para apuntar al backend.

