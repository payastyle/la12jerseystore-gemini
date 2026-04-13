// Se agrega actualizarInterfazCupon() al inicio
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
    actualizarInterfazCupon(); 
    cargarRecomendadosCarrito();
});

function renderizarCarrito() {
    const contenedor = document.getElementById('lista-productos-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];

    // SI EL CARRITO ESTÁ VACÍO, LIMPIAMOS TODO Y PARAMOS
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p class='text-center py-5'>Tu carrito está vacío.</p>";
        
        if(document.getElementById('subtotal-carrito')) document.getElementById('subtotal-carrito').innerText = "$0.00";
        if(document.getElementById('envio-texto')) document.getElementById('envio-texto').innerText = "$0.00";
        if(document.getElementById('total-carrito')) document.getElementById('total-carrito').innerText = "$0.00";
        
        const barraProgreso = document.getElementById('envio-status-container');
        if(barraProgreso) barraProgreso.style.display = 'none';
        
        return;
    }

    // SI HAY ARTÍCULOS, VOLVEMOS A MOSTRAR LA BARRA (por si se había ocultado)
    const barraProgreso = document.getElementById('envio-status-container');
    if(barraProgreso) barraProgreso.style.display = 'block';

    // DIBUJAMOS LA LISTA DE PRODUCTOS
    contenedor.innerHTML = carrito.map((item, index) => {
        const infoPerso = (item.personalizacion && (item.personalizacion.nombre || item.personalizacion.numero)) 
            ? `<p class="small text-gold fw-bold mb-0">✨ Personalización: ${item.personalizacion.nombre} #${item.personalizacion.numero}</p>` 
            : '';

return `
        <div class="item-carrito shadow-sm p-3 mb-3 bg-white rounded d-flex align-items-center">
            <a href="producto.html?id=${item.id}" class="d-flex align-items-center text-decoration-none text-dark flex-grow-1">
                <img src="${item.imagen}" style="width: 70px; height: 90px; object-fit: contain;">
                <div class="ms-3">
                    <h6 class="mb-0 fw-bold">${item.equipo} - ${item.nombre}</h6>
                    <p class="small text-muted mb-1">Talla: ${item.talla} | ${item.version}</p>
                    ${infoPerso} 
                </div>
            </a>
            
            <div class="d-flex flex-column align-items-end ms-3">
                <div class="d-flex align-items-center gap-2 mb-2">
                    <button class="btn btn-sm btn-outline-dark px-2" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span class="fw-bold">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-dark px-2" onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <button class="btn btn-link text-danger btn-sm p-0" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    <span class="fw-bold fs-5">${item.precio}</span>
                </div>
            </div>
        </div>`;
    }).join('');

    // LLAMAMOS AL CÁLCULO DE TOTALES
    calcularTotal(carrito);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito_la12', JSON.stringify(carrito));
    renderizarCarrito();
    if (typeof actualizarBadgeCarrito === 'function') actualizarBadgeCarrito();
}

function cambiarCantidad(index, delta) {
    let carrito = JSON.parse(localStorage.getItem('carrito_la12'));
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
    localStorage.setItem('carrito_la12', JSON.stringify(carrito));
    renderizarCarrito();
    if (typeof actualizarBadgeCarrito === 'function') actualizarBadgeCarrito();
}

// ACTUALIZACIÓN: Ahora detecta si hay un cupón de envío activo
function actualizarBarraEnvio(cantidadItems) {
    const barra = document.getElementById('barra-progreso-envio');
    const texto = document.getElementById('texto-envio-dinamico');
    const meta = 4; // Tu regla base de 4 jerseys
    
    if(!barra || !texto) return;

    // REGLA DE ORO: ¿Hay un cupón de tipo 'envio' aplicado?
    const esCuponEnvioGratis = (cuponAplicadoGlobal && cuponAplicadoGlobal.tipo === 'envio');

    // Calculamos el porcentaje. Si hay cupón, forzamos al 100%
    let porcentaje = (cantidadItems / meta) * 100;
    if (porcentaje > 100 || esCuponEnvioGratis) porcentaje = 100;

    barra.style.width = `${porcentaje}%`;

    // Cambiamos el mensaje y el color basándonos en el cupón o en la cantidad
    if (esCuponEnvioGratis || cantidadItems >= meta) {
        // Si el envío es gratis por cupón O por cantidad de piezas
        texto.innerHTML = "¡ENVÍO GRATIS DESBLOQUEADO! ✅";
        barra.style.backgroundColor = "#28a745"; // Verde éxito
        
        // Si fue por cupón, podemos darle un toque extra al texto
        if (esCuponEnvioGratis && cantidadItems < meta) {
            texto.innerHTML = "¡ENVÍO GRATIS POR CUPÓN! ✅";
        }
    } else if (cantidadItems === 0) {
        texto.innerText = "Agrega jerseys para envío GRATIS";
        barra.style.backgroundColor = "#c5a044"; 
    } else {
        // Estado normal: falta para la meta
        const faltan = meta - cantidadItems;
        texto.innerHTML = `¡Faltan <span class="text-gold">${faltan}</span> ${faltan === 1 ? 'jersey' : 'jerseys'} para envío GRATIS!`;
        barra.style.backgroundColor = "#c5a044"; // Color dorado LA 12
    }
}

// ==========================================
// --- LÓGICA DE FINALIZACIÓN Y WHATSAPP ---
// ==========================================



// ==========================================
// --- LÓGICA DE FINALIZACIÓN Y WHATSAPP (CORREGIDA) ---
// ==========================================

// 1. Abrir el modal al dar clic en el botón principal
document.getElementById('btn-finalizar-pedido').addEventListener('click', () => {
    const carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    if (carrito.length === 0) return alert("Tu carrito está vacío.");
    
    const modalEnvio = new bootstrap.Modal(document.getElementById('modalEnvio'));
    modalEnvio.show();
});

// 2. Procesar el formulario y enviar a WhatsApp
document.getElementById('form-datos-envio').addEventListener('submit', function(e) {
    e.preventDefault();

    const carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    
    // Capturamos los datos del formulario
    const cliente = {
        nombre: document.getElementById('env_nombre').value.trim(),
        direccion: document.getElementById('env_direccion').value.trim(),
        colonia: document.getElementById('env_colonia').value, // Toma el valor del select
        cp: document.getElementById('env_cp').value.trim(),
        ciudad: document.getElementById('env_ciudad').value,
        estado: document.getElementById('env_estado').value,
        pais: document.getElementById('env_pais').value,
        telefono: document.getElementById('env_telefono').value.trim()
    };

    // Capturamos los valores económicos directamente de la pantalla para que coincidan
    const subtotal = document.getElementById('subtotal-carrito').innerText;
    const envio = document.getElementById('envio-texto').innerText;
    const total = document.getElementById('total-carrito').innerText;
    
    // Construimos el cuerpo del mensaje (Texto plano primero)
    let cuerpoMensaje = `¡Hola LA 12! 👋 Quiero realizar el siguiente pedido:\n\n`;
    
    cuerpoMensaje += `🛒 *PRODUCTOS:*\n`;
    carrito.forEach((item, i) => {
        cuerpoMensaje += `${i+1}. *${item.equipo}* - ${item.nombre}\n`;
        cuerpoMensaje += `   Talla: ${item.talla} | Versión: ${item.version}\n`;
        
        // Verificación segura de personalización
        if (item.personalizacion && (item.personalizacion.nombre || item.personalizacion.numero)) {
            const nom = item.personalizacion.nombre || "N/A";
            const num = item.personalizacion.numero || "S/N";
            cuerpoMensaje += `   ✨ Personalización: ${nom} #${num}\n`;
        }
        
        cuerpoMensaje += `   Cantidad: ${item.cantidad} | Precio: ${item.precio}\n\n`;
    });

    cuerpoMensaje += `📊 *RESUMEN:* \n`;
    cuerpoMensaje += `   Subtotal: ${subtotal}\n`;
    cuerpoMensaje += `   Envío: ${envio}\n`;
    
    if (cuponAplicadoGlobal) {
        const descTexto = document.getElementById('descuento-texto').innerText;
        cuerpoMensaje += `   Cupón: ${cuponAplicadoGlobal.codigo} (${descTexto})\n`;
    }
    
    cuerpoMensaje += `   *TOTAL A PAGAR: ${total}*\n\n`;

    cuerpoMensaje += `📍 *DATOS DE ENVÍO:* \n`;
    cuerpoMensaje += `   Nombre: ${cliente.nombre}\n`;
    cuerpoMensaje += `   Dirección: ${cliente.direccion}\n`;
    cuerpoMensaje += `   Colonia: ${cliente.colonia}\n`;
    cuerpoMensaje += `   C.P.: ${cliente.cp}\n`;
    cuerpoMensaje += `   Ciudad: ${cliente.ciudad}, ${cliente.estado}\n`;
    cuerpoMensaje += `   Teléfono: ${cliente.telefono}\n\n`;
    
    const pagoInput = document.querySelector('input[name="metodoPago"]:checked');
    const metodoSeleccionado = pagoInput ? pagoInput.value : 'No especificado';
    
    cuerpoMensaje += `💳 *MÉTODO DE PAGO ELEGIDO:* \n`;
    cuerpoMensaje += `   ${metodoSeleccionado}\n\n`;

    cuerpoMensaje += `¿Me podrían confirmar disponibilidad y el método de pago? Gracias.`;

    // IMPORTANTE: encodeURIComponent hace que el mensaje NO se rompa
    const mensajeFinal = encodeURIComponent(cuerpoMensaje);
    const numeroWhatsApp = "5218123055784"; // Pon aquí tu número real
    
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeFinal}`, '_blank');

    // LIMPIEZA POST-VENTA
    localStorage.removeItem('carrito_la12');
    localStorage.removeItem('cupon_la12_activo');
    
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalEnvio'));
    modalInstance.hide();

    // Recargamos en 1 segundo para mostrar el carrito vacío
    setTimeout(() => {
        window.location.reload();
    }, 1000);
});
// ==========================================
// --- LÓGICA DE CUPONES (CON PERSISTENCIA Y BLOQUEO) ---
// ==========================================

// Leemos de la memoria si ya había un cupón
let cuponAplicadoGlobal = JSON.parse(localStorage.getItem('cupon_la12_activo')) || null;

function aplicarCupon() {
    const input = document.getElementById('input-cupon');
    const codigoIngresado = input.value.trim().toUpperCase();

    if (codigoIngresado === "") return;

    if (typeof cuponesActivos === 'undefined' || cuponesActivos.length === 0) {
        mostrarMensajeCupon("No hay promociones activas por el momento.", "text-danger");
        return;
    }

    const cuponEncontrado = cuponesActivos.find(c => c.codigo === codigoIngresado);

    if (!cuponEncontrado) {
        mostrarMensajeCupon("Cupón inválido ❌", "text-danger");
        return;
    }
    
    if (!cuponEncontrado.activo) {
        mostrarMensajeCupon("Este cupón ya no está activo ❌", "text-danger");
        return;
    }

    const hoy = new Date().toISOString().split('T')[0];
    if (cuponEncontrado.fecha_expiracion && cuponEncontrado.fecha_expiracion !== "sin_caducidad" && cuponEncontrado.fecha_expiracion < hoy) {
        mostrarMensajeCupon("Este cupón ha expirado ❌", "text-danger");
        return;
    }

    // ÉXITO: Guardamos en memoria y bloqueamos
    cuponAplicadoGlobal = cuponEncontrado;
    localStorage.setItem('cupon_la12_activo', JSON.stringify(cuponEncontrado));
    
    mostrarMensajeCupon(`¡Cupón aplicado con éxito! ✅`, "text-success");
    actualizarInterfazCupon(); 

    const carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    calcularTotal(carrito);
}

// NUEVA FUNCIÓN: Eliminar cupón
function eliminarCupon() {
    cuponAplicadoGlobal = null;
    localStorage.removeItem('cupon_la12_activo');
    
    document.getElementById('input-cupon').value = "";
    mostrarMensajeCupon("Cupón eliminado.", "text-muted");
    
    actualizarInterfazCupon();
    
    const carrito = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    calcularTotal(carrito);
}

// NUEVA FUNCIÓN: Oculta o muestra la barra de texto según haya cupón o no
function actualizarInterfazCupon() {
    const grupoInput = document.getElementById('grupo-input-cupon');
    const contenedorAplicado = document.getElementById('contenedor-cupon-aplicado');
    const labelNombre = document.getElementById('nombre-cupon-label');

    // Validación por si no has pegado el nuevo HTML todavía
    if (!grupoInput || !contenedorAplicado) return;

    if (cuponAplicadoGlobal) {
        grupoInput.classList.add('d-none');
        contenedorAplicado.classList.remove('d-none');
        if(labelNombre) labelNombre.innerText = cuponAplicadoGlobal.codigo;
    } else {
        grupoInput.classList.remove('d-none');
        contenedorAplicado.classList.add('d-none');
    }
}

function mostrarMensajeCupon(texto, claseColor) {
    const msj = document.getElementById('mensaje-cupon');
    msj.innerText = texto;
    msj.className = `small mt-1 mb-3 text-center fw-bold ${claseColor}`;
    msj.style.display = 'block';
    
    // Desaparece el mensaje rojo/verde después de 3 segundos
    setTimeout(() => { msj.style.display = 'none'; }, 3000);
}

// --- ACTUALIZACIÓN DE calcularTotal (Limpiada de duplicados) ---
function calcularTotal(carrito) {
    let subtotal = 0;
    let totalArticulos = 0;

    carrito.forEach(item => {
        let precioLimpio = item.precio.split('.')[0].replace(/[^0-9]/g, '');
        let precioNum = parseInt(precioLimpio);
        subtotal += (precioNum * item.cantidad);
        totalArticulos += item.cantidad;
    });

    let costoEnvio = (totalArticulos >= 4) ? 0 : 120;
    let descuentoMonto = 0;
    const filaDescuento = document.getElementById('fila-descuento');
    
    if (cuponAplicadoGlobal) {
        if (cuponAplicadoGlobal.tipo === 'porcentaje') {
            descuentoMonto = subtotal * (cuponAplicadoGlobal.valor / 100);
        } else if (cuponAplicadoGlobal.tipo === 'monto') {
            descuentoMonto = cuponAplicadoGlobal.valor;
        } else if (cuponAplicadoGlobal.tipo === 'envio') {
            costoEnvio = 0; 
        }

        if (descuentoMonto > 0) {
            document.getElementById('nombre-cupon-aplicado').innerText = cuponAplicadoGlobal.codigo;
            document.getElementById('descuento-texto').innerText = `-$${Math.round(descuentoMonto).toLocaleString()}.00`;
            filaDescuento.classList.remove('d-none');
            filaDescuento.classList.add('d-flex');
        } else {
            filaDescuento.classList.add('d-none');
            filaDescuento.classList.remove('d-flex');
        }
    } else {
        // Aseguramos que la fila de descuento desaparezca si se elimina el cupón
        if(filaDescuento) {
            filaDescuento.classList.add('d-none');
            filaDescuento.classList.remove('d-flex');
        }
    }

    let totalFinal = (subtotal + costoEnvio) - descuentoMonto;
    if (totalFinal < 0) totalFinal = 0; 

    document.getElementById('subtotal-carrito').innerText = `$${subtotal.toLocaleString()}.00`;
    document.getElementById('envio-texto').innerText = costoEnvio === 0 ? "GRATIS" : `$${costoEnvio}.00`;
    document.getElementById('total-carrito').innerText = `$${Math.round(totalFinal).toLocaleString()}.00`;
    
    if (typeof actualizarBarraEnvio === 'function') {
        actualizarBarraEnvio(totalArticulos);
    }
}

// ==========================================
// --- LÓGICA DE AUTO-LLENADO DE C.P. (API) ---
// ==========================================

const inputCP = document.getElementById('env_cp');
const selectColonia = document.getElementById('env_colonia');
const inputCiudad = document.getElementById('env_ciudad');
const inputEstado = document.getElementById('env_estado');

if (inputCP) {
    inputCP.addEventListener('input', async function() {
        // Evitamos que escriban letras, solo números
        let cp = this.value.replace(/[^0-9]/g, ''); 
        this.value = cp;

        // Si ya escribió los 5 dígitos, consultamos la API
        if (cp.length === 5) {
            selectColonia.innerHTML = '<option value="">Buscando colonias... ⏳</option>';
            
            try {
                // El "mesero" (fetch) va a la API gratuita por los datos de México (mx)
                const respuesta = await fetch(`https://api.zippopotam.us/mx/${cp}`);
                
                if (!respuesta.ok) throw new Error("CP no encontrado");
                
                const datos = await respuesta.json();
                
                // 1. Llenamos el Estado automáticamente
                inputEstado.value = datos.places[0].state;
                
                // 2. Desbloqueamos la Ciudad para que la escriba o confirme
                inputCiudad.removeAttribute('readonly');
                inputCiudad.style.backgroundColor = "#fff";
                
                // 3. Limpiamos y llenamos la lista de colonias
                selectColonia.innerHTML = '<option value="">Selecciona tu colonia...</option>';
                
                datos.places.forEach(lugar => {
                    let opcion = document.createElement('option');
                    opcion.value = lugar['place name'];
                    opcion.innerText = lugar['place name'];
                    selectColonia.appendChild(opcion);
                });

                // Movemos el cursor a la colonia para que elija rápido
                selectColonia.focus();

            } catch (error) {
                // Si el CP no existe o se equivocaron
                selectColonia.innerHTML = '<option value="">❌ C.P. Inválido</option>';
                inputEstado.value = "";
                inputCiudad.value = "";
                inputCiudad.setAttribute('readonly', 'true');
                inputCiudad.style.backgroundColor = "#e9ecef";
            }
        } else {
            // Si borra números y tiene menos de 5, reseteamos todo
            selectColonia.innerHTML = '<option value="">Escribe tu C.P. primero...</option>';
            inputEstado.value = "";
            inputCiudad.value = "";
            inputCiudad.setAttribute('readonly', 'true');
            inputCiudad.style.backgroundColor = "#e9ecef";
        }
    });
}

// ==========================================
// --- RECOMENDACIONES DE VENTA CRUZADA ---
// ==========================================
function cargarRecomendadosCarrito() {
    const contenedor = document.getElementById('lista-recomendados-carrito');
    const seccionEntera = document.getElementById('seccion-recomendaciones-carrito');
    
    if (!contenedor || typeof catalogo === 'undefined') return;

    const carritoActual = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    const idsEnCarrito = carritoActual.map(item => item.id);

    const sugerencias = catalogo
        .filter(p => !idsEnCarrito.includes(p.id)) 
        .sort(() => 0.5 - Math.random())           
        .slice(0, 4);                              

    if (sugerencias.length === 0) {
        if (seccionEntera) seccionEntera.style.display = 'none';
        return;
    }

    // Dibujamos las tarjetitas con el nuevo botón de Agregar
    contenedor.innerHTML = sugerencias.map(p => {
        const precioMostrar = p.precios.fan.oferta ? p.precios.fan.oferta : p.precios.fan.normal;
        
        return `
        <div class="col-6 col-md-3 d-flex align-items-stretch">
            <div class="card h-100 w-100 border-0 shadow-sm p-3 text-center d-flex flex-column" style="transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                <a href="producto.html?id=${p.id}" class="text-decoration-none">
                    <img src="${p.imagenes.principal}" class="img-fluid rounded mb-3" style="height: 120px; object-fit: contain; background: #f8f9fa;">
                    <h6 class="text-dark fw-bold mb-1 small">${p.equipo}</h6>
                    <p class="text-muted x-small mb-2" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nombre}</p>
                    <span class="text-gold fw-900 d-block mb-3">$${precioMostrar}.00</span>
                </a>
                <button class="btn btn-sm btn-outline-dark w-100 mt-auto fw-bold" onclick="abrirModalQuickAdd(${p.id})">Agregar ➕</button>
            </div>
        </div>
        `;
    }).join('');
}

// ==========================================
// --- LÓGICA DE QUICK ADD (MODAL) ---
// ==========================================
let productoQuickAddTemp = null; // Memoria temporal para el modal

function abrirModalQuickAdd(idProducto) {
    // Buscamos el producto en el catálogo
    const producto = catalogo.find(p => p.id === idProducto);
    if (!producto) return;

    productoQuickAddTemp = producto;

    // Llenamos los textos e imagen del modal
    document.getElementById('qa-img').src = producto.imagenes.principal;
    document.getElementById('qa-equipo').innerText = producto.equipo;
    document.getElementById('qa-nombre').innerText = producto.nombre;
    
    const precioMostrar = producto.precios.fan.oferta ? producto.precios.fan.oferta : producto.precios.fan.normal;
    document.getElementById('qa-precio').innerText = `$${precioMostrar}.00`;

    // --- LÓGICA DINÁMICA DE GUÍA DE TALLAS PARA EL MODAL ---
    const imgGuia = document.getElementById('img-guia-tallas-quick');
    if (imgGuia) {
        // Si el producto es de la categoría Kids, usa la guía de niños
        // Usamos trim() y toLowerCase() para evitar errores de dedo en el catálogo
        if (producto.categoria && producto.categoria.trim().toLowerCase() === "kids") {
            imgGuia.src = "img/guia-kids.jpg";
        } else {
            // Para todas las demás categorías, usa la de adultos
            imgGuia.src = "img/guia-adultos.jpg";
        }
    }

    // Limpiamos los inputs por si el cliente abre varios modales
    document.getElementById('qa-pers-nombre').value = '';
    document.getElementById('qa-pers-numero').value = '';
    document.getElementById('qa-version').value = 'Fan';
    document.getElementById('qa-talla').value = 'M';

    // Ocultar opción de jugador si no existe
    const optionJugador = document.querySelector('#qa-version option[value="Jugador"]');
    if(optionJugador) {
        optionJugador.style.display = producto.versiones && producto.versiones.tiene_jugador === false ? 'none' : 'block';
    }

    // Mostramos el modal
    const modalQA = new bootstrap.Modal(document.getElementById('modalQuickAdd'));
    modalQA.show();
}

function confirmarQuickAdd() {
    if (!productoQuickAddTemp) return;

    const talla = document.getElementById('qa-talla').value;
    const version = document.getElementById('qa-version').value;
    const nombrePers = document.getElementById('qa-pers-nombre').value.trim().toUpperCase();
    const numPers = document.getElementById('qa-pers-numero').value.trim();

    // Determinar precio según si eligió Fan o Jugador
    let precioElegido = productoQuickAddTemp.precios[version.toLowerCase()].normal;
    if (productoQuickAddTemp.precios[version.toLowerCase()].oferta) {
        precioElegido = productoQuickAddTemp.precios[version.toLowerCase()].oferta;
    }

    // Armamos el objeto para el carrito
    const itemCarrito = {
        id: productoQuickAddTemp.id,
        equipo: productoQuickAddTemp.equipo,
        nombre: productoQuickAddTemp.nombre,
        imagen: productoQuickAddTemp.imagenes.principal,
        talla: talla,
        version: version,
        precio: `$${precioElegido}.00`,
        cantidad: 1,
        personalizacion: {
            nombre: nombrePers,
            numero: numPers
        }
    };

    // Guardamos en LocalStorage
    let carritoActual = JSON.parse(localStorage.getItem('carrito_la12')) || [];
    carritoActual.push(itemCarrito);
    localStorage.setItem('carrito_la12', JSON.stringify(carritoActual));

    // Escondemos el modal
    const modalInst = bootstrap.Modal.getInstance(document.getElementById('modalQuickAdd'));
    if (modalInst) modalInst.hide();

    // Actualizamos toda la pantalla mágicamente sin recargar la página
    renderizarCarrito();
    cargarRecomendadosCarrito(); // Esto hace que el jersey recién agregado desaparezca de las sugerencias
    if (typeof actualizarBadgeCarrito === 'function') actualizarBadgeCarrito();
}


// --- LÓGICA PARA MOSTRAR INFO DE PAGO DINÁMICA ---
document.addEventListener('change', function(e) {
    if (e.target.name === 'metodoPago') {
        const container = document.getElementById('info-pago-container');
        const infos = document.querySelectorAll('.metodo-info');
        
        // Mostramos el contenedor principal
        container.style.display = 'block';
        
        // Ocultamos todos los mensajes primero
        infos.forEach(i => i.style.display = 'none');
        
        // Mostramos el que corresponde
        if (e.target.id === 'pay_mp') document.getElementById('info-mp').style.display = 'block';
        if (e.target.id === 'pay_transfer') document.getElementById('info-transferencia').style.display = 'block';
        if (e.target.id === 'pay_oxxo') document.getElementById('info-oxxo').style.display = 'block';
    }
});