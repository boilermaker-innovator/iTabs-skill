// iTabs Queue — TEMPLATE (staff/operator side) — v2
// Separate val from the customer menu val, sharing the same blob storage keys.
// Paste into its own Val.town HTTP val, bookmark this val's URL on the venue's iPad.
//
// SETUP FOR A NEW VENUE:
// 1. Set SLUG below to match the customer menu val's SLUG exactly.
// 2. Nothing else needs editing — venue name, emoji, and colour all pull
//    automatically from the menu val's settings blob.
//
// v2 CHANGE: manual "Add Order" panel is now a mini-cart — staff can add
// several different items (with quantities) before submitting one order,
// instead of one item = one submit = one order number.

import { blob } from "https://esm.town/v/std/blob";

const SLUG = "REPLACE_WITH_VENUE_SLUG"; // MUST match the customer menu val exactly
const STATE_KEY = "itabs-menu-" + SLUG;
const ORDERS_KEY = "itabs-orders-" + SLUG;
const DEFAULT_EMOJI = "📋"; // shown if a venue hasn't set settings.queueEmoji

async function getState() {
  try {
    const state = await blob.getJSON(STATE_KEY);
    if (state && state.settings && state.categories) return state;
  } catch (e) {}
  return { settings: { venue: "Venue", accent: "#e8791f" }, categories: [] };
}
async function getOrders() {
  try {
    const orders = await blob.getJSON(ORDERS_KEY);
    if (Array.isArray(orders)) return orders;
  } catch (e) {}
  return [];
}
async function saveOrders(orders) {
  await blob.setJSON(ORDERS_KEY, orders);
}
async function nextOrderNumber(orders) {
  const today = new Date().toISOString().slice(0, 10);
  let max = 13;
  for (const o of orders) {
    if (o.createdAt && o.createdAt.slice(0, 10) === today && o.orderNumber > max) max = o.orderNumber;
  }
  return max + 1;
}
function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { "Content-Type": "application/json" } });
}

// venue = { venue, accent, queueEmoji } pulled live from the menu blob so the
// queue always matches whatever the operator set in the menu editor.
function queuePage(venue) {
  const accent = venue.accent || "#e8791f";
  const emoji = venue.queueEmoji || DEFAULT_EMOJI;
  const name = venue.venue || "Venue";
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} — Queue</title>
<style>:root{--bg:#0d0d0d;--card:#1a1414;--panel:#161010;--muted:#b8a89f;--accent:${accent};--header:${accent};--green:#3fae6a;--yellow:#e0b93c;--border:rgba(255,255,255,.1)}*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:#fff;font-family:-apple-system,sans-serif;min-height:100vh}header{background:var(--header);padding:12px 20px;display:flex;justify-content:space-between;align-items:center}.waiting{background:rgba(0,0,0,.25);padding:5px 12px;border-radius:14px;font-size:12px;font-weight:700}.split{display:flex}.entry-panel{width:44%;background:var(--panel);border-right:1px solid var(--border);padding:16px;max-height:100vh;overflow-y:auto}.panel-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px}.coffee-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}.coffee-btn{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 6px;font-size:12px;font-weight:600;text-align:center}.coffee-btn.selected{border-color:var(--accent);background:rgba(232,121,31,.15);color:var(--accent)}.toggle-row{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}.toggle-btn{flex:1;padding:9px;border:1px solid var(--border);border-radius:9px;font-size:12px;font-weight:600;text-align:center;background:rgba(255,255,255,.04);min-width:60px}.toggle-btn.selected{border-color:var(--accent);background:rgba(232,121,31,.15);color:var(--accent)}.name-input{width:100%;background:var(--card);border:1px solid var(--border);color:#fff;border-radius:10px;padding:11px;font-size:13px;margin-bottom:14px}.add-btn{width:100%;background:var(--accent);color:#1a1414;border:none;border-radius:12px;padding:14px;font-weight:800;font-size:14px;cursor:pointer}.add-btn:disabled{opacity:.35;cursor:not-allowed}.add-to-cart-btn{width:100%;background:rgba(255,255,255,.08);color:#fff;border:1px solid var(--border);border-radius:10px;padding:10px;font-weight:700;font-size:13px;margin-bottom:16px;cursor:pointer}.cart-box{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:16px}.cart-empty{color:var(--muted);font-size:12px;text-align:center;padding:6px 0}.cart-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)}.cart-row:last-child{border-bottom:none}.cart-row-name{font-size:13px;flex:1}.cart-row-controls{display:flex;align-items:center;gap:8px}.cart-qty-btn{width:22px;height:22px;border-radius:50%;border:none;background:var(--accent);color:#1a1414;font-weight:800;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center}.cart-qty{min-width:16px;text-align:center;font-size:13px;font-weight:700}.cart-remove{color:#ef4444;font-weight:800;cursor:pointer;font-size:14px;margin-left:4px}.queue-panel{width:56%;padding:16px}.tab-row{display:flex;gap:6px;margin-bottom:12px}.tab-btn{flex:1;padding:9px;border-radius:9px;font-size:12px;font-weight:700;border:1px solid var(--border);background:rgba(255,255,255,.04);color:var(--muted)}.tab-btn.active{background:var(--accent);color:#1a1414;border:none}.order-card{background:var(--card);border:1px solid var(--border);border-left:4px solid var(--yellow);border-radius:12px;padding:12px 14px;margin-bottom:9px}.order-card.paid{border-left-color:var(--green)}.order-card.history{border-left-color:var(--muted);opacity:.75}.order-top{display:flex;justify-content:space-between;margin-bottom:6px}.order-number{font-size:20px;font-weight:800}.order-name{font-size:12px;color:var(--muted);margin-left:8px}.status-pill{font-size:11px;font-weight:700;padding:3px 9px;border-radius:10px}.status-pill.unpaid{background:rgba(224,185,60,.15);color:var(--yellow)}.status-pill.paid{background:rgba(63,174,106,.15);color:var(--green)}.order-items{font-size:13px;margin-bottom:3px}.order-notes{font-size:12px;color:var(--accent);margin-bottom:6px;font-style:italic}.order-total{font-weight:700;color:var(--accent);margin-bottom:8px;font-size:13px}.wait-time{font-size:11px;font-weight:700;margin-bottom:6px}.wait-time.fresh{color:var(--muted)}.wait-time.warn{color:var(--yellow)}.wait-time.late{color:#ef4444}.order-actions{display:flex;gap:8px}.action-btn{flex:1;padding:8px;border-radius:8px;font-size:12px;font-weight:700;border:1px solid var(--border);background:rgba(255,255,255,.05);color:#fff}.action-btn.done-btn{background:var(--accent);color:#1a1414;border:none}.empty{text-align:center;padding:40px;color:var(--muted);font-size:13px}@media (max-width:700px){.split{flex-direction:column}.entry-panel,.queue-panel{width:100%;border-right:none;max-height:none}.entry-panel{border-bottom:1px solid var(--border)}}</style></head>
<body>
<header><div style="font-weight:800">${emoji} ${name}</div><div class="waiting" id="waitingCount">0 waiting</div></header>
<div class="split">
  <div class="entry-panel">
    <div class="panel-title">Add Item</div>
    <div class="coffee-grid" id="coffeeGrid"></div>
    <div class="panel-title" id="sizeLabel" style="display:none">Size</div>
    <div class="toggle-row" id="sizeRow" style="display:none"></div>
    <button class="add-to-cart-btn" id="addToCartBtn" onclick="addSelectedToCart()" disabled>+ Add to order</button>

    <div class="panel-title">Order so far</div>
    <div class="cart-box" id="cartBox"><div class="cart-empty">No items added yet</div></div>

    <div class="panel-title">Name (optional)</div>
    <input class="name-input" id="nameInput" placeholder="e.g. Sarah">
    <div class="panel-title">Notes (optional)</div>
    <input class="name-input" id="notesInput" placeholder="e.g. black tea, oat milk, no sugar">
    <button class="add-btn" id="submitOrderBtn" onclick="submitOrder()" disabled>Add to Queue</button>
  </div>
  <div class="queue-panel">
    <div class="tab-row">
      <button class="tab-btn active" id="tabActive" onclick="switchTab('active')">Active</button>
      <button class="tab-btn" id="tabHistory" onclick="switchTab('history')">History</button>
    </div>
    <div id="queueList"></div>
  </div>
</div>
<script>
  var MENU_FLAT = [];
  var BASE_COFFEES = [];
  var currentTab = 'active';
  var selectedCoffee = null;
  var selectedSizeLabel = null;
  var cart = []; // { name, qty }

  function deriveBaseCoffees(){
    var seen = {}; var list = [];
    MENU_FLAT.forEach(function(name){
      var m = name.match(/^(.*) \\(([^)]+)\\)$/);
      if (m){
        var base=m[1], sizeLabel=m[2];
        if(!seen[base]){ seen[base]={baseName:base, hasSizes:true, sizeLabels:[]}; list.push(seen[base]); }
        seen[base].sizeLabels.push(sizeLabel);
      }
      else { if(!seen[name]){ seen[name]={baseName:name, hasSizes:false, sizeLabels:[]}; list.push(seen[name]); } }
    });
    return list;
  }
  function renderCoffeeGrid(){
    BASE_COFFEES = deriveBaseCoffees();
    var grid = document.getElementById('coffeeGrid');
    grid.innerHTML = '';
    BASE_COFFEES.forEach(function(c){
      var btn = document.createElement('div');
      btn.className = 'coffee-btn'; btn.textContent = c.baseName;
      btn.onclick = function(){ selectCoffee(c, btn); };
      grid.appendChild(btn);
    });
  }
  function selectCoffee(coffee, el){
    var all = document.getElementById('coffeeGrid').children;
    for (var i=0;i<all.length;i++) all[i].classList.remove('selected');
    el.classList.add('selected');
    selectedCoffee = coffee;
    var sizeRow = document.getElementById('sizeRow');
    sizeRow.innerHTML = '';
    if (coffee.hasSizes){
      sizeRow.style.display = 'flex';
      document.getElementById('sizeLabel').style.display = 'block';
      selectedSizeLabel = coffee.sizeLabels[0];
      coffee.sizeLabels.forEach(function(label, idx){
        var btn = document.createElement('div');
        btn.className = 'toggle-btn' + (idx===0 ? ' selected' : '');
        btn.textContent = label;
        btn.onclick = function(){ selectSize(label, btn); };
        sizeRow.appendChild(btn);
      });
    } else {
      sizeRow.style.display = 'none';
      document.getElementById('sizeLabel').style.display = 'none';
      selectedSizeLabel = null;
    }
    document.getElementById('addToCartBtn').disabled = false;
  }
  function selectSize(label, el){
    var all = document.getElementById('sizeRow').children;
    for (var i=0;i<all.length;i++) all[i].classList.remove('selected');
    el.classList.add('selected'); selectedSizeLabel = label;
  }
  function addSelectedToCart(){
    if (!selectedCoffee) return;
    var actualName = selectedCoffee.hasSizes ? (selectedCoffee.baseName+' ('+selectedSizeLabel+')') : selectedCoffee.baseName;
    var existing = cart.find(function(c){ return c.name === actualName; });
    if (existing) existing.qty++;
    else cart.push({ name: actualName, qty: 1 });
    renderCart();
    // Reset selection so staff picks the next item fresh.
    selectedCoffee = null;
    document.getElementById('sizeRow').innerHTML = '';
    document.getElementById('sizeRow').style.display = 'none';
    document.getElementById('sizeLabel').style.display = 'none';
    document.getElementById('addToCartBtn').disabled = true;
    var all = document.getElementById('coffeeGrid').children;
    for (var i=0;i<all.length;i++) all[i].classList.remove('selected');
  }
  function changeCartQty(idx, delta){
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    renderCart();
  }
  function removeCartItem(idx){
    cart.splice(idx, 1);
    renderCart();
  }
  function renderCart(){
    var box = document.getElementById('cartBox');
    if (cart.length === 0){
      box.innerHTML = '<div class="cart-empty">No items added yet</div>';
      document.getElementById('submitOrderBtn').disabled = true;
      return;
    }
    box.innerHTML = '';
    cart.forEach(function(item, idx){
      var row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML =
        '<div class="cart-row-name">'+item.name+'</div>'+
        '<div class="cart-row-controls">'+
          '<button class="cart-qty-btn" onclick="changeCartQty('+idx+',-1)">−</button>'+
          '<div class="cart-qty">'+item.qty+'</div>'+
          '<button class="cart-qty-btn" onclick="changeCartQty('+idx+',1)">+</button>'+
          '<span class="cart-remove" onclick="removeCartItem('+idx+')">×</span>'+
        '</div>';
      box.appendChild(row);
    });
    document.getElementById('submitOrderBtn').disabled = false;
  }
  async function submitOrder(){
    if (cart.length === 0) return;
    var name = document.getElementById('nameInput').value.trim();
    var notes = document.getElementById('notesInput').value.trim();
    var btn = document.getElementById('submitOrderBtn');
    btn.disabled = true; btn.textContent = 'Adding…';
    await fetch('/queue-order', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:name, notes:notes, items: cart })
    });
    cart = [];
    renderCart();
    document.getElementById('nameInput').value=''; document.getElementById('notesInput').value='';
    btn.textContent = 'Add to Queue';
    loadQueue();
  }
  function switchTab(tab){
    currentTab = tab;
    document.getElementById('tabActive').classList.toggle('active', tab==='active');
    document.getElementById('tabHistory').classList.toggle('active', tab==='history');
    loadQueue();
  }
  async function loadQueue(){
    var res = await fetch('/queue-data?tab='+currentTab);
    var data = await res.json();
    MENU_FLAT = data.menuNames;
    if (BASE_COFFEES.length===0) renderCoffeeGrid();
    var orders = data.orders;
    var list = document.getElementById('queueList');
    if (currentTab==='active') document.getElementById('waitingCount').textContent = orders.length+' waiting';
    if (orders.length===0){ list.innerHTML = '<div class="empty">'+(currentTab==='active'?'Queue is empty':'No completed orders yet')+'</div>'; return; }
    list.innerHTML = '';
    orders.forEach(function(o){
      var card = document.createElement('div');
      card.className = 'order-card'+(currentTab==='history'?' history':(o.paid?' paid':''));
      var nameHtml = o.name ? '<span class="order-name">'+o.name+'</span>' : '';
      var actionsHtml = '';
      if (currentTab==='active'){
        actionsHtml = '<div class="order-actions">'+
          (o.paid?'':'<button class="action-btn" onclick="markPaid(\\''+o.id+'\\')">Mark Paid</button>')+
          '<button class="action-btn done-btn" onclick="markDone(\\''+o.id+'\\')">Done</button></div>';
      }
      var waitHtml = '';
      if (currentTab==='active' && o.createdAt){
        var mins = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
        var waitClass = mins >= 10 ? 'late' : (mins >= 5 ? 'warn' : 'fresh');
        var waitLabel = mins < 1 ? 'Just now' : (mins + (mins===1?' min waiting':' min waiting'));
        waitHtml = '<div class="wait-time '+waitClass+'">⏱ '+waitLabel+'</div>';
      }
      card.innerHTML =
        '<div class="order-top"><div><span class="order-number">#'+o.orderNumber+'</span>'+nameHtml+'</div>'+
        '<div class="status-pill '+(o.paid?'paid':'unpaid')+'">'+(o.paid?'Paid':'Unpaid')+'</div></div>'+
        waitHtml+
        '<div class="order-items">'+o.itemsText+'</div>'+
        (o.notes?'<div class="order-notes">📝 '+o.notes+'</div>':'')+
        '<div class="order-total">$'+(o.total).toFixed(2)+'</div>'+
        actionsHtml;
      list.appendChild(card);
    });
  }
  async function markPaid(id){
    await fetch('/mark-paid', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:id})});
    loadQueue();
  }
  async function markDone(id){
    await fetch('/mark-done', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:id})});
    loadQueue();
  }
  loadQueue();
  setInterval(function(){ if(currentTab==='active') loadQueue(); }, 4000);
</script>
</body></html>`;
}

export default async function (req) {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/") {
    const state = await getState();
    return new Response(queuePage(state.settings), { headers: { "Content-Type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }

  if (req.method === "POST" && url.pathname === "/queue-order") {
    let body;
    try { body = await req.json(); } catch (e) { return jsonResponse({ ok: false }); }
    const orders = await getOrders();
    const items = body.items || [];
    const state = await getState();
    const flatMenu = [];
    state.categories.forEach((c) => c.items.forEach((it) => flatMenu.push(it)));
    let totalCents = 0;
    const itemsText = items.map((i) => {
      const menuItem = flatMenu.find((m) => m.name === i.name);
      const price = menuItem ? menuItem.price : 0;
      totalCents += Math.round(price * 100) * i.qty;
      return i.qty + "× " + i.name;
    }).join(", ");
    const orderNumber = await nextOrderNumber(orders);
    const order = {
      id: SLUG + "-" + Date.now().toString(36).toUpperCase(),
      orderNumber, name: body.name || "", notes: body.notes || "",
      itemsText, total: totalCents / 100, paid: false, done: false,
      squareOrderId: "", createdAt: new Date().toISOString(),
    };
    orders.push(order);
    await saveOrders(orders);
    return jsonResponse({ ok: true, orderId: order.id });
  }

  if (req.method === "GET" && url.pathname === "/queue-data") {
    const tab = url.searchParams.get("tab") || "active";
    const orders = await getOrders();
    const state = await getState();
    const menuNames = [];
    state.categories.forEach((c) => c.items.forEach((it) => menuNames.push(it.name)));
    const filtered = tab === "active"
      ? orders.filter((o) => !o.done).sort((a, b) => a.orderNumber - b.orderNumber)
      : orders.filter((o) => o.done).sort((a, b) => b.orderNumber - a.orderNumber).slice(0, 100);
    return jsonResponse({ orders: filtered, menuNames });
  }

  if (req.method === "POST" && url.pathname === "/mark-paid") {
    const body = await req.json();
    const orders = await getOrders();
    const order = orders.find((o) => o.id === body.id);
    if (order) order.paid = true;
    await saveOrders(orders);
    return jsonResponse({ ok: true });
  }

  if (req.method === "POST" && url.pathname === "/mark-done") {
    const body = await req.json();
    const orders = await getOrders();
    const order = orders.find((o) => o.id === body.id);
    if (order) order.done = true;
    await saveOrders(orders);
    return jsonResponse({ ok: true });
  }

  return new Response("Not found", { status: 404 });
}
