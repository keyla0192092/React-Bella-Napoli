import logo from '../assets/logo-bella-napoli.png'
import { pageLinks } from './data.js'
import { pageUrl } from './utils.js'

export function Header({ page, count }) {
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
