import aboutBackground from '../assets/nosotros.png'
import oven from '../assets/horno.jpg'
import flour from '../assets/harina.jpg'
import { PageHero } from './PageHero.jsx'

export function AboutPage() {
  return (
    <main id="contenido">
      <PageHero image={aboutBackground} title="Nosotros" subtitle="Más que pizza, una pasión" />
      <section className="about-editorial">
        <div className="container">
          <div className="story-row">
            <div className="story-copy"><p className="eyebrow">BELLA NAPÓLI</p><h2>Nuestra historia</h2><p>Bella Napóli nace del amor por la cocina italiana y la tradición de compartir una buena pizza. Cada pedido se prepara buscando ese equilibrio entre una masa artesanal, ingredientes frescos y sabores que reúnen a las personas.</p></div>
            <img src={oven} alt="Pizza artesanal Bella Napóli" />
          </div>
          <div className="unique">
            <img src={flour} alt="Ingredientes frescos" />
            <div><h2>Lo que nos hace únicos</h2>
              <div className="unique-list">
                <div className="unique-item"><span>🌿</span><div><strong>Ingredientes frescos</strong>Seleccionados para cada preparación.</div></div>
                <div className="unique-item"><span>🔥</span><div><strong>Preparación artesanal</strong>Hecha con cuidado en cada pedido.</div></div>
                <div className="unique-item"><span>🍕</span><div><strong>Recetas con inspiración italiana</strong>Sabores clásicos con nuestro toque.</div></div>
                <div className="unique-item"><span>♡</span><div><strong>Hecha con pasión</strong>Para compartir buenos momentos.</div></div>
              </div>
            </div>
          </div>
          <p className="about-quote">“La verdadera pizza se disfruta con buenos ingredientes y mejores momentos.”</p>
        </div>
      </section>
    </main>
  )
}
