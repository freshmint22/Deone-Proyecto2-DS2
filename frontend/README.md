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

HU2 - Login de usuario (Frontend)
--------------------------------

Flujo de autenticación:
- Página: `src/pages/Login.jsx` con formulario email + contraseña.
- Servicio: `src/services/auth.js` expone `login(payload)` que POST a `/api/auth/login` y devuelve `{token, user}`.
- Contexto: `src/context/AuthContext.jsx` maneja el token en memoria y lo persiste en `localStorage` (`deone_token`).
- Protecciones: `src/components/PrivateRoute.jsx` permite renderizar contenido sólo si existe `token`.
- Logout: limpiar token en contexto y `localStorage`.

Notas de desarrollo:
- Tests básicos en `frontend/tests/login.test.jsx`.
- El token se guarda en `localStorage` como `deone_token`. Ajustar según políticas de seguridad (cookie httpOnly para producción).

HU3 - Catálogo de productos (Frontend)
-------------------------------------

Implementación:
- Página: `src/pages/Catalog.jsx` que consume `src/services/api.js` (`getProducts()`) para obtener productos desde `GET /api/products`.
- Componentes: `src/components/ProductList.jsx` y `src/components/ProductCard.jsx` para render en grid responsivo.
- UI: búsqueda por nombre, filtro por categoría y filtro por precio máximo. Botón para limpiar filtros.
- Responsividad: `ProductList` usa CSS grid con `auto-fill` y `minmax` para adaptarse a pantallas.
- Tests: `frontend/tests/catalog.test.jsx` con mock de `fetch` para comprobar render y filtrado.

Notas de desarrollo:
- `getProducts()` apunta por defecto a `http://localhost:3000/products` o usa `VITE_API_URL`.
- Para pruebas de integración, mockear el endpoint o usar un fixture de datos.

HU6 - Actualización de estado del pedido (Frontend)
-------------------------------------------------

Implementación:
- Página: `src/pages/OrderTracker.jsx` permite introducir un ID de pedido y ver su estado actual.
- Componente: `src/components/OrderProgress.jsx` muestra pasos y barra de progreso (recibido -> en preparación -> listo para entrega).
- API: `src/services/api.js` incluye `getOrder(id)` y `updateOrderStatus(id,status)` (PATCH `/api/orders/:id/status`).
- Socket: `OrderTracker` se suscribe al evento `orderStatusUpdated` para actualizar la UI en tiempo real.
- Tests: `frontend/tests/orderStatus.test.jsx` mockea el API y el socket para simular actualizaciones.

Notas de desarrollo:
- Asegúrate de que el backend emite `orderStatusUpdated` con payload que contenga `id` y `status`.
- Para permitir que los comercios actualicen el estado desde el panel, crea acciones en el backend que emitan este evento a los clientes interesados.


HU5 - Notificación de nuevos pedidos (Frontend)
----------------------------------------------

Implementación:
- Cliente socket: `src/services/socket.js` usa import dinámico de `socket.io-client` (evita romper si la dependencia no está instalada).
- Componente: `src/components/NotificationBell.jsx` muestra un contador y alertas/toasts cuando llegan nuevos pedidos (`new_order`).
- Página: `src/pages/Orders.jsx` lista pedidos y se actualiza en tiempo real al recibir `new_order`.
- API: `src/services/api.js::getOrders()` para obtener pedidos iniciales.

Configuración y dependencias:
- Instala `socket.io-client` en el frontend para habilitar la conexión:
  ```powershell
  cd frontend
  npm install socket.io-client
  ```
- Configura `VITE_SOCKET_URL` para apuntar al servidor de sockets si es distinto del backend.

Notas de desarrollo:
- En entornos donde no se instala `socket.io-client`, el cliente no fallará gracias al import dinámico, pero no recibirá notificaciones en tiempo real.
- Tests: `frontend/tests/notifications.test.jsx` mockea el servicio de socket.


HU4 - Carrito y confirmación de pedidos (Frontend)
--------------------------------------------------

Implementación:
- Contexto: `src/context/CartContext.jsx` con `addItem`, `removeItem`, `updateQty`, `clear`, y persistencia en `localStorage` (`deone_cart`).
- Componente: `src/components/Cart.jsx` para ver y editar los items del carrito (cantidad, eliminar, vaciar).
- Checkout: `src/pages/Checkout.jsx` muestra resumen del pedido y confirma con `POST /api/orders` usando `src/services/api.js::createOrder`.
- Confirmación: se muestra alerta visual (componente `Alert.jsx`) con el resultado y el carrito se limpia en éxito.
- Tests: `frontend/tests/cart.test.jsx` mockea `createOrder` y verifica que el pedido se crea y el carrito queda vacío.

Notas de desarrollo:
- En producción considerar enviar token de autenticación en la petición de creación de orden (Authorization header) y usar cookies httpOnly si procede.
- Para flujos de entrega/estado, el backend debe exponer endpoints para actualizar y listar pedidos.




