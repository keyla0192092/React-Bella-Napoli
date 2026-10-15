import { useEffect, useState } from 'react'
import menuBackground from '../assets/fondo menu.png'
import { extras, pizzas, sizes } from './data.js'
import { PageHero } from './PageHero.jsx'
import { formatMoney, pageUrl } from './utils.js'

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

export function MenuPage({ addToCart }) {
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
