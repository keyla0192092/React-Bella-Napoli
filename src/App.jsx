import { useEffect, useState } from 'react'
import './App.css'
import './assets/styles.css'
import { AboutPage } from './components/AboutPage.jsx'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { HomePage } from './components/HomePage.jsx'
import { LoginPage } from './components/LoginPage.jsx'
import { MenuPage } from './components/MenuPage.jsx'
import { OrderPage } from './components/OrderPage.jsx'
import { StaffPanel } from './components/StaffPanel.jsx'
import { currentPage } from './components/utils.js'
import {
  clearCartItems,
  createCartItem,
  deleteCartItem,
  ensureGuestSession,
  listCartItems,
  updateCartItemQuantity,
} from './lib/store.js'

function App() {
  const page = currentPage()
  const [cart, setCart] = useState([])
  const [cartStatus, setCartStatus] = useState('loading')
  const [connectionError, setConnectionError] = useState('')
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    setCartStatus('loading')
    setConnectionError('')
    try {
      await ensureGuestSession()
      setCart(await listCartItems())
      setCartStatus('ready')
    } catch (error) {
      console.error('No se pudo conectar con Supabase.', error)
      setConnectionError('No se pudo conectar con Supabase. Comprueba la configuración y vuelve a intentarlo.')
      setCartStatus('error')
    }
  }

  useEffect(() => {
    const titles = { home: 'Inicio', menu: 'Menú', about: 'Nosotros', order: 'Mi pedido', login: 'Acceso de personal', panel: 'Panel de personal' }
    document.title = `${titles[page] || 'Bella Napoli'} | Bella Napoli`
  }, [page])

  async function addToCart(item) {
    const savedItem = await createCartItem(item)
    setCart((items) => [...items, savedItem])
  }

  async function changeCartItemQuantity(id, quantity) {
    const savedItem = await updateCartItemQuantity(id, quantity)
    setCart((items) => items.map((item) => item.id === id ? savedItem : item))
  }

  async function removeCartItem(id) {
    await deleteCartItem(id)
    setCart((items) => items.filter((item) => item.id !== id))
  }

  async function clearCart() {
    await clearCartItems(cart.map((item) => item.id))
    setCart([])
  }

  if (cartStatus === 'loading') {
    return <main className="section"><div className="container"><p role="status">Conectando con Bella Napoli...</p></div></main>
  }

  if (cartStatus === 'error') {
    return (
      <main className="section">
        <div className="container">
          <p className="form-status error" role="alert">{connectionError}</p>
          <button className="btn btn-primary" type="button" onClick={loadCart}>Reintentar</button>
        </div>
      </main>
    )
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
      content = (
        <OrderPage
          cart={cart}
          updateCartItem={changeCartItemQuantity}
          removeCartItem={removeCartItem}
          clearCart={clearCart}
        />
      )
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
