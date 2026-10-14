import { useEffect } from 'react'
import { pageUrl } from './utils.js'

export function StaffPanel() {
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
