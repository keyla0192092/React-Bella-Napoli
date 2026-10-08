import { useEffect, useState } from 'react'
import './App.css'
import '../.docs/Legacy/styles.css'
import logo from '../.docs/Legacy/imagenes/logo-bella-napoli.png'
import heroPizza from '../.docs/Legacy/imagenes/fondo pizza.png'
import menuBackground from '../.docs/Legacy/imagenes/fondo menu.png'
import aboutBackground from '../.docs/Legacy/imagenes/nosotros.png'
import orderBackground from '../.docs/Legacy/imagenes/pedido.png'
import chef from '../.docs/Legacy/imagenes/chef.jpg'
import oven from '../.docs/Legacy/imagenes/horno.jpg'
import flour from '../.docs/Legacy/imagenes/harina.jpg'
import margaritaPhoto from '../.docs/Legacy/imagenes/margarita.jpg'
import pepperoniPhoto from '../.docs/Legacy/imagenes/pepperoni.jpg'
import napolitanaPhoto from '../.docs/Legacy/imagenes/napolitana.jpg'
import hawaianaPhoto from '../.docs/Legacy/imagenes/hawaiana.jpg'
import vegetarianaPhoto from '../.docs/Legacy/imagenes/vegetariana.jpg'
import carnivoraPhoto from '../.docs/Legacy/imagenes/carnivora.webp'

const pizzas = [
  { id: 1, category: 'clasicas', name: 'Margarita', description: 'Salsa de tomate, mozzarella y albahaca fresca.', base: 120, image: margaritaPhoto },
  { id: 2, category: 'clasicas', name: 'Pepperoni', description: 'Mozzarella, salsa de tomate y pepperoni.', base: 135, image: pepperoniPhoto },
  { id: 3, category: 'clasicas', name: 'Napolitana', description: 'Mozzarella, tomate, aceitunas, albahaca y orégano.', base: 130, image: napolitanaPhoto },
  { id: 4, category: 'especiales', name: 'Hawaiana', description: 'Mozzarella, jamón y piña.', base: 135, image: hawaianaPhoto },
  { id: 5, category: 'vegetarianas', name: 'Vegetariana', description: 'Mozzarella, champiñones, pimiento, cebolla y aceitunas.', base: 130, image: vegetarianaPhoto },
  { id: 6, category: 'especiales', name: 'Carnívora', description: 'Mozzarella, jamón, pepperoni, tocino y carne.', base: 145, image: carnivoraPhoto },
]

const sizes = [
  { id: 'pequena', name: 'Pequeña', extra: 0 },
  { id: 'mediana', name: 'Mediana', extra: 8 },
  { id: 'grande', name: 'Grande', extra: 15 },
]

const extras = [
  { id: 'queso', name: 'Queso extra', extra: 5 },
  { id: 'pepperoni', name: 'Pepperoni extra', extra: 7 },
  { id: 'champi', name: 'Champiñones', extra: 5 },
  { id: 'aceitunas', name: 'Aceitunas', extra: 4 },
]

const pageLinks = [
  ['Inicio', 'home'],
  ['Menú', 'menu'],
  ['Nosotros', 'about'],
  ['Mi pedido', 'order'],
]

const formatMoney = (amount) => `Bs ${amount.toFixed(0)}`
const pageUrl = (page) => page === 'home' ? '/' : `/?page=${page}`

function currentPage() {
  const page = new URLSearchParams(window.location.search).get('page')
  const pathname = window.location.pathname.toLowerCase()
  if (page) return page
  if (pathname.endsWith('menu.html')) return 'menu'
  if (pathname.endsWith('nosotros.html')) return 'about'
  if (pathname.endsWith('pedido.html')) return 'order'
  if (pathname.endsWith('personal-login.html')) return 'login'
  if (pathname.endsWith('personal-panel.html')) return 'panel'
  return 'home'
}

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('bellaNapoliCart') || '[]')
    return Array.isArray(saved) ? saved : []
  } catch (error) {
    console.error('No se pudo leer el carrito guardado.', error)
    return []
  }
}

function Header({ page, count }) {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido principal</a>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href={pageUrl('home')} aria-label="Bella Napoli, inicio">
            <img className="brand-logo" src={logo} alt="Bella Napóli Pizzería" />
          </a>
          <nav aria-label="Navegación principal">
            {pageLinks.map(([label, key]) => (
              <a key={key} href={pageUrl(key)} aria-current={page === key ? 'page' : undefined}>
                {label}
                {key === 'order' && <span className="cart-count" aria-label={`${count} producto${count === 1 ? '' : 's'}`}>{count}</span>}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img className="brand-logo" src={logo} alt="Bella Napóli" />
          <p>Pizza artesanal para compartir buenos momentos.</p>
        </div>
        <div><h3>Contacto</h3><p>📍 Cochabamba, Bolivia</p><p>📞 70712345</p></div>
        <div><h3>Horario</h3><p>Lunes a domingo</p><p>11:00 – 22:00</p></div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Bella Napoli. Todos los derechos reservados.</p>
        <a href={pageUrl('login')}>Acceso de personal</a>
      </div>
    </footer>
  )
}

function PageHero({ image, title, subtitle }) {
  return (
    <section className="page-hero">
      <img src={image} alt="" />
      <div><h1>{title}</h1><p>{subtitle}</p><div className="checker" /></div>
    </section>
  )
}

function HomePage() {
  return (
    <main id="contenido">
      <section className="hero-redesign">
        <img className="hero-bg" src={heroPizza} alt="Pizza artesanal recién horneada" />
        <div className="container">
          <div className="hero-copybox">
            <div className="hero-kicker">BELLA NAPÓLI · PIZZERÍA ARTESANAL</div>
            <h1>Pizza artesanal<br /><span>con alma italiana</span></h1>
            <p>Ingredientes frescos, recetas inspiradas en la tradición y el mejor sabor en cada porción.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={pageUrl('menu')}>Ver menú →</a>
              <a className="btn btn-secondary" href={pageUrl('about')}>Nuestra historia</a>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="container trust-grid">
          <div className="trust-item"><span className="trust-icon">🌿</span><strong>Ingredientes frescos</strong></div>
          <div className="trust-item"><span className="trust-icon">🔥</span><strong>Horno artesanal</strong></div>
          <div className="trust-item"><span className="trust-icon">🍕</span><strong>Recetas tradicionales</strong></div>
          <div className="trust-item"><span className="trust-icon">♡</span><strong>Hecha con pasión</strong></div>
        </div>
      </section>
      <section className="home-story">
        <div className="home-story-grid">
          <img src={chef} alt="Preparación artesanal de pizza" />
          <div className="home-story-copy">
            <p className="eyebrow">DESDE NUESTRA COCINA</p>
            <h2>El sabor de siempre, como en Nápoli</h2>
            <p>En Bella Napóli creemos que una buena pizza comienza con ingredientes de calidad, una masa preparada con paciencia y mucho amor por lo que hacemos.</p>
            <a className="btn btn-primary" href={pageUrl('about')}>Conoce más →</a>
          </div>
        </div>
      </section>
    </main>
  )
}

function PizzaCard({ pizza, onCustomize }) {
  return (
    <article className="pizza-card">
      <div className="pizza-art"><img src={pizza.image} alt={`Pizza ${pizza.name}`} loading="lazy" /></div>
      <div className="pizza-body">
        <h3>{pizza.name}</h3>
        <p className="pizza-description">{pizza.description}</p>
        <div className="price-row">
          <span className="price">{formatMoney(pizza.base)}</span>
          <button className="btn btn-primary" type="button" onClick={() => onCustomize(pizza)}>Agregar 🛒</button>
        </div>
      </div>
    </article>
  )
}

function PizzaCustomizer({ pizza, onClose, onAdd }) {
  const [sizeId, setSizeId] = useState('mediana')
  const [selectedExtras, setSelectedExtras] = useState([])
  const size = sizes.find((item) => item.id === sizeId)
  const total = pizza.base + size.extra + selectedExtras.reduce((sum, id) => sum + extras.find((item) => item.id === id).extra, 0)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function toggleExtra(id) {
    setSelectedExtras((selected) => selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id])
  }

  return (
    <div className="modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal-backdrop" />
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="customizer-title">
        <button className="modal-close" type="button" aria-label="Cerrar" onClick={onClose}>×</button>
        <p className="eyebrow">PERSONALIZA TU PIZZA</p>
        <h2 id="customizer-title">{pizza.name}</h2>
        <p>{pizza.description}</p>
        <fieldset className="option-group">
          <legend>Tamaño</legend>
          <div className="option-list">
            {sizes.map((item) => (
              <label className="option-label" key={item.id}>
                <input type="radio" name="size" value={item.id} checked={sizeId === item.id} onChange={() => setSizeId(item.id)} />
                <span>{item.name}</span>
                <span className="option-price">{item.extra ? `+${formatMoney(item.extra)}` : 'Incluido'}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="option-group">
          <legend>Ingredientes extras <span className="help-text">(puedes elegir varios)</span></legend>
          <div className="option-list">
            {extras.map((item) => (
              <label className="option-label" key={item.id}>
                <input type="checkbox" checked={selectedExtras.includes(item.id)} onChange={() => toggleExtra(item.id)} />
                <span>{item.name}</span>
                <span className="option-price">+{formatMoney(item.extra)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="custom-total">Total: {formatMoney(total)}</div>
        <div className="sr-only" aria-live="polite" aria-atomic="true">Total actualizado: {formatMoney(total)}</div>
        <button className="btn btn-primary btn-full" type="button" onClick={() => onAdd({ pizza, size, selectedExtras, total })}>Agregar al carrito</button>
      </section>
    </div>
  )
}

function MenuPage({ addToCart }) {
  const [category, setCategory] = useState('todas')
  const [activePizza, setActivePizza] = useState(null)
  const visiblePizzas = category === 'todas' ? pizzas : pizzas.filter((pizza) => pizza.category === category)
  const closeCustomizer = () => setActivePizza(null)

  function addCustomizedPizza({ pizza, size, selectedExtras, total }) {
    const extrasList = selectedExtras.map((id) => extras.find((item) => item.id === id).name)
    addToCart({
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      pizzaId: pizza.id,
      name: pizza.name,
      size: size.name,
      extras: extrasList,
      price: total,
      quantity: 1,
    })
    closeCustomizer()
    window.location.assign(pageUrl('order'))
  }

  return (
    <>
      <main id="contenido">
        <PageHero image={menuBackground} title="Nuestro menú" subtitle="Pizzas artesanales" />
        <section className="menu-section">
          <div className="container">
            <div className="menu-tabs" role="group" aria-label="Filtrar pizzas por categoría">
              {[['Todas', 'todas'], ['Clásicas', 'clasicas'], ['Especiales', 'especiales'], ['Vegetarianas', 'vegetarianas']].map(([label, key]) => (
                <button className={`menu-tab${category === key ? ' active' : ''}`} type="button" key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</button>
              ))}
            </div>
            <div className="pizza-grid">
              {visiblePizzas.map((pizza) => <PizzaCard key={pizza.id} pizza={pizza} onCustomize={setActivePizza} />)}
            </div>
          </div>
        </section>
      </main>
      {activePizza && <PizzaCustomizer pizza={activePizza} onClose={closeCustomizer} onAdd={addCustomizedPizza} />}
    </>
  )
}

function AboutPage() {
  return (
    <main id="contenido">
      <PageHero image={aboutBackground} title="Nosotros" subtitle="Más que pizza, una pasión" />
      <section className="about-editorial">
        <div className="container">
          <div className="story-row">
            <div className="story-copy"><p className="eyebrow">BELLA NAPÓLI</p><h2>Nuestra historia</h2><p>Bella Napóli nace del amor por la cocina italiana y la tradición de compartir una buena pizza. Cada pedido se prepara buscando ese equilibrio entre una masa artesanal, ingredientes frescos y sabores que reúnen a las personas.</p></div>
            <img src={oven} alt="Pizza artesanal Bella Napóli" />
          </div>
          <div className="unique">
            <img src={flour} alt="Ingredientes frescos" />
            <div><h2>Lo que nos hace únicos</h2>
              <div className="unique-list">
                <div className="unique-item"><span>🌿</span><div><strong>Ingredientes frescos</strong>Seleccionados para cada preparación.</div></div>
                <div className="unique-item"><span>🔥</span><div><strong>Preparación artesanal</strong>Hecha con cuidado en cada pedido.</div></div>
                <div className="unique-item"><span>🍕</span><div><strong>Recetas con inspiración italiana</strong>Sabores clásicos con nuestro toque.</div></div>
                <div className="unique-item"><span>♡</span><div><strong>Hecha con pasión</strong>Para compartir buenos momentos.</div></div>
              </div>
            </div>
          </div>
          <p className="about-quote">“La verdadera pizza se disfruta con buenos ingredientes y mejores momentos.”</p>
        </div>
      </section>
    </main>
  )
}

function OrderPage({ cart, updateCart }) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ message: '', kind: '' })
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)

  function changeQuantity(id, delta) {
    updateCart((items) => items.flatMap((item) => {
      if (item.id !== id) return [item]
      const quantity = item.quantity + delta
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
    setStatus({ message: `Carrito actualizado. Total: ${formatMoney(cart.reduce((sum, item) => item.id === id ? sum + item.price * Math.max(0, item.quantity + delta) : sum + item.price * item.quantity, 0))}`, kind: '' })
  }

  function removeItem(id) {
    updateCart((items) => items.filter((item) => item.id !== id))
    setStatus({ message: `Carrito actualizado. Total: ${formatMoney(cart.filter((item) => item.id !== id).reduce((sum, item) => sum + item.price * item.quantity, 0))}`, kind: '' })
  }

  function validateForm(form) {
    const fields = {
      nombre: { valid: Boolean(form.nombre.value.trim()), message: 'Ingresa tu nombre completo.' },
      telefono: { valid: /^[0-9]{7,8}$/.test(form.telefono.value), message: 'Ingresa un teléfono válido de 7 u 8 dígitos.' },
      direccion: { valid: Boolean(form.direccion.value.trim()), message: 'Ingresa tu dirección de entrega.' },
    }
    const nextErrors = Object.fromEntries(Object.entries(fields).filter(([, value]) => !value.valid).map(([key, value]) => [key, value.message]))
    setErrors(nextErrors)
    return nextErrors
  }

  function submitOrder(event) {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validateForm(form)
    if (!cart.length) {
      setStatus({ message: 'Agrega al menos una pizza antes de confirmar el pedido.', kind: 'error' })
      return
    }
    if (Object.keys(nextErrors).length) {
      setStatus({ message: 'Revisa los campos marcados antes de continuar.', kind: 'error' })
      form.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus({ message: `¡Pedido recibido, ${form.nombre.value.trim()}! Total a pagar: ${formatMoney(total)}. Te contactaremos al ${form.telefono.value}.`, kind: 'success' })
    updateCart([])
    form.reset()
  }

  function validateOnBlur(event) {
    const { name, value } = event.target
    const rules = {
      nombre: { valid: Boolean(value.trim()), message: 'Ingresa tu nombre completo.' },
      telefono: { valid: /^[0-9]{7,8}$/.test(value), message: 'Ingresa un teléfono válido de 7 u 8 dígitos.' },
      direccion: { valid: Boolean(value.trim()), message: 'Ingresa tu dirección de entrega.' },
    }
    if (!rules[name]) return
    setErrors((current) => {
      const next = { ...current }
      if (rules[name].valid) delete next[name]
      else next[name] = rules[name].message
      return next
    })
  }

  return (
    <main id="contenido">
      <PageHero image={orderBackground} title="Mi pedido" subtitle="Revisa tu orden" />
      <section className="order-page">
        <div className="container order-layout">
          <div>
            <p className="eyebrow">TU PEDIDO</p><h2 className="order-title">Tu carrito</h2>
            <div className="cart-box">
              {!cart.length ? <p className="empty-state">Tu carrito está vacío. Agrega una pizza desde el menú.</p> : cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong><p>Tamaño: {item.size}</p><p>Extras: {item.extras.length ? item.extras.join(', ') : 'Ninguno'}</p>
                    <div className="qty-controls" aria-label={`Cantidad de ${item.name}`}>
                      <button type="button" aria-label={`Disminuir cantidad de ${item.name}`} onClick={() => changeQuantity(item.id, -1)}>−</button>
                      <strong aria-live="polite">{item.quantity}</strong>
                      <button type="button" aria-label={`Aumentar cantidad de ${item.name}`} onClick={() => changeQuantity(item.id, 1)}>+</button>
                      <button type="button" aria-label={`Eliminar ${item.name}`} title="Eliminar" onClick={() => removeItem(item.id)}>🗑</button>
                    </div>
                  </div>
                  <strong>{formatMoney(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="cart-total"><span>Total</span><strong>{formatMoney(total)}</strong></div>
            <div className="sr-only" aria-live="polite">Carrito: {count} productos.</div>
          </div>
          <div className="checkout-card">
            <p className="eyebrow">ENTREGA</p><h2 className="order-title">Datos de entrega</h2>
            <form noValidate onSubmit={submitOrder} onBlur={validateOnBlur}>
              <div className="form-group"><label htmlFor="nombre">Nombre completo *</label><input id="nombre" name="nombre" type="text" autoComplete="name" required aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? 'nombre-error' : undefined} /><p className="field-error" id="nombre-error">{errors.nombre}</p></div>
              <div className="form-group"><label htmlFor="telefono">Teléfono *</label><input id="telefono" name="telefono" type="tel" inputMode="numeric" pattern="[0-9]{7,8}" maxLength="8" placeholder="Ej.: 70712345" required aria-invalid={Boolean(errors.telefono)} aria-describedby={errors.telefono ? 'telefono-error' : undefined} /><p className="field-error" id="telefono-error">{errors.telefono}</p></div>
              <div className="form-group"><label htmlFor="direccion">Dirección de entrega *</label><input id="direccion" name="direccion" type="text" placeholder="Calle, número y referencia" required aria-invalid={Boolean(errors.direccion)} aria-describedby={errors.direccion ? 'direccion-error' : undefined} /><p className="field-error" id="direccion-error">{errors.direccion}</p></div>
              <div className="form-group"><label htmlFor="referencia">Referencia</label><input id="referencia" name="referencia" type="text" placeholder="Ej.: casa con puerta azul" /></div>
              <div className="form-group"><label htmlFor="notas">Notas del pedido</label><textarea id="notas" name="notas" rows="3" placeholder="Indicaciones adicionales" /></div>
              <button className="btn btn-primary btn-full" type="submit">Confirmar pedido</button>
              <div className={`form-status${status.kind ? ` ${status.kind}` : ''}`} role="status" aria-live="polite">{status.message}</div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

function LoginPage() {
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('caja')

  function login(event) {
    event.preventDefault()
    const form = event.currentTarget
    if (form.usuario.value.trim() === 'personal' && form.clave.value === 'bella2026') {
      sessionStorage.setItem('bellaStaffAuth', 'true')
      sessionStorage.setItem('bellaStaffRole', role)
      window.location.assign(pageUrl('panel'))
      return
    }
    setStatus('Usuario o contraseña incorrectos.')
  }

  return (
    <main className="section">
      <div className="container login-container">
        <div className="checkout-card">
          <a className="brand" href={pageUrl('home')} aria-label="Volver a Bella Napoli"><img className="brand-logo" src={logo} alt="Bella Napóli Pizzería" /></a>
          <p className="eyebrow login-eyebrow">ÁREA PRIVADA</p>
          <h1 className="login-title">Acceso de personal</h1>
          <p>Ingresa con tus credenciales para acceder al panel correspondiente a tu rol.</p>
          <form onSubmit={login}>
            <div className="form-group"><label htmlFor="usuario">Usuario</label><input id="usuario" name="usuario" type="text" autoComplete="username" required /></div>
            <div className="form-group"><label htmlFor="clave">Contraseña</label><input id="clave" name="clave" type="password" autoComplete="current-password" required /></div>
            <div className="form-group"><label htmlFor="rol">Rol</label><select id="rol" value={role} onChange={(event) => setRole(event.target.value)}><option value="caja">Caja</option><option value="cocina">Cocina</option><option value="repartidor">Repartidor</option></select></div>
            <button className="btn btn-primary btn-full" type="submit">Iniciar sesión</button>
            <p className="form-status error" role="alert" aria-live="polite">{status}</p>
          </form>
          <p className="help-text login-help"><strong>Demo académica:</strong> usuario <code>personal</code> y contraseña <code>bella2026</code>.</p>
          <p className="help-text">En producción, la autenticación debe realizarse en un servidor; una validación JavaScript del navegador no sustituye un sistema de seguridad real.</p>
        </div>
      </div>
    </main>
  )
}

function StaffPanel() {
  const authorized = sessionStorage.getItem('bellaStaffAuth') === 'true'
  const role = sessionStorage.getItem('bellaStaffRole') || 'personal'
  const names = { caja: 'Caja', cocina: 'Cocina', repartidor: 'Repartidor' }

  useEffect(() => {
    if (!authorized) window.location.replace(pageUrl('login'))
  }, [authorized])

  function logout() {
    sessionStorage.clear()
    window.location.replace(pageUrl('login'))
  }

  if (!authorized) return null
  return (
    <main className="section">
      <div className="container">
        <div className="checkout-card panel-card">
          <div className="panel-heading">
            <div><p className="eyebrow">ÁREA PRIVADA</p><h1 className="panel-title">Panel de {names[role] || 'Personal'}</h1><p>Bienvenido. Esta área está disponible después de iniciar sesión.</p></div>
            <button className="btn btn-secondary panel-logout" type="button" onClick={logout}>Cerrar sesión</button>
          </div>
          <div className="feature-list">
            <div><span aria-hidden="true">✓</span><strong>Sesión autenticada para esta demostración.</strong></div>
            <div><span aria-hidden="true">✓</span><strong>El acceso no aparece como enlace directo en el footer público.</strong></div>
            <div><span aria-hidden="true">✓</span><strong>Los roles se separan mediante la selección de perfil.</strong></div>
          </div>
          <a className="btn btn-primary panel-back" href={pageUrl('home')}>Volver al sitio</a>
        </div>
      </div>
    </main>
  )
}

function App() {
  const page = currentPage()
  const [cart, setCart] = useState(readCart)
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    try {
      localStorage.setItem('bellaNapoliCart', JSON.stringify(cart))
    } catch (error) {
      console.error('No se pudo guardar el carrito.', error)
    }
  }, [cart])

  useEffect(() => {
    const titles = { home: 'Inicio', menu: 'Menú', about: 'Nosotros', order: 'Mi pedido', login: 'Acceso de personal', panel: 'Panel de personal' }
    document.title = `${titles[page] || 'Bella Napoli'} | Bella Napoli`
  }, [page])

  function addToCart(item) {
    setCart((items) => [...items, item])
  }

  let content
  switch (page) {
    case 'menu':
      content = <MenuPage addToCart={addToCart} />
      break
    case 'about':
      content = <AboutPage />
      break
    case 'order':
      content = <OrderPage cart={cart} updateCart={setCart} />
      break
    case 'login':
      content = <LoginPage />
      break
    case 'panel':
      content = <StaffPanel />
      break
    default:
      content = <HomePage />
  }

  const staffPage = page === 'login' || page === 'panel'
  return (
    <>
      {!staffPage && <Header page={page} count={count} />}
      {content}
      {!staffPage && <Footer />}
    </>
  )
}

export default App
