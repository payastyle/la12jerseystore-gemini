/**
 * LA 12 - MOTOR DE INYECCIÓN Y CONTROL DE COMPONENTES
 */

async function cargarComponentes() {
    try {
        const headerRes = await fetch('header.html');
        if (headerRes.ok) document.getElementById('header-placeholder').innerHTML = await headerRes.text();

        const footerRes = await fetch('footer.html');
        if (footerRes.ok) document.getElementById('footer-placeholder').innerHTML = await footerRes.text();

        conectarEventosComponentes();
    } catch (error) {
        console.error("Error cargando componentes:", error);
    }
}

// --- FUNCIONES DEL MENÚ ---
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

function actualizarBadgeCarrito() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    
    const carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    badge.innerText = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

// --- CONEXIÓN DE BOTONES ---
function conectarEventosComponentes() {
    const btnMenu = document.querySelector('.menu-trigger'); 
    if (btnMenu) btnMenu.onclick = toggleMenu;

    const btnCerrar = document.querySelector('.btn-close-custom');
    if (btnCerrar) btnCerrar.onclick = cerrarMenu;

    // Conectamos el ícono del carrito del header
    const btnCarritoHeader = document.querySelector('.carrito-capsula');
    if (btnCarritoHeader) btnCarritoHeader.onclick = abrirCarrito; 

    // --- LÓGICA DEL BUSCADOR ---
const formBusqueda = document.querySelector('.buscador-capsula');
if (formBusqueda) {
    formBusqueda.onsubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue sola
        const input = formBusqueda.querySelector('input');
        const query = input.value.trim();
        if (query) {
            // Mandamos al usuario a la PLP con el término de búsqueda
            window.location.href = `plp.html?q=${encodeURIComponent(query)}`
        }
    };
}
    actualizarBadgeCarrito();
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.menu-trigger')) toggleMenu();
    if (e.target.closest('.btn-close-custom') || e.target.id === 'overlay-menu') cerrarMenu();
});

document.addEventListener('DOMContentLoaded', cargarComponentes);

// ==========================================
// --- LÓGICA DEL CARRITO LATERAL (MINI CART) ---
// ==========================================

function abrirCarrito() {
    // Si estamos en la página del carrito completo, no hacemos nada
    if (window.location.pathname.includes('carrito.html')) {
        return;
    }
    // Si estamos en cualquier otra página, abrimos el panel lateral
    abrirMiniCarrito();
}

function abrirMiniCarrito() {
    renderizarMiniCarrito();
    const panelLateral = document.getElementById('miniCarritoLateral');
    if (panelLateral) {
        // CORRECCIÓN: Usamos getInstance para no clonar la pantalla negra
        let bsOffcanvas = bootstrap.Offcanvas.getInstance(panelLateral);
        if (!bsOffcanvas) {
            bsOffcanvas = new bootstrap.Offcanvas(panelLateral);
        }
        bsOffcanvas.show();
    }
}

function renderizarMiniCarrito() {
    const contenedor = document.getElementById('mini-carrito-lista');
    const subtotalText = document.getElementById('mini-carrito-subtotal');
    if(!contenedor) return;

    const carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-muted mt-5 small">Tu carrito está vacío.</p>';
        if(subtotalText) subtotalText.innerText = "$0.00";
        return;
    }

    let subtotal = 0;
    contenedor.innerHTML = carrito.map((item, index) => {
        let precioLimpio = parseInt(item.precio.split('.')[0].replace(/[^0-9]/g, ''));
        subtotal += (precioLimpio * item.cantidad);


return `
        <div class="d-flex align-items-center mb-3 border-bottom pb-3">
            <a href="producto.html?id=${item.id}" class="d-flex align-items-center text-decoration-none text-dark flex-grow-1">
                <img src="${item.imagen}" style="width: 50px; height: 65px; object-fit: contain; border-radius: 4px;">
                <div class="ms-3">
                    <p class="mb-0 fw-bold" style="font-size: 13px;">${item.equipo}</p>
                    <p class="mb-0 text-muted" style="font-size: 11px;">Talla: ${item.talla} | Cant: ${item.cantidad}</p>
                    <p class="mb-0 fw-bold text-gold" style="font-size: 14px;">${item.precio}</p>
                </div>
            </a>
            <button class="btn btn-link text-danger p-0 ms-2" onclick="eliminarDelMiniCarrito(${index})" style="text-decoration:none;">🗑️</button>
        </div>`;
    }).join('');

    if(subtotalText) subtotalText.innerText = `$${subtotal.toLocaleString()}.00`;
}

function eliminarDelMiniCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito_la12', JSON.stringify(carrito));
    
    renderizarMiniCarrito();
    actualizarBadgeCarrito();
}