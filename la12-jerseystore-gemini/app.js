// ==========================================
// 1. VARIABLES GLOBALES Y ESTADO
// ==========================================
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let productoActual = null; 
let seleccionesPDP = { talla: '', version: 'Versión Fan', dorsal: 'Sin Dorsal' };
let metodoSeleccionado = 'paypal';

// ==========================================
// 2. INICIALIZACIÓN (Al cargar la página)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // A. Cargar Tema Claro/Oscuro
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('theme-icon');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.innerText = '☀️';
    }

    actualizarContadorCarrito();

    // B. Detectar en qué página estamos y renderizar
    if (document.getElementById('contenedor-productos') && typeof productos !== 'undefined') {
        renderizarProductos(productos); // Estamos en el Home
    } else if (document.getElementById('pdp-contenedor') && window.location.search.includes('?id=')) {
        cargarProducto(); // Estamos en la Página de Producto
    } else if (document.getElementById('carrito-productos-lista')) {
        renderizarCarrito(); // Estamos en el Carrito
        inicializarPayPal();
    }

    // C. Lógica del Buscador Principal
    const buscador = document.getElementById('buscador-principal');
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (document.getElementById('contenedor-productos')) {
                const filtrados = productos.filter(p => 
                    p.nombre.toLowerCase().includes(query) || 
                    p.equipo.toLowerCase().includes(query) ||
                    p.liga.toLowerCase().includes(query) ||
                    p.marca.toLowerCase().includes(query)
                );
                renderizarProductos(filtrados);
            }
        });
    }
});

// ==========================================
// 3. MODO CLARO / OSCURO
// ==========================================
function toggleTheme() {
    const body = document.documentElement;
    const icon = document.getElementById('theme-icon');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        if(icon) icon.innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        if(icon) icon.innerText = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

// ==========================================
// 4. HOME: CATÁLOGO Y FILTROS
// ==========================================
function renderizarProductos(arrayProductos) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    
    if (arrayProductos.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; width:100%; color:var(--color-texto);">No se encontraron jerseys.</p>';
        return;
    }

    arrayProductos.forEach(p => {
        // Verificar si está en la wishlist
        const esFavorito = wishlist.includes(p.id) ? 'active' : '';
        const corazon = wishlist.includes(p.id) ? '❤️' : '🤍';

        contenedor.innerHTML += `
            <div class="producto-card">
                <div class="fav-btn ${esFavorito}" onclick="toggleFavorito('${p.id}', this)">${corazon}</div>
                <img src="${p.imagenes[0]}" alt="${p.nombre}" onclick="window.location.href='producto.html?id=${p.id}'" style="cursor:pointer; width:100%; border-radius:8px;">
                <div class="info" onclick="window.location.href='producto.html?id=${p.id}'" style="cursor:pointer; padding: 10px 0;">
                    <h3 style="font-size: 14px; margin-bottom: 5px;">${p.nombre}</h3>
                    <p style="color: #d4af37; font-weight: bold; font-size: 16px;">$${p.precio}</p>
                </div>
            </div>
        `;
    });
}

function filtrarPorLiga(liga) {
    const filtrados = productos.filter(p => p.liga.toLowerCase() === liga.toLowerCase());
    renderizarProductos(filtrados);
    window.scrollTo({ top: 400, behavior: 'smooth' });
}

function filtrarPorMarca(marca) {
    const filtrados = productos.filter(p => p.marca.toLowerCase() === marca.toLowerCase());
    renderizarProductos(filtrados);
    window.scrollTo({ top: 400, behavior: 'smooth' });
}

// ==========================================
// 5. WISHLIST (FAVORITOS)
// ==========================================
function toggleFavorito(id, btnElement) {
    const index = wishlist.indexOf(id);
    if (index === -1) {
        wishlist.push(id);
        btnElement.classList.add('active');
        btnElement.innerText = '❤️';
    } else {
        wishlist.splice(index, 1);
        btnElement.classList.remove('active');
        btnElement.innerText = '🤍';
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// ==========================================
// 6. PÁGINA DE PRODUCTO (PDP)
// ==========================================
function cargarProducto() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    productoActual = productos.find(p => p.id === id);

    const contenedor = document.getElementById('pdp-contenedor');
    
    if (!productoActual) {
        contenedor.innerHTML = '<h2 style="text-align:center; margin-top:50px;">Jersey no encontrado</h2>';
        return;
    }

    // Resetear selecciones por defecto al entrar
    seleccionesPDP = { talla: '', version: 'Versión Fan', dorsal: 'Sin Dorsal' };

    contenedor.innerHTML = `
        <div class="pdp-layout" style="animation: fadeInUp 0.5s ease;">
            <div class="pdp-galeria">
                <img src="${productoActual.imagenes[0]}" id="pdp-imagen-principal">
                
                <div class="pdp-comparativa" style="margin-top: 25px; background: var(--bg-tarjetas); padding: 20px; border-radius: 8px; border: 1px solid var(--color-borde);">
                    <h4 style="color: #d4af37; margin-bottom: 10px; font-size: 14px; text-transform: uppercase;">Diferencias de Versión:</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 12px; line-height: 1.5;">
                        <div><strong style="color:#d4af37; display:block;">Fan:</strong> Escudo bordado, corte holgado, tela estándar. Ideal uso diario.</div>
                        <div><strong style="color:#d4af37; display:block;">Jugador:</strong> Escudo termosellado, corte ajustado atlético, tecnología de ventilación.</div>
                    </div>
                </div>
            </div>

            <div class="pdp-info">
                <h1 style="font-size: 28px; margin-bottom: 10px;">${productoActual.nombre}</h1>
                <div class="precios-pdp" style="margin-bottom: 25px;">
                    <span id="pdp-precio-dinamico" style="font-size: 26px; font-weight: bold; color: #d4af37;">$${productoActual.precio}</span>
                </div>

                <div class="opciones">
                    <h3 style="font-size: 13px; color: #d4af37; margin: 15px 0 10px; text-transform: uppercase;">Selecciona Versión</h3>
                    <div class="grupo-botones" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-opcion seleccionada" onclick="cambiarOpcionPDP('version', 'Versión Fan', this)">Versión Fan</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('version', 'Versión Jugador', this)">Versión Jugador</button>
                    </div>
                    
                    <h3 style="font-size: 13px; color: #d4af37; margin: 15px 0 10px; text-transform: uppercase;">Personalización</h3>
                    <div class="grupo-botones" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-opcion seleccionada" onclick="cambiarOpcionPDP('dorsal', 'Sin Dorsal', this)">Sin Dorsal</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('dorsal', 'Con Dorsal', this)">Nombre y Número</button>
                    </div>
                    <input type="text" id="input-dorsal" placeholder="Ej: BELLINGHAM 5" style="display:none; width:100%; margin-top:10px; padding:10px; border-radius:5px; border:1px solid var(--color-borde); background:var(--bg-input); color:var(--color-texto);">

                    <h3 style="font-size: 13px; color: #d4af37; margin: 15px 0 10px; text-transform: uppercase;">Talla</h3>
                    <div id="contenedor-tallas" class="grupo-botones" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'S', this)">S</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'M', this)">M</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'L', this)">L</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'XL', this)">XL</button>
                        <button class="btn-opcion" onclick="cambiarOpcionPDP('talla', 'XXL', this)">XXL</button>
                    </div>
                </div>

                <button class="btn-principal" onclick="agregarAlCarrito()" style="width:100%; margin-top:30px; padding:18px; background:#d4af37; color:#000; font-weight:bold; border:none; border-radius:8px; cursor:pointer; font-size:16px;">
                    AÑADIR AL CARRITO 🛒
                </button>
            </div>
        </div>
    `;

    // Inyectar guía de tallas inteligente y recomendaciones
    const infoDiv = document.querySelector('.pdp-info');
    if (infoDiv) infoDiv.innerHTML += obtenerGuiaTallas(productoActual.tipoProducto);
    mostrarRecomendaciones(productoActual.id);
}

function cambiarOpcionPDP(tipo, valor, btnElement) {
    seleccionesPDP[tipo] = valor;
    
    // Quitar clase 'seleccionada' a los hermanos y ponerla al clickeado
    const botones = btnElement.parentElement.querySelectorAll('.btn-opcion');
    botones.forEach(btn => btn.classList.remove('seleccionada'));
    btnElement.classList.add('seleccionada');

    // Mostrar/ocultar input de dorsal
    if (tipo === 'dorsal') {
        const inputDorsal = document.getElementById('input-dorsal');
        if (valor === 'Con Dorsal') {
            inputDorsal.style.display = 'block';
            inputDorsal.focus();
        } else {
            inputDorsal.style.display = 'none';
            inputDorsal.value = '';
        }
    }
}

function obtenerGuiaTallas(categoria) {
    const esKids = categoria.toLowerCase() === 'kids' || categoria.toLowerCase() === 'niño';
    const rutaImagen = esKids ? 'img/guia-kids.jpg' : 'img/guia-adulto.jpg';
    const tituloGuia = esKids ? 'NIÑOS' : 'ADULTOS';

    return `
        <div class="pdp-acordeon-tallas" style="margin-top: 25px; border-top: 1px solid var(--color-borde); padding-top: 15px;">
            <div onclick="toggleGuiaTallas()" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; color: #d4af37; font-weight: bold; font-size: 14px; letter-spacing: 1px;">
                <span>📏 VER GUÍA DE TALLAS (${tituloGuia})</span>
                <span id="flecha-guia">▼</span>
            </div>
            <div id="contenido-guia" style="display: none; margin-top: 15px; overflow: hidden; transition: 0.3s;">
                <img src="${rutaImagen}" alt="Guía de tallas" style="width: 100%; border-radius: 8px; border: 1px solid var(--color-borde);">
                <p style="font-size: 11px; color: #888; margin-top: 8px; text-align: center;">* Las medidas son aproximadas y pueden variar 1-2 cm.</p>
            </div>
        </div>
    `;
}

function toggleGuiaTallas() {
    const contenido = document.getElementById('contenido-guia');
    const flecha = document.getElementById('flecha-guia');
    if (contenido.style.display === 'none') {
        contenido.style.display = 'block';
        flecha.innerText = '▲';
        flecha.style.color = 'var(--color-texto)';
    } else {
        contenido.style.display = 'none';
        flecha.innerText = '▼';
        flecha.style.color = '#d4af37';
    }
}

function mostrarRecomendaciones(idActual) {
    const contenedor = document.getElementById('pdp-recomendaciones');
    if (!contenedor || typeof productos === 'undefined') return;

    const otrosProductos = productos.filter(p => p.id !== idActual);
    const aleatorios = otrosProductos.sort(() => 0.5 - Math.random()).slice(0, 4);

    let html = `<h2 style="color: #d4af37; text-align: center; margin: 50px 0 30px; letter-spacing: 2px; font-size:16px;">TAMBIÉN TE PUEDE GUSTAR</h2>`;
    html += `<div class="productos-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">`; 

    aleatorios.forEach(p => {
        html += `
            <div class="producto-card" style="border: 1px solid var(--color-borde); border-radius: 8px; overflow: hidden; background: var(--bg-tarjetas); transition: 0.3s; cursor: pointer;" onclick="window.location.href='producto.html?id=${p.id}'">
                <img src="${p.imagenes[0]}" alt="${p.nombre}" style="width: 100%;">
                <div style="padding: 10px; text-align: center;">
                    <h3 style="font-size: 12px; margin-bottom: 5px; color: var(--color-texto);">${p.nombre}</h3>
                    <p style="color: #d4af37; font-weight: bold; font-size: 14px;">$${p.precio}</p>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    contenedor.innerHTML = html;
}

function agregarAlCarrito() {
    if (!seleccionesPDP.talla) {
        alert("⚠️ Por favor, selecciona una talla antes de añadir al carrito.");
        return;
    }

    let textoDorsal = seleccionesPDP.dorsal;
    if (textoDorsal === 'Con Dorsal') {
        const inputValor = document.getElementById('input-dorsal').value.trim();
        if (inputValor === '') {
            alert("⚠️ Escribe el nombre y número para la personalización.");
            return;
        }
        textoDorsal = inputValor.toUpperCase();
    }

    const item = {
        id: productoActual.id,
        nombre: productoActual.nombre,
        precio: productoActual.precio,
        imagen: productoActual.imagenes[0],
        talla: seleccionesPDP.talla,
        version: seleccionesPDP.version,
        dorsal: textoDorsal
    };

    carrito.push(item);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    alert(`✅ ¡Añadido al carrito!\n${item.nombre} - ${item.talla}`);
}

// ==========================================
// 7. LÓGICA DE CARRITO Y TOTALES
// ==========================================
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) contador.innerText = carrito.length;
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-productos-lista');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; padding: 50px; color: var(--color-texto);">Tu carrito está vacío.</p>';
        actualizarTotales();
        return;
    }

    carrito.forEach((p, index) => {
        let detalleDorsal = p.dorsal !== 'Sin Dorsal' ? `<br><small style="color:#888;">Dorsal: ${p.dorsal}</small>` : '';
        
        contenedor.innerHTML += `
            <div class="item-carrito" style="display: flex; gap: 15px; margin-bottom: 15px; padding: 15px; background: var(--bg-tarjetas); border: 1px solid var(--color-borde); border-radius: 8px; position: relative;">
                <img src="${p.imagen}" style="width: 80px; border-radius: 5px; object-fit: cover;">
                <div style="flex: 1;">
                    <h4 style="font-size: 14px; margin-bottom: 5px;">${p.nombre}</h4>
                    <p style="font-size: 12px; color: #aaa;">Talla: ${p.talla} | ${p.version} ${detalleDorsal}</p>
                    <p style="font-size: 14px; color: #d4af37; font-weight: bold; margin-top: 5px;">$${p.precio}</p>
                </div>
                <button onclick="eliminarDelCarrito(${index})" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #ff4444; cursor: pointer; font-size: 18px;">🗑️</button>
            </div>
        `;
    });

    actualizarTotales();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
}

function actualizarTotales() {
    const elSubtotal = document.getElementById('subtotal');
    const elEnvio = document.getElementById('envio');
    const elTotal = document.getElementById('total');
    
    if (!elSubtotal || !elEnvio || !elTotal) return;

    let subtotal = carrito.reduce((acc, el) => acc + el.precio, 0);
    let costoEnvio = 0;

    // Lógica Envío Gratis: En la compra de 4 jerseys o más
    if (carrito.length > 0 && carrito.length < 4) {
        costoEnvio = 150; // Costo de envío estándar
    } else if (carrito.length >= 4) {
        costoEnvio = 0;
    }

    // Calcular posibles descuentos si existe un cupón aplicado (Lógica base)
    let descuento = 0;
    const msjCupon = document.getElementById('mensaje-cupon');
    if (msjCupon && msjCupon.innerText.includes('aplicado')) {
        // Asumiendo un cupón de 10% para simplificar la lógica si promo.js no interviene directamente aquí
        descuento = subtotal * 0.10; 
    }

    let totalFinal = subtotal + costoEnvio - descuento;

    elSubtotal.innerText = `$${subtotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    elEnvio.innerText = costoEnvio === 0 ? '¡GRATIS!' : `$${costoEnvio.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    elTotal.innerText = `$${totalFinal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
}

// ==========================================
// 8. LÓGICA DE CHECKOUT (MÉTODOS DE PAGO Y WHATSAPP)
// ==========================================
function seleccionarMetodo(metodo) {
    metodoSeleccionado = metodo;
    const containerPaypal = document.getElementById('container-paypal');
    const containerBanco = document.getElementById('datos-banco');
    const containerOxxo = document.getElementById('datos-oxxo');
    const btnManual = document.getElementById('btn-finalizar-manual');

    if(containerPaypal) containerPaypal.style.display = 'none';
    if(containerBanco) containerBanco.style.display = 'none';
    if(containerOxxo) containerOxxo.style.display = 'none';
    if(btnManual) btnManual.style.display = 'none';

    if (metodo === 'paypal' && containerPaypal) {
        containerPaypal.style.display = 'block';
    } else if (metodo === 'transferencia' && containerBanco) {
        containerBanco.style.display = 'block';
        if(btnManual) btnManual.style.display = 'block';
    } else if (metodo === 'oxxo' && containerOxxo) {
        containerOxxo.style.display = 'block';
        if(btnManual) btnManual.style.display = 'block';
    }
}

function inicializarPayPal() {
    if (typeof paypal !== 'undefined' && document.getElementById('paypal-button-container')) {
        paypal.Buttons({
            createOrder: function(data, actions) {
                const totalText = document.getElementById('total').innerText.replace('$', '').replace(/,/g, '');
                return actions.order.create({
                    purchase_units: [{
                        amount: { value: totalText }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    document.getElementById('paypal-button-container').style.display = 'none';
                    const containerPaypal = document.getElementById('container-paypal');
                    
                    containerPaypal.innerHTML = `
                        <div style="background: #1a1a1a; border: 2px solid #25D366; padding: 20px; border-radius: 10px; text-align: center; animation: fadeInUp 0.5s ease;">
                            <h3 style="color: #25D366; margin-bottom: 10px;">¡PAGO RECIBIDO! ✅</h3>
                            <p style="color: #fff; font-size: 14px; margin-bottom: 15px;">Por favor toma captura de pantalla de tu confirmación.</p>
                            <button onclick="finalizarCompraWhatsApp('PAGO CONFIRMADO POR PAYPAL - ID: ${details.id}')" 
                                style="width: 100%; padding: 15px; background: #25D366; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">
                                ENVIAR COMPROBANTE POR WHATSAPP 💬
                            </button>
                        </div>
                    `;
                    alert('¡Pago completado! Haz clic en el botón verde para enviarnos tu comprobante y procesar tu envío.');
                });
            },
            onError: function(err) {
                console.error('Error en PayPal:', err);
                alert('Hubo un error con PayPal. Por favor intenta de nuevo o elige Transferencia/Oxxo.');
            }
        }).render('#paypal-button-container');
    }
}

function finalizarCompraWhatsApp(pagoConfirmado = "") {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let mensaje = "⚽ *NUEVO PEDIDO - LA 12* ⚽\n";
    mensaje += "----------------------------------\n";
    
    carrito.forEach(p => {
        mensaje += `👕 *${p.nombre}*\n`;
        mensaje += `   Talla: ${p.talla} | ${p.version}\n`;
        if(p.dorsal !== 'Sin Dorsal') mensaje += `   Personalización: ${p.dorsal}\n`;
        mensaje += `   Precio: $${p.precio}\n\n`;
    });

    const subtotal = document.getElementById('subtotal').innerText;
    const envio = document.getElementById('envio').innerText;
    const total = document.getElementById('total').innerText;
    
    const msjCupon = document.getElementById('mensaje-cupon');
    let textoCupon = (msjCupon && msjCupon.innerText.includes('aplicado')) ? "Aplicado" : "Ninguno";

    mensaje += "----------------------------------\n";
    mensaje += `💰 *Subtotal:* ${subtotal}\n`;
    mensaje += `🚚 *Envío:* ${envio}\n`;
    if(textoCupon === "Aplicado") mensaje += `🎟️ *Cupón:* ${textoCupon}\n`;
    mensaje += `✅ *TOTAL:* ${total}\n`;
    mensaje += "----------------------------------\n";
    
    if(pagoConfirmado) {
        mensaje += `💳 *PAGO:* ${pagoConfirmado}`;
    } else {
        mensaje += `📌 *FORMA DE PAGO:* ${metodoSeleccionado.toUpperCase()}\n`;
        mensaje += `📱 _Adjunto comprobante a continuación..._`;
    }

    // REEMPLAZA LAS X POR TU NÚMERO DE TELÉFONO REAL CON CÓDIGO DE PAÍS (Ej. 521 para México)
    const url = `https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
    
    // Opcional: Vaciar carrito después de redirigir
    // carrito = [];
    // localStorage.setItem('carrito', JSON.stringify(carrito));
}