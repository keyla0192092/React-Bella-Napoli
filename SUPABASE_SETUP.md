# Configuración de Supabase

## Entorno e instalación

- Sistema: Windows 10 x64.
- Aplicación: React 19 con Vite, JavaScript y npm.
- Node.js LTS 26.13.1 se instaló con WinGet (`OpenJS.NodeJS.LTS`).
- Supabase CLI 3.1.0 se instaló como dependencia de desarrollo (`supabase`); el SDK `@supabase/supabase-js` también quedó instalado.
- La carpeta de trabajo no contiene metadatos de Git.
- Se inicializó `supabase/config.toml` con `supabase init`. No se inició Supabase local ni se instaló o utilizó Docker.

## Autenticación y proyecto Cloud

- Autenticación: pendiente. `supabase projects list` informó que falta un access token.
- Vinculación: pendiente. Aún no se ha seleccionado un proyecto ni ejecutado `supabase link`.
- No se modificó ningún proyecto, tabla ni dato remoto.

Para autenticar, genera un access token en [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens), abre una terminal en la raíz del proyecto y ejecuta `npx supabase login`. Introduce el token únicamente en el prompt local; no lo compartas en el chat ni lo guardes en un archivo del proyecto. Después, ejecuta `npx supabase projects list` y selecciona el proyecto Cloud correcto antes de vincularlo.

## Archivos de integración

- `supabase/config.toml`: configuración generada por la CLI para este repositorio.
- `src/lib/supabase.js`: cliente centralizado; informa explícitamente si faltan las variables de entorno.
- `.env.example`: plantilla sin credenciales reales.
- `.gitignore`: excluye `.env` y `.env.*`, permitiendo únicamente `.env.example`.
- `package.json` y `package-lock.json`: incluyen la CLI y el SDK.

## Variables de entorno

Copia `.env.example` a `.env.local` y reemplaza los valores con los de tu proyecto en Supabase Dashboard:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLISHABLE_KEY
```

Obtén la URL y la clave **publishable** desde la configuración/API del proyecto en el Dashboard. Las variables `VITE_*` se incluyen en el código del navegador; utiliza únicamente la clave publicable. Nunca pongas claves `service_role`, `secret` ni tokens de acceso en variables `VITE_*`, en `.env.example` o en el repositorio. `.env.local` está excluido de Git.

El cliente aún no está importado por la aplicación principal, por lo que la app existente no requiere las credenciales para arrancar. Al importar `src/lib/supabase.js`, el módulo exige ambas variables.

## Comandos útiles

Ejecuta estos comandos desde la raíz del proyecto:

```bash
npx supabase --version
npx supabase login
npx supabase projects list
npx supabase link --project-ref <PROJECT_REF>
npm run dev
npm run build
```

## Pendiente

1. Completar `npx supabase login` localmente y confirmar acceso con `npx supabase projects list`.
2. Elegir el proyecto Cloud correcto y vincularlo con `npx supabase link --project-ref <PROJECT_REF>`.
3. Crear `.env.local` con la URL del proyecto y la clave publicable.

El flujo preparado es para Supabase Cloud. No ejecutes comandos de inicio local (`supabase start`) ni operaciones que apliquen migraciones o modifiquen la base de datos.
