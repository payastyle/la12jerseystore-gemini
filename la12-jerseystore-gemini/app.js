/**
 * LA 12 - LÓGICA DE LA TIENDA (HOME)
 */

let carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];

// --- RENDERIZADO DE PRODUCTOS ---
function renderizarProductos(valor = "Todos", tipo = "Todos") {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor || typeof catalogo === 'undefined') return;

    contenedor.innerHTML = "";
    let productosAMostrar = [];

    if (tipo === "Todos") {
        productosAMostrar = catalogo;
    } else if (tipo === "busqueda") {
        const q = valor.toLowerCase();
        productosAMostrar = catalogo.filter(p => 
            p.equipo.toLowerCase().includes(q) || 
            p.nombre.toLowerCase().includes(q) ||
            p.liga.toLowerCase().includes(q)
        );
    } else {
        productosAMostrar = catalogo.filter(p => p.liga === valor || p.marca === valor);
    }

    if (productosAMostrar.length === 0) {
        contenedor.innerHTML = `<p class="text-center w-100 py-5">No se encontraron jerseys para "${valor}" 😢</p>`;
        return;
    }

    // --- AQUÍ ESTÁ EL CÓDIGO QUE SE HABÍA BORRADO ---
    productosAMostrar.forEach(p => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto-card";
        
        const tieneOferta = p.precios.fan.oferta;
        const precioHTML = tieneOferta 
            ? `<div class="precio-contenedor">
                <span class="precio-tachado">$${p.precios.fan.normal}.00</span>
                <span class="precio-oferta">$${p.precios.fan.oferta}.00</span>
               </div>`
            : `<div class="precio-contenedor">
                <span class="precio-normal">$${p.precios.fan.normal}.00</span>
               </div>`;

        tarjeta.innerHTML = `
            ${tieneOferta ? '<span class="badge-oferta">OFERTA 🔥</span>' : ''}
            <img src="${p.imagenes.principal}" alt="${p.equipo}" class="img-producto">
            <h3 class="fw-bold mt-2">${p.equipo}</h3>
            <p class="subtitulo text-muted small">${p.nombre}</p>
            ${precioHTML}
            <button class="btn btn-dark w-100 mt-2" onclick="verDetallesProducto(${p.id}, '${p.equipo}', '${p.nombre}')">
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

// Inicialización del Home
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("contenedor-productos")) {
        // Leemos los parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        const liga = params.get('liga');
        const marca = params.get('marca');

        if (query) {
            // Si hay búsqueda, filtramos por texto
            renderizarProductos(query, "busqueda");
        } else if (liga) {
            renderizarProductos(liga, "liga");
        } else if (marca) {
            renderizarProductos(marca, "marca");
        } else {
            renderizarProductos(); // Carga normal
        }
    }
});