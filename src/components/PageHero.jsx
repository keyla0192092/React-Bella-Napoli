export function PageHero({ image, title, subtitle }) {
  return (
    <section className="page-hero">
      <img src={image} alt="" />
      <div><h1>{title}</h1><p>{subtitle}</p><div className="checker" /></div>
    </section>
  )
}
