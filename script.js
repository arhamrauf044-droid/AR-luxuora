
const WA_NUMBER = "923124393426";
const PRODUCTS = [
  {id:"LX-001",name:"Luxe Noir Couple Set",category:"Couple Watches",price:8490,oldPrice:9990,image:"assets/watch-1.jpeg",tag:"Bestseller",color:"Obsidian black & brushed gold",colorTone:"charcoal",desc:"A polished silver-and-gold couple set with deep charcoal dials and a refined luxury profile."},
  {id:"LX-002",name:"Silver Prestige Duo",category:"Couple Watches",price:7990,oldPrice:9490,image:"assets/watch-2.jpeg",tag:"New Arrival",color:"Arctic silver",colorTone:"silver",desc:"A clean all-silver duo designed for understated elegance, gifting and coordinated occasions."},
  {id:"LX-003",name:"Emerald Royale Duo",category:"Couple Watches",price:8790,oldPrice:10490,image:"assets/watch-3.jpeg",tag:"Signature",color:"Malachite green & gold",colorTone:"emerald",desc:"Emerald-toned dials, gold accents and a statement bracelet make this set instantly distinctive."},
  {id:"LX-004",name:"Pearl Silver Duo",category:"Couple Watches",price:7690,oldPrice:8990,image:"assets/watch-4.jpeg",tag:"Classic",color:"Ivory pearl & platinum",colorTone:"pearl",desc:"A bright pearl dial with silver bracelet detailing for a timeless, versatile everyday look."},
  {id:"LX-005",name:"Golden Pearl Couple Set",category:"Couple Watches",price:8990,oldPrice:10990,image:"assets/watch-5.jpeg",tag:"Premium",color:"Rose champagne",colorTone:"rose",desc:"Warm gold accents and luminous pearl faces create a graceful premium gifting set."},
  {id:"LX-006",name:"Emerald Signature Set",category:"Couple Watches",price:9290,oldPrice:11490,image:"assets/watch-6.jpeg",tag:"Limited Look",color:"Pine green & antique gold",colorTone:"forest",desc:"A richer emerald face with a two-tone bracelet for a bold, coordinated luxury finish."}
];
const DEFAULT_COLORS = Object.fromEntries(PRODUCTS.map(product=>[product.id,{color:product.color,colorTone:product.colorTone}]));

const money = n => `Rs. ${Number(n).toLocaleString("en-PK")}`;
const getCart = () => JSON.parse(localStorage.getItem("arLuxoraCart") || "[]");
const saveCart = c => { localStorage.setItem("arLuxoraCart", JSON.stringify(c)); updateCartCount(); };
const getProducts = () => JSON.parse(localStorage.getItem("arLuxoraProducts") || "null") || PRODUCTS;
const saveProducts = p => localStorage.setItem("arLuxoraProducts", JSON.stringify(p));

function toast(msg){
  let t=document.querySelector(".toast");
  if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}
  t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600);
}
function updateCartCount(){
  const count=getCart().reduce((a,b)=>a+b.qty,0);
  document.querySelectorAll(".cart-count").forEach(e=>e.textContent=count);
}
function addToCart(id){
  const p=getProducts().find(x=>x.id===id); if(!p)return;
  const c=getCart(); const item=c.find(x=>x.id===id);
  if(item)item.qty++; else c.push({...p,qty:1});
  saveCart(c); toast(`${p.name} added to your bag.`);
}
function removeFromCart(id){
  saveCart(getCart().filter(x=>x.id!==id)); renderCart();
}
function renderCart(){
  const box=document.querySelector("#cartItems"); if(!box)return;
  const c=getCart();
  if(!c.length){box.innerHTML='<div class="empty">Your luxury bag is waiting for something beautiful.</div>'}
  else box.innerHTML=c.map(x=>`
    <div class="cart-item">
      <img src="${x.image}" alt="${x.name}">
      <div><h4>${x.name}</h4><p>${x.qty} × ${money(x.price)}</p></div>
      <button class="close" onclick="removeFromCart('${x.id}')">×</button>
    </div>`).join("");
  const total=c.reduce((a,b)=>a+b.price*b.qty,0);
  const totalEl=document.querySelector("#cartTotal"); if(totalEl)totalEl.textContent=money(total);
}
function openCart(){document.querySelector("#cartDrawer")?.classList.add("open");renderCart()}
function closeCart(){document.querySelector("#cartDrawer")?.classList.remove("open")}
function checkoutWhatsApp(){
  const c=getCart(); if(!c.length){toast("Your bag is empty.");return}
  let msg="Hello AR LUXORA! I would like to order:%0A";
  c.forEach(x=>msg+=`%0A• ${x.name} — ${x.qty} × ${money(x.price)}`);
  msg+=`%0A%0ATotal: ${money(c.reduce((a,b)=>a+b.price*b.qty,0))}%0A%0AName:%0AAddress:%0APhone:`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,"_blank");
}
function buyNow(id){
  const product=getProducts().find(item=>item.id===id); if(!product)return;
  const color=product.color||DEFAULT_COLORS[product.id]?.color||"Not specified";
  const message=`Hello AR LUXORA! I would like to buy:\n\n${product.name} (${product.id})\nColor: ${color}\nPrice: ${money(product.price)}\n\nName:\nAddress:\nPhone:`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
}
function productCard(p){
  const colors=p.color?{color:p.color,colorTone:p.colorTone}:DEFAULT_COLORS[p.id];
  return `<article class="product-card">
    <a class="product-details-link" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="product-img"><img src="${p.image}" alt="${p.name}" onerror="this.closest('.product-img').classList.add('image-missing');this.remove()"><span class="product-tag">${p.tag||"Luxury"}</span>${colors?`<span class="color-tag tone-${colors.colorTone}"><i aria-hidden="true"></i>${colors.color}</span>`:""}</div>
      <div class="product-body"><span class="badge">${p.category}</span><h3>${p.name}</h3><p>${p.desc}</p>
        <div class="card-price"><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div>
      </div>
    </a><div class="product-action"><a class="detail-btn" href="product.html?id=${encodeURIComponent(p.id)}">View details</a><button class="add-btn" onclick="addToCart('${p.id}')">Add to bag</button><button class="buy-btn" onclick="buyNow('${p.id}')">Buy now</button></div></article>`;
}
function renderProducts(list=getProducts(),selectedCategory="all"){
  const categoryGrids={
    "Men's Watches":"#menProductGrid",
    "Women's Watches":"#womenProductGrid",
    "Couple Watches":"#coupleProductGrid",
    "Brand Watches":"#brandProductGrid"
  };
  Object.entries(categoryGrids).forEach(([category,target])=>{
    const section=document.querySelector(`[data-category="${category}"]`);
    const grid=document.querySelector(target);
    if(!section||!grid)return;
    const products=list.filter(product=>product.category===category);
    section.hidden=selectedCategory!=="all"&&selectedCategory!==category;
    grid.innerHTML=products.length
      ?products.map(productCard).join("")
      :`<p class="category-empty">${getProducts().some(product=>product.category===category)?"No watches match your search.":category==="Brand Watches"?"Brand pieces are being added. Contact us to check current availability.":"New pieces for this collection are being curated."}</p>`;
  });
}
function initShop(){
  renderProducts();
  const search=document.querySelector("#productSearch"), filter=document.querySelector("#productFilter");
  function apply(){
    let list=getProducts(), q=(search?.value||"").toLowerCase(), cat=filter?.value||"all";
    list=list.filter(p=>(cat==="all"||p.category===cat) && `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q));
    renderProducts(list,cat);
  }
  search?.addEventListener("input",apply); filter?.addEventListener("change",apply);
}
function initNav(){
  document.querySelector("#menuBtn")?.addEventListener("click",()=>document.querySelector("#navLinks")?.classList.toggle("open"));
  document.querySelector("#cartBtn")?.addEventListener("click",openCart);
  document.querySelector("#cartClose")?.addEventListener("click",closeCart);
  document.querySelector("#cartBackdrop")?.addEventListener("click",closeCart);
  updateCartCount();
}
function initForms(){
  document.querySelectorAll("[data-contact-form]").forEach(form=>form.addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(form), name=data.get("name")||"Customer", message=data.get("message")||"I want to know more about AR LUXORA watches.";
    const text=`Hello AR LUXORA!%0AName: ${name}%0AMessage: ${message}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,"_blank");
    toast("Opening WhatsApp with your message.");
    form.reset();
  }));
}
function initProductModal(){
  document.querySelectorAll("[data-product-id]").forEach(btn=>btn.addEventListener("click",()=>{
    const p=getProducts().find(x=>x.id===btn.dataset.productId); if(!p)return;
    const m=document.querySelector("#productModal"); if(!m)return;
    m.querySelector(".modal-content").innerHTML=`<div class="split"><img class="story-img" src="${p.image}" alt="${p.name}"><div><span class="badge">${p.tag}</span><h2>${p.name}</h2><p>${p.desc}</p><h3>${money(p.price)}</h3><button class="btn btn-primary" onclick="addToCart('${p.id}');document.querySelector('#productModal').classList.remove('open')">Add to Bag</button></div></div>`;
    m.classList.add("open");
  }));
}
function initProductPage(){
  const detail=document.querySelector("#productDetail"); if(!detail)return;
  const id=new URLSearchParams(window.location.search).get("id");
  const product=getProducts().find(item=>item.id===id);
  if(!product){
    detail.innerHTML='<div class="product-not-found"><span class="eyebrow">AR LUXORA</span><h1>Timepiece not found</h1><p>This watch may no longer be in our collection.</p><a class="btn btn-primary" href="index.html#collection">Return to collection</a></div>';
    return;
  }
  document.title=`${product.name} | AR LUXORA`;
  detail.innerHTML=`<a class="detail-back" href="index.html#collection">← Back to collection</a>
    <div class="detail-layout">
      <div class="detail-image"><img src="${product.image}" alt="${product.name}" onerror="this.closest('.detail-image').classList.add('image-missing');this.remove()"></div>
      <div class="detail-copy"><span class="eyebrow">${product.category}</span><h1>${product.name}</h1><span class="badge">${product.tag||"Luxury"}</span>
        <div class="detail-price"><span class="price">${money(product.price)}</span>${product.oldPrice?`<span class="old-price">${money(product.oldPrice)}</span>`:""}</div>
        <p class="detail-description">${product.desc}</p>
        <dl class="detail-facts"><div><dt>Collection</dt><dd>${product.category}</dd></div><div><dt>Style</dt><dd>${product.tag||"Luxury"}</dd></div><div><dt>Reference</dt><dd>${product.id}</dd></div></dl>
        <button class="btn btn-primary detail-add" onclick="addToCart('${product.id}')">Add to bag</button>
      </div>
    </div>`;
}
document.addEventListener("DOMContentLoaded",()=>{initNav();initForms();initShop();initProductModal();initProductPage();});
