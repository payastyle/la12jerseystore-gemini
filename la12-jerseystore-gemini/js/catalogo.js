// ==========================================
// js/catalogo.js - LÓGICA DE LA PLP (NIKE STYLE)
// ==========================================

// Estado global de los filtros para que se puedan combinar
let filtros = {
    categoria: null,
    liga: null,
    marca: null,
    busqueda: ""
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Capturar parámetros de la URL (ej: ?cat=anime o ?search=messi)
    const params = new URLSearchParams(window.location.search);
    filtros.categoria = params.get('cat');
    const busquedaInicial = params.get('search');

    if (busquedaInicial) {
        document.getElementById('busqueda-input').value = busquedaInicial;
        filtros.busqueda = busquedaInicial.toLowerCase();
    }

    // 2. Actualizar el título visual según la categoría
    actualizarTitulo();

    // 3. Ejecutar el primer renderizado
    ejecutarFiltros();
});

// FUNCIÓN PRINCIPAL DE FILTRADO
function ejecutarFiltros() {
    const orden = document.getElementById('ordenar-select').value;
    const inputBusqueda = document.getElementById('busqueda-input')?.value.toLowerCase() || "";
    
    let resultado = [...productos]; // Copia de la base de datos de productos.js

    // A. Filtro por Categoría (Temporada, Anime, Retro, etc.)
    if (filtros.categoria) {
        resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    // B. Filtro por Liga
    if (filtros.liga) {
        resultado = resultado.filter(p => p.liga === filtros.liga);
    }

    // C. Filtro por Marca
    if (filtros.marca) {
        resultado = resultado.filter(p => p.marca === filtros.marca);
    }

    // D. Filtro por Buscador de texto
    if (inputBusqueda) {
        resultado = resultado.filter(p => 
            p.nombre.toLowerCase().includes(inputBusqueda) || 
            p.equipo.toLowerCase().includes(inputBusqueda) ||
            p.jugador.toLowerCase().includes(inputBusqueda)
        );
    }

    // E. Ordenar resultados
    if (orden === "recientes") {
        // Ordena por fecha de la más nueva a la más vieja
        resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (orden === "baratos") {
        resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === "caros") {
        resultado.sort((a, b) => b.precio - a.precio);
    }

    renderizarProductos(resultado);
}

// DIBUJAR LOS PRODUCTOS EN EL HTML
function renderizarProductos(lista) {
    const contenedor = document.getElementById('contenedor-catalogo');
    const contador = document.getElementById('contador-productos');

    if (contador) contador.innerText = `${lista.length} Productos encontrados`;

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 100px 0;">
                <p style="color: #707072; font-size: 18px;">No encontramos resultados para tu búsqueda. 🔍</p>
                <button onclick="limpiarFiltros()" class="btn-principal" style="margin-top:20px;">VER TODO EL CATÁLOGO</button>
            </div>`;
        return;
    }

    contenedor.innerHTML = lista.map(p => {
        const tieneDescuento = p.precio < p.precioNormal;
        return `
        <article class="card-nike" onclick="window.location.href='producto.html?id=${p.id}'">
            <div class="img-nike-box">
                ${tieneDescuento ? `<span class="badge-promo">Oferta</span>` : ''}
                <img src="${p.imagenes[0]}" alt="${p.nombre}" loading="lazy">
                ${p.imagenes[1] ? `<img src="${p.imagenes[1]}" class="img-hover" loading="lazy">` : ''}
            </div>
            <div class="info-nike">
                <span class="categoria-tag">${p.categoria.replace('-', ' ').toUpperCase()}</span>
                <h4>${p.nombre}</h4>
                <p style="color:#707072; font-size:14px;">${p.liga}</p>
                <div style="margin-top:10px;">
                    <span class="precio-nike">$${p.precio}</span>
                    ${tieneDescuento ? `<span class="precio-tachado">$${p.precioNormal}</span>` : ''}
                </div>
            </div>
        </article>
    `}).join('');
}

// FUNCIONES DE INTERACCIÓN DESDE EL HTML
function filtrarPor(tipo, valor) {
    // Si se hace clic en lo que ya estaba seleccionado, se limpia el filtro (toggle)
    if (filtros[tipo] === valor) {
        filtros[tipo] = null;
    } else {
        filtros[tipo] = valor;
    }
    
    actualizarTitulo();
    ejecutarFiltros();
}

function limpiarFiltros() {
    filtros = { categoria: null, liga: null, marca: null, busqueda: "" };
    const input = document.getElementById('busqueda-input');
    if (input) input.value = "";
    actualizarTitulo();
    ejecutarFiltros();
}

function actualizarTitulo() {
    const titulo = document.getElementById('titulo-categoria');
    if (!titulo) return;

    if (filtros.categoria) {
        titulo.innerText = filtros.categoria.replace('-', ' ');
    } else if (filtros.liga) {
        titulo.innerText = filtros.liga;
    } else if (filtros.marca) {
        titulo.innerText = filtros.marca;
    } else {
        titulo.innerText = "Todos los Jerseys";
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('plp-sidebar');
    const btn = document.querySelector('.btn-filter-toggle');
    if (sidebar.style.display === "none") {
        sidebar.style.display = "block";
        btn.innerHTML = 'Ocultar Filtros <i class="bi bi-sliders"></i>';
    } else {
        sidebar.style.display = "none";
        btn.innerHTML = 'Mostrar Filtros <i class="bi bi-sliders"></i>';
    }
}