import { useState } from 'react'
import orderBackground from '../assets/pedido.png'
import { PageHero } from './PageHero.jsx'
import { formatMoney } from './utils.js'

export function OrderPage({ cart, updateCart }) {
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
