import { getSupabaseClient } from './supabase.js'

const CART_COLUMNS = 'id, pizza_id, name, size, extras, price, quantity'
const CART_SIZES = new Set(['Pequeña', 'Mediana', 'Grande'])
const CART_EXTRAS = new Set(['Queso extra', 'Pepperoni extra', 'Champiñones', 'Aceitunas'])
let guestUserIdPromise

function mapCartItem(row) {
  return {
    id: row.id,
    pizzaId: row.pizza_id,
    name: row.name,
    size: row.size,
    extras: row.extras,
    price: Number(row.price),
    quantity: row.quantity,
  }
}

export function ensureGuestSession() {
  if (!guestUserIdPromise) {
    guestUserIdPromise = (async () => {
      const client = getSupabaseClient()
      const { data: sessionData, error: sessionError } = await client.auth.getSession()
      if (sessionError) throw sessionError
      if (sessionData.session) return sessionData.session.user.id

      const { data, error } = await client.auth.signInAnonymously()
      if (error) throw error
      if (!data.user) throw new Error('Supabase Auth returned no guest user.')
      return data.user.id
    })()
  }

  const sessionPromise = guestUserIdPromise
  return sessionPromise.finally(() => {
    if (guestUserIdPromise === sessionPromise) guestUserIdPromise = null
  })
}

export async function listPizzas() {
  const { data, error } = await getSupabaseClient()
    .from('pizzas')
    .select('id, category, name, description, base_price')
    .order('id')

  if (error) throw error
  return data
}

export async function listCartItems() {
  const userId = await ensureGuestSession()
  const { data, error } = await getSupabaseClient()
    .from('cart_items')
    .select(CART_COLUMNS)
    .eq('user_id', userId)
    .order('created_at')

  if (error) throw error
  return data.map(mapCartItem)
}

export async function createCartItem(item) {
  if (!Number.isInteger(item.pizzaId) || !item.name?.trim() || !item.size || !Array.isArray(item.extras)
    || !CART_SIZES.has(item.size) || item.extras.some((extra) => !CART_EXTRAS.has(extra))
    || !Number.isFinite(item.price) || item.price <= 0) {
    throw new Error('Invalid cart item.')
  }

  const { data, error } = await getSupabaseClient()
    .from('cart_items')
    .insert({
      pizza_id: item.pizzaId,
      name: item.name.trim(),
      size: item.size,
      extras: item.extras,
      price: item.price,
    })
    .select(CART_COLUMNS)
    .single()

  if (error) throw error
  return mapCartItem(data)
}

export async function updateCartItemQuantity(id, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Cart quantity must be a positive integer.')
  }

  const { data, error } = await getSupabaseClient()
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .select(CART_COLUMNS)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('The cart item was not found or is not accessible.')
  return mapCartItem(data)
}

export async function deleteCartItem(id) {
  const { data, error } = await getSupabaseClient()
    .from('cart_items')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('The cart item was not found or is not accessible.')
}

export async function clearCartItems(itemIds) {
  if (!Array.isArray(itemIds) || itemIds.some((id) => typeof id !== 'string')) {
    throw new Error('Invalid cart item identifiers.')
  }
  if (itemIds.length === 0) return

  const userId = await ensureGuestSession()
  const { data, error } = await getSupabaseClient()
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .in('id', itemIds)
    .select('id')

  if (error) throw error
  const deletedIds = new Set(data.map((row) => row.id))
  if (deletedIds.size !== itemIds.length || itemIds.some((id) => !deletedIds.has(id))) {
    throw new Error('The cart changed before it could be cleared.')
  }
}
