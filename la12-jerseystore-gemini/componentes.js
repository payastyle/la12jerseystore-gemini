/**
 * LA 12 - MOTOR DE INYECCIÓN DE COMPONENTES
 * Este script carga el Header y Footer en todas las páginas de forma dinámica.
 */

async function cargarComponentes() {
    try {
        // 1. CARGAR EL HEADER (Cintillo + Navegación + Logo + Buscador)
        const headerRes = await fetch('header.html');
        if (headerRes.ok) {
            const headerHtml = await headerRes.text();
            document.getElementById('header-placeholder').innerHTML = headerHtml;
        } else {
            console.error("Error: No se encontró el archivo header.html");
        }

        // 2. CARGAR EL FOOTER (Categorías + Redes Sociales + Info)
        const footerRes = await fetch('footer.html');
        if (footerRes.ok) {
            const footerHtml = await footerRes.text();
            document.getElementById('footer-placeholder').innerHTML = footerHtml;
        } else {
            console.error("Error: No se encontró el archivo footer.html");
        }

        // 3. ACTIVAR INTERACCIONES
        // Una vez inyectado el HTML, conectamos los botones con las funciones de app.js
        conectarEventosComponentes();

    } catch (error) {
        console.error("Error crítico cargando los componentes de LA 12:", error);
    }
}

/**
 * Conecta los botones del Header inyectado con las funciones de app.js
 */
function conectarEventosComponentes() {
    // Buscamos el nuevo botón "menu-trigger" que tiene las 3 barras
    const btnMenu = document.querySelector('.menu-trigger'); 
    if (btnMenu) {
        btnMenu.onclick = toggleMenu;
    }

    // Botón para cerrar el Menú Lateral (dentro del sidebar)
    const btnCerrar = document.querySelector('.btn-close-custom');
    if (btnCerrar) {
        btnCerrar.onclick = cerrarMenu;
    }

    // Icono del Carrito
    const btnCarrito = document.getElementById('open-cart');
    if (btnCarrito) {
        btnCarrito.onclick = abrirCarrito; // Función definida en app.js
    }

    // Sincronizar el contador del carrito inmediatamente después de cargar
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
}

// Iniciar la carga en cuanto el navegador esté listo
document.addEventListener('DOMContentLoaded', cargarComponentes);