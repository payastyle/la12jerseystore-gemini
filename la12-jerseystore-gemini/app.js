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
  if(contador){
    contador.innerText = carrito.length;
  }
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

    // Lógica para tomar las dos imágenes (frente y vuelta)
    let imgFront = p.imagenes[0];
    let imgBack = p.imagenes[1] ? p.imagenes[1] : p.imagenes[0]; // Si no hay segunda, repite la primera

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

// ================== RESEÑAS ==================
function iniciarSliderResenas(){
  const contenedor = document.getElementById("slider-resenas");
  if(!contenedor) return;

  let lista = [...resenas].sort(()=>0.5 - Math.random());
  let index = 0;

  function mostrar(){
    const r = lista[index];
    const estrellas = "⭐".repeat(r.estrellas);

    contenedor.innerHTML = `
      <div class="resena-slide">
        <img src="${r.imagen}">
        <h4>${r.nombre}</h4>
        <p style="margin: 8px 0;">${estrellas}</p>
        <p style="color:#aaa;">"${r.comentario}"</p>
      </div>
    `;
    index = (index + 1) % lista.length;
  }

  mostrar();
  setInterval(mostrar, 4000);
}

// ================== RECOMENDADOS ==================
function generarRecomendados(){
  const contenedor = document.getElementById("productos-recomendados");
  if(!contenedor) return;

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

// ================== WHATSAPP ==================
function comprarWhatsApp(){
  let numero = "521XXXXXXXXXX";
  let mensaje = "🔥 Pedido - La 12 Jersey Store 🔥\n\n";
  let subtotal = 0;

  carrito.forEach((p,i)=>{
    mensaje += `🛒 Producto ${i+1}\n`;
    mensaje += `${p.nombre}\n`;
    mensaje += `ID: ${p.id}\n`;
    mensaje += `Talla: ${p.talla}\n`;
    if(p.tipo) mensaje += `Versión: ${p.tipo}\n`;
    if(p.personalizar === "Si"){
      mensaje += `Nombre: ${p.nombrePersonalizado}\n`;
      mensaje += `Número: ${p.numero}\n`;
    }
    if(p.parches === "Si") mensaje += `Con parches\n`;
    mensaje += `Precio: $${p.precio}\n\n`;
    subtotal += p.precio;
  });

  let envio = carrito.length >= 4 ? 0 : 50;
  let total = subtotal + envio;
  mensaje += `Total: $${total}`;
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

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", ()=>{
  actualizarContador();
  actualizarCarrito();
  iniciarSliderResenas();
  cargarTema();
  animarScroll();

  if(typeof productos !== "undefined" && document.getElementById("productos-categoria")){
    renderPLP(productos);
  }
});

window.addEventListener("scroll", animarScroll);