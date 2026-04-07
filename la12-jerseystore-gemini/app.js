// ================== DATA ==================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ================== GUARDAR ==================
function guardarCarrito(){
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

// ================== CONTADOR ==================
function actualizarContador(){
  const contador = document.getElementById("contador-carrito");
  if(contador) contador.innerText = carrito.length;
}

// ================== AGREGAR ==================
function agregarConfigurado(producto){
  carrito.push(producto);
  guardarCarrito();
}

// ================== ELIMINAR ==================
function eliminarProducto(index){
  carrito.splice(index,1);
  guardarCarrito();
  actualizarCarrito();
}

// ================== CARRITO ==================
function actualizarCarrito(){
  const contenedor = document.getElementById("carrito-productos");
  if(!contenedor) return;

  contenedor.innerHTML = "";
  let subtotal = 0;

  carrito.forEach((p,i)=>{
    contenedor.innerHTML += `
      <div class="item-carrito" style="display:flex; justify-content:space-between; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #333;">
        <div>
          <p><b>${p.nombre}</b></p>
          <p style="color:#888; font-size:14px;">Talla: ${p.talla || "-"}</p>
        </div>
        <div style="text-align:right;">
          <p>$${p.precio}</p>
          <button onclick="eliminarProducto(${i})" style="background:transparent; color:red; border:none; cursor:pointer; font-size:12px; margin-top:5px;">Eliminar</button>
        </div>
      </div>
    `;
    subtotal += p.precio;
  });

  let envio = carrito.length >= 4 ? 0 : 50;
  let total = subtotal + envio;

  if(document.getElementById("subtotal")) document.getElementById("subtotal").innerText = subtotal;
  if(document.getElementById("envio")) document.getElementById("envio").innerText = envio;
  if(document.getElementById("total")) document.getElementById("total").innerText = total;

  actualizarContador();
}

// ================== PLP ==================
function renderPLP(lista){
  const contenedor = document.getElementById("productos-categoria");
  if(!contenedor) return;

  contenedor.innerHTML = "";

  lista.forEach(p=>{
    let badge = "";
    if(p.tipoProducto === "retro") badge = `<div class="badge">Retro</div>`;
    if(p.tipoProducto === "niño") badge = `<div class="badge">Niño</div>`;

    let imgFront = p.imagenes[0];
    let imgBack = p.imagenes[1] ? p.imagenes[1] : p.imagenes[0];

    contenedor.innerHTML += `
      <div class="plp-card animar" onclick="verProducto('${p.id}')">
        ${badge}
        <div class="imagen-contenedor">
          <img src="${imgFront}" class="img-front">
          <img src="${imgBack}" class="img-back">
        </div>
        <div class="plp-info">
          <h3>${p.nombre}</h3>
          <p class="categoria">${p.liga || "Jersey"}</p>
          <p class="precio">$${p.precio}</p>
        </div>
      </div>
    `;
  });
  animarScroll();
}

// ================== CATEGORÍAS ==================
function mostrarCategoria(tipo){
  const titulo = document.getElementById("titulo-categoria");
  const nombres = {
    mundial: "Copa Mundial 2026",
    reciente: "Temporada 25/26",
    retro: "Retro",
    niño: "Niños",
    anime: "Anime"
  };

  if(titulo) titulo.innerText = nombres[tipo] || "Productos";
  const filtrados = productos.filter(p => p.tipoProducto === tipo);
  renderPLP(filtrados);
}

// ================== BUSCADOR ==================
function filtrarProductos(){
  const texto = document.getElementById("busqueda")?.value.toLowerCase() || "";
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    (p.equipo && p.equipo.toLowerCase().includes(texto)) ||
    (p.liga && p.liga.toLowerCase().includes(texto))
  );
  renderPLP(filtrados);
}

// ================== PRODUCTO ==================
function verProducto(id){
  window.location.href = `producto.html?id=${id}`;
}

// ================== RECOMENDADOS ==================
function generarRecomendados(){
  const contenedor = document.getElementById("productos-recomendados");
  if(!contenedor || typeof productos === "undefined") return;

  contenedor.innerHTML = "";
  const aleatorios = [...productos].sort(()=>0.5 - Math.random()).slice(0,4);

  aleatorios.forEach(p=>{
    let imgFront = p.imagenes[0];
    let imgBack = p.imagenes[1] ? p.imagenes[1] : p.imagenes[0];

    contenedor.innerHTML += `
      <div class="plp-card" onclick="verProducto('${p.id}')">
        <div class="imagen-contenedor">
          <img src="${imgFront}" class="img-front">
          <img src="${imgBack}" class="img-back">
        </div>
        <div class="plp-info">
          <h3>${p.nombre}</h3>
          <p class="precio">$${p.precio}</p>
        </div>
      </div>
    `;
  });
}

// ================== RESEÑAS TIPO TARJETA (PÁGINA DEDICADA) ==================
let indexResena = 0;
let intervaloResenas;

function renderResenaActual() {
  const contenedor = document.getElementById("tarjeta-carrusel-contenido");
  if(!contenedor || typeof resenas === "undefined" || resenas.length === 0) return;

  const r = resenas[indexResena];
  const estrellas = "⭐".repeat(r.estrellas);

  contenedor.innerHTML = `
    <div class="tarjeta-presentacion">
      <img src="${r.imagen}" alt="${r.nombre}" onerror="this.src='img/logo.png'">
      <h4>${r.nombre}</h4>
      <p class="estrellas-tarjeta">${estrellas}</p>
      <p class="comentario-tarjeta">"${r.comentario}"</p>
    </div>
  `;
}

function cambiarResena(direccion) {
  if(typeof resenas === "undefined" || resenas.length === 0) return;

  if (direccion === 'siguiente') {
    indexResena = (indexResena + 1) % resenas.length;
  } else if (direccion === 'anterior') {
    indexResena = (indexResena - 1 + resenas.length) % resenas.length;
  }
  
  renderResenaActual();
  reiniciarIntervaloResenas(); 
}

function reiniciarIntervaloResenas() {
  clearInterval(intervaloResenas);
  intervaloResenas = setInterval(() => {
    cambiarResena('siguiente');
  }, 10000); // 10 segundos
}

function iniciarCarruselTarjeta(){
  const contenedor = document.getElementById("tarjeta-carrusel-contenido");
  if(!contenedor) return;

  renderResenaActual();
  reiniciarIntervaloResenas();
}

// ================== WHATSAPP ==================
function comprarWhatsApp(){
  let numero = "521XXXXXXXXXX";
  let mensaje = "🔥 Pedido / Ayuda - La 12 Jersey Store 🔥\n\nHola, me gustaría recibir más información o ayuda con mi pedido.";
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

// ================== TEMA ==================
function cambiarTema(){
  document.body.classList.toggle("light");
  localStorage.setItem("tema", document.body.classList.contains("light") ? "light" : "dark");
}

function cargarTema(){
  if(localStorage.getItem("tema") === "light"){
    document.body.classList.add("light");
  }
}

// ================== ANIMACIONES ==================
function animarScroll(){
  document.querySelectorAll(".plp-card, .animar").forEach(el=>{
    const top = el.getBoundingClientRect().top;
    if(top < window.innerHeight - 50){
      el.classList.add("visible");
    }
  });
}

// ================== MENU ==================
function toggleMenu(e){
  if(e) e.stopPropagation();
  document.getElementById("menu-lateral").classList.toggle("open");
}

document.addEventListener("click", function(e){
  const menu = document.getElementById("menu-lateral");
  const btn = document.querySelector(".menu-icon");

  if(menu && btn){
    if(menu.classList.contains("open") && !menu.contains(e.target) && !btn.contains(e.target)){
      menu.classList.remove("open");
    }
  }
});

// ================== INIT GLOBAL ==================
document.addEventListener("DOMContentLoaded", ()=>{
  actualizarContador();
  actualizarCarrito();
  cargarTema();
  animarScroll();

  // 1. Si estamos en index.html
  if(document.getElementById("hero") && typeof irHome === "function"){
    irHome();
  }

  // 2. Si estamos en la página de Reseñas
  if(document.getElementById("tarjeta-carrusel-contenido")){
    iniciarCarruselTarjeta();
  }

  // 3. Si la página tiene recomendados (como resenas.html)
  if(document.getElementById("productos-recomendados")){
    generarRecomendados();
  }
});

window.addEventListener("scroll", animarScroll);