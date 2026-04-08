/* ==========================================================================
   LA 12 JERSEY STORE - CEREBRO PRINCIPAL (app.js)
   ========================================================================== */

// ================= VARIABLES GLOBALES =================
let carrito = JSON.parse(localStorage.getItem('carritoLa12')) || [];
let productoActual = null;

let pdpEstado = {
    version: 'Versión Fan',
    dorsal: 'Sin Dorsal',
    dorsalTexto: '',
    talla: ''
};

const nombresCategoriasLegibles = {
    "temporada": "Temporada 25/26",
    "mundial": "Copa del Mundo 26",
    "retro-clubes": "Retro Clubes",
    "retro-selecciones": "Retro Selecciones",
    "kids": "Kids",
    "anime": "Edición Anime"
};

// ================= INICIALIZACIÓN =================
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadoresGlobales();

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

    // Aseguramos que productos.js esté cargado
    if (typeof productos !== 'undefined') {
        productoActual = productos.find(p => p.id === idProducto);
    }

    if (!productoActual || !contenedor) return;

    const categoria = productoActual.tipoProducto;
    const pNormal = productoActual.precioNormal || (productoActual.precio + 500);
    const pOferta = productoActual.precio;
    const ahorro = Math.round(((pNormal - pOferta) / pNormal) * 100);

    let htmlVersiones = '';
    if (['temporada', 'mundial', 'anime'].includes(categoria)) {
        htmlVersiones = `
            <button class="btn-opcion seleccionada" onclick="cambiarOpcionPDP('version', 'Versión Fan', this)">Versión Fan</button>
            <button class="btn-opcion" onclick="cambiarOpcionPDP('version', 'Versión Jugador', this)">Versión Jugador (+ $120)</button>
            <button class="btn-opcion" onclick="cambiarOpcionPDP('version', 'Manga Larga', this)">Manga Larga (+ $120)</button>
        `;
    } else {
        htmlVersiones = `<button class="btn-opcion seleccionada" onclick="cambiarOpcionPDP('version', 'Versión Fan', this)">Versión Fan</button>`;
    }

    contenedor.innerHTML = `
        <div class="pdp-layout">
            <div class="pdp-galeria">
                <img src="${productoActual.imagenes[0]}" id="pdp-imagen-principal" alt="${productoActual.nombre}">
                <div class="pdp-miniaturas">
                    ${productoActual.imagenes.map(img => `<img src="${img}" onclick="document.getElementById('pdp-imagen-principal').src='${img}'">`).join('')}
                </div>
            </div>

            <div class="pdp-info">
                <p class="pdp-liga">${nombresCategoriasLegibles[categoria] || categoria}</p>
                <h1 class="pdp-titulo">${productoActual.nombre}</h1>
                
                <div class="contenedor-precios-pdp" style="margin-bottom: 20px; display: flex; align-items: center;">
                    <span class="precio-original-tachado" style="text-decoration: line-through; color: #888; font-size: 18px; margin-right: 10px;">$${pNormal}</span>
                    <span class="precio-actual-oferta" id="pdp-precio-dinamico" style="font-size: 28px; color: #d4af37; font-weight: 800;">$${pOferta}</span>
                    <span class="badge-ahorro" style="background: #cc0000; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px; font-weight: bold;">${ahorro}% OFF</span>
                </div>

                <div class="opcion-bloque">
                    <h3>1. Elige la Versión</h3>
                    <div class="opciones-grid">${htmlVersiones}</div>
                </div>

                <div class="opcion-bloque">
                    <h3>2. ¿Nombre y Número?</h3>
                    <div class="opciones-grid">
                        <button class="btn-opcion seleccionada" onclick="cambiarOpcionPDP('dorsal', 'Sin Dorsal', this)">Sin Dorsal</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('dorsal', 'Con Dorsal', this)">Personalizado (+ $80)</button>
                    </div>
                    <input type="text" id="input-dorsal" placeholder="Ej: MESSI 10" style="display: none; width: 100%; padding: 10px; margin-top: 10px; border-radius: 4px; border: 1px solid #444; background: #111; color: white;">
                </div>

                <div class="opcion-bloque">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>3. Selecciona tu Talla</h3>
                        <a href="tallas.html" style="color: #aaa; font-size: 12px; text-decoration: underline;">Guía de Tallas</a>
                    </div>
                    <div class="opciones-grid" id="contenedor-tallas"></div>
                </div>

                <button class="btn-principal" onclick="agregarAlCarrito()" style="width: 100%; padding: 15px; font-size: 16px; margin-top: 20px;">AGREGAR AL CARRITO 🛒</button>
                
                <button class="btn-opcion" id="btn-compartir" style="width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 15px; border: 1px solid #333; color: #fff; background: transparent; padding: 10px;" onclick="compartirJersey()">
                    <span style="font-size: 1.2em; margin-right: 8px;">🔗</span> Compartir Jersey
                </button>
            </div>
        </div>
    `;

    renderizarTallasDisponibles();
    calcularPrecioDinamico();
}

function renderizarTallasDisponibles() {
    const categoria = productoActual.tipoProducto;
    const contTallas = document.getElementById('contenedor-tallas');
    let tallas = [];

    if (categoria === 'kids') {
        tallas = ['16', '18', '20', '22', '24', '26', '28'];
    } else if (['retro-clubes', 'retro-selecciones'].includes(categoria)) {
        tallas = ['S', 'M', 'L', 'XL', 'XXL'];
    } else {
        tallas = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
    }

    let html = '';
    tallas.forEach(talla => {
        let esExtra = ['XXL', '3XL', '4XL'].includes(talla) ? ' (+ $35)' : '';
        html += `<button class="btn-opcion" onclick="cambiarOpcionPDP('talla', '${talla}', this)">${talla}${esExtra}</button>`;
    });
    contTallas.innerHTML = html;
}

function cambiarOpcionPDP(tipo, valor, elemento) {
    pdpEstado[tipo] = valor;
    const botones = elemento.parentElement.querySelectorAll('.btn-opcion');
    botones.forEach(btn => btn.classList.remove('seleccionada'));
    elemento.classList.add('seleccionada');

    if (tipo === 'dorsal') {
        document.getElementById('input-dorsal').style.display = (valor === 'Con Dorsal') ? 'block' : 'none';
    }
    calcularPrecioDinamico();
}

function calcularPrecioDinamico() {
    let base = productoActual.precio;
    let extra = 0;

    if (pdpEstado.version !== 'Versión Fan') extra += 120;
    if (pdpEstado.dorsal === 'Con Dorsal') extra += 80;
    if (['XXL', '3XL', '4XL'].includes(pdpEstado.talla)) extra += 35;

    let precioFinal = base + extra;
    document.getElementById('pdp-precio-dinamico').innerText = `$${precioFinal}`;
    return precioFinal;
}

function compartirJersey() {
    if (navigator.share) {
        navigator.share({
            title: `La 12 Jersey Store - ${productoActual.nombre}`,
            text: `¡Checa este jersey premium de ${productoActual.nombre}!`,
            url: window.location.href
        }).catch((error) => console.log('Error al compartir', error));
    } else {
        alert("Copia y pega este enlace para compartir el jersey:\n\n" + window.location.href);
    }
}

// ================= CARRITO Y CÁLCULOS =================
function agregarAlCarrito() {
    if (!pdpEstado.talla) {
        alert("Por favor, selecciona una talla antes de agregar al carrito.");
        return;
    }

    let dorsalTxt = '';
    if (pdpEstado.dorsal === 'Con Dorsal') {
        dorsalTxt = document.getElementById('input-dorsal').value.trim();
        if (!dorsalTxt) {
            alert("Elegiste la opción 'Con Dorsal', por favor escribe el nombre y número.");
            return;
        }
    }

    const item = {
        id: productoActual.id,
        nombre: productoActual.nombre,
        imagenes: productoActual.imagenes,
        precio: calcularPrecioDinamico(),
        versionSelec: pdpEstado.version,
        talla: pdpEstado.talla,
        dorsalTexto: dorsalTxt,
        cantidad: 1,
        categoria: nombresCategoriasLegibles[productoActual.tipoProducto] || productoActual.tipoProducto
    };

    carrito.push(item);
    guardarCarrito();
    actualizarContadoresGlobales();
    alert("¡Producto agregado al carrito con éxito!");
}

function actualizarCarrito() {
    const contenedor = document.getElementById("carrito-productos-lista");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    let subtotalGeneral = 0;
    let totalPrendas = 0;

    carrito.forEach((p, i) => {
        let precioLinea = p.precio * p.cantidad;
        subtotalGeneral += precioLinea;
        totalPrendas += p.cantidad;

        contenedor.innerHTML += `
            <div class="cart-item" style="display: flex; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                <img src="${p.imagenes[0]}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px; color: #fff;">${p.nombre}</h4>
                    <p style="margin: 0; color: #aaa; font-size: 13px;">${p.talla} | ${p.versionSelec} ${p.dorsalTexto ? '| ' + p.dorsalTexto : ''}</p>
                    <p style="margin: 5px 0 0; color: #d4af37; font-weight: bold;">$${p.precio.toFixed(2)} c/u</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
                    <button onclick="eliminarProducto(${i})" style="background: none; border: none; color: #cc0000; cursor: pointer; font-size: 18px;">🗑️</button>
                    <div style="display: flex; align-items: center; gap: 10px; background: #222; padding: 5px 10px; border-radius: 20px;">
                        <button onclick="cambiarCantidad(${i}, -1)" style="background: none; border: none; color: white; cursor: pointer;">-</button>
                        <span style="color: white; font-weight: bold;">${p.cantidad}</span>
                        <button onclick="cambiarCantidad(${i}, 1)" style="background: none; border: none; color: white; cursor: pointer;">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    // 1. Calcular el Envío (Lee de promo.js si existe)
    let costoEnvio = 0;
    let promoEnvioActiva = false;
    let envMeta = 4; // Por defecto
    
    if (typeof PROMOS !== 'undefined') {
        promoEnvioActiva = PROMOS.envioGratis.activo;
        envMeta = PROMOS.envioGratis.cantidadMinima;
        costoEnvio = PROMOS.envioGratis.costoEnvio;
    }

    if (totalPrendas > 0) {
        if (promoEnvioActiva && totalPrendas >= envMeta) {
            costoEnvio = 0;
        }
    } else {
        costoEnvio = 0;
    }

    // 2. Calcular Descuentos de Cupones (Lee de promo.js si aplicaron uno)
    let montoDescuento = 0;
    if (typeof cuponAplicado !== 'undefined' && cuponAplicado !== null) {
        montoDescuento = subtotalGeneral * cuponAplicado.descuento; 
    }

    // 3. Total Final
    const totalFinal = subtotalGeneral - montoDescuento + costoEnvio;

    // 4. Actualizar la Interfaz (UI)
    if(document.getElementById("subtotal")) document.getElementById("subtotal").innerText = `$${subtotalGeneral.toFixed(2)}`;
    
    // Inyectar o actualizar el descuento visualmente
    const txtDescuento = document.getElementById("descuento-linea");
    if (montoDescuento > 0) {
        if (!txtDescuento) {
            const resumenTotal = document.querySelector(".resumen-total");
            const divDescuento = document.createElement("div");
            divDescuento.id = "descuento-linea";
            divDescuento.className = "resumen-linea";
            divDescuento.innerHTML = `<span>Desc. (${cuponAplicado.descuento * 100}%)</span> <span style="color: #28a745;">-$${montoDescuento.toFixed(2)}</span>`;
            resumenTotal.parentNode.insertBefore(divDescuento, resumenTotal);
        } else {
            txtDescuento.innerHTML = `<span>Desc. (${cuponAplicado.descuento * 100}%)</span> <span style="color: #28a745;">-$${montoDescuento.toFixed(2)}</span>`;
        }
    } else if (txtDescuento) {
        txtDescuento.remove(); 
    }

    // Actualizar Envío visualmente
    const txtEnvio = document.getElementById("envio");
    if(txtEnvio) {
        if (costoEnvio === 0 && totalPrendas >= envMeta && promoEnvioActiva) {
            txtEnvio.innerHTML = `<span style="color: #28a745; font-weight: bold;">GRATIS (Promo)</span>`;
        } else {
            txtEnvio.innerText = `$${costoEnvio.toFixed(2)}`;
        }
    }

    if(document.getElementById("total")) document.getElementById("total").innerText = `$${totalFinal.toFixed(2)}`;
    
    mostrarAvisoEnvioGratis(totalPrendas, promoEnvioActiva, envMeta);
    actualizarContadoresGlobales();
}

function mostrarAvisoEnvioGratis(totalPrendas, activa, meta) {
    const resumen = document.querySelector(".cart-summary-sidebar");
    if (!resumen) return;

    let aviso = document.getElementById("aviso-promo-envio");
    if (!aviso) {
        aviso = document.createElement("div");
        aviso.id = "aviso-promo-envio";
        aviso.style = "background: #111; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;";
        resumen.prepend(aviso);
    }

    if (totalPrendas === 0 || !activa) {
        aviso.style.display = "none";
        return;
    }

    aviso.style.display = "block";
    const faltan = meta - totalPrendas;
    const porcentaje = Math.min((totalPrendas / meta) * 100, 100);

    if (totalPrendas < meta) {
        aviso.innerHTML = `
            <span style="font-size: 13px; color: #ccc;">
                Te faltan <b>${faltan} ${faltan === 1 ? 'jersey' : 'jerseys'}</b> para el <b>Envío Gratis</b> 🚚
            </span>
            <div style="width: 100%; height: 8px; background-color: #333; border-radius: 10px; margin-top: 10px; overflow: hidden;">
                <div style="height: 100%; background-color: #d4af37; width: ${porcentaje}%; transition: width 0.6s ease;"></div>
            </div>
        `;
    } else {
        aviso.innerHTML = `
            <div style="color: #28a745; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>🚚 ¡Tu envío es GRATIS!</span>
            </div>
            <div style="width: 100%; height: 8px; background-color: #333; border-radius: 10px; margin-top: 10px; overflow: hidden;">
                <div style="height: 100%; background-color: #28a745; width: 100%; transition: width 0.6s ease;"></div>
            </div>
        `;
    }
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        eliminarProducto(index);
    } else {
        guardarCarrito();
        actualizarCarrito();
    }
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carritoLa12', JSON.stringify(carrito));
}

function actualizarContadoresGlobales() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        let total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.innerText = total;
    }
}

// ================= WHATSAPP CHECKOUT =================
function finalizarCompraWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const nombreForm = document.getElementById("cliente-nombre") ? document.getElementById("cliente-nombre").value : "Cliente Web";
    
    let mensaje = `*NUEVO PEDIDO - LA 12 JERSEY STORE* ⚽\n`;
    mensaje += `👤 *Cliente:* ${nombreForm}\n\n`;
    mensaje += `*--- DETALLE DEL PEDIDO ---*\n`;

    let totalPrendas = 0;
    let subtotalGeneral = 0;

    carrito.forEach((p, i) => {
        totalPrendas += p.cantidad;
        subtotalGeneral += (p.precio * p.cantidad);
        mensaje += `*${i + 1}. ${p.nombre}*\n`;
        mensaje += `📏 Talla: ${p.talla} | 👕 Versión: ${p.versionSelec}\n`;
        if (p.dorsalTexto) mensaje += `🔢 Dorsal: ${p.dorsalTexto}\n`;
        mensaje += `💰 ${p.cantidad} x $${p.precio.toFixed(2)}\n\n`;
    });

    let costoEnvioFinal = 0;
    if (typeof PROMOS !== 'undefined') {
        if (PROMOS.envioGratis.activo && totalPrendas >= PROMOS.envioGratis.cantidadMinima) {
            costoEnvioFinal = 0;
        } else {
            costoEnvioFinal = PROMOS.envioGratis.costoEnvio;
        }
    } else {
        costoEnvioFinal = (totalPrendas > 0 && totalPrendas < 4) ? 130 : 0;
    }

    let montoDescuento = 0;
    if (typeof cuponAplicado !== 'undefined' && cuponAplicado !== null) {
        montoDescuento = subtotalGeneral * cuponAplicado.descuento; 
    }

    let totalFinal = subtotalGeneral - montoDescuento + costoEnvioFinal;

    mensaje += `*--- RESUMEN FINANCIERO ---*\n`;
    mensaje += `Subtotal: $${subtotalGeneral.toFixed(2)}\n`;
    
    if (montoDescuento > 0) {
        mensaje += `🔥 *Descuento (${cuponAplicado.codigo}):* -$${montoDescuento.toFixed(2)}\n`;
    }
    
    mensaje += `Envío: ${costoEnvioFinal === 0 ? '*GRATIS*' : '$' + costoEnvioFinal.toFixed(2)}\n`;
    mensaje += `*TOTAL A PAGAR: $${totalFinal.toFixed(2)}*\n\n`;
    
    mensaje += `¡Confirmo mi pedido para recibir los métodos de pago! 💳`;

    const numeroTuWhatsApp = "521XXXXXXXXXX"; // REEMPLAZA ESTO
    const url = `https://wa.me/${numeroTuWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
}

// ================= INTERFAZ (UI) =================
function toggleMenu(event) {
    const menu = document.getElementById("menu-lateral");
    if (menu.style.left === "0px") {
        menu.style.left = "-300px";
    } else {
        menu.style.left = "0px";
    }
}