// ================== VARIABLES GLOBALES ==================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let tallaSeleccionada = null;
let productoActual = null;
let productosFiltrados = [];
let vistaActual = 'grid';
let indexResena = 0;
let intervaloResenas;

// ================== LÓGICA DEL CARRITO ==================
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if(contador) contador.innerText = carrito.length;
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  const contenedor = document.getElementById("carrito-productos");
  if(!contenedor) return;

  contenedor.innerHTML = "";
  let subtotal = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p style='color:#888; text-align:center;'>Tu carrito está vacío.</p>";
    document.getElementById("subtotal").innerText = "0";
    document.getElementById("envio").innerText = "0";
    document.getElementById("total").innerText = "0";
    return;
  }

  carrito.forEach((p, i) => {
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

// ================== PÁGINA DE INICIO (HOME) ==================
function renderPLP(lista) {
  const contenedor = document.getElementById("productos-categoria");
  if(!contenedor) return;

  contenedor.innerHTML = "";
  
  // En el home mostramos máximo 8 productos destacados
  const destacados = lista.slice(0, 8);

  destacados.forEach(p => {
    let badge = "";
    if(p.tipoProducto === "retro") badge = `<div class="badge">Retro</div>`;
    if(p.tipoProducto === "niño") badge = `<div class="badge">Niño</div>`;
    let badgeStock = p.stock === false ? `<div class="badge" style="background:red; color:white; top:40px;">Agotado</div>` : '';

    let imgFront = p.imagenes[0];
    let imgBack = p.imagenes[1] ? p.imagenes[1] : p.imagenes[0];

    contenedor.innerHTML += `
      <div class="plp-card animar" onclick="verProducto('${p.id}')">
        ${badge}
        ${badgeStock}
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

function generarRecomendados() {
  const contenedor = document.getElementById("productos-recomendados");
  if(!contenedor || typeof productos === "undefined") return;

  contenedor.innerHTML = "";
  const aleatorios = [...productos].sort(()=>0.5 - Math.random()).slice(0,4);

  aleatorios.forEach(p=>{
    let imgFront = p.imagenes[0];
    let imgBack = p.imagenes[1] ? p.imagenes[1] : p.imagenes[0];

    contenedor.innerHTML += `
      <div class="plp-card animar" onclick="verProducto('${p.id}')">
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
  animarScroll();
}

function verProducto(id) {
  window.location.href = `producto.html?id=${id}`;
}

// ================== PÁGINA DE PRODUCTO (PDP) ==================
function cargarProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const contenedor = document.getElementById("detalle-producto");
  const errorContenedor = document.getElementById("mensaje-error");

  if (!id || typeof productos === "undefined") return;

  productoActual = productos.find(p => p.id === id);

  if (!productoActual) {
    if(contenedor) contenedor.style.display = "none";
    if(errorContenedor) errorContenedor.style.display = "block";
    return;
  }

  let miniaturasHTML = '';
  if (productoActual.imagenes.length > 1) {
    productoActual.imagenes.forEach((img, index) => {
      miniaturasHTML += `<img src="${img}" class="miniatura ${index === 0 ? 'activa' : ''}" onclick="cambiarImagenPrincipal(this, '${img}')">`;
    });
  }

  let stockMensaje = productoActual.stock === false 
    ? `<p style="color:red; font-weight:bold; margin-bottom:15px;">❌ Agotado temporalmente</p>` 
    : `<p style="color:#00ff88; font-weight:bold; margin-bottom:15px;">✅ En Stock - Listo para envío</p>`;

  let botonComprar = productoActual.stock === false
    ? `<button class="btn-principal" style="background:#555; cursor:not-allowed;" disabled>AGOTADO</button>`
    : `<button class="btn-principal" onclick="agregarAlCarritoPDP()">AGREGAR AL CARRITO 🛒</button>`;

  contenedor.innerHTML = `
    <div class="pdp-galeria">
      <div class="imagen-principal-box">
        <img src="${productoActual.imagenes[0]}" id="imagen-principal">
      </div>
      <div class="pdp-miniaturas">${miniaturasHTML}</div>
    </div>
    
    <div class="pdp-info">
      <p class="pdp-liga">${productoActual.liga || "Jersey"} | ${productoActual.equipo || ""}</p>
      <h1 class="pdp-titulo">${productoActual.nombre}</h1>
      <h2 class="pdp-precio">$${productoActual.precio}</h2>
      
      ${stockMensaje}

      <div class="pdp-tallas">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h3>Selecciona tu talla</h3>
          <a href="tallas.html" style="color:#d4af37; font-size:14px; text-decoration:none;">Ver guía de tallas📏</a>
        </div>
        <div class="grid-tallas">
          <button class="btn-talla" onclick="seleccionarTalla(this, 'S')">S</button>
          <button class="btn-talla" onclick="seleccionarTalla(this, 'M')">M</button>
          <button class="btn-talla" onclick="seleccionarTalla(this, 'L')">L</button>
          <button class="btn-talla" onclick="seleccionarTalla(this, 'XL')">XL</button>
          <button class="btn-talla" onclick="seleccionarTalla(this, 'XXL')">XXL</button>
        </div>
      </div>

      ${botonComprar}

      <div class="pdp-descripcion">
        <h3>Detalles del Producto</h3>
        <p>${productoActual.descripcion || "Jersey de la más alta calidad, logos bordados/termosellados y tela transpirable."}</p>
      </div>
      
      <div class="trust-badges-pdp">
        <p>🔒 Pago 100% Seguro</p>
        <p>🚚 Envío a todo México</p>
      </div>
    </div>
  `;
}

function cambiarImagenPrincipal(elemento, url) {
  document.getElementById("imagen-principal").src = url;
  document.querySelectorAll(".miniatura").forEach(img => img.classList.remove("activa"));
  elemento.classList.add("activa");
}

function seleccionarTalla(boton, talla) {
  tallaSeleccionada = talla;
  document.querySelectorAll(".btn-talla").forEach(btn => btn.classList.remove("seleccionada"));
  boton.classList.add("seleccionada");
}

function agregarAlCarritoPDP() {
  if (!tallaSeleccionada) {
    alert("⚠️ Por favor, selecciona una talla antes de agregar al carrito.");
    return;
  }
  let productoParaCarrito = { ...productoActual, talla: tallaSeleccionada };
  carrito.push(productoParaCarrito);
  guardarCarrito();

  const toast = document.getElementById("toast-notificacion");
  if(toast){
    toast.classList.add("mostrar");
    setTimeout(() => { toast.classList.remove("mostrar"); }, 3000);
  }

  tallaSeleccionada = null;
  document.querySelectorAll(".btn-talla").forEach(btn => btn.classList.remove("seleccionada"));
}

// ================== PÁGINA DE CATÁLOGO (Filtros y Orden) ==================
function iniciarCatalogo() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoriaURL = urlParams.get('cat');
  
  if (categoriaURL) {
    productosFiltrados = productos.filter(p => p.tipoProducto === categoriaURL);
    let titulo = categoriaURL.replace("-", " ").toUpperCase();
    document.getElementById("catalogo-titulo").innerText = titulo;
  } else {
    productosFiltrados = [...productos];
    document.getElementById("catalogo-titulo").innerText = "TODOS LOS JERSEYS";
  }
  aplicarFiltrosYOrden();
}

function actualizarLabelPrecio() {
  const label = document.getElementById("precio-label");
  const input = document.getElementById("filtro-precio");
  if(label && input) label.innerText = input.value;
}

function aplicarFiltrosYOrden() {
  const stockEl = document.getElementById("filtro-stock");
  const ligaEl = document.getElementById("filtro-liga");
  const precioEl = document.getElementById("filtro-precio");
  const ordenEl = document.getElementById("ordenar-select");

  if(!stockEl || !ligaEl || !precioEl || !ordenEl) return;

  const soloStock = stockEl.checked;
  const liga = ligaEl.value;
  const precioMax = parseInt(precioEl.value);
  const orden = ordenEl.value;

  let resultado = productosFiltrados.filter(p => {
    let pasaStock = soloStock ? p.stock === true : true;
    let pasaLiga = liga === "todas" ? true : (p.liga && p.liga.toLowerCase() === liga);
    let pasaPrecio = p.precio <= precioMax;
    return pasaStock && pasaLiga && pasaPrecio;
  });

  resultado.sort((a, b) => {
    if (orden === "precio-menor") return a.precio - b.precio;
    if (orden === "precio-mayor") return b.precio - a.precio;
    if (orden === "a-z") return a.nombre.localeCompare(b.nombre);
    if (orden === "z-a") return b.nombre.localeCompare(a.nombre);
    if (orden === "recientes") {
      let fechaA = new Date(a.fecha || "2000-01-01");
      let fechaB = new Date(b.fecha || "2000-01-01");
      return fechaB - fechaA; 
    }
  });

  document.getElementById("contador-productos").innerText = resultado.length;
  renderizarCatalogoFinal(resultado);
}

function renderizarCatalogoFinal(lista) {
  const contenedor = document.getElementById("productos-catalogo");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if(lista.length === 0){
    contenedor.innerHTML = `<p style="color:#888; grid-column: 1/-1; text-align:center; padding:50px;">No hay productos que coincidan con estos filtros.</p>`;
    return;
  }

  contenedor.className = vistaActual === 'grid' ? "plp-grid" : "plp-list";

  lista.forEach(p => {
    let badgeStock = p.stock === false ? `<div class="badge" style="background:red; color:white;">Agotado</div>` : '';
    let imgFront = p.imagenes[0];
    let imgBack = p.imagenes[1] ? p.imagenes[1] : p.imagenes[0];

    contenedor.innerHTML += `
      <div class="plp-card animar" onclick="verProducto('${p.id}')">
        ${badgeStock}
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

function cambiarVista(tipo) {
  vistaActual = tipo;
  document.getElementById("btn-grid").classList.remove("active");
  document.getElementById("btn-list").classList.remove("active");
  document.getElementById(`btn-${tipo}`).classList.add("active");
  aplicarFiltrosYOrden();
}

// ================== CHECKOUT Y PAGOS (CARRITO) ==================
function irPaso2() {
  if (carrito.length === 0) { alert("Tu carrito está vacío"); return; }
  document.getElementById("paso1").style.display = "none";
  document.getElementById("paso2").style.display = "block";
}

function irPaso3() {
  const nombre = document.getElementById("nombre");
  if (!nombre || !nombre.value) { alert("Completa tus datos para continuar."); return; }
  document.getElementById("paso2").style.display = "none";
  document.getElementById("paso3").style.display = "block";
}

function seleccionarMetodo(valor) {
  document.querySelectorAll('.metodo-info').forEach(div => div.style.display = 'none');

  if (valor === "PayPal") {
    document.getElementById("area-paypal").style.display = "block";
    renderizarPaypal(); 
  } else if (valor === "Transferencia") {
    document.getElementById("area-transferencia").style.display = "block";
  } else if (valor === "OXXO") {
    document.getElementById("area-oxxo").style.display = "block";
  }
}

function renderizarPaypal() {
  const total = document.getElementById("total").innerText;
  const container = document.getElementById("paypal-button-container");
  
  if(!container) return;
  container.innerHTML = ""; 

  // Asegura que paypal SDK esté cargado
  if(typeof paypal !== "undefined") {
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{ amount: { value: total } }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('¡Pago aprobado! Redirigiendo a WhatsApp para confirmar detalles y validar tu captura.');
          finalizarCompraWhatsApp('PayPal (Pagado)', details.id);
          localStorage.removeItem("carrito");
          window.location.href = "index.html";
        });
      }
    }).render('#paypal-button-container');
  }
}

function finalizarCompraWhatsApp(metodo, ordenID = "N/A") {
  const numero = "521XXXXXXXXXX"; // Configura tu número de WhatsApp aquí
  const nombreCliente = document.getElementById("nombre").value || "Cliente";
  const total = document.getElementById("total").innerText;

  let mensaje = `✅ *NUEVO PEDIDO - LA 12 JERSEY STORE*\n\n`;
  mensaje += `👤 *Cliente:* ${nombreCliente}\n`;
  mensaje += `💳 *Método:* ${metodo}\n`;
  if(ordenID !== "N/A") mensaje += `🆔 *ID Pago:* ${ordenID}\n`;
  mensaje += `💰 *Total:* $${total}\n\n`;
  mensaje += `📦 *PRODUCTOS:* \n`;

  carrito.forEach((p, i) => {
    mensaje += `${i + 1}. ${p.nombre} (Talla: ${p.talla || "N/A"})\n`;
  });

  mensaje += `\n*Por favor, adjunto mi captura de pantalla/ticket arriba.*`;

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

function comprarWhatsApp() {
  let numero = "521XXXXXXXXXX";
  let mensaje = "🔥 Contacto - La 12 Jersey Store 🔥\n\nHola, necesito ayuda o me gustaría cotizar una camiseta.";
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

// ================== PÁGINA DE RESEÑAS ==================
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
  }, 10000); // Rota cada 10 seg
}

function iniciarCarruselTarjeta() {
  const contenedor = document.getElementById("tarjeta-carrusel-contenido");
  if(!contenedor) return;
  renderResenaActual();
  reiniciarIntervaloResenas();
}

// ================== UI / UX (TEMA, SCROLL Y MENÚ) ==================
function cambiarTema() {
  document.body.classList.toggle("light");
  localStorage.setItem("tema", document.body.classList.contains("light") ? "light" : "dark");
}

function cargarTema() {
  if (localStorage.getItem("tema") === "light") {
    document.body.classList.add("light");
  }
}

function animarScroll() {
  document.querySelectorAll(".plp-card, .animar").forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
}

function toggleMenu(e) {
  if(e) e.stopPropagation();
  document.getElementById("menu-lateral").classList.toggle("open");
}

document.addEventListener("click", function(e) {
  const menu = document.getElementById("menu-lateral");
  const btn = document.querySelector(".menu-icon");

  if(menu && btn){
    if(menu.classList.contains("open") && !menu.contains(e.target) && !btn.contains(e.target)){
      menu.classList.remove("open");
    }
  }
});

// ================== INIT (ENRUTADOR PRINCIPAL) ==================
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
  actualizarCarrito();
  cargarTema();
  animarScroll();

  // 1. Home (index.html)
  if (document.getElementById("hero") && typeof productos !== "undefined") {
    renderPLP(productos);
  }

  // 2. Catálogo (catalogo.html)
  if (document.getElementById("productos-catalogo")) {
    iniciarCatalogo();
  }

  // 3. Detalles de Producto (producto.html)
  if (document.getElementById("detalle-producto")) {
    cargarProducto();
  }

  // 4. Página de Reseñas (resenas.html)
  if (document.getElementById("tarjeta-carrusel-contenido")) {
    iniciarCarruselTarjeta();
  }

  // 5. Recomendados (presente en Reseñas, Home o donde se agregue)
  if (document.getElementById("productos-recomendados")) {
    generarRecomendados();
  }
});

window.addEventListener("scroll", animarScroll);