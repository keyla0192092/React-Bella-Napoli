# Bella Napoli

Migración del sitio de Bella Napoli a React y Vite. El diseño y las imágenes originales se conservan desde `.docs/Legacy`; esos archivos son la referencia y no se editan.

## Desarrollo y build

```bash
npm run dev
npm run build
```

## Pantallas

- Inicio: `/`
- Menú: `/?page=menu`
- Nosotros: `/?page=about`
- Mi pedido: `/?page=order`
- Acceso de personal: `/?page=login`
- Panel de personal: `/?page=panel`

Las rutas antiguas `menu.html`, `nosotros.html`, `pedido.html`, `personal-login.html` y `personal-panel.html` también se resuelven en la aplicación.

El menú permite filtrar pizzas, personalizar tamaños y extras, y guardar el carrito en `localStorage`. El checkout valida los datos de entrega. La demostración de personal usa usuario `personal` y contraseña `bella2026`; la autenticación con `sessionStorage` es solo para fines académicos y no protege una aplicación de producción.
