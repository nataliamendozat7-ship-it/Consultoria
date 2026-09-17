const products = [
 {id:1,name:"Vitamina C 500 mg",category:"Vitaminas",price:249,img:"producto-1.png",desc:"Tabletas con vitamina C para complementar tu rutina.",rating:4.9,reviews:128},
 {id:2,name:"Vitamina D3",category:"Vitaminas",price:319,img:"producto-2.png",desc:"Vitamina D3 en cápsulas, presentación de 60 piezas.",rating:4.8,reviews:96},
 {id:3,name:"Complejo B",category:"Vitaminas",price:289,img:"producto-3.png",desc:"Complejo de vitaminas B para tu rutina diaria.",rating:4.7,reviews:84},
 {id:4,name:"Multivitamínico Daily",category:"Vitaminas",price:459,img:"producto-4.png",desc:"Fórmula multivitamínica de uso diario.",rating:4.8,reviews:112},
 {id:5,name:"Vitamina E",category:"Vitaminas",price:379,img:"producto-5.png",desc:"Cápsulas de vitamina E para complementar tu alimentación.",rating:4.9,reviews:143},
 {id:6,name:"Magnesio",category:"Minerales",price:329,img:"producto-6.png",desc:"Suplemento de magnesio en presentación práctica.",rating:4.6,reviews:71},
 {id:7,name:"Zinc",category:"Minerales",price:219,img:"producto-7.png",desc:"Zinc en cápsulas para complementar la dieta.",rating:4.7,reviews:88},
 {id:8,name:"Calcio + D",category:"Minerales",price:399,img:"producto-8.png",desc:"Combinación de calcio y vitamina D.",rating:4.8,reviews:102},
 {id:9,name:"Omega 3",category:"Bienestar",price:549,img:"producto-9.png",desc:"Cápsulas de Omega 3 para una rutina de bienestar.",rating:4.9,reviews:156},
 {id:10,name:"Colágeno",category:"Bienestar",price:629,img:"producto-10.png",desc:"Colágeno en polvo para preparar fácilmente.",rating:4.8,reviews:119},
 {id:11,name:"Probióticos",category:"Bienestar",price:599,img:"producto-11.png",desc:"Probióticos en cápsulas para complementar tu alimentación.",rating:4.7,reviews:93},
 {id:12,name:"Electrolitos",category:"Energía",price:199,img:"producto-12.png",desc:"Mezcla en polvo para preparar una bebida con electrolitos.",rating:4.9,reviews:174},
 {id:13,name:"Bebida energética natural",category:"Energía",price:289,img:"producto-13.png",desc:"Bebida ficticia de energía para este proyecto académico.",rating:4.6,reviews:67},
 {id:14,name:"Gummies multivitamínicas",category:"Vitaminas",price:349,img:"producto-14.png",desc:"Gomitas multivitamínicas de sabor agradable.",rating:4.9,reviews:161}
];
let cart=JSON.parse(localStorage.getItem("mvsCart")||"[]"), orders=JSON.parse(localStorage.getItem("mvsOrders")||"[]");
let currentUser=JSON.parse(localStorage.getItem("mvsUser")||"null"), users=JSON.parse(localStorage.getItem("mvsUsers")||"[]");
let appliedCoupon=localStorage.getItem("mvsCoupon")||"";
const $=id=>document.getElementById(id), money=n=>n.toLocaleString("es-MX",{style:"currency",currency:"MXN"});
function save(){localStorage.setItem("mvsCart",JSON.stringify(cart));localStorage.setItem("mvsOrders",JSON.stringify(orders));localStorage.setItem("mvsUsers",JSON.stringify(users));localStorage.setItem("mvsUser",JSON.stringify(currentUser));localStorage.setItem("mvsCoupon",appliedCoupon);updateCartCount()}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2400)}
function showView(id){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$(id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"});if(id==="catalogo")renderProducts();if(id==="seguimiento")renderOrders()}
document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();showView(el.dataset.view);history.replaceState(null,"","#"+el.dataset.view)}));
function renderProducts(){
 const q=($("searchInput")?.value||"").toLowerCase().trim(),cat=$("categoryFilter")?.value||"todos";
 const list=products.filter(p=>(cat==="todos"||p.category===cat)&&(p.name+" "+p.category+" "+p.desc).toLowerCase().includes(q));
 $("productGrid").innerHTML=list.length?list.map(p=>`<article class="product">
 <div class="product-img"><img src="images/${p.img}" alt="${p.name}">${p.reviews>=140?'<span class="popular">🔥 Más pedido</span>':''}</div>
 <div class="product-body"><small class="product-category">${p.category}</small><h3>${p.name}</h3><p>${p.desc}</p>
 <div class="rating">★★★★★ <b>${p.rating}</b> <small>(${p.reviews})</small></div><div class="price">${money(p.price)}</div>
 <button class="button" onclick="addToCart(${p.id})">Agregar al carrito</button></div></article>`).join(""):'<div class="empty">No encontramos productos con esa búsqueda.</div>';
}
$("searchInput").addEventListener("input",renderProducts);$("categoryFilter").addEventListener("change",renderProducts);
function updateCartCount(){$("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0)}
function addToCart(id){let i=cart.find(x=>x.id===id);if(i)i.qty++;else cart.push({id,qty:1});save();renderCart();toast("Producto agregado al carrito 🛒")}
function changeQty(id,d){let i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);save();renderCart()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();renderCart();toast("Producto eliminado")}
function totals(){
 const subtotal=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 let discount=subtotal>=1500?subtotal*.10:0,coupon="";
 if(appliedCoupon==="MVS10"){discount+=subtotal*.10;coupon="Cupón MVS10 (10%)"}
 return {subtotal,discount,total:Math.max(0,subtotal-discount),coupon};
}
function renderCart(){
 const area=$("cartItems"),sum=$("cartSummary");
 if(!cart.length){area.innerHTML='<div class="empty">Tu carrito está vacío.</div>';sum.innerHTML="";$("checkoutBtn").disabled=true;return}
 $("checkoutBtn").disabled=false;
 area.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id);return `<div class="cart-row"><div><b>${p.name}</b><small>${money(p.price)} c/u</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div><button class="remove" onclick="removeItem(${p.id})">Eliminar</button></div>`}).join("");
 let t=totals();sum.innerHTML=`<div class="summary"><div><span>Subtotal</span><b>${money(t.subtotal)}</b></div>${t.discount?`<div class="discount"><span>${t.coupon||"Compra de $1,500 o más (10%)"}</span><b>-${money(t.discount)}</b></div>`:""}<div class="total"><span>Total</span><b>${money(t.total)}</b></div></div>`;
}
$("cartNav").addEventListener("click",()=>{$("cartModal").classList.remove("hidden");renderCart()});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).classList.add("hidden")));
$("checkoutBtn").addEventListener("click",()=>{if(!currentUser){$("cartModal").classList.add("hidden");$("loginModal").classList.remove("hidden");toast("Inicia sesión para continuar");return}$("cartModal").classList.add("hidden");$("buyerName").value=currentUser.name||"";appliedCoupon="";$("couponInput").value="";$("couponMessage").textContent="";updateCheckoutDetails();$("checkoutModal").classList.remove("hidden")});
function updateCheckoutDetails(){let t=totals();$("checkoutDetails").innerHTML=`<div class="summary"><div><span>Subtotal</span><b>${money(t.subtotal)}</b></div>${t.discount?`<div class="discount"><span>${t.coupon}</span><b>-${money(t.discount)}</b></div>`:""}<div class="total"><span>Total</span><b>${money(t.total)}</b></div></div>`}
$("applyCoupon").addEventListener("click",()=>{let c=$("couponInput").value.trim().toUpperCase();if(c==="MVS10"){appliedCoupon="MVS10";$("couponMessage").textContent="✓ Cupón aplicado: 10% de descuento";$("couponMessage").className="coupon-message ok"}else{appliedCoupon="";$("couponMessage").textContent="✕ Cupón no válido. Prueba MVS10";$("couponMessage").className="coupon-message bad"}save();updateCheckoutDetails()});
$("checkoutForm").addEventListener("submit",e=>{e.preventDefault();let t=totals(),code="MVS-"+new Date().getFullYear()+"-"+Math.floor(100000+Math.random()*900000),now=new Date();
 orders.unshift({code,date:now.toLocaleString("es-MX"),email:currentUser.email,name:$("buyerName").value,address:$("buyerAddress").value,payment:$("paymentMethod").value,items:cart.map(i=>({id:i.id,qty:i.qty})),subtotal:t.subtotal,discount:t.discount,total:t.total,status:0});
 cart=[];appliedCoupon="";save();$("checkoutModal").classList.add("hidden");$("checkoutForm").reset();$("trackingInput").value=code;showView("seguimiento");renderOrders();trackOrder(code);toast("¡Pedido confirmado! Código: "+code)});
function orderCard(o){let labels=["Pedido recibido","Preparando","En camino","Entregado"],txt=o.items.map(i=>`${products.find(p=>p.id===i.id).name} × ${i.qty}`).join(", ");return `<article class="order-card"><div class="order-top"><div><span class="order-number">${o.code}</span><br><small>${o.date}</small></div><span class="status">${labels[o.status]}</span></div><p class="order-products"><b>Productos:</b> ${txt}</p><p><b>Entrega:</b> ${o.address}</p><p><b>Pago:</b> ${o.payment}</p><p><b>Total:</b> ${money(o.total)} ${o.discount?`· <span class="discount">Descuento ${money(o.discount)}</span>`:""}</p><div class="progress">${labels.map((_,i)=>`<div class="step ${i<=o.status?"done":""}"></div>`).join("")}</div><button class="text-btn advance" data-code="${o.code}">Actualizar demostración</button></article>`}
function renderOrders(){if(!currentUser){$("ordersArea").innerHTML='<div class="empty">Inicia sesión para consultar tus compras.</div>';return}let mine=orders.filter(o=>o.email===currentUser.email);$("ordersArea").innerHTML=mine.length?mine.map(orderCard).join(""):'<div class="empty">Todavía no tienes pedidos.</div>';document.querySelectorAll(".advance").forEach(b=>b.onclick=()=>{let o=orders.find(x=>x.code===b.dataset.code);if(o.status<3){o.status++;save();renderOrders();trackOrder(o.code)}else toast("El pedido ya fue entregado")})}
function trackOrder(code){let c=code.trim().toUpperCase(),o=orders.find(x=>x.code.toUpperCase()===c);if(!o){$("trackingResult").innerHTML=c?'<div class="track-error">No encontramos ese código. Revisa que esté escrito correctamente.</div>':"";return}let labels=["Pedido recibido","Preparando","En camino","Entregado"];$("trackingResult").innerHTML=`<div class="tracking-result"><div><b>${o.code}</b><span class="status">${labels[o.status]}</span></div><p>Pedido de <b>${o.name}</b> · Total ${money(o.total)}</p><div class="progress">${labels.map((l,i)=>`<div><div class="step ${i<=o.status?"done":""}"></div><small>${l}</small></div>`).join("")}</div></div>`}
$("trackBtn").addEventListener("click",()=>trackOrder($("trackingInput").value));$("trackingInput").addEventListener("keydown",e=>{if(e.key==="Enter")trackOrder(e.target.value)});
function openLogin(){$("loginModal").classList.remove("hidden")} $("loginNav").addEventListener("click",openLogin);$("heroLogin").addEventListener("click",openLogin);
function resetLogin(){$("authContent").innerHTML=`<h2>Iniciar sesión</h2><p class="modal-note">Cuenta de demostración guardada solamente en este navegador.</p><form id="loginForm"><input id="loginEmail" type="email" required placeholder="Correo electrónico"><input id="loginPassword" type="password" required placeholder="Contraseña"><button class="button full" type="submit">Iniciar sesión</button></form><button class="text-btn" id="showRegister">¿No tienes cuenta? Crear cuenta</button>`;bindAuth()}
function bindAuth(){$("loginForm").onsubmit=e=>{e.preventDefault();let email=$("loginEmail").value.toLowerCase().trim(),pass=$("loginPassword").value,u=users.find(x=>x.email===email&&x.password===pass);if(!u)return toast("Correo o contraseña incorrectos");currentUser={name:u.name,email:u.email};save();$("loginModal").classList.add("hidden");toast("Bienvenida/o, "+u.name+" 👋");renderOrders()};$("showRegister").onclick=showRegisterForm}
function showRegisterForm(){$("authContent").innerHTML=`<h2>Crear cuenta</h2><p class="modal-note">Los datos son de demostración y se guardan en este navegador.</p><form id="registerForm"><input id="regName" required placeholder="Nombre completo"><input id="regEmail" type="email" required placeholder="Correo electrónico"><input id="regPassword" type="password" minlength="4" required placeholder="Contraseña"><button class="button full">Crear cuenta</button></form><button class="text-btn" id="backLogin">Ya tengo cuenta · Iniciar sesión</button>`;$("registerForm").onsubmit=e=>{e.preventDefault();let name=$("regName").value.trim(),email=$("regEmail").value.toLowerCase().trim(),password=$("regPassword").value;if(users.some(u=>u.email===email))return toast("Ese correo ya tiene una cuenta");users.push({name,email,password});currentUser={name,email};save();$("loginModal").classList.add("hidden");toast("Cuenta creada correctamente 🎉")};$("backLogin").onclick=resetLogin}
$("contactForm").onsubmit=e=>{e.preventDefault();toast("Gracias, "+$("contactName").value+". Tu mensaje fue recibido.");e.target.reset()};
// Carousel
let slide=0;const track=$("promoTrack"),dots=$("promoDots");function renderCarousel(){track.style.transform=`translateX(-${slide*100}%)`;dots.innerHTML=[0,1,2].map(i=>`<button class="${i===slide?"active":""}" aria-label="Publicidad ${i+1}" onclick="slide=${i};renderCarousel()"></button>`).join("")}
$("promoPrev").onclick=()=>{slide=(slide+2)%3;renderCarousel()};$("promoNext").onclick=()=>{slide=(slide+1)%3;renderCarousel()};setInterval(()=>{slide=(slide+1)%3;renderCarousel()},6000);
renderProducts();renderCart();updateCartCount();renderCarousel();
