/**
 * LA 12 - LÓGICA CENTRAL CORREGIDA
 */

// --- 1. ESTADO GLOBAL ---
let carrito = JSON.parse(localStorage.getItem('carritoLa12')) || [];

// --- 2. GESTIÓN DE NAVEGACIÓN ---

function toggleMenu() {
    const menu = document.getElementById('menu-lateral');
    const overlay = document.getElementById('overlay-menu');
    
    if (menu && overlay) {
        menu.classList.add('abierto');
        overlay.classList.add('activo');
        document.body.style.overflow = 'hidden'; 
    }
}

function cerrarMenu() {
    const menu = document.getElementById('menu-lateral');
    const overlay = document.getElementById('overlay-menu');
    
    if (menu && overlay) {
        menu.classList.remove('abierto');
        overlay.classList.remove('activo');
        document.body.style.overflow = 'auto';
    }
}

// ESCUCHADOR DE CLICS GLOBAL (Delegación de Eventos)
// Esto soluciona el problema de que el menú no abra
document.addEventListener('click', (e) => {
    // Si toca el botón de las 3 barras
    if (e.target.closest('.menu-trigger')) {
        toggleMenu();
    }
    // Si toca la X de cerrar o el fondo oscuro
    if (e.target.closest('.btn-close-custom') || e.target.id === 'overlay-menu') {
        cerrarMenu();
    }
});

// --- 3. RENDERIZADO DE PRODUCTOS ---
function renderizarProductos(filtro = "Todos") {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    const productosAMostrar = filtro === "Todos" 
        ? catalogo 
        : catalogo.filter(p => p.liga === filtro || p.marca === filtro);

    productosAMostrar.forEach(p => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto-card";
        
        const tieneOferta = p.precios.fan.oferta;
        const precioHTML = tieneOferta 
            ? `<div class="precio-contenedor">
                <span class="precio-tachado">$${p.precios.fan.normal}</span>
                <span class="precio-oferta">$${p.precios.fan.oferta}</span>
               </div>`
            : `<div class="precio-contenedor">
                <span class="precio-normal">$${p.precios.fan.normal}</span>
               </div>`;

        tarjeta.innerHTML = `
            ${tieneOferta ? '<span class="badge-oferta">OFERTA</span>' : ''}
            <img src="${p.imagenes.principal}" alt="${p.equipo}" class="img-producto">
            <h3>${p.equipo}</h3>
            <p class="subtitulo">${p.nombre}</p>
            ${precioHTML}
            <button class="btn-detalles" onclick="verDetallesProducto(${p.id}, '${p.equipo}', '${p.nombre}')">
                Ver Detalles
            </button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function verDetallesProducto(id, equipo, nombre) {
    const slug = `${equipo}-${nombre}`.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    window.location.href = `producto.html?id=${id}&jersey=${slug}`;
}

// --- 4. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("contenedor-productos")) {
        renderizarProductos();
    }
    const contador = document.getElementById("cart-count");
    if (contador) contador.innerText = carrito.length;
});