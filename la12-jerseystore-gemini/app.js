/* ==========================================================================
   LA 12 JERSEY STORE - CEREBRO PRINCIPAL (app.js)
   ========================================================================== */

// ================= VARIABLES GLOBALES =================
let carrito = JSON.parse(localStorage.getItem('carritoLa12')) || [];
let productoActual = null;

// Estado para la página de producto (PDP)
let pdpEstado = {
    version: 'Versión Fan',
    dorsal: 'Sin Dorsal',
    dorsalTexto: '',
    talla: ''
};

// ================= INICIALIZACIÓN =================
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadoresGlobales();

    // Detectar página actual
    if (window.location.pathname.includes('producto.html')) {
        cargarProducto();
    } else if (window.location.pathname.includes('carrito.html')) {
        actualizarCarrito();
    }
});

// ================= LÓGICA DE PRODUCTO (PDP) =================
function cargarProducto() {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    const contenedor = document.getElementById('pdp-contenedor');

    if (typeof productos !== 'undefined') {
        productoActual = productos.find(p => p.id === idProducto);
    }

    if (!productoActual || !contenedor) return;

    // Precios y Ahorro
    const pNormal = productoActual.precioNormal || (productoActual.precio + 500);
    const pOferta = productoActual.precio;
    const ahorro = Math.round(((pNormal - pOferta) / pNormal) * 100);

    // Inyectar HTML básico (Solo lo necesario)
    contenedor.innerHTML = `
        <div class="pdp-layout">
            <div class="pdp-galeria">
                <img src="${productoActual.imagenes[0]}" id="pdp-imagen-principal">
            </div>

            <div class="pdp-info">
                <h1>${productoActual.nombre}</h1>
                
                <div class="precios-pdp">
                    <span style="text-decoration:line-through; color:#888;">$${pNormal}</span>
                    <span id="pdp-precio-dinamico" style="font-size:24px; color:#d4af37; font-weight:bold; margin-left:10px;">$${pOferta}</span>
                </div>

                <div class="opciones">
                    <h3>Selecciona Versión</h3>
                    <button class="btn-opcion seleccionada" onclick="cambiarOpcionPDP('version', 'Versión Fan', this)">Versión Fan</button>
                    <button class="btn-opcion" onclick="cambiarOpcionPDP('version', 'Versión Jugador', this)">Versión Jugador (+$120)</button>
                    
                    <h3>Dorsal</h3>
                    <button class="btn-opcion seleccionada" onclick="cambiarOpcionPDP('dorsal', 'Sin Dorsal', this)">Sin Dorsal</button>
                    <button class="btn-opcion" onclick="cambiarOpcionPDP('dorsal', 'Con Dorsal', this)">Personalizado (+$80)</button>
                    <input type="text" id="input-dorsal" placeholder="NOMBRE 10" style="display:none; width:100%; margin-top:10px;">

                    <h3>Talla</h3>
                    <div id="contenedor-tallas">
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'S', this)">S</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'M', this)">M</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'L', this)">L</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'XL', this)">XL</button>
                    </div>
                </div>

                <button class="btn-principal" onclick="agregarAlCarrito()" style="width:100%; margin-top:20px; padding:15px;">AGREGAR AL CARRITO</button>
                <button class="btn-opcion" onclick="compartirJersey()" style="width:100%; margin-top:10px;">🔗 Compartir Jersey</button>
            </div>
        </div>
    `;
}

function cambiarOpcionPDP(tipo, valor, elemento) {
    pdpEstado[tipo] = valor;
    
    // Switch visual de botones
    const botones = elemento.parentElement.querySelectorAll('.btn-opcion');
    botones.forEach(btn => btn.classList.remove('seleccionada'));
    elemento.classList.add('seleccionada');

    if (tipo === 'dorsal') {
        document.getElementById('input-dorsal').style.display = (valor === 'Con Dorsal') ? 'block' : 'none';
    }
    calcularPrecioDinamico();
}

function calcularPrecioDinamico() {
    let total = productoActual.precio;
    if (pdpEstado.version === 'Versión Jugador') total += 120;
    if (pdpEstado.dorsal === 'Con Dorsal') total += 80;
    
    document.getElementById('pdp-precio-dinamico').innerText = `$${total}`;
    return total;
}

// ================= CARRITO Y CÁLCULOS (CON CUPONES) =================

function agregarAlCarrito() {
    if (!pdpEstado.talla) return alert("Selecciona una talla.");

    const item = {
        id: productoActual.id,
        nombre: productoActual.nombre,
        precio: calcularPrecioDinamico(),
        talla: pdpEstado.talla,
        version: pdpEstado.version,
        dorsal: (pdpEstado.dorsal === 'Con Dorsal') ? document.getElementById('input-dorsal').value : 'Sin Dorsal',
        cantidad: 1,
        imagen: productoActual.imagenes[0]
    };

    carrito.push(item);
    localStorage.setItem('carritoLa12', JSON.stringify(carrito));
    actualizarContadoresGlobales();
    alert("¡Agregado!");
}

function actualizarCarrito() {
    const contenedor = document.getElementById("carrito-productos-lista");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    let subtotal = 0;
    let totalPrendas = 0;

    carrito.forEach((p, i) => {
        subtotal += (p.precio * p.cantidad);
        totalPrendas += p.cantidad;
        contenedor.innerHTML += `
            <div class="item-carrito">
                <p>${p.nombre} (${p.talla}) - $${p.precio} x ${p.cantidad}</p>
                <button onclick="eliminarDelCarrito(${i})">Eliminar</button>
            </div>
        `;
    });

    // --- LÓGICA DE CUPÓN Y ENVÍO (CONEXIÓN CON PROMO.JS) ---
    let descuento = 0;
    if (typeof cuponAplicado !== 'undefined' && cuponAplicado !== null) {
        descuento = subtotal * cuponAplicado.descuento;
    }

    let envio = 0;
    if (totalPrendas > 0) {
        // Usar reglas de PROMOS si existe, sino usar 4 por defecto
        const metaEnvio = (typeof PROMOS !== 'undefined') ? PROMOS.envioGratis.cantidadMinima : 4;
        const costoBase = (typeof PROMOS !== 'undefined') ? PROMOS.envioGratis.costoEnvio : 130;
        
        envio = (totalPrendas >= metaEnvio) ? 0 : costoBase;
    }

    const totalFinal = subtotal - descuento + envio;

    // Inyectar en el HTML del carrito
    if(document.getElementById("subtotal")) document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    if(document.getElementById("envio")) document.getElementById("envio").innerText = (envio === 0) ? "GRATIS" : `$${envio}`;
    if(document.getElementById("total")) document.getElementById("total").innerText = `$${totalFinal.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carritoLa12', JSON.stringify(carrito));
    actualizarCarrito();
    actualizarContadoresGlobales();
}

function actualizarContadoresGlobales() {
    const cont = document.getElementById('contador-carrito');
    if (cont) cont.innerText = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

function compartirJersey() {
    if (navigator.share) {
        navigator.share({
            title: productoActual.nombre,
            url: window.location.href
        });
    }
}

function finalizarCompraWhatsApp() {
    // Genera el mensaje de texto para WhatsApp con el detalle del carrito
    let mensaje = "Hola La 12, quiero confirmar mi pedido:\n";
    carrito.forEach(p => {
        mensaje += `- ${p.nombre} (${p.talla}) ${p.version}\n`;
    });
    // Agrega el cupón al mensaje si existe
    if (typeof cuponAplicado !== 'undefined' && cuponAplicado !== null) {
        mensaje += `\nCupón aplicado: ${cuponAplicado.codigo}`;
    }
    
    window.open(`https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(mensaje)}`);
}

// Función para abrir/cerrar menú
function toggleMenu() {
    const menu = document.getElementById("menu-lateral");
    menu.style.left = (menu.style.left === "0px") ? "-300px" : "0px";
}