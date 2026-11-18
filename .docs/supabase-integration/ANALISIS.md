# Análisis de integración con Supabase

## Fuente y estado de revisión

Fuente local: `.docs/ER-CRUD.pdf`, 7 páginas. Se comprobó el contenido y se revisaron visualmente el modelo de campos de la página 2, el diagrama y la matriz CRUD de las páginas 3–4 y las reglas de seguridad y límites de las páginas 4–7. El PDF original se conserva en la carpeta local del proyecto y no se incluye en el repositorio de GitHub.

El PDF se abrió localmente y sus siete páginas son legibles. La matriz marca CRUD para ítems del carrito, lectura pública del catálogo y deja la confirmación del pedido como simulada; el documento no especifica permisos de backend y advierte que los roles de personal solo existen en la interfaz.

Al revisar el código antes de integrar, la aplicación React/Vite no tenía backend: el carrito se mantenía en `useState` y `localStorage`, el menú estaba codificado en `src/components/data.js` y el checkout solo confirmaba un pedido simulado. La integración sustituye la persistencia del carrito y la lectura del catálogo; el checkout sigue simulado y no hay registro persistente de pedidos.

## Modelo de datos y decisiones

El PDF describe `ItemCarrito` y los datos temporales del formulario; no fija tipos SQL, nulabilidad, claves, restricciones ni cardinalidades relacionales. La tabla de pedidos reales de la matriz es una propuesta futura, no una entidad implementada. Por ello, no se crea una tabla de pedidos ni se persisten datos de entrega.

| Tabla / entidad | Columnas PostgreSQL | Claves, nulabilidad y restricciones | Fuente |
|---|---|---|---|
| `public.pizzas` (catálogo existente en la aplicación) | `id integer`, `category text`, `name text`, `description text`, `base_price numeric(10,2)` | `id` PK; los campos son `NOT NULL`; `category` restringida a las categorías actuales; nombre único; precio positivo. Los seis registros del menú actual se cargan de manera idempotente en la migración. | Menú previo a la integración en `src/components/data.js`; lectura pública en la matriz CRUD, p. 3. El archivo conserva solo el mapa de imágenes locales. |
| `public.cart_items` / `ItemCarrito` | `id uuid`, `user_id uuid`, `pizza_id integer`, `name text`, `size text`, `extras text[]`, `price numeric(10,2)`, `quantity integer`, `created_at timestamptz` | `id` PK con `gen_random_uuid()`; `user_id` FK a `auth.users(id)` con `ON DELETE CASCADE`, por defecto `auth.uid()`; `pizza_id` FK a `pizzas(id)` con `ON DELETE RESTRICT`; demás campos `NOT NULL`; `extras` por defecto `{}`; `quantity` por defecto 1 y positiva; precio positivo; tamaño limitado a las opciones existentes. Índice por propietario y fecha. | Modelo de campos, pp. 2–3; CRUD del carrito, pp. 3–4. |

`cart_items.name` y `price` guardan la descripción y el precio calculado del ítem, como hace el carrito existente. `pizza_id` resuelve la referencia que el PDF deja sin tipo especificado. Los identificadores de ítem de la aplicación pasan a ser UUID reales emitidos por PostgreSQL. No hay otra relación ni tabla intermedia en el modelo implementado.

Los nombres, teléfono, dirección, referencia y notas del formulario son datos temporales del cliente, no una entidad persistente ni un pedido confirmado según el PDF (pp. 1–3). Se mantienen en el flujo actual y no se envían a Supabase. Pedidos reales, pagos, autorización de personal, cambios de precios y seguimiento son alcance futuro.

## Matriz de correspondencia y operaciones

| Página | Entidad / operación | Flujo y archivo de aplicación | Acceso y verificación |
|---|---|---|---|
| 2–4 | Ítem de carrito: crear | Personalización de pizza en `src/components/MenuPage.jsx`; estado coordinado por `src/App.jsx`. | Visitante con sesión Supabase Auth anónima; `INSERT` limitado por RLS a `auth.uid()`. Verificado en la app y con dos sesiones SDK. |
| 2–4 | Ítem de carrito: leer | Carga del carrito en `src/App.jsx`, mostrado en `src/components/OrderPage.jsx`. | Solo propietario; `SELECT` limitado por RLS y UUID reales. Verificada lectura propia y persistencia tras recargar la app. |
| 2–4 | Ítem de carrito: actualizar cantidad | Controles de cantidad en `src/components/OrderPage.jsx`. | Solo propietario; `UPDATE` con `USING` y `WITH CHECK`. Verificado cambio persistido tras recarga; cantidad inválida rechazada. |
| 2–4 | Ítem de carrito: eliminar | Quitar ítem y vaciar tras la confirmación simulada, en `src/components/OrderPage.jsx`. | Solo propietario; `DELETE` con RLS. Verificados borrado individual y vaciado remoto; otro usuario no puede eliminar la fila. |
| 3 | Catálogo de pizzas: crear, actualizar, eliminar | No hay interfaces de administración del catálogo; el menú existente está en `src/components/MenuPage.jsx`. | No permitido a clientes. Operaciones fuera del alcance de la matriz; la migración instala el catálogo inicial. |
| 3 | Catálogo de pizzas: leer | Menú en `src/components/MenuPage.jsx`, apoyado por imágenes locales de `src/components/data.js`. | Lectura pública mediante `anon` y `authenticated`; se verificó la consulta sin sesión y la visualización de los seis registros en la app. |
| 2–4 | Datos de entrega / pedido confirmado: CRUD | Formulario `src/components/OrderPage.jsx`. | El PDF solo define captura y confirmación simulada; no existe registro que leer, actualizar o eliminar. No se crea persistencia ni acceso de base de datos para estos campos. |
| 4–6 | Sesión/roles del personal | `src/components/LoginPage.jsx` y `src/components/StaffPanel.jsx`. | La matriz identifica la selección de rol en cliente como demostrativa e insegura. No se concede acceso a datos de clientes y no se considera un mecanismo de autorización de backend. |

## Permisos y seguridad

- El PDF clasifica al cliente como actor funcional público, pero no define aislamiento de datos para visitantes. Se usa Auth anónima para asignar un `auth.uid()` a cada navegador; la tabla de carrito solo concede acceso a `authenticated` y todas sus políticas comprueban `user_id = auth.uid()`. La selección de rol del cliente no determina permisos.
- El catálogo permite solo `SELECT` público con RLS; no hay políticas de escritura para el cliente.
- La sesión anónima es necesaria para el CRUD del carrito y debe habilitarse en Supabase Auth. El menú público no requiere autenticación.
- Las claves privadas y `service_role` no se utilizan en el navegador. El formulario de pedido y la demostración de personal siguen sin ser aptos como controles de producción.
- La autenticación anónima se verificó en Cloud creando dos sesiones distintas con la clave publicable. Las políticas RLS se consultaron en el catálogo de Postgres y se probó que la segunda sesión no puede leer, actualizar ni eliminar la fila de la primera.

## Diferencias y verificación ejecutada

La aplicación actual no tiene una entidad de pedido ni una API de catálogo. Se añade una tabla pública de menú de solo lectura y persistencia de `cart_items`; no se inventa una entidad para el formulario. Los valores del carrito proceden del navegador y no son una fuente confiable para pagos o pedidos reales.

El proyecto remoto `bella-napoli` (`ksgzovyiimrolmyzawfy`, `sa-east-1`) está saludable y enlazado. Se aplicó la migración `20261111200000_create_bella_napoli_catalog_and_cart.sql`; `migration list --remote` confirmó que el historial local y remoto coincide. SQL de solo lectura confirmó ambas tablas con RLS, las cinco políticas previstas, los seis registros de catálogo y los grants esperados: `anon` puede leer `pizzas`, no puede escribir el catálogo ni acceder a `cart_items`, y `authenticated` tiene CRUD en `cart_items` condicionado por RLS. `config diff` no reportó diferencias de Auth.

Se probaron desde la aplicación el alta, lectura, cambio de cantidad, persistencia tras recarga, eliminación individual y vaciado al confirmar el pedido simulado. Dos sesiones anónimas separadas verificaron el aislamiento RLS; una cantidad cero fue rechazada. `npm.cmd run lint` y `npm.cmd run build` pasaron. Se eliminaron la fila de prueba y las tres cuentas anónimas temporales; una consulta confirmó que no quedaran esas cuentas.

Única diferencia no aplicada: `db.pooler.max_client_conn` es 600 en `supabase/config.toml` y 200 en Cloud. No se empujó esa configuración para evitar modificar el pooler de producción, pues es ajena al modelo y al flujo solicitado. El pedido confirmado y los datos de entrega siguen siendo demostrativos, según el alcance del PDF.
