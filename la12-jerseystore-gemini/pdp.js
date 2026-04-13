document.addEventListener('DOMContentLoaded', () => {
    // 1. OBTENER PRODUCTO DEL CATÁLOGO
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    
    if (typeof catalogo === 'undefined') {
        console.error("Error: catalogo.js no se cargó correctamente.");
        return;
    }

    // Buscamos el producto o usamos el primero por defecto
    const producto = catalogo.find(p => p.id === productId) || catalogo[0]; 

    // 2. DATOS DE CABECERA Y PRECIOS INICIALES
    document.querySelector('.pdp-title').innerText = `${producto.equipo} - ${producto.nombre}`;
    const pDisplay = document.getElementById('pdp-price-display');
    const oDisplay = document.getElementById('old-price');

    // --- INYECTAR LA DESCRIPCIÓN / HISTORIA ---
    const descElement = document.getElementById('pdp-descripcion');
    if (descElement) {
        if (producto.descripcion) {
            descElement.innerText = producto.descripcion;
            descElement.style.display = 'block';
        } else {
            descElement.style.display = 'none';
        }
    }

    // --- LÓGICA DEL BREADCRUMB (Categoría / Nombre) ---
    const linkCat = document.getElementById('breadcrumb-link-cat');
    const txtProd = document.getElementById('breadcrumb-prod-name');

    if (linkCat && txtProd) {
        linkCat.innerText = producto.categoria || "Colección";
        linkCat.href = `plp.html?cat=${encodeURIComponent(producto.categoria)}`;
        txtProd.innerText = producto.equipo;
    }

    // --- ✨ AQUÍ AGREGAMOS LA LÓGICA DE IMÁGENES Y GALERÍA ---
    const mainImg = document.getElementById('main-product-img');
    const thumbContainer = document.getElementById('galeria-thumbs');

    if (producto.imagenes) {
        // Ponemos la imagen principal inicial
        if (mainImg) mainImg.src = producto.imagenes.principal;

        // Creamos las miniaturas (Principal + Galería)
        if (thumbContainer) {
            const todasLasFotos = [producto.imagenes.principal, ...producto.imagenes.galeria];
            thumbContainer.innerHTML = todasLasFotos.map((url, index) => `
                <img src="${url}" 
                     class="pdp-thumb ${index === 0 ? 'active' : ''}" 
                     onclick="changeImage(this)">
            `).join('');
        }
    }
    // -------------------------------------------------------

    if (pDisplay && producto.precios.fan) {
        pDisplay.innerText = `$${producto.precios.fan.oferta}.00`;
        oDisplay.innerText = `$${producto.precios.fan.normal}.00`;
    }

    // 3. CONTROL DE VERSIONES (JUGADOR / FAN)
    const vSelector = document.getElementById('version-selector');
    if (vSelector) {
        const btnJug = vSelector.querySelector('[data-version="Jugador"]');
        if (producto.versiones && !producto.versiones.tiene_jugador && btnJug) {
            btnJug.style.display = 'none'; 
        }
    }

    // 4. GUÍA DE TALLAS DINÁMICA
    const imgGuia = document.getElementById('img-guia-tallas');
    if (imgGuia && producto.categoria) {
        const categoriaLimpia = producto.categoria.trim().toLowerCase();
        imgGuia.src = (categoriaLimpia === 'kids') ? 'img/guia-kids.jpg' : 'img/guia-adultos.jpg';
    }

    // 5. CARGAR TALLAS DINÁMICAS DEL CATÁLOGO
    const sSelector = document.getElementById('size-selector');
    if (sSelector && producto.tallas_disponibles) {
        sSelector.innerHTML = producto.tallas_disponibles.map(t => 
            `<button class="btn-pdp-opt">${t}</button>`
        ).join('');
        rebindButtons(); 
    }

    // 6. EVENTOS DE CLIC PARA VERSIONES (ACTUALIZAR PRECIOS)
    const vButtons = document.querySelectorAll('#version-selector .btn-pdp-opt');
    vButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            vButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tipo = btn.getAttribute('data-version').toLowerCase();
            if (producto.precios[tipo]) {
                pDisplay.innerText = `$${producto.precios[tipo].oferta}.00`;
                oDisplay.innerText = `$${producto.precios[tipo].normal}.00`;
            }
        });
    });

    // 7. LÓGICA DE FECHAS AUTOMÁTICAS
    const hoy = new Date();
    const envio = new Date(); envio.setDate(hoy.getDate() + 5);
    const entregaMin = new Date(); entregaMin.setDate(hoy.getDate() + 15);
    const entregaMax = new Date(); entregaMax.setDate(hoy.getDate() + 20);
    const opciones = { day: 'numeric', month: 'short' };

    if(document.getElementById('fecha-orden')) {
        document.getElementById('fecha-orden').innerText = hoy.toLocaleDateString('es-MX', opciones);
        document.getElementById('fecha-envio').innerText = envio.toLocaleDateString('es-MX', opciones);
        const r = `${entregaMin.toLocaleDateString('es-MX', opciones)} - ${entregaMax.toLocaleDateString('es-MX', opciones)}`;
        document.getElementById('fecha-entrega').innerText = r;
        if(document.getElementById('rango-entrega')) document.getElementById('rango-entrega').innerText = r;
    }

    // 8. LÓGICA DE RECOMENDACIONES ALEATORIAS
    function cargarRecomendados() {
        const contenedor = document.getElementById('productos-recomendados');
        if (!contenedor) return;

        const sugerencias = catalogo
            .filter(p => p.id !== producto.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 8); 

        contenedor.innerHTML = sugerencias.map(p => `
            <div class="col-6 col-md-3 mb-4">
                <div class="card h-100 border-0 shadow-sm p-2 text-center card-recomendado">
                    <a href="producto.html?id=${p.id}" class="text-decoration-none">
                        <div class="pdp-img-container mb-2">
                            <img src="${p.imagenes.principal}" class="img-recomendado img-front">
                            <img src="${p.imagenes.hover || p.imagenes.principal}" class="img-recomendado img-back">
                        </div>
                        <h6 class="text-dark fw-bold mb-1 small">${p.equipo}</h6>
                        <p class="text-muted x-small mb-1">${p.nombre}</p>
                        <span class="text-gold fw-900">$${p.precios.fan.oferta}.00</span>
                    </a>
                </div>
            </div>
        `).join('');
    }
    cargarRecomendados();

    // 9. FUNCIONALIDAD DEL BOTÓN AGREGAR AL CARRITO
    const btnCarrito = document.querySelector('.btn-add-cart-pdp');

    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => {
            const tallaActiva = document.querySelector('#size-selector .btn-pdp-opt.active');
            const versionActiva = document.querySelector('#version-selector .btn-pdp-opt.active');
            
            const inputNombre = document.querySelector('input[placeholder="Nombre (Ej: GIGNAC)"]');
            const inputNumero = document.querySelector('input[placeholder="10"]');

            if (!tallaActiva) {
                alert("⚠️ Selecciona una talla");
                return;
            }

            let precioTexto = document.getElementById('pdp-price-display').innerText;

            const itemCarrito = {
                id: producto.id,
                equipo: producto.equipo,
                nombre: producto.nombre,
                imagen: producto.imagenes.principal,
                talla: tallaActiva.innerText,
                version: versionActiva ? versionActiva.getAttribute('data-version') : 'Fan',
                precio: precioTexto, 
                cantidad: 1,
                personalizacion: {
                    nombre: inputNombre ? inputNombre.value.trim().toUpperCase() : "",
                    numero: inputNumero ? inputNumero.value.trim() : ""
                }
            };

            let carritoActual = JSON.parse(localStorage.getItem('carrito_la12')) || [];
            carritoActual.push(itemCarrito);
            localStorage.setItem('carrito_la12', JSON.stringify(carritoActual));

            actualizarBadgeCarrito();

            if (typeof abrirMiniCarrito === 'function') {
                abrirMiniCarrito();
            }

            btnCarrito.innerText = "¡AÑADIDO! ✅";
            setTimeout(() => { btnCarrito.innerText = "Añadir al Carrito 🛒"; }, 2000);
        });
    }

    function rebindButtons() {
        const sButtons = document.querySelectorAll('#size-selector .btn-pdp-opt');
        sButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                sButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
});

// Función global para la galería de fotos (Fuera para que onclick la vea)
function changeImage(el) {
    const mainImg = document.getElementById('main-product-img');
    if(mainImg) mainImg.src = el.src;
    document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}