import margaritaPhoto from '../assets/margarita.jpg'
import pepperoniPhoto from '../assets/pepperoni.jpg'
import napolitanaPhoto from '../assets/napolitana.jpg'
import hawaianaPhoto from '../assets/hawaiana.jpg'
import vegetarianaPhoto from '../assets/vegetariana.jpg'
import carnivoraPhoto from '../assets/carnivora.webp'

export const pizzas = [
  { id: 1, category: 'clasicas', name: 'Margarita', description: 'Salsa de tomate, mozzarella y albahaca fresca.', base: 120, image: margaritaPhoto },
  { id: 2, category: 'clasicas', name: 'Pepperoni', description: 'Mozzarella, salsa de tomate y pepperoni.', base: 135, image: pepperoniPhoto },
  { id: 3, category: 'clasicas', name: 'Napolitana', description: 'Mozzarella, tomate, aceitunas, albahaca y orégano.', base: 130, image: napolitanaPhoto },
  { id: 4, category: 'especiales', name: 'Hawaiana', description: 'Mozzarella, jamón y piña.', base: 135, image: hawaianaPhoto },
  { id: 5, category: 'vegetarianas', name: 'Vegetariana', description: 'Mozzarella, champiñones, pimiento, cebolla y aceitunas.', base: 130, image: vegetarianaPhoto },
  { id: 6, category: 'especiales', name: 'Carnívora', description: 'Mozzarella, jamón, pepperoni, tocino y carne.', base: 145, image: carnivoraPhoto },
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
