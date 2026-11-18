import margaritaPhoto from '../assets/margarita.jpg'
import pepperoniPhoto from '../assets/pepperoni.jpg'
import napolitanaPhoto from '../assets/napolitana.jpg'
import hawaianaPhoto from '../assets/hawaiana.jpg'
import vegetarianaPhoto from '../assets/vegetariana.jpg'
import carnivoraPhoto from '../assets/carnivora.webp'

export const pizzaImages = [
  { id: 1, image: margaritaPhoto },
  { id: 2, image: pepperoniPhoto },
  { id: 3, image: napolitanaPhoto },
  { id: 4, image: hawaianaPhoto },
  { id: 5, image: vegetarianaPhoto },
  { id: 6, image: carnivoraPhoto },
]

export const sizes = [
  { id: 'pequena', name: 'Pequeña', extra: 0 },
  { id: 'mediana', name: 'Mediana', extra: 8 },
  { id: 'grande', name: 'Grande', extra: 15 },
]

export const extras = [
  { id: 'queso', name: 'Queso extra', extra: 5 },
  { id: 'pepperoni', name: 'Pepperoni extra', extra: 7 },
  { id: 'champi', name: 'Champiñones', extra: 5 },
  { id: 'aceitunas', name: 'Aceitunas', extra: 4 },
]

export const pageLinks = [
  ['Inicio', 'home'],
  ['Menú', 'menu'],
  ['Nosotros', 'about'],
  ['Mi pedido', 'order'],
]
