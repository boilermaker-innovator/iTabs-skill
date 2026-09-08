// iTabs Menu — Swan Sidewalk Cafe. Blob-backed, photo upload, Queue page for Grace's iPad.
// STAGE 1 — ordering only, no online payment. Paste into a Val.town HTTP val, Save, open the URL.

import { blob } from "https://esm.town/v/std/blob";

const SLUG = "template-test";
const STATE_KEY = "itabs-menu-" + SLUG;
const ORDERS_KEY = "itabs-orders-" + SLUG;
const LOCK_PREFIX = "itabs-lock-" + SLUG + "-";
const DEFAULT_PIN = "7000"; // last 4 of Grace's phone
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const RECOVERY_CODE = "boilermaker-reset-swansidewalk-4821";

const SEED = {
  settings: {
    venue: "Swan Sidewalk Cafe",
    tagline: "Satisfy your Craving",
    phone: "0437 007 000",
    mapUrl: "",
    photoMode: "photos",
    accent: "#e8791f",
    pin: DEFAULT_PIN,
    logo: "",
    heroImg: "",
    eventLabel: "",
    eventCutoff: "",
  },
  categories: [
    {
      name: "Coffee & Hot Drinks",
      categoryPhoto: "",
      items: [
        { name: "Cappuccino (M)", desc: "", price: 5.50, photo: "", popular: true, soldOut: false },
        { name: "Cappuccino (L)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Chai (M)", desc: "", price: 5.50, photo: "", popular: false, soldOut: false },
        { name: "Chai (L)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Dirty Chai (M)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Dirty Chai (L)", desc: "", price: 6.50, photo: "", popular: false, soldOut: false },
        { name: "Flat White (M)", desc: "", price: 5.50, photo: "", popular: true, soldOut: false },
        { name: "Flat White (L)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Hot Chocolate (M)", desc: "", price: 5.50, photo: "", popular: false, soldOut: false },
        { name: "Hot Chocolate (L)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Latte (M)", desc: "", price: 5.50, photo: "", popular: true, soldOut: false },
        { name: "Latte (L)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Long Black (M)", desc: "", price: 4.00, photo: "", popular: false, soldOut: false },
        { name: "Long Black (L)", desc: "", price: 4.50, photo: "", popular: false, soldOut: false },
        { name: "Mocha (M)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Mocha (L)", desc: "", price: 6.50, photo: "", popular: false, soldOut: false },
        { name: "Matcha (M)", desc: "", price: 5.50, photo: "", popular: false, soldOut: false },
        { name: "Matcha (L)", desc: "", price: 6.00, photo: "", popular: false, soldOut: false },
        { name: "Tea (M)", desc: "", price: 4.00, photo: "", popular: false, soldOut: false },
        { name: "Tea (L)", desc: "", price: 4.50, photo: "", popular: false, soldOut: false },
        { name: "Macchiato", desc: "", price: 4.00, photo: "", popular: false, soldOut: false },
        { name: "Long Mac Topped Up", desc: "", price: 5.00, photo: "", popular: false, soldOut: false },
        { name: "Espresso", desc: "", price: 4.50, photo: "", popular: false, soldOut: false },
      ],
    },
  ],
};

async function getState() {
  try {
    const state = await blob.getJSON(STATE_KEY);
    if (state && state.settings && state.categories) return state;
  } catch (e) {}
  return SEED;
}
async function saveState(state) {
  await blob.setJSON(STATE_KEY, state);
}
async function getLock(ip) {
  try {
    const lock = await blob.getJSON(LOCK_PREFIX + ip);
    if (lock) return lock;
  } catch (e) {}
  return { attempts: 0, lockedUntil: 0 };
}
async function setLock(ip, lock) {
  try {
    await blob.setJSON(LOCK_PREFIX + ip, lock);
  } catch (e) {}
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

async function savePhotoBlob(dataUrl) {
  const key = "itabs-photo-" + SLUG + "-" + crypto.randomUUID();
  await blob.setJSON(key, { dataUrl });
  return key;
}
async function getPhotoBlob(key) {
  const data = await blob.getJSON(key);
  return data ? data.dataUrl : null;
}

function getIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}
function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function nextOrderNumber(orders) {
  const today = new Date().toISOString().slice(0, 10);
  let max = 13;
  for (const o of orders) {
    if (
      o.createdAt && o.createdAt.slice(0, 10) === today && o.orderNumber > max
    ) max = o.orderNumber;
  }
  return max + 1;
}

const HTML_TEMPLATE = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Swan Sidewalk Cafe | Order</title>
<style>:root{--bg-main:#0d0d0d;--bg-card:#1a1414;--bg-sheet:#1f1717;--text-primary:#ffffff;--text-muted:#b8a89f;--accent:#e8791f;--accent-ink:#0d0d0d;--border:rgba(255,255,255,0.1)}*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}html{scroll-behavior:smooth;background:#0d0d0d}body{background:var(--bg-main);color:var(--text-primary);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding-bottom:120px;max-width:600px;margin:0 auto}header{position:sticky;top:0;z-index:60;background:rgba(13,13,13,0.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:12px 16px;display:flex;align-items:center;justify-content:space-between}.brand-name{font-size:16px;font-weight:700}.brand-sub{font-size:12px;color:var(--text-muted)}.connect-btn{background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);padding:8px 14px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer}.hero{position:relative;width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,rgba(232,121,31,0.35),rgba(13,13,13,0.9));display:flex;align-items:flex-end;overflow:hidden}.hero-initial{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:96px;font-weight:800;color:rgba(255,255,255,0.10)}.hero-overlay{position:relative;z-index:2;padding:16px 18px 14px;width:100%;background:linear-gradient(0deg,rgba(0,0,0,0.75),transparent)}.hero-overlay h1{font-size:21px;font-weight:800}.hero-overlay p{font-size:12.5px;color:rgba(255,255,255,0.75);margin-top:3px}.event-banner{padding:14px 16px;text-align:center;font-size:16px;font-weight:800;line-height:1.4}.event-banner.open{background:rgba(232,121,31,0.15);color:var(--accent)}.event-banner.closed{background:rgba(239,68,68,0.15);color:#ef4444}.pill-tabs{position:sticky;top:57px;z-index:55;background:var(--bg-main);border-bottom:1px solid var(--border);display:flex;gap:8px;padding:10px 16px;overflow-x:auto;scrollbar-width:none}.pill-tabs::-webkit-scrollbar{display:none}.pill{flex-shrink:0;padding:7px 14px;border-radius:20px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-muted);font-size:12.5px;font-weight:700;cursor:pointer;white-space:nowrap}.pill.active{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}section.menu-section{padding:4px 16px 4px}.cat-block{scroll-margin-top:112px;padding-top:14px}.section-title{font-size:14px;font-weight:800;margin-bottom:8px}.drink-card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:10px}.drink-card.sold-out{opacity:0.5}.photo-tile{width:52px;height:52px;border-radius:10px;background:#2a2020;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:10px;font-weight:700;overflow:hidden}.photo-tile img{width:100%;height:100%;object-fit:cover}.drink-info{flex:1;min-width:0}.drink-name{font-size:14.5px;font-weight:600;margin-bottom:3px}.drink-desc{font-size:12px;color:var(--text-muted);margin-bottom:5px}.badge-row{display:flex;gap:6px;margin-bottom:5px;flex-wrap:wrap}.badge{font-size:10px;background:rgba(232,121,31,0.15);color:var(--accent);padding:2px 7px;border-radius:8px;font-weight:700}.badge.sold-out-badge{background:rgba(239,68,68,0.15);color:#ef4444}.drink-price{font-size:14px;font-weight:700;color:var(--accent)}.quantity-selector{display:flex;align-items:center;gap:8px;background:var(--bg-sheet);border-radius:20px;padding:4px;flex-shrink:0}.qty-btn{width:28px;height:28px;border-radius:50%;border:none;background:var(--accent);color:var(--accent-ink);font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center}.qty-btn:disabled{opacity:0.3;cursor:not-allowed}.qty-display{min-width:18px;text-align:center;font-size:14px;font-weight:700}.see-more-btn{display:block;width:100%;background:none;border:1px dashed var(--border);color:var(--accent);padding:10px;border-radius:12px;font-size:12.5px;font-weight:700;cursor:pointer;margin-bottom:14px}footer{text-align:center;padding:24px 16px 10px;font-size:11px;color:var(--text-muted)}footer .edit-link{display:block;margin-top:10px;color:var(--text-muted);text-decoration:underline;cursor:pointer}.cart-bar{position:fixed;bottom:0;left:0;right:0;display:none;background:var(--accent);color:var(--accent-ink);padding:14px 18px;z-index:70;box-shadow:0 -4px 20px rgba(0,0,0,0.4)}.cart-bar.active{display:flex}.cart-bar-inner{max-width:600px;margin:0 auto;width:100%;display:flex;align-items:center;justify-content:space-between}.cart-count{font-weight:700;font-size:14px}.cart-total{font-weight:800;font-size:15px}.order-btn{background:var(--accent-ink);color:var(--accent);border:none;padding:10px 18px;border-radius:20px;font-weight:700;font-size:13px;cursor:pointer}.overlay-bg{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:100;opacity:0;pointer-events:none;transition:opacity 0.2s}.overlay-bg.active{opacity:1;pointer-events:auto}.bottom-sheet{position:fixed;left:0;right:0;bottom:0;background:var(--bg-sheet);border-radius:20px 20px 0 0;padding:18px 18px 26px;z-index:101;transform:translateY(100%);transition:transform 0.25s ease;max-width:600px;margin:0 auto;max-height:85vh;overflow-y:auto}.bottom-sheet.active{transform:translateY(0)}.sheet-handle{width:40px;height:4px;background:var(--border);border-radius:4px;margin:0 auto 16px}.sheet-title{font-size:17px;font-weight:800;margin-bottom:12px}.sheet-row{display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px;border-bottom:1px solid var(--border)}.sheet-total-row{display:flex;justify-content:space-between;padding:12px 0 0;font-size:15px;font-weight:800}.sheet-note{font-size:12px;color:var(--text-muted);margin:14px 0;text-align:center}.field-label{font-size:11.5px;font-weight:700;color:var(--text-muted);margin:14px 0 6px;text-transform:uppercase}.field-input{width:100%;background:var(--bg-card);border:1px solid var(--border);color:var(--text-primary);border-radius:10px;padding:11px 12px;font-size:13.5px}textarea.field-input{resize:vertical;min-height:60px;font-family:inherit}.chip-row{display:flex;flex-wrap:wrap;gap:8px}.chip{padding:7px 12px;border-radius:16px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-muted);font-size:12px;font-weight:600;cursor:pointer}.chip.selected{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}.cta-btn{width:100%;background:var(--accent);color:var(--accent-ink);border:none;padding:14px;border-radius:14px;font-weight:800;font-size:14.5px;cursor:pointer;margin-top:16px}.cta-btn:disabled{opacity:0.4}.link-btn{display:block;text-align:center;width:100%;background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border);padding:12px;border-radius:14px;font-weight:700;font-size:13.5px;text-decoration:none;margin-top:8px;cursor:pointer}.popup-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.95);background:var(--bg-sheet);border-radius:18px;padding:28px 24px;z-index:102;width:85%;max-width:340px;text-align:center;opacity:0;pointer-events:none;transition:opacity 0.2s,transform 0.2s}.popup-modal.active{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}.popup-modal .check{font-size:40px;margin-bottom:10px}.popup-modal h3{font-size:17px;margin-bottom:6px}.popup-modal p{font-size:12.5px;color:var(--text-muted)}.pin-input-row{display:flex;gap:8px;justify-content:center;margin:18px 0 8px}.pin-digit{width:44px;height:52px;text-align:center;font-size:22px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;color:var(--text-primary)}.pin-msg{text-align:center;font-size:11.5px;color:#ef4444;min-height:14px;margin-bottom:8px}.editor-block-title{font-size:12px;font-weight:800;text-transform:uppercase;color:var(--accent);margin:20px 0 10px}.editor-item-card{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:8px 10px;margin-bottom:6px}.editor-primary-row{display:flex;gap:6px;align-items:center}.editor-thumb-toggle{width:30px;height:30px;border-radius:7px;object-fit:cover;flex-shrink:0;cursor:pointer}.editor-thumb-placeholder{display:flex;align-items:center;justify-content:center;background:var(--bg-sheet);border:1px solid var(--border);font-size:13px}.editor-primary-row input.name-input{flex:2;min-width:0;background:var(--bg-sheet);border:1px solid var(--border);color:var(--text-primary);border-radius:7px;padding:6px 8px;font-size:12.5px}.editor-primary-row input.price-input{width:52px;flex-shrink:0;background:var(--bg-sheet);border:1px solid var(--border);color:var(--text-primary);border-radius:7px;padding:6px 8px;font-size:12.5px}.toggle-chip.compact{font-size:10px;padding:5px 7px;flex-shrink:0}.more-toggle-link{font-size:10.5px;color:var(--text-muted);text-align:right;margin-top:4px;cursor:pointer}.editor-more-section{margin-top:6px;padding-top:6px;border-top:1px solid var(--border)}.editor-item-row{display:flex;gap:6px;align-items:center;margin-bottom:6px}.editor-item-row input,.editor-item-row textarea{background:var(--bg-sheet);border:1px solid var(--border);color:var(--text-primary);border-radius:8px;padding:8px;font-size:12.5px;font-family:inherit}.desc-input{width:100%;min-height:36px}.editor-item-row input.name-input{flex:2}.editor-item-row input.price-input{flex:1;width:60px}.editor-item-row textarea.desc-input{flex:1;width:100%;min-height:36px}.remove-x{color:#ef4444;font-weight:800;cursor:pointer;padding:0 6px;flex-shrink:0}.toggle-row{display:flex;gap:14px;margin-top:4px}.toggle-chip{font-size:11px;font-weight:700;padding:5px 10px;border-radius:10px;background:var(--bg-sheet);border:1px solid var(--border);color:var(--text-muted);cursor:pointer}.toggle-chip.on{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}.toggle-chip.on.danger{background:#ef4444;color:#fff;border-color:#ef4444}.add-item-btn{width:100%;padding:10px;border-radius:12px;background:none;border:1px dashed var(--border);color:var(--accent);font-size:12.5px;font-weight:700;cursor:pointer;margin-bottom:6px}.editor-subtabs{display:flex;gap:8px;margin-bottom:16px}.editor-subtab{flex:1;background:var(--bg-sheet);border:1px solid var(--border);color:var(--text-muted);font-size:12.5px;font-weight:700;padding:10px;border-radius:10px;cursor:pointer}.editor-subtab.active{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}.photo-field-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}.photo-field-row .field-input{flex:1;margin-bottom:0}.upload-btn-label{flex-shrink:0;background:var(--accent);color:var(--accent-ink);font-size:12px;font-weight:700;padding:10px 14px;border-radius:10px;cursor:pointer;white-space:nowrap}.editor-photo-preview{width:44px;height:44px;border-radius:8px;object-fit:cover;background:var(--bg-sheet);flex-shrink:0;margin-bottom:8px}</style>
</head>
<body>

<script>
var CONFIG = {
  venue: "Swan Sidewalk Cafe",
  tagline: "Satisfy your Craving",
  slug: "swan-sidewalk-cafe",
  accent: "#e8791f",
  accentInk: "#0d0d0d",
  phone: "0437 007 000",
  mapUrl: "",
  pin: "7000",
  heroImg: "",
  logo: "",
  photoMode: "photos",
  pickupTimes: [0, 5, 10],
  categories: []
};
var VERSION = "1";
</script>
<script>
var SERVER_DATA = __ITABS_DATA__;
</script>

<header>
  <div><div class="brand-name" id="hdrVenue"></div><div class="brand-sub" id="hdrTagline"></div></div>
  <button class="connect-btn" onclick="openSheet('connectSheet')">Connect</button>
</header>

<div class="event-banner" id="eventBanner" style="display:none;"></div>

<div class="hero" id="hero">
  <div class="hero-initial" id="heroInitial"></div>
  <div class="hero-overlay">
    <h1 id="heroVenue"></h1>
    <p id="heroTagline"></p>
  </div>
</div>

<div class="pill-tabs" id="pillTabs"></div>

<div class="container">
  <section class="menu-section" id="menuSection"></section>
  <footer>
    Powered by iTabs · itabs.ai
    <span class="edit-link" onclick="openPinSheet()">itabs · edit</span>
  </footer>
</div>

<div class="cart-bar" id="cartBar">
  <div class="cart-bar-inner">
    <div><div class="cart-count" id="cartCount">0 items</div><div class="cart-total" id="cartTotal">$0.00</div></div>
    <button class="order-btn" onclick="openOrderSheet()">Order →</button>
  </div>
</div>

<div class="overlay-bg" id="overlayBg" onclick="closeAllSheets()"></div>

<div class="bottom-sheet" id="connectSheet">
  <div class="sheet-handle"></div>
  <div class="sheet-title">Connect</div>
  <div class="sheet-note" id="connectPhone" style="margin-bottom:8px;"></div>
  <a class="link-btn" id="mapLinkBtn" href="#" target="_blank">Get directions</a>
</div>

<div class="bottom-sheet" id="orderSheet">
  <div class="sheet-handle"></div>
  <div class="sheet-title">Your order</div>
  <div id="orderSummary"></div>
  <div class="sheet-total-row"><span>Total</span><span id="orderSheetTotal">$0.00</span></div>

  <div class="field-label">Pickup time</div>
  <div class="chip-row" id="pickupChips"></div>
  <div class="sheet-note" id="pickupReadyNote" style="margin:8px 0 0;"></div>

  <div class="field-label">Name</div>
  <input class="field-input" id="orderName" placeholder="Your name">

  <div class="field-label">Dietary</div>
  <div class="chip-row" id="dietaryChips"></div>

  <div class="field-label">Notes for the kitchen</div>
  <textarea class="field-input" id="kitchenNotes" placeholder="e.g. black tea, oat milk, no sugar"></textarea>

  <div class="sheet-note">Pay online now — show this screen when you pick up</div>
  <button class="cta-btn" onclick="placeOrder()">Pay & Place order</button>
</div>

<div class="popup-modal" id="placedPopup">
  <div class="check">✅</div>
  <h3>Order Placed</h3>
  <div id="placedSummary" style="text-align:left; margin:12px 0;"></div>
  <p>Show this screen at the counter.</p>
  <button class="cta-btn" onclick="closeAllSheets()">Done</button>
</div>

<div class="bottom-sheet" id="pinSheet">
  <div class="sheet-handle"></div>
  <div class="sheet-title">Owner access</div>
  <div class="pin-input-row">
    <input class="pin-digit" maxlength="1" inputmode="numeric" id="pin0">
    <input class="pin-digit" maxlength="1" inputmode="numeric" id="pin1">
    <input class="pin-digit" maxlength="1" inputmode="numeric" id="pin2">
    <input class="pin-digit" maxlength="1" inputmode="numeric" id="pin3">
  </div>
  <div class="pin-msg" id="pinMsg"></div>
  <button class="cta-btn" onclick="checkPin()">Unlock</button>
</div>

<div class="bottom-sheet" id="editorSheet">
  <div class="sheet-handle"></div>
  <div class="sheet-title">Venue settings & menu</div>
  <div class="editor-subtabs">
    <button type="button" class="editor-subtab active" id="subtabVenueBtn" onclick="showEditorPanel('venue')">Venue & Hero</button>
    <button type="button" class="editor-subtab" id="subtabItemsBtn" onclick="showEditorPanel('items')">Menu Items</button>
  </div>

  <div id="editorPanelVenue">
    <div class="field-label">Venue name</div>
    <input class="field-input" id="edVenue">
    <div class="field-label">Tagline</div>
    <input class="field-input" id="edTagline">
    <div class="field-label">Phone</div>
    <input class="field-input" id="edPhone">
    <div class="field-label">Map link</div>
    <input class="field-input" id="edMapUrl">
    <div class="editor-block-title">Next pickup (optional)</div>
    <div class="field-label">Where / which event</div>
    <select class="field-input" id="edEventPreset" onchange="onEventPresetChange()">
      <option value="">— No event (hide banner) —</option>
      <option value="School — Teachers' Morning Tea">School — Teachers' Morning Tea</option>
      <option value="Fleetwood">Fleetwood</option>
      <option value="custom">Custom…</option>
    </select>
    <input class="field-input" id="edEventLabelCustom" placeholder="Custom label" style="display:none; margin-top:8px;">
    <div class="field-label">Order cutoff date & time</div>
    <input class="field-input" id="edEventDate" type="date">
    <select class="field-input" id="edEventTime" style="margin-top:8px;"></select>
    <div class="field-label">Item photos</div>
    <select class="field-input" id="edPhotoMode">
      <option value="photos">Photos</option>
      <option value="logo">Logo only</option>
      <option value="off">None (text only)</option>
    </select>
    <div class="field-label">Brand colour</div>
    <input class="field-input" id="edAccent" type="color" style="height:44px;">
    <div class="field-label">Logo (URL or upload)</div>
    <div class="photo-field-row">
      <input class="field-input" id="edLogoUrlText" placeholder="https://... direct image link">
      <label class="upload-btn-label">Upload<input type="file" id="edLogoFile" accept="image/*" style="display:none;"></label>
    </div>
    <img class="editor-photo-preview" id="edLogoPreviewImg" style="display:none;">
    <div class="field-label">Hero banner image (URL or upload)</div>
    <div class="photo-field-row">
      <input class="field-input" id="edHeroUrlText" placeholder="https://... direct image link">
      <label class="upload-btn-label">Upload<input type="file" id="edHeroFile" accept="image/*" style="display:none;"></label>
    </div>
    <div id="edHeroPreviewBand" style="width:100%;aspect-ratio:16/9;border-radius:10px;background:var(--bg-card);margin-top:2px;background-size:cover;background-position:center;"></div>
    <div class="editor-block-title">Change PIN</div>
    <div class="field-label">New PIN (4 digits)</div>
    <input class="field-input" id="edNewPin" maxlength="4" inputmode="numeric">
    <div class="field-label">Confirm new PIN</div>
    <input class="field-input" id="edConfirmPin" maxlength="4" inputmode="numeric">
  </div>

  <div id="editorPanelItems" style="display:none;">
    <div id="editorCategories"></div>
  </div>

  <button class="cta-btn" id="saveEditorBtn" onclick="saveEditor()">Save changes</button>
  <button class="link-btn" onclick="closeAllSheets()">Cancel</button>
</div>

<script>
  var DIETARY_OPTIONS = ["Gluten free", "Vegetarian", "Dairy free", "Nut allergy"];
  var COLLAPSE_THRESHOLD = 5;
  var selectedDietary = {};
  var selectedPickupOffset = (CONFIG.pickupTimes && CONFIG.pickupTimes.length) ? CONFIG.pickupTimes[0] : 0;

  function pickupLabel(offset) { return offset === 0 ? 'ASAP' : '+' + offset + ' min'; }
  function formatReadyTime(offset) {
    var d = new Date(Date.now() + offset * 60000);
    var hours = d.getHours(), mins = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var h12 = hours % 12; if (h12 === 0) h12 = 12;
    var minsStr = mins < 10 ? '0' + mins : '' + mins;
    return h12 + ':' + minsStr + ' ' + ampm;
  }
  function renderPickupChips() {
    var wrap = document.getElementById('pickupChips');
    wrap.innerHTML = '';
    for (var i = 0; i < CONFIG.pickupTimes.length; i++) {
      var offset = CONFIG.pickupTimes[i];
      var chip = document.createElement('div');
      chip.className = 'chip' + (offset === selectedPickupOffset ? ' selected' : '');
      chip.textContent = pickupLabel(offset);
      chip.onclick = (function(o){ return function(){ selectedPickupOffset = o; renderPickupChips(); }; })(offset);
      wrap.appendChild(chip);
    }
    document.getElementById('pickupReadyNote').textContent = 'Ready around ' + formatReadyTime(selectedPickupOffset);
  }

  function idFor(name){ return name.replace(/[^a-zA-Z0-9]+/g, '-'); }
  function catIdFor(name){ return 'cat-' + idFor(name); }

  var settings = (typeof SERVER_DATA !== 'undefined' && SERVER_DATA.settings) ? SERVER_DATA.settings : {
    venue: CONFIG.venue, tagline: CONFIG.tagline, phone: CONFIG.phone, mapUrl: CONFIG.mapUrl,
    photoMode: CONFIG.photoMode, accent: CONFIG.accent, pin: CONFIG.pin, logo: CONFIG.logo, heroImg: CONFIG.heroImg
  };
  var menuData = (typeof SERVER_DATA !== 'undefined' && SERVER_DATA.categories) ? SERVER_DATA.categories : CONFIG.categories;

  var sessionPin = '';
  var expandedCats = {};
  var cart = {};

  function applyAccent(){
    document.documentElement.style.setProperty('--accent', settings.accent || CONFIG.accent);
    document.documentElement.style.setProperty('--accent-ink', CONFIG.accentInk);
  }
  function renderChrome(){
    document.getElementById('hdrVenue').textContent = settings.venue;
    document.getElementById('hdrTagline').textContent = settings.tagline;
    document.getElementById('heroVenue').textContent = settings.venue;
    document.getElementById('heroTagline').textContent = settings.tagline;
    document.getElementById('heroInitial').textContent = settings.venue.charAt(0);
    document.getElementById('mapLinkBtn').href = settings.mapUrl || '#';
    document.getElementById('connectPhone').textContent = settings.phone ? ('📞 ' + settings.phone) : '';
    if (settings.heroImg) {
      var hero = document.getElementById('hero');
      hero.style.backgroundImage = 'url(' + settings.heroImg + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
      document.getElementById('heroInitial').style.display = 'none';
    }
    renderEventBanner();
  }
  var orderingClosed = false;
  function renderEventBanner(){
    var banner = document.getElementById('eventBanner');
    if (!settings.eventLabel) { banner.style.display = 'none'; orderingClosed = false; return; }
    var cutoffDate = settings.eventCutoff ? new Date(settings.eventCutoff) : null;
    var isPast = cutoffDate && !isNaN(cutoffDate.getTime()) && Date.now() > cutoffDate.getTime();
    orderingClosed = false;
    if (isPast) {
      banner.style.display = 'none';
    } else if (cutoffDate && !isNaN(cutoffDate.getTime())) {
      var timeStr = cutoffDate.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
      banner.style.display = 'block';
      banner.className = 'event-banner open';
      banner.textContent = settings.eventLabel + ' — order by ' + timeStr;
    } else {
      banner.style.display = 'block';
      banner.className = 'event-banner open';
      banner.textContent = settings.eventLabel;
    }
  }
  function renderDietaryChips(){
    var wrap = document.getElementById('dietaryChips');
    wrap.innerHTML = '';
    DIETARY_OPTIONS.forEach(function(opt){
      var chip = document.createElement('div');
      chip.className = 'chip' + (selectedDietary[opt] ? ' selected' : '');
      chip.textContent = opt;
      chip.onclick = function(){ selectedDietary[opt] = !selectedDietary[opt]; renderDietaryChips(); };
      wrap.appendChild(chip);
    });
  }
  function renderPillTabs(){
    var wrap = document.getElementById('pillTabs');
    wrap.innerHTML = '';
    var nonEmptyCats = menuData.filter(function(cat){ return cat.items.length > 0; });
    if (nonEmptyCats.length <= 1) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';
    nonEmptyCats.forEach(function(cat){
      var pill = document.createElement('div');
      pill.className = 'pill';
      pill.id = 'pill-' + idFor(cat.name);
      pill.textContent = cat.name;
      pill.onclick = function(){
        expandedCats[cat.name] = true;
        renderMenu();
        var el = document.getElementById(catIdFor(cat.name));
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      };
      wrap.appendChild(pill);
    });
  }
  function buildPhotoTile(item){
    var mode = settings.photoMode || CONFIG.photoMode;
    if (mode === 'off') return null;
    var tile = document.createElement('div');
    tile.className = 'photo-tile';
    var src = (mode === 'photos' && item.photo) ? item.photo : settings.logo;
    if (src) { var img = document.createElement('img'); img.src = src; tile.appendChild(img); }
    else { tile.textContent = settings.venue.charAt(0); }
    return tile;
  }
  var groupSelectedVariant = {};
  function groupCategoryItems(items){
    var groups = []; var byBase = {};
    items.forEach(function(item){
      var m = item.name.match(/^(.*) \(([^)]+)\)$/);
      var baseName = m ? m[1] : item.name;
      var sizeLabel = m ? m[2] : null;
      if (!byBase[baseName]) {
        var g = { baseName: baseName, variants: [] };
        byBase[baseName] = g;
        groups.push(g);
      }
      byBase[baseName].variants.push({ fullName: item.name, sizeLabel: sizeLabel, price: item.price, desc: item.desc, photo: item.photo, popular: item.popular, soldOut: item.soldOut });
    });
    groups.forEach(function(g){ g.hasSizes = g.variants.length > 1; });
    return groups;
  }
  function buildGroupCard(group, cat){
    var catName = cat.name;
    var groupId = idFor(catName) + '-' + idFor(group.baseName);
    if (!groupSelectedVariant[groupId]) groupSelectedVariant[groupId] = group.variants[0].fullName;
    var selected = group.variants.find(function(v){ return v.fullName === groupSelectedVariant[groupId]; }) || group.variants[0];
    var itemId = idFor(catName) + '-' + idFor(selected.fullName);

    var card = document.createElement('div');
    card.className = 'drink-card' + (selected.soldOut ? ' sold-out' : '');
    var groupPhoto = selected.photo;
    if (!groupPhoto) {
      for (var vi = 0; vi < group.variants.length; vi++) {
        if (group.variants[vi].photo) { groupPhoto = group.variants[vi].photo; break; }
      }
    }
    if (!groupPhoto) groupPhoto = cat.categoryPhoto || '';
    var photoTile = buildPhotoTile({ photo: groupPhoto });
    if (photoTile) card.appendChild(photoTile);

    var info = document.createElement('div');
    info.className = 'drink-info';
    var badgeRow = '';
    if (selected.popular) badgeRow += '<span class="badge">★ Popular</span>';
    if (selected.soldOut) badgeRow += '<span class="badge sold-out-badge">Sold out</span>';
    var badgeHtml = badgeRow ? '<div class="badge-row">' + badgeRow + '</div>' : '';
    var descHtml = selected.desc ? '<div class="drink-desc">' + selected.desc + '</div>' : '';
    info.innerHTML = badgeHtml + '<div class="drink-name">' + group.baseName + '</div>' + descHtml;

    if (group.hasSizes) {
      var sizeRow = document.createElement('div');
      sizeRow.className = 'chip-row';
      sizeRow.style.marginTop = '4px';
      sizeRow.style.marginBottom = '6px';
      group.variants.forEach(function(v){
        var chip = document.createElement('div');
        chip.className = 'chip' + (v.fullName === selected.fullName ? ' selected' : '');
        chip.style.fontSize = '11px';
        chip.style.padding = '5px 10px';
        chip.textContent = v.sizeLabel;
        chip.onclick = function(){
          groupSelectedVariant[groupId] = v.fullName;
          renderMenu();
        };
        sizeRow.appendChild(chip);
      });
      info.appendChild(sizeRow);
    }
    var priceDiv = document.createElement('div');
    priceDiv.className = 'drink-price';
    priceDiv.textContent = '$' + selected.price.toFixed(2);
    info.appendChild(priceDiv);

    var qtySel = document.createElement('div');
    qtySel.className = 'quantity-selector';
    var minusBtn = document.createElement('button');
    minusBtn.className = 'qty-btn'; minusBtn.textContent = '−'; minusBtn.disabled = !!selected.soldOut;
    minusBtn.onclick = function(){ decrement(itemId); };
    var qtyDisplay = document.createElement('div');
    qtyDisplay.className = 'qty-display'; qtyDisplay.id = 'qty-' + itemId;
    qtyDisplay.textContent = cart[itemId] ? cart[itemId].qty : 0;
    var plusBtn = document.createElement('button');
    plusBtn.className = 'qty-btn'; plusBtn.textContent = '+'; plusBtn.disabled = !!selected.soldOut;
    plusBtn.onclick = function(){ increment(itemId, selected.fullName, selected.price); };
    qtySel.appendChild(minusBtn); qtySel.appendChild(qtyDisplay); qtySel.appendChild(plusBtn);

    card.appendChild(info); card.appendChild(qtySel);
    return card;
  }
  function renderMenu(){
    var section = document.getElementById('menuSection');
    section.innerHTML = '';
    menuData.filter(function(cat){ return cat.items.length > 0; }).forEach(function(cat){
      var block = document.createElement('div');
      block.className = 'cat-block'; block.id = catIdFor(cat.name);
      var title = document.createElement('div');
      title.className = 'section-title'; title.textContent = cat.name;
      block.appendChild(title);

      var groups = groupCategoryItems(cat.items);
      var popularGroups = groups.filter(function(g){ return g.variants.some(function(v){ return v.popular; }); });
      var visible, hidden;
      if (groups.length <= COLLAPSE_THRESHOLD) { visible = groups; hidden = []; }
      else if (popularGroups.length > 0) { visible = popularGroups; hidden = groups.filter(function(g){ return popularGroups.indexOf(g) === -1; }); }
      else { visible = groups.slice(0,2); hidden = groups.slice(2); }

      var isExpanded = !!expandedCats[cat.name];
      var groupsToShow = isExpanded ? groups : visible;
      groupsToShow.forEach(function(group){ block.appendChild(buildGroupCard(group, cat)); });

      if (hidden.length > 0) {
        var btn = document.createElement('button');
        btn.className = 'see-more-btn';
        btn.textContent = isExpanded ? 'Show less' : 'See ' + hidden.length + ' more';
        btn.onclick = function(){ expandedCats[cat.name] = !expandedCats[cat.name]; renderMenu(); };
        block.appendChild(btn);
      }
      section.appendChild(block);
    });
  }
  function increment(itemId, name, price){
    if (orderingClosed) { alert('Ordering is closed for this pickup — check back for the next one.'); return; }
    if (!cart[itemId]) cart[itemId] = {qty:0, price:price, name:name};
    cart[itemId].qty++;
    var d = document.getElementById('qty-'+itemId); if (d) d.textContent = cart[itemId].qty;
    updateCart();
  }
  function decrement(itemId){
    if (!cart[itemId] || cart[itemId].qty<=0) return;
    cart[itemId].qty--;
    var d = document.getElementById('qty-'+itemId);
    if (cart[itemId].qty===0){ delete cart[itemId]; if(d) d.textContent=0; }
    else if (d) d.textContent = cart[itemId].qty;
    updateCart();
  }
  function cartTotals(){
    var totalItems=0, totalPrice=0;
    for (var id in cart){ totalItems += cart[id].qty; totalPrice += cart[id].qty*cart[id].price; }
    return {totalItems:totalItems, totalPrice:totalPrice};
  }
  function updateCart(){
    var totals = cartTotals();
    var bar = document.getElementById('cartBar');
    bar.classList.toggle('active', totals.totalItems>0);
    document.getElementById('cartCount').textContent = totals.totalItems + (totals.totalItems===1?' item':' items');
    document.getElementById('cartTotal').textContent = '$'+totals.totalPrice.toFixed(2);
  }
  function buildOrderSummary(){
    var summary = document.getElementById('orderSummary');
    summary.innerHTML = '';
    var totals = cartTotals();
    for (var id in cart){
      var row = document.createElement('div');
      row.className = 'sheet-row';
      var lineTotal = cart[id].qty*cart[id].price;
      row.innerHTML = '<span>'+cart[id].qty+' × '+cart[id].name+'</span><span>$'+lineTotal.toFixed(2)+'</span>';
      summary.appendChild(row);
    }
    document.getElementById('orderSheetTotal').textContent = '$'+totals.totalPrice.toFixed(2);
  }
  function openOrderSheet(){
    buildOrderSummary();
    renderDietaryChips();
    renderPickupChips();
    openSheet('orderSheet');
  }
  function openSheet(id){
    document.getElementById('overlayBg').classList.add('active');
    document.getElementById(id).classList.add('active');
  }
  function closeAllSheets(){
    document.querySelectorAll('.bottom-sheet, .popup-modal').forEach(function(s){ s.classList.remove('active'); });
    document.getElementById('overlayBg').classList.remove('active');
  }
  function placeOrder(){
    var totals = cartTotals();
    var items = [];
    for (var id in cart) items.push({name:cart[id].name, qty:cart[id].qty, price:cart[id].price});
    var name = document.getElementById('orderName').value || 'Guest';
    var dietList = [];
    for (var opt in selectedDietary) if (selectedDietary[opt]) dietList.push(opt);
    var notes = document.getElementById('kitchenNotes').value;
    if (dietList.length) notes = (notes ? notes+' | ' : '') + 'Dietary: '+dietList.join(', ');
    notes += (notes?' | ':'') + 'Pickup: ' + pickupLabel(selectedPickupOffset);

    var summaryHtml = '';
    for (var sid in cart){
      var lineTotal = cart[sid].qty*cart[sid].price;
      summaryHtml += '<div class="sheet-row"><span>'+cart[sid].qty+' × '+cart[sid].name+'</span><span>$'+lineTotal.toFixed(2)+'</span></div>';
    }
    summaryHtml += '<div class="sheet-total-row"><span>Total</span><span>$'+totals.totalPrice.toFixed(2)+'</span></div>';

    var btn = document.querySelector('#orderSheet .cta-btn');
    if (btn){ btn.disabled = true; btn.textContent = 'Placing order…'; }

    fetch('/order', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:name, notes:notes, items:items })
    }).then(function(res){ return res.json(); }).then(function(data){
      if (btn){ btn.disabled=false; btn.textContent='Pay & Place order'; }
      if (data.payUrl){
        window.location.href = data.payUrl;
        return;
      }
      closeAllSheets();
      cart = {};
      updateCart();
      document.getElementById('placedSummary').innerHTML = summaryHtml;
      document.getElementById('overlayBg').classList.add('active');
      document.getElementById('placedPopup').classList.add('active');
    }).catch(function(){
      if (btn){ btn.disabled=false; btn.textContent='Pay & Place order'; }
      alert('Network error — could not place order.');
    });
  }

  function openPinSheet(){ document.getElementById('pinMsg').textContent=''; openSheet('pinSheet'); }
  function checkPin(){
    var entered = '';
    for (var i=0;i<4;i++) entered += document.getElementById('pin'+i).value || '';
    for (var j=0;j<4;j++) document.getElementById('pin'+j).value = '';
    fetch('/unlock', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({pin:entered})})
      .then(function(res){return res.json();}).then(function(data){
        if (data.ok){ sessionPin = entered; closeAllSheets(); openEditor(); }
        else if (data.locked){ document.getElementById('pinMsg').textContent = 'Too many attempts. Try again in '+data.minutesLeft+' min.'; }
        else { document.getElementById('pinMsg').textContent = ''; }
      }).catch(function(){ document.getElementById('pinMsg').textContent = 'Network error — try again.'; });
  }
  function showEditorPanel(panel){
    document.getElementById('editorPanelVenue').style.display = panel==='items' ? 'none' : 'block';
    document.getElementById('editorPanelItems').style.display = panel==='items' ? 'block' : 'none';
    document.getElementById('subtabVenueBtn').classList.toggle('active', panel!=='items');
    document.getElementById('subtabItemsBtn').classList.toggle('active', panel==='items');
  }
  function updateLogoPreview(){
    var url = document.getElementById('edLogoUrlText').value.trim();
    var img = document.getElementById('edLogoPreviewImg');
    if (url){ img.src=url; img.style.display='block'; } else { img.style.display='none'; }
  }
  function updateHeroPreview(){
    var url = document.getElementById('edHeroUrlText').value.trim();
    document.getElementById('edHeroPreviewBand').style.backgroundImage = url ? 'url('+url+')' : '';
  }
  function resizeImageFile(file, maxDim, quality, cb){
    var reader = new FileReader();
    reader.onload = function(ev){
      var img = new Image();
      img.onload = function(){
        var w=img.width, h=img.height;
        var scale = Math.min(1, maxDim/Math.max(w,h));
        var cw = Math.max(1, Math.round(w*scale)), ch = Math.max(1, Math.round(h*scale));
        var canvas = document.createElement('canvas');
        canvas.width=cw; canvas.height=ch;
        canvas.getContext('2d').drawImage(img,0,0,cw,ch);
        cb(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
  function uploadResizedPhoto(file, maxDim, quality, onUrl, onError){
    resizeImageFile(file, maxDim, quality, function(dataUrl){
      fetch('/upload-photo', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ dataUrl: dataUrl })
      }).then(function(res){ return res.json(); }).then(function(data){
        if (data.ok) { onUrl(data.url); }
        else { alert(data.message || 'Photo upload failed.'); if (onError) onError(); }
      }).catch(function(){
        alert('Network error uploading photo.');
        if (onError) onError();
      });
    });
  }
  function onEventPresetChange(){
    var presetSelect = document.getElementById('edEventPreset');
    var customInput = document.getElementById('edEventLabelCustom');
    customInput.style.display = presetSelect.value === 'custom' ? 'block' : 'none';
  }
  function buildTimeDropdown(){
    var select = document.getElementById('edEventTime');
    if (select.children.length > 0) return;
    var opt0 = document.createElement('option');
    opt0.value = ''; opt0.textContent = '— Time —';
    select.appendChild(opt0);
    for (var h = 6; h <= 18; h++) {
      for (var m = 0; m < 60; m += 15) {
        var hh = h < 10 ? '0'+h : ''+h;
        var mm = m < 10 ? '0'+m : ''+m;
        var value = hh + ':' + mm;
        var h12 = h % 12; if (h12 === 0) h12 = 12;
        var ampm = h < 12 ? 'AM' : 'PM';
        var label = h12 + ':' + mm + ' ' + ampm;
        var opt = document.createElement('option');
        opt.value = value; opt.textContent = label;
        select.appendChild(opt);
      }
    }
  }
  function openEditor(){
    document.getElementById('edVenue').value = settings.venue;
    document.getElementById('edTagline').value = settings.tagline;
    document.getElementById('edPhone').value = settings.phone;
    document.getElementById('edMapUrl').value = settings.mapUrl;
    var presetSelect = document.getElementById('edEventPreset');
    var customInput = document.getElementById('edEventLabelCustom');
    var presetValues = ["School — Teachers' Morning Tea", "Fleetwood"];
    if (!settings.eventLabel) {
      presetSelect.value = '';
      customInput.style.display = 'none'; customInput.value = '';
    } else if (presetValues.indexOf(settings.eventLabel) !== -1) {
      presetSelect.value = settings.eventLabel;
      customInput.style.display = 'none'; customInput.value = '';
    } else {
      presetSelect.value = 'custom';
      customInput.style.display = 'block'; customInput.value = settings.eventLabel;
    }
    buildTimeDropdown();
    if (settings.eventCutoff && settings.eventCutoff.indexOf('T') !== -1) {
      var parts = settings.eventCutoff.split('T');
      document.getElementById('edEventDate').value = parts[0];
      document.getElementById('edEventTime').value = parts[1];
    } else {
      document.getElementById('edEventDate').value = '';
      document.getElementById('edEventTime').value = '';
    }
    document.getElementById('edPhotoMode').value = settings.photoMode;
    document.getElementById('edAccent').value = settings.accent;
    document.getElementById('edNewPin').value = '';
    document.getElementById('edConfirmPin').value = '';
    showEditorPanel('venue');

    document.getElementById('edLogoUrlText').value = settings.logo || '';
    document.getElementById('edLogoUrlText').oninput = updateLogoPreview;
    updateLogoPreview();
    document.getElementById('edLogoFile').onchange = function(e){
      var file = e.target.files[0]; if (!file) return;
      uploadResizedPhoto(file, 200, 0.6, function(url){ document.getElementById('edLogoUrlText').value=url; updateLogoPreview(); });
    };
    document.getElementById('edHeroUrlText').value = settings.heroImg || '';
    document.getElementById('edHeroUrlText').oninput = updateHeroPreview;
    updateHeroPreview();
    document.getElementById('edHeroFile').onchange = function(e){
      var file = e.target.files[0]; if (!file) return;
      uploadResizedPhoto(file, 700, 0.6, function(url){ document.getElementById('edHeroUrlText').value=url; updateHeroPreview(); });
    };

    var wrap = document.getElementById('editorCategories');
    wrap.innerHTML = '';
    menuData.forEach(function(cat){
      var headingRow = document.createElement('div');
      headingRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
      var heading = document.createElement('div');
      heading.className = 'editor-block-title'; heading.textContent = cat.name;
      var removeCatBtn = document.createElement('span');
      removeCatBtn.textContent = 'Remove category ×';
      removeCatBtn.style.cssText = 'color:#ef4444;font-size:11px;font-weight:700;cursor:pointer;';
      removeCatBtn.onclick = function(){
        if (!confirm('Remove "' + cat.name + '" and all its items? This cannot be undone until you Save.')) return;
        menuData = menuData.filter(function(c){ return c.name !== cat.name; });
        openEditor();
      };
      headingRow.appendChild(heading); headingRow.appendChild(removeCatBtn);
      wrap.appendChild(headingRow);

      var catPhotoRow = document.createElement('div');
      catPhotoRow.className = 'photo-field-row';
      catPhotoRow.style.marginBottom = '10px';
      var catPhotoThumb = document.createElement('img');
      catPhotoThumb.className = 'editor-thumb-toggle';
      catPhotoThumb.src = cat.categoryPhoto || '';
      catPhotoThumb.style.display = cat.categoryPhoto ? 'block' : 'none';
      var catPhotoUrlInput = document.createElement('input');
      catPhotoUrlInput.className = 'field-input';
      catPhotoUrlInput.placeholder = 'Category photo — shown for any item without its own photo';
      catPhotoUrlInput.value = cat.categoryPhoto || '';
      catPhotoUrlInput.setAttribute('data-cat-photo-for', cat.name);
      var catPhotoUploadLabel = document.createElement('label');
      catPhotoUploadLabel.className = 'upload-btn-label';
      catPhotoUploadLabel.textContent = 'Upload';
      var catPhotoFileInput = document.createElement('input');
      catPhotoFileInput.type = 'file'; catPhotoFileInput.accept = 'image/*'; catPhotoFileInput.style.display = 'none';
      catPhotoUploadLabel.appendChild(catPhotoFileInput);
      catPhotoUrlInput.oninput = function(){
        var v = catPhotoUrlInput.value.trim();
        if (v){ catPhotoThumb.src = v; catPhotoThumb.style.display = 'block'; } else { catPhotoThumb.style.display = 'none'; }
      };
      catPhotoFileInput.onchange = function(e){
        var file = e.target.files[0]; if (!file) return;
        uploadResizedPhoto(file, 220, 0.55, function(url){
          catPhotoUrlInput.value = url;
          catPhotoThumb.src = url; catPhotoThumb.style.display = 'block';
        });
      };
      catPhotoRow.appendChild(catPhotoThumb);
      catPhotoRow.appendChild(catPhotoUrlInput);
      catPhotoRow.appendChild(catPhotoUploadLabel);
      wrap.appendChild(catPhotoRow);

      cat.items.forEach(function(item, i){ wrap.appendChild(buildEditorItemCard(cat.name, i, item)); });
      var addBtn = document.createElement('button');
      addBtn.className = 'add-item-btn';
      addBtn.textContent = '+ Add item to ' + cat.name;
      addBtn.onclick = function(){
        menuData.forEach(function(c){ if (c.name===cat.name) c.items.push({name:'New item', desc:'', price:0, popular:false, soldOut:false, photo:''}); });
        openEditor();
      };
      wrap.appendChild(addBtn);
    });
    var addCatBtn = document.createElement('button');
    addCatBtn.className = 'add-item-btn';
    addCatBtn.textContent = '+ Add new category';
    addCatBtn.onclick = function(){
      var name = prompt('New category name:');
      if (name && name.trim()) {
        menuData.push({ name: name.trim(), items: [] });
        openEditor();
      }
    };
    wrap.appendChild(addCatBtn);
    openSheet('editorSheet');
  }
  function buildEditorItemCard(catName, idx, item){
    var card = document.createElement('div');
    card.className = 'editor-item-card';
    card.setAttribute('data-cat', catName);
    card.setAttribute('data-idx', idx);
    card.setAttribute('data-photo', item.photo || '');

    var primaryRow = document.createElement('div');
    primaryRow.className = 'editor-primary-row';

    var thumbToggle = document.createElement('img');
    thumbToggle.className = 'editor-thumb-toggle';
    thumbToggle.src = item.photo || '';
    thumbToggle.style.display = item.photo ? 'block' : 'none';
    if (!item.photo) {
      var placeholderThumb = document.createElement('div');
      placeholderThumb.className = 'editor-thumb-toggle editor-thumb-placeholder';
      placeholderThumb.textContent = '📷';
      placeholderThumb.onclick = function(){ toggleMore(); };
      primaryRow.appendChild(placeholderThumb);
    } else {
      thumbToggle.onclick = function(){ toggleMore(); };
      primaryRow.appendChild(thumbToggle);
    }

    var nameInput = document.createElement('input');
    nameInput.className = 'name-input'; nameInput.value = item.name;
    var priceInput = document.createElement('input');
    priceInput.className = 'price-input'; priceInput.type = 'number'; priceInput.step = '0.10'; priceInput.value = item.price;

    var popChip = document.createElement('div');
    popChip.className = 'toggle-chip compact'+(item.popular?' on':''); popChip.textContent='★';
    popChip.title = 'Popular';
    popChip.onclick = function(){ popChip.classList.toggle('on'); };
    var soldChip = document.createElement('div');
    soldChip.className = 'toggle-chip compact'+(item.soldOut?' on danger':''); soldChip.textContent='Sold out';
    soldChip.onclick = function(){ soldChip.classList.toggle('on'); soldChip.classList.toggle('danger'); };
    var removeX = document.createElement('span');
    removeX.className = 'remove-x'; removeX.textContent = '×';
    removeX.onclick = function(){ card.remove(); };

    primaryRow.appendChild(nameInput);
    primaryRow.appendChild(priceInput);
    primaryRow.appendChild(popChip);
    primaryRow.appendChild(soldChip);
    primaryRow.appendChild(removeX);

    var moreSection = document.createElement('div');
    moreSection.className = 'editor-more-section';
    moreSection.style.display = 'none';

    var photoRow = document.createElement('div');
    photoRow.className = 'photo-field-row';
    var photoUrlInput = document.createElement('input');
    photoUrlInput.className = 'field-input';
    photoUrlInput.placeholder = 'https://... direct image link';
    photoUrlInput.value = item.photo || '';
    var photoUploadLabel = document.createElement('label');
    photoUploadLabel.className = 'upload-btn-label';
    photoUploadLabel.textContent = 'Upload';
    var photoFileInput = document.createElement('input');
    photoFileInput.type = 'file'; photoFileInput.accept = 'image/*'; photoFileInput.style.display='none';
    photoUploadLabel.appendChild(photoFileInput);
    photoUrlInput.oninput = function(){
      var v = photoUrlInput.value.trim();
      card.setAttribute('data-photo', v);
      if (v){ thumbToggle.src=v; thumbToggle.style.display='block'; } else { thumbToggle.style.display='none'; }
    };
    photoFileInput.onchange = function(e){
      var file = e.target.files[0]; if (!file) return;
      uploadResizedPhoto(file, 220, 0.55, function(url){
        photoUrlInput.value = url;
        card.setAttribute('data-photo', url);
        thumbToggle.src = url; thumbToggle.style.display='block';
      });
    };
    photoRow.appendChild(photoUrlInput); photoRow.appendChild(photoUploadLabel);

    var descInput = document.createElement('textarea');
    descInput.className = 'desc-input'; descInput.placeholder = 'Description (optional)';
    descInput.value = item.desc || '';

    moreSection.appendChild(photoRow);
    moreSection.appendChild(descInput);

    var moreToggleLink = document.createElement('div');
    moreToggleLink.className = 'more-toggle-link';
    moreToggleLink.textContent = 'Photo & description ▾';
    function toggleMore(){
      var isOpen = moreSection.style.display !== 'none';
      moreSection.style.display = isOpen ? 'none' : 'block';
      moreToggleLink.textContent = isOpen ? 'Photo & description ▾' : 'Photo & description ▴';
    }
    moreToggleLink.onclick = toggleMore;

    card.appendChild(primaryRow);
    card.appendChild(moreToggleLink);
    card.appendChild(moreSection);

    nameInput.classList.add('name-input');
    priceInput.classList.add('price-input');
    return card;
  }
  function saveEditor(){
    settings.venue = document.getElementById('edVenue').value || settings.venue;
    settings.tagline = document.getElementById('edTagline').value;
    settings.phone = document.getElementById('edPhone').value;
    settings.mapUrl = document.getElementById('edMapUrl').value;
    var presetVal = document.getElementById('edEventPreset').value;
    settings.eventLabel = presetVal === 'custom' ? document.getElementById('edEventLabelCustom').value.trim() : presetVal;
    var eventDate = document.getElementById('edEventDate').value;
    var eventTime = document.getElementById('edEventTime').value;
    settings.eventCutoff = (eventDate && eventTime) ? (eventDate + 'T' + eventTime) : '';
    settings.photoMode = document.getElementById('edPhotoMode').value;
    settings.accent = document.getElementById('edAccent').value;
    settings.logo = document.getElementById('edLogoUrlText').value.trim() || '';
    settings.heroImg = document.getElementById('edHeroUrlText').value.trim() || '';

    var newPin = document.getElementById('edNewPin').value;
    var confirmPin = document.getElementById('edConfirmPin').value;
    var newPinToSend = '';
    if ((newPin || confirmPin) && newPin.length===4 && /^[0-9]{4}$/.test(newPin) && newPin===confirmPin) newPinToSend = newPin;

    var cards = document.querySelectorAll('#editorCategories .editor-item-card');
    var updated = {};
    menuData.forEach(function(c){ updated[c.name] = []; });
    cards.forEach(function(card){
      var catName = card.getAttribute('data-cat');
      var nameVal = card.querySelector('.name-input').value;
      var priceVal = parseFloat(card.querySelector('.price-input').value)||0;
      var descVal = card.querySelector('.desc-input').value;
      var chips = card.querySelectorAll('.toggle-chip');
      var popular = chips[0].classList.contains('on');
      var soldOut = chips[1].classList.contains('on');
      var photoVal = card.getAttribute('data-photo')||'';
      if (!updated[catName]) updated[catName]=[];
      updated[catName].push({name:nameVal, desc:descVal, price:priceVal, popular:popular, soldOut:soldOut, photo:photoVal});
    });
    menuData.forEach(function(c){ c.items = updated[c.name] || c.items; });

    var catPhotoInputs = document.querySelectorAll('[data-cat-photo-for]');
    catPhotoInputs.forEach(function(input){
      var catName = input.getAttribute('data-cat-photo-for');
      var cat = menuData.find(function(c){ return c.name === catName; });
      if (cat) cat.categoryPhoto = input.value.trim();
    });

    var saveBtn = document.getElementById('saveEditorBtn');
    if (saveBtn){ saveBtn.disabled=true; saveBtn.textContent='Saving…'; }
    var payload = JSON.stringify({ pin:sessionPin, newPin:newPinToSend, settings:settings, categories:menuData });
    fetch('/save', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: payload
    }).then(function(res){
      if (!res.ok) {
        return res.text().then(function(text){
          throw new Error('Server returned ' + res.status + ': ' + text.substring(0, 300));
        });
      }
      return res.json();
    }).then(function(data){
      if (saveBtn){ saveBtn.disabled=false; saveBtn.textContent='Save changes'; }
      if (!data.ok){ alert(data.message||'Save failed — try unlocking again.'); return; }
      if (data.pin) sessionPin = data.pin;
      settings = data.settings; menuData = data.categories;
      applyAccent(); renderChrome(); renderPillTabs(); renderMenu();
      closeAllSheets();
    }).catch(function(err){
      if (saveBtn){ saveBtn.disabled=false; saveBtn.textContent='Save changes'; }
      alert('Save failed (payload ' + Math.round(payload.length/1024) + 'KB): ' + err.message);
    });
  }
  function setupScrollspy(){
    window.addEventListener('scroll', function(){
      var scrollPos = window.scrollY + 130;
      var activeCat = null;
      menuData.forEach(function(cat){
        var el = document.getElementById(catIdFor(cat.name));
        if (el && el.offsetTop <= scrollPos) activeCat = cat.name;
      });
      document.querySelectorAll('.pill').forEach(function(p){ p.classList.remove('active'); });
      if (activeCat){ var p = document.getElementById('pill-'+idFor(activeCat)); if (p) p.classList.add('active'); }
    }, {passive:true});
  }

  applyAccent(); renderChrome(); renderPillTabs(); renderMenu(); updateCart(); setupScrollspy();
</script>
</body>
</html>
`;

export default async function (req) {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/") {
    const state = await getState();
    const dataForClient = {
      settings: Object.assign({}, state.settings, { pin: undefined }),
      categories: state.categories,
    };
    delete dataForClient.settings.pin;
    let dataJson = JSON.stringify(dataForClient);
    dataJson = dataJson.split("</").join("<\/");
    const html = HTML_TEMPLATE.replace("__ITABS_DATA__", dataJson);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  if (req.method === "POST" && url.pathname === "/upload-photo") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false, message: "Bad request." });
    }
    if (!body || !body.dataUrl) {
      return jsonResponse({ ok: false, message: "No image data." });
    }
    try {
      const key = await savePhotoBlob(body.dataUrl);
      return jsonResponse({ ok: true, url: "/photo/" + key });
    } catch (err) {
      return jsonResponse({
        ok: false,
        message: "Photo upload failed — image may be too large: " + String(err),
      }, 500);
    }
  }

  if (req.method === "GET" && url.pathname.indexOf("/photo/") === 0) {
    const key = url.pathname.slice("/photo/".length);
    try {
      const dataUrl = await getPhotoBlob(key);
      if (!dataUrl) return new Response("Not found", { status: 404 });
      const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
      if (!match) return new Response("Not found", { status: 404 });
      const contentType = match[1];
      const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
      return new Response(bytes, {
        headers: {
          "Content-Type": contentType,
          "cache-control": "public, max-age=31536000",
        },
      });
    } catch (err) {
      return new Response("Not found", { status: 404 });
    }
  }

  if (req.method === "GET" && url.pathname === "/recover-pin") {
    const code = url.searchParams.get("code");
    if (code !== RECOVERY_CODE) {
      return new Response("Not found", { status: 404 });
    }
    const state = await getState();
    await saveState({
      settings: Object.assign({}, state.settings, { pin: DEFAULT_PIN }),
      categories: state.categories,
    });
    return new Response("PIN reset to " + DEFAULT_PIN + ".", {
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (req.method === "POST" && url.pathname === "/unlock") {
    const ip = getIp(req);
    const lock = await getLock(ip);
    if (lock.lockedUntil > Date.now()) {
      return jsonResponse({
        ok: false,
        locked: true,
        minutesLeft: Math.ceil((lock.lockedUntil - Date.now()) / 60000),
      });
    }
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false });
    }
    const state = await getState();
    const currentPin = state.settings.pin || DEFAULT_PIN;
    if (body && body.pin === currentPin) {
      await setLock(ip, { attempts: 0, lockedUntil: 0 });
      return jsonResponse({ ok: true });
    }
    const attempts = (lock.attempts || 0) + 1;
    if (attempts >= MAX_ATTEMPTS) {
      await setLock(ip, {
        attempts: 0,
        lockedUntil: Date.now() + LOCK_MINUTES * 60000,
      });
      return jsonResponse({
        ok: false,
        locked: true,
        minutesLeft: LOCK_MINUTES,
      });
    }
    await setLock(ip, { attempts: attempts, lockedUntil: 0 });
    return jsonResponse({ ok: false, locked: false });
  }

  if (req.method === "POST" && url.pathname === "/save") {
    const ip = getIp(req);
    const lock = await getLock(ip);
    if (lock.lockedUntil > Date.now()) {
      return jsonResponse({
        ok: false,
        message: "Too many attempts. Try again in " +
          Math.ceil((lock.lockedUntil - Date.now()) / 60000) + " min.",
      });
    }
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false, message: "Bad request." });
    }
    const state = await getState();
    const currentPin = state.settings.pin || DEFAULT_PIN;
    if (!body || body.pin !== currentPin) {
      return jsonResponse({
        ok: false,
        message: "PIN check failed — please unlock again.",
      });
    }
    if (!body.settings || !body.categories) {
      return jsonResponse({ ok: false, message: "Missing data." });
    }
    const newState = {
      settings: Object.assign({}, state.settings, body.settings),
      categories: body.categories,
    };
    newState.settings.pin = (body.newPin && /^[0-9]{4}$/.test(body.newPin))
      ? body.newPin
      : currentPin;
    try {
      await saveState(newState);
    } catch (err) {
      return jsonResponse({
        ok: false,
        message:
          "Save failed — the menu data is likely too large (probably too many/too-large photos). Try removing a photo or two and save again. (" +
          String(err) + ")",
      }, 500);
    }
    const responseSettings = Object.assign({}, newState.settings, {
      pin: undefined,
    });
    delete responseSettings.pin;
    const result = {
      ok: true,
      settings: responseSettings,
      categories: newState.categories,
    };
    if (body.newPin && /^[0-9]{4}$/.test(body.newPin)) result.pin = body.newPin;
    return jsonResponse(result);
  }

  if (req.method === "POST" && url.pathname === "/order") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ ok: false });
    }
    const orders = await getOrders();
    const items = body.items || [];
    let totalCents = 0;
    const itemsText = items.map((i) => {
      totalCents += Math.round(i.price * 100) * i.qty;
      return i.qty + "× " + i.name;
    }).join(", ");
    const orderNumber = await nextOrderNumber(orders);
    const order = {
      id: SLUG + "-" + Date.now().toString(36).toUpperCase(),
      orderNumber: orderNumber,
      name: body.name || "",
      notes: body.notes || "",
      itemsText: itemsText,
      total: totalCents / 100,
      paid: false,
      done: false,
      squareOrderId: "",
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    await saveOrders(orders);
    return jsonResponse({ ok: true, orderId: order.id, payUrl: null });
  }

  return new Response("Not found", { status: 404 });
}
