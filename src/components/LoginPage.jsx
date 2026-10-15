import { useState } from 'react'
import logo from '../assets/logo-bella-napoli.png'
import { pageUrl } from './utils.js'

export function LoginPage() {
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
