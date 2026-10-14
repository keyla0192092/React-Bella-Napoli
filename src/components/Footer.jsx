import logo from '../assets/logo-bella-napoli.png'
import { pageUrl } from './utils.js'

export function Footer() {
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
