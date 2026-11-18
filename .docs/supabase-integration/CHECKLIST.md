# Checklist de integración Supabase

- [x] Revisar el proyecto y validar el PDF. Evidencia: `.docs/ER-CRUD.pdf` (7 páginas), abierto localmente y revisado visualmente; `package.json`, flujos React, `supabase/config.toml` y `.docs` inspeccionados.
- [x] Documentar el modelo y su correspondencia con la aplicación. Evidencia: [ANALISIS.md](./ANALISIS.md), con páginas, columnas, permisos, decisiones y límites del modelo.
- [x] Crear o identificar el proyecto remoto y enlazarlo mediante CLI. Evidencia: proyecto gratuito `bella-napoli`, ref `ksgzovyiimrolmyzawfy`, región `sa-east-1`; `supabase link` y `supabase projects list` confirmaron el destino.
- [x] Crear, aplicar y verificar migraciones y permisos. Evidencia: `npx.cmd supabase db push --dry-run --remote` propuso solo `20261111200000_create_bella_napoli_catalog_and_cart.sql`; `db push --remote --yes` la aplicó y `migration list --remote` confirmó `20261111200000` en local y remoto. Consultas SQL remotas de solo lectura confirmaron ambas tablas con RLS, las cinco políticas esperadas, grants de lectura pública solo para el catálogo, CRUD para `authenticated` en el carrito y los seis registros de catálogo. `config diff` no mostró diferencias de Auth.
- [x] Configurar el SDK y las variables de entorno. Evidencia: cliente Supabase y `.env.local` con URL y clave publicable; se comprobó su presencia sin imprimir valores y que `.gitignore` excluye el archivo.
- [x] Integrar y comprobar cada operación CRUD requerida.
  - [x] `cart_items` — crear: flujo de personalización en `src/components/MenuPage.jsx`; se insertó y leyó el ítem desde la app y desde dos sesiones SDK.
  - [x] `cart_items` — leer: carga en `src/App.jsx` y `src/components/OrderPage.jsx`; se verificó tras recargar la app.
  - [x] `cart_items` — actualizar cantidad: `src/components/OrderPage.jsx`; cambio de 1 a 2 persistió tras recarga; cantidad inválida 0 fue rechazada por la restricción.
  - [x] `cart_items` — eliminar/vaciar: `src/components/OrderPage.jsx`; eliminar un ítem y vaciar tras confirmación simulada funcionaron; nueva lectura tras recarga mostró el carrito vacío.
  - [ ] `pizzas` — crear: no aplica; el PDF no ofrece administración del catálogo.
  - [x] `pizzas` — leer públicamente: `src/lib/store.js` y `src/components/MenuPage.jsx`; catálogo público de seis filas consultado en Cloud y mostrado en la app.
  - [ ] `pizzas` — actualizar: no aplica; el PDF no ofrece administración del catálogo.
  - [ ] `pizzas` — eliminar: no aplica; el PDF no ofrece administración del catálogo.
  - [ ] Datos de entrega — crear: captura solo en memoria; el PDF no define persistencia.
  - [ ] Datos de entrega — leer: solo durante edición del formulario; no hay lectura desde la base.
  - [ ] Datos de entrega — actualizar: edición local antes de enviar; no hay actualización de base.
  - [ ] Datos de entrega — eliminar: no existe registro persistido que eliminar.
  - [ ] Pedido confirmado — crear: confirmación simulada, no se crea un pedido persistente según el PDF.
  - [ ] Pedido confirmado — leer: no aplica; el PDF indica que el pedido confirmado no está implementado.
  - [ ] Pedido confirmado — actualizar: no aplica; el PDF indica que el pedido confirmado no está implementado.
  - [ ] Pedido confirmado — eliminar: no aplica; el PDF indica que el pedido confirmado no está implementado.
- [x] Verificar persistencia, permisos y funcionamiento del proyecto. `npm.cmd run lint` y `npm.cmd run build` pasaron. En navegador se verificaron alta, lectura, actualización, persistencia tras recarga, eliminación y vaciado. Dos sesiones anónimas probaron aislamiento: la segunda no pudo leer, actualizar ni eliminar la fila de la primera. Se rechazó cantidad 0. Se limpiaron el ítem y las tres cuentas temporales; consulta final confirmó cero cuentas temporales restantes.
- [x] Documentar la ejecución y los pendientes. Evidencia: `SUPABASE_SETUP.md`, `ANALISIS.md` y esta checklist registran migración, configuración, pruebas y la única diferencia de configuración pendiente.

## Estado y próxima acción

- Proyecto remoto existente `bella-napoli` (`ksgzovyiimrolmyzawfy`, `sa-east-1`) saludable y enlazado. La CLI volvió a autenticar; `projects list` encontró solo este proyecto y se reutilizó, sin crear otro.
- `auth.enable_anonymous_sign_ins` está habilitado local y remotamente; `config diff` no reportó diferencias de Auth. Sí detectó una diferencia no aplicada: `db.pooler.max_client_conn` es 600 local y 200 remoto. No se hizo `config push` para evitar cambiar una configuración de producción ajena al alcance.
- La migración `20261111200000` está aplicada en remoto; el historial local/remoto coincide.
- `.env.local` contiene la URL y la clave publicable del proyecto, su host coincide con el proyecto y `.gitignore` excluye el archivo. No se imprimieron valores.
- `npm.cmd run lint` y `npm.cmd run build` pasaron después de la actualización. `package.json` no define una suite de pruebas automatizadas.
- Siguiente acción: ninguna para el alcance definido por el PDF. La única diferencia pendiente es la configuración local/remota del pooler (600/200); mantenerla sin cambios salvo que se decida revisarla explícitamente.
