create table public.orders (
  id uuid primary key,
  user_id uuid not null,
  customer_name text not null,
  phone text not null,
  delivery_address text not null,
  delivery_reference text not null,
  notes text not null,
  items jsonb not null,
  total numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
revoke all on table public.orders from public, anon, authenticated;

create schema if not exists checkout_private;
revoke all on schema checkout_private from public, anon, authenticated;
grant usage on schema checkout_private to authenticated;

create function checkout_private.place_order(
  request_id uuid,
  item_ids uuid[],
  expected_total numeric,
  customer_name text,
  phone text,
  delivery_address text,
  delivery_reference text,
  notes text
)
returns numeric
language plpgsql
security definer
set search_path = ''
as $$
declare
  customer_id uuid := auth.uid();
  order_items jsonb;
  order_total numeric;
  item_count integer;
begin
  if customer_id is null or request_id is null then
    raise exception 'Se requiere una sesión y un identificador de pedido';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(customer_id::text, 0));

  select o.total into order_total
    from public.orders o
    where o.id = request_id and o.user_id = customer_id;
  if found then
    return order_total;
  end if;

  if coalesce(cardinality(item_ids), 0) = 0
    or coalesce(length(trim(customer_name)), 0) not between 1 and 120
    or phone is null or phone !~ '^[0-9]{7,8}$'
    or coalesce(length(trim(delivery_address)), 0) not between 1 and 250
    or length(coalesce(delivery_reference, '')) > 250
    or length(coalesce(notes, '')) > 500 then
    raise exception 'Datos de entrega o carrito inválidos';
  end if;

  with removed as (
    delete from public.cart_items
      where user_id = customer_id and id = any(item_ids)
      returning pizza_id, size, extras, quantity, created_at, id
  ), priced as (
    select r.*, p.name,
      p.base_price
        + case r.size when 'Mediana' then 8 when 'Grande' then 15 else 0 end
        + case when 'Queso extra' = any(r.extras) then 5 else 0 end
        + case when 'Pepperoni extra' = any(r.extras) then 7 else 0 end
        + case when 'Champiñones' = any(r.extras) then 5 else 0 end
        + case when 'Aceitunas' = any(r.extras) then 4 else 0 end as unit_price
    from removed r join public.pizzas p on p.id = r.pizza_id
  )
  select count(*), sum(unit_price * quantity),
    jsonb_agg(jsonb_build_object(
      'pizza_id', pizza_id, 'name', name, 'size', size, 'extras', extras,
      'quantity', quantity, 'unit_price', unit_price
    ) order by created_at, id)
  into item_count, order_total, order_items
  from priced;

  if item_count <> cardinality(item_ids) or order_total is distinct from expected_total then
    raise exception 'El carrito o el precio cambió. Vuelve a cargar la página.';
  end if;

  insert into public.orders (id, user_id, customer_name, phone, delivery_address, delivery_reference, notes, items, total)
    values (request_id, customer_id, trim(customer_name), phone, trim(delivery_address),
      trim(coalesce(delivery_reference, '')), trim(coalesce(notes, '')), order_items, order_total);

  return order_total;
end;
$$;

revoke all on function checkout_private.place_order(uuid, uuid[], numeric, text, text, text, text, text) from public, anon, authenticated;
grant execute on function checkout_private.place_order(uuid, uuid[], numeric, text, text, text, text, text) to authenticated;

create function public.place_order(
  request_id uuid, item_ids uuid[], expected_total numeric, customer_name text,
  phone text, delivery_address text, delivery_reference text, notes text
)
returns numeric
language sql
security invoker
set search_path = ''
as $$
  select checkout_private.place_order($1, $2, $3, $4, $5, $6, $7, $8);
$$;

revoke all on function public.place_order(uuid, uuid[], numeric, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.place_order(uuid, uuid[], numeric, text, text, text, text, text) to authenticated;
