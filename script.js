// ---- Product data ----
const PRODUCTS = [
  {id:1, name:"Canvas Rucksack 32L", cat:"Packs", price:3499, icon:"pack"},
  {id:2, name:"Waxed Trail Jacket", cat:"Apparel", price:5299, icon:"jacket"},
  {id:3, name:"Folding Camp Stove", cat:"Cookware", price:1899, icon:"stove"},
  {id:4, name:"Enamel Mug Set", cat:"Cookware", price:799, icon:"mug"},
  {id:5, name:"Leather Trail Boots", cat:"Footwear", price:6499, icon:"boot"},
  {id:6, name:"Merino Base Layer", cat:"Apparel", price:2199, icon:"shirt"},
  {id:7, name:"Compact Tent 2P", cat:"Shelter", price:8999, icon:"tent"},
  {id:8, name:"Brass Compass", cat:"Tools", price:1299, icon:"compass"},
];

const ICONS = {
  pack: `<path d="M30 35h40v45a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8z" fill="none" stroke="#F8F5EC" stroke-width="3"/><path d="M38 35v-8a12 12 0 0 1 24 0v8" fill="none" stroke="#F8F5EC" stroke-width="3"/><rect x="40" y="55" width="20" height="14" fill="none" stroke="#B58B46" stroke-width="2.5"/>`,
  jacket: `<path d="M30 30l15-8h10l15 8 5 18-12 4v44H37V52l-12-4z" fill="none" stroke="#F8F5EC" stroke-width="3"/><line x1="50" y1="32" x2="50" y2="86" stroke="#B58B46" stroke-width="2"/>`,
  stove: `<rect x="25" y="55" width="50" height="30" rx="3" fill="none" stroke="#F8F5EC" stroke-width="3"/><circle cx="50" cy="45" r="20" fill="none" stroke="#C1502E" stroke-width="3"/><line x1="50" y1="30" x2="50" y2="22" stroke="#C1502E" stroke-width="3"/>`,
  mug: `<path d="M30 35h35v30a17.5 17.5 0 0 1-35 0z" fill="none" stroke="#F8F5EC" stroke-width="3"/><path d="M65 45h8a8 8 0 0 1 0 16h-8" fill="none" stroke="#B58B46" stroke-width="3"/>`,
  boot: `<path d="M35 25h22v35l18 8v15H35a10 10 0 0 1-10-10V35a10 10 0 0 1 10-10z" fill="none" stroke="#F8F5EC" stroke-width="3"/><line x1="35" y1="35" x2="57" y2="35" stroke="#C1502E" stroke-width="2.5"/><line x1="35" y1="45" x2="57" y2="45" stroke="#C1502E" stroke-width="2.5"/>`,
  shirt: `<path d="M35 28l15 8 15-8 12 14-10 9v44H33V51l-10-9z" fill="none" stroke="#F8F5EC" stroke-width="3"/>`,
  tent: `<path d="M50 20L85 80H15z" fill="none" stroke="#F8F5EC" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="80" stroke="#B58B46" stroke-width="2"/><path d="M40 80v-15a10 10 0 0 1 20 0v15" fill="none" stroke="#C1502E" stroke-width="2.5"/>`,
  compass: `<circle cx="50" cy="50" r="30" fill="none" stroke="#F8F5EC" stroke-width="3"/><polygon points="50,28 58,50 50,72 42,50" fill="none" stroke="#C1502E" stroke-width="2.5"/><circle cx="50" cy="50" r="3" fill="#B58B46"/>`,
};

let cart = JSON.parse(localStorage.getItem('fieldnote_cart') || '[]');

function fmt(n){ return '₹' + n.toLocaleString('en-IN'); }

function renderProducts(){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="card">
      <div class="tagpunch"></div>
      <div class="thumb"><svg viewBox="0 0 100 100">${ICONS[p.icon]}</svg></div>
      <div class="body">
        <div class="cat">${p.cat}</div>
        <h3>${p.name}</h3>
        <div class="desc">Durable, repairable, built from materials that earn their wear.</div>
        <div class="row">
          <span class="price">${fmt(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function saveCart(){
  localStorage.setItem('fieldnote_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, btn){
  const existing = cart.find(c => c.id === id);
  if(existing){ existing.qty++; } else { cart.push({id, qty:1}); }
  saveCart();
  showToast('Added to cart');
  if(btn){
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(()=>{ btn.textContent='Add to cart'; btn.classList.remove('added'); }, 1200);
  }
}

function changeQty(id, delta){
  const line = cart.find(c => c.id === id);
  if(!line) return;
  line.qty += delta;
  if(line.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
}

function removeLine(id){
  cart = cart.filter(c => c.id !== id);
  saveCart();
}

function updateCartUI(){
  const count = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cart-count').textContent = count;

  const itemsEl = document.getElementById('cart-items');
  if(cart.length === 0){
    itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.<br>Go find something worth carrying.</div>`;
  } else {
    itemsEl.innerHTML = cart.map(line => {
      const p = PRODUCTS.find(p => p.id === line.id);
      return `
      <div class="cart-line">
        <div class="thumb-sm"><svg viewBox="0 0 100 100">${ICONS[p.icon]}</svg></div>
        <div class="info">
          <div class="name">${p.name}</div>
          <div class="meta">
            <button class="qty-btn" data-act="dec" data-id="${p.id}">−</button>
            <span>${line.qty}</span>
            <button class="qty-btn" data-act="inc" data-id="${p.id}">+</button>
            <span>${fmt(p.price * line.qty)}</span>
          </div>
          <button class="remove-btn" data-act="remove" data-id="${p.id}">Remove</button>
        </div>
      </div>`;
    }).join('');
  }

  const total = cart.reduce((s,c)=>{
    const p = PRODUCTS.find(p=>p.id===c.id);
    return s + p.price * c.qty;
  },0);
  document.getElementById('cart-total').textContent = fmt(total);
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1600);
}

function openCart(){ document.getElementById('cart-drawer').classList.add('open'); document.getElementById('overlay').classList.add('open'); }
function closeCart(){ document.getElementById('cart-drawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }

document.addEventListener('click', e=>{
  if(e.target.matches('.add-btn')){
    addToCart(Number(e.target.dataset.id), e.target);
  }
  if(e.target.matches('.qty-btn')){
    const id = Number(e.target.dataset.id);
    changeQty(id, e.target.dataset.act === 'inc' ? 1 : -1);
  }
  if(e.target.matches('.remove-btn')){
    removeLine(Number(e.target.dataset.id));
  }
});

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);
document.getElementById('checkout-btn').addEventListener('click', ()=>{
  if(cart.length === 0){ showToast('Your cart is empty'); return; }
  showToast('This is a demo — no real checkout');
});

renderProducts();
updateCartUI();