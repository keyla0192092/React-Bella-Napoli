BELLA NAPOLI — VERSIÓN CORREGIDA

Archivos:
- index.html: sitio público, menú, personalización, carrito y checkout.
- styles.css: diseño responsive y accesible.
- script.js: menú, personalización, carrito, validaciones y anuncios ARIA.
- personal-login.html: acceso del personal.
- personal-panel.html: panel privado de demostración.

CORRECCIONES INCLUIDAS:
1. Se eliminan del footer público los enlaces directos a Caja/Cocina/Repartidor.
2. Se añade pantalla de login para el área de personal.
3. Se valida teléfono con type="tel", inputmode, pattern y required.
4. Todos los campos tienen label asociado mediante for/id.
5. Tamaños usan radio buttons; extras usan checkboxes.
6. El total se anuncia con aria-live cuando cambia.
7. Se mejora el contraste de textos secundarios.
8. Controles táctiles principales tienen áreas de interacción de al menos 44 px.
9. Se añaden estados de error accesibles y aria-invalid.
10. El diseño es responsive para móvil y escritorio.
11. No se incluye el badge de Netlify dentro del diseño del sitio.

IMPORTANTE SOBRE SEGURIDAD:
Esta es una solución frontend para una entrega académica. sessionStorage y una contraseña escrita en JavaScript NO son seguridad real. Para producción, las rutas y APIs de Caja/Cocina/Repartidor deben protegerse en servidor con autenticación, autorización por rol y expiración de sesión.

CREDENCIALES DEMO:
Usuario: personal
Contraseña: bella2026

MEJORAS VISUALES AÑADIDAS
- Fotografías reales de pizzas en portada y menú.
- Elementos SVG decorativos con movimiento suave.
- Efecto parallax con el puntero en la portada.
- Hover fotográfico en tarjetas del menú.
- Respeta prefers-reduced-motion para accesibilidad.
- Fotografías de referencia: Wikimedia Commons (CC0 / CC BY-SA 4.0). Para entrega final de marca se recomienda reemplazarlas por fotografías propias de Bella Napoli.
