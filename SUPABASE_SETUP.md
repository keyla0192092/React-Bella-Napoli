# Configuración de Supabase

La aplicación usa React 19, Vite, `@supabase/supabase-js` y Supabase CLI 3.1.0. `supabase/config.toml` ya existe; no es necesario iniciar contenedores Docker ni Supabase local. Ejecuta los comandos desde la carpeta interna del proyecto: `C:\Users\Windows\OneDrive\Escritorio\React-Bella-Napoli-main\React-Bella-Napoli-main` (contiene `package.json` y `supabase\`).

## Autenticación y proyecto Cloud

Se reutilizó el proyecto remoto saludable y enlazado `bella-napoli` (`ksgzovyiimrolmyzawfy`), en `sa-east-1` (São Paulo); no se creó otro proyecto. La CLI está autenticada. Con el access token de la CLI vigente, la conexión remota funcionó sin contraseña de base de datos.

La migración `supabase/migrations/20261111200000_create_bella_napoli_catalog_and_cart.sql` está aplicada. Para futuras migraciones, desde la raíz del proyecto:

```powershell
npx.cmd supabase migration list --remote
npx.cmd supabase db push --dry-run --remote
```

Confirma que el destino sea `bella-napoli` y que el dry-run solo proponga las migraciones previstas. Después de revisar, aplica con `npx.cmd supabase db push --remote --yes` y vuelve a comprobar `migration list --remote`. El flag `--yes` es necesario en la ejecución no interactiva y confirma la mutación remota. Las consultas de verificación del esquema deben usar `npx.cmd supabase db query --remote --read-only "<consulta>"`.

La URL del proyecto y la clave publicable ya están en `.env.local`, que está ignorado por Git. No uses claves `service_role`, claves `secret`, contraseñas de base de datos ni access tokens en el navegador o en variables `VITE_*`. `.gitignore` excluye `.env` y `.env.*`, pero conserva `.env.example`.

## Persistencia y permisos

- `supabase/migrations/20261111200000_create_bella_napoli_catalog_and_cart.sql` crea el catálogo (`pizzas`, lectura pública sin grants de escritura) y `cart_items` (grants CRUD a `authenticated` limitados por RLS al propietario; `anon` no tiene acceso).
- `supabase/config.toml` habilita los inicios de sesión anónimos necesarios para asignar el carrito a `auth.uid()`. El remoto coincide en configuración de Auth; dos sesiones anónimas distintas confirmaron el aislamiento RLS.
- El menú fusiona los datos públicos con las imágenes locales de `src/components/data.js`. El carrito se vuelve a leer de Supabase al iniciar la app y después de CRUD el cliente actualiza el estado desde el resultado confirmado.
- Se verificaron desde la app alta, lectura, actualización, persistencia tras recargar, eliminación y vaciado del carrito. Se rechazó una cantidad inválida y se limpiaron las filas y cuentas temporales de prueba.
- No se persiste el formulario de entrega ni la confirmación simulada; no existe una tabla de pedidos en el PDF.

`npx.cmd supabase config diff --remote` reportó una única diferencia no aplicada: `db.pooler.max_client_conn` es 600 en la configuración local y 200 en Cloud. No se empujó esa diferencia para evitar cambiar el pooler de producción; no afecta Auth ni el CRUD.

Para ejecución local: `npm run dev`. Para controles: `npm run lint` y `npm run build`. El análisis del PDF, la matriz de correspondencia y el estado por verificar están en [.docs/supabase-integration/ANALISIS.md](./.docs/supabase-integration/ANALISIS.md) y [.docs/supabase-integration/CHECKLIST.md](./.docs/supabase-integration/CHECKLIST.md).
