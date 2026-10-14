export const formatMoney = (amount) => `Bs ${amount.toFixed(0)}`

export const pageUrl = (page) => page === 'home'
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}?page=${page}`

export function currentPage() {
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

export function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('bellaNapoliCart') || '[]')
    return Array.isArray(saved) ? saved : []
  } catch (error) {
    console.error('No se pudo leer el carrito guardado.', error)
    return []
  }
}
