import heroPizza from '../assets/fondo pizza.png'
import chef from '../assets/chef.jpg'
import { pageUrl } from './utils.js'

export function HomePage() {
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
