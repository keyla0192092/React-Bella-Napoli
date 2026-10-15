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
import { currentPage, readCart } from './components/utils.js'

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
