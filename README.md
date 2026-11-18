# Bella Napoli

Aplicación React y Vite para la pizzería Bella Napoli. El menú se consulta desde Supabase y los ítems del carrito se guardan por visitante autenticado anónimamente. El formulario de entrega sigue siendo una demostración: no se guarda un pedido ni información personal.

## Desarrollo

```bash
npm install
npm run dev
npm run build
```

Antes de ejecutar la app, copia `.env.example` a `.env.local` y define `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con los valores publicables del proyecto. No uses claves `service_role` o secretas en el navegador.

## Supabase

- `supabase/migrations/` define el catálogo público de solo lectura y `cart_items` con políticas RLS por `auth.uid()`.
- La autenticación anónima debe habilitarse mediante la configuración CLI de `supabase/config.toml` en el proyecto remoto.
- Desde la raíz del proyecto: `npx supabase login`, `npx supabase projects list`, `npx supabase link --project-ref <PROJECT_REF>`, `npx supabase db push --dry-run --remote` y, tras revisar el destino, `npx supabase db push --remote`.
- Consulta [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) y [.docs/supabase-integration/CHECKLIST.md](./.docs/supabase-integration/CHECKLIST.md) para autenticación, variables, migraciones y estado de verificaciones.

## Pantallas

- Inicio: `/`
- Menú: `/?page=menu`
- Nosotros: `/?page=about`
- Mi pedido: `/?page=order`
- Acceso de personal: `/?page=login`
- Panel de personal: `/?page=panel`

Las rutas antiguas `menu.html`, `nosotros.html`, `pedido.html`, `personal-login.html` y `personal-panel.html` también se resuelven en la aplicación. La autenticación/selección de rol del panel de personal sigue siendo una demostración de cliente, no una autorización de producción.
