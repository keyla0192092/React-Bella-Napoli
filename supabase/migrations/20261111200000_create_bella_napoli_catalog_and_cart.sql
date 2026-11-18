create table public.pizzas (
  id integer primary key,
  category text not null check (category in ('clasicas', 'especiales', 'vegetarianas')),
  name text not null unique,
  description text not null,
  base_price numeric(10, 2) not null check (base_price > 0)
);

alter table public.pizzas enable row level security;

revoke all on table public.pizzas from public, anon, authenticated;
grant select on table public.pizzas to anon, authenticated;

create policy "Anyone can read the pizza catalog"
  on public.pizzas
  for select
  to anon, authenticated
  using (true);

insert into public.pizzas (id, category, name, description, base_price)
values
  (1, 'clasicas', 'Margarita', 'Salsa de tomate, mozzarella y albahaca fresca.', 120),
  (2, 'clasicas', 'Pepperoni', 'Mozzarella, salsa de tomate y pepperoni.', 135),
  (3, 'clasicas', 'Napolitana', 'Mozzarella, tomate, aceitunas, albahaca y orégano.', 130),
  (4, 'especiales', 'Hawaiana', 'Mozzarella, jamón y piña.', 135),
  (5, 'vegetarianas', 'Vegetariana', 'Mozzarella, champiñones, pimiento, cebolla y aceitunas.', 130),
  (6, 'especiales', 'Carnívora', 'Mozzarella, jamón, pepperoni, tocino y carne.', 145)
on conflict (id) do update
set category = excluded.category,
    name = excluded.name,
    description = excluded.description,
    base_price = excluded.base_price;

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pizza_id integer not null references public.pizzas (id) on delete restrict,
  name text not null check (length(trim(name)) > 0),
  size text not null check (size in ('Pequeña', 'Mediana', 'Grande')),
  extras text[] not null default '{}'::text[]
    check (extras <@ array['Queso extra', 'Pepperoni extra', 'Champiñones', 'Aceitunas']::text[]),
  price numeric(10, 2) not null check (price > 0),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index cart_items_user_created_at_idx
  on public.cart_items (user_id, created_at);

alter table public.cart_items enable row level security;

revoke all on table public.cart_items from public, anon, authenticated;
grant select, insert, update, delete on table public.cart_items to authenticated;

create policy "Users can read their own cart items"
  on public.cart_items
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add items to their own cart"
  on public.cart_items
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own cart items"
  on public.cart_items
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own cart items"
  on public.cart_items
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
