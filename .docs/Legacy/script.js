const pizzas = [
  {id:1,category:"clasicas",name:"Margarita",description:"Salsa de tomate, mozzarella y albahaca fresca.",base:120,image:"imagenes/margarita.jpg",position:"center"},
  {id:2,category:"clasicas",name:"Pepperoni",description:"Mozzarella, salsa de tomate y pepperoni.",base:135,image:"imagenes/pepperoni.jpg",position:"center"},
  {id:3,category:"clasicas",name:"Napolitana",description:"Mozzarella, tomate, aceitunas, albahaca y orégano.",base:130,image:"imagenes/napolitana.jpg",position:"center"},
  {id:4,category:"especiales",name:"Hawaiana",description:"Mozzarella, jamón y piña.",base:135,image:"imagenes/hawaiana.jpg",position:"center"},
  {id:5,category:"vegetarianas",name:"Vegetariana",description:"Mozzarella, champiñones, pimiento, cebolla y aceitunas.",base:130,image:"imagenes/vegetariana.jpg",position:"center"},
  {id:6,category:"especiales",name:"Carnívora",description:"Mozzarella, jamón, pepperoni, tocino y carne.",base:145,image:"imagenes/carnivora.webp",position:"center"}
];

const sizes = [
  {id:"pequena",name:"Pequeña",extra:0},
  {id:"mediana",name:"Mediana",extra:8},
  {id:"grande",name:"Grande",extra:15}
];

const extras = [
  {id:"queso",name:"Queso extra",extra:5},
  {id:"pepperoni",name:"Pepperoni extra",extra:7},
  {id:"champi",name:"Champiñones",extra:5},
  {id:"aceitunas",name:"Aceitunas",extra:4}
];

let cart = JSON.parse(localStorage.getItem("bellaNapoliCart") || "[]");
let activePizza = null;

const money = n => `Bs ${n.toFixed(0)}`;

function saveCart(){
  localStorage.setItem("bellaNapoliCart", JSON.stringify(cart));
}

function renderMenu(category = "todas"){
  const list = document.getElementById("pizza-list");
  if(!list) return;
  const visiblePizzas = category === "todas" ? pizzas : pizzas.filter(p => p.category === category);
  list.innerHTML = visiblePizzas.map(p => `
    <article class="pizza-card">
      <div class="pizza-art">
        <img src="${p.image}" alt="Pizza ${p.name}" loading="lazy" style="object-position:${p.position || 'center'}">
        <span class="pizza-photo-label">${p.name}</span>
      </div>
      <div class="pizza-body">
        <h3>${p.name}</h3>
        <p class="pizza-description">${p.description}</p>
        <div class="price-row">
          <span class="price">${money(p.base)}</span>
          <button class="btn btn-primary" type="button" data-customize="${p.id}">Agregar 🛒</button>
        </div>
      </div>
    </article>
  `).join("");
}

function openCustomizer(id){
  activePizza = pizzas.find(p => p.id === Number(id));
  const modal = document.getElementById("customizer");
  const content = document.getElementById("customizer-content");

  content.innerHTML = `
    <p class="eyebrow">PERSONALIZA TU PIZZA</p>
    <h2 id="customizer-title">${activePizza.name}</h2>
    <p>${activePizza.description}</p>

    <fieldset class="option-group">
      <legend>Tamaño</legend>
      <div class="option-list">
        ${sizes.map((s,i) => `
          <label class="option-label">
            <input type="radio" name="size" value="${s.id}" data-extra="${s.extra}" ${i===1?"checked":""}>
            <span>${s.name}</span>
            <span class="option-price">${s.extra ? "+"+money(s.extra) : "Incluido"}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>

    <fieldset class="option-group">
      <legend>Ingredientes extras <span class="help-text">(puedes elegir varios)</span></legend>
      <div class="option-list">
        ${extras.map(e => `
          <label class="option-label">
            <input type="checkbox" name="extra" value="${e.id}" data-extra="${e.extra}">
            <span>${e.name}</span>
            <span class="option-price">+${money(e.extra)}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>

    <div class="custom-total">Total: <span id="custom-total">${money(activePizza.base + 8)}</span></div>
    <div id="custom-live" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    <button class="btn btn-primary btn-full" type="button" id="add-custom">Agregar al carrito</button>
  `;

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  content.querySelectorAll('input[name="size"], input[name="extra"]').forEach(input => {
    input.addEventListener("change", updateCustomizerTotal);
  });
  document.getElementById("add-custom").addEventListener("click", addCustomizedPizza);
  updateCustomizerTotal();
}

function updateCustomizerTotal(){
  if(!activePizza) return;
  const size = document.querySelector('input[name="size"]:checked');
  const selectedExtras = [...document.querySelectorAll('input[name="extra"]:checked')];
  const total = activePizza.base + Number(size?.dataset.extra || 0) +
    selectedExtras.reduce((sum,e) => sum + Number(e.dataset.extra),0);
  document.getElementById("custom-total").textContent = money(total);
  document.getElementById("custom-live").textContent = `Total actualizado: ${money(total)}`;
}

function addCustomizedPizza(){
  const size = document.querySelector('input[name="size"]:checked');
  const selectedExtras = [...document.querySelectorAll('input[name="extra"]:checked')];
  const sizeData = sizes.find(s => s.id === size.value);
  const extraData = selectedExtras.map(e => extras.find(x => x.id === e.value));
  const total = activePizza.base + sizeData.extra + extraData.reduce((sum,e)=>sum+e.extra,0);

  cart.push({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    pizzaId: activePizza.id,
    name: activePizza.name,
    size: sizeData.name,
    extras: extraData.map(e=>e.name),
    price: total,
    quantity: 1
  });
  saveCart();
  renderCart();
  closeModal();
  window.location.href = "pedido.html";
}

function renderCart(){
  const box = document.getElementById("cart-items");
  const count = cart.reduce((sum,item)=>sum+item.quantity,0);
  const total = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);

  const countEl = document.getElementById("cart-count");
  if(countEl){ countEl.textContent = count; countEl.setAttribute("aria-label", `${count} producto${count===1?"":"s"}`); }
  const totalEl = document.getElementById("cart-total");
  if(totalEl) totalEl.textContent = money(total);
  if(!box) return;

  if(!cart.length){
    box.innerHTML = `<p class="empty-state">Tu carrito está vacío. Agrega una pizza desde el menú.</p>`;
    return;
  }

  box.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <p>Tamaño: ${item.size}</p>
        <p>Extras: ${item.extras.length ? item.extras.join(", ") : "Ninguno"}</p>
        <div class="qty-controls" aria-label="Cantidad de ${item.name}">
          <button type="button" data-qty="-1" data-id="${item.id}" aria-label="Disminuir cantidad de ${item.name}">−</button>
          <strong aria-live="polite">${item.quantity}</strong>
          <button type="button" data-qty="1" data-id="${item.id}" aria-label="Aumentar cantidad de ${item.name}">+</button>
          <button type="button" data-remove="${item.id}" aria-label="Eliminar ${item.name}" title="Eliminar">🗑</button>
        </div>
      </div>
      <strong>${money(item.price * item.quantity)}</strong>
    </div>
  `).join("");

  box.querySelectorAll("[data-qty]").forEach(btn => {
    btn.addEventListener("click", () => changeQuantity(btn.dataset.id, Number(btn.dataset.qty)));
  });
  box.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => removeItem(btn.dataset.remove));
  });
}

function changeQuantity(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.quantity += delta;
  if(item.quantity <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
  announceCartChange();
}

function removeItem(id){
  cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
  announceCartChange();
}

function announceCartChange(){
  const total = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const live = document.getElementById("live-total");
  if(live) live.textContent = `Carrito actualizado. Total: ${money(total)}`;
}

function closeModal(){
  const modal = document.getElementById("customizer");
  if(!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  activePizza = null;
}

function validateField(input, message){
  const error = document.getElementById(`${input.id}-error`);
  if(!input.validity.valid){
    error.textContent = message;
    input.setAttribute("aria-invalid","true");
    return false;
  }
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  return true;
}

document.addEventListener("click", e => {
  const btn = e.target.closest("[data-customize]");
  if(btn) openCustomizer(btn.dataset.customize);
  if(e.target.matches("[data-close-modal]")) closeModal();
});

document.addEventListener("keydown", e => {
  const modal = document.getElementById("customizer");
  if(e.key === "Escape" && modal && !modal.hidden) closeModal();
});

const checkoutForm = document.getElementById("checkout-form");
if(checkoutForm) checkoutForm.addEventListener("submit", e => {
  e.preventDefault();
  const form = e.currentTarget;
  const nombre = document.getElementById("nombre");
  const telefono = document.getElementById("telefono");
  const direccion = document.getElementById("direccion");
  let valid = true;

  valid = validateField(nombre, "Ingresa tu nombre completo.") && valid;
  valid = validateField(telefono, "Ingresa un teléfono válido de 7 u 8 dígitos.") && valid;
  valid = validateField(direccion, "Ingresa tu dirección de entrega.") && valid;

  if(!cart.length){
    document.getElementById("form-status").className = "form-status error";
    document.getElementById("form-status").textContent = "Agrega al menos una pizza antes de confirmar el pedido.";
    return;
  }

  if(!valid){
    document.getElementById("form-status").className = "form-status error";
    document.getElementById("form-status").textContent = "Revisa los campos marcados antes de continuar.";
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  const total = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  document.getElementById("form-status").className = "form-status success";
  document.getElementById("form-status").textContent = `¡Pedido recibido, ${nombre.value}! Total a pagar: ${money(total)}. Te contactaremos al ${telefono.value}.`;
  cart = [];
  saveCart();
  renderCart();
  form.reset();
  announceCartChange();
});

["nombre","telefono","direccion"].forEach(id => {
  const field = document.getElementById(id);
  if(!field) return;
  field.addEventListener("blur", e => {
    const messages = {
      nombre:"Ingresa tu nombre completo.",
      telefono:"Ingresa un teléfono válido de 7 u 8 dígitos.",
      direccion:"Ingresa tu dirección de entrega."
    };
    validateField(e.target,messages[id]);
  });
});


function initHeroMotion(){
  const wrap = document.getElementById("hero-photo-wrap");
  if(!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const pieces = [...wrap.querySelectorAll(".floating-svg")];
  wrap.addEventListener("pointermove", e => {
    if(e.pointerType === "touch") return;
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width-.5);
    const y = ((e.clientY-r.top)/r.height-.5);
    pieces.forEach((el,i)=>{
      const d=(i+1)*10;
      el.style.setProperty("--px", `${x*d}px`);
      el.style.setProperty("--py", `${y*d}px`);
    });
  });
  wrap.addEventListener("pointerleave",()=>pieces.forEach(el=>{el.style.setProperty("--px","0px");el.style.setProperty("--py","0px");}));
}

function setupMenuTabs(){
  const tabs = [...document.querySelectorAll(".menu-tab")];
  if(!tabs.length) return;
  const categories = ["todas", "clasicas", "especiales", "vegetarianas"];
  tabs.forEach((tab, index) => {
    tab.dataset.category = categories[index] || "todas";
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderMenu(tab.dataset.category);
      document.getElementById("pizza-list")?.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });
}

setupMenuTabs();
renderMenu();
renderCart();
initHeroMotion();
