/* ==========================================================================
   SISTEMA DE PROMOCIONES Y CUPONES - LA 12 (promo.js)
   ========================================================================== */

// ================== BASE DE DATOS DE PROMOCIONES ==================
// Aquí pegarás los cupones que generes en tu Panel Admin
const PROMOS = {
    envioGratis: {
        activo: true,
        cantidadMinima: 4,
        costoEnvio: 130
    },
    cupones: [
        {
            codigo: "PRIMERA12",
            descuento: 0.10, // 10%
            activo: true
        },
        {
            codigo: "LA12-20OFF",
            descuento: 0.20, // 20%
            activo: true
        }
    ]
};

// Variable global para guardar el cupón si el cliente ingresa uno válido
let cuponAplicado = null; 

// ================= LÓGICA DE VALIDACIÓN DE CUPONES =================
function aplicarCupon() {
    // 1. Capturar lo que escribió el cliente y convertirlo a mayúsculas
    const input = document.getElementById("input-cupon").value.trim().toUpperCase();
    const mensajeUI = document.getElementById("mensaje-cupon");

    if (input === "") {
        mensajeUI.innerHTML = "Por favor, ingresa un código.";
        mensajeUI.style.color = "#cc0000";
        return;
    }

    // 2. Buscar si el cupón existe en tu base de datos y si está activo
    const cuponEncontrado = PROMOS.cupones.find(c => c.codigo === input && c.activo === true);

    // 3. Validar y dar respuesta
    if (cuponEncontrado) {
        cuponAplicado = cuponEncontrado; // Lo guardamos en la memoria
        
        // Mensaje de Éxito
        mensajeUI.innerHTML = `¡Éxito! Cupón de ${cuponAplicado.descuento * 100}% aplicado.`;
        mensajeUI.style.color = "#28a745"; // Verde
        
        // Forzamos al carrito a recalcular los precios en app.js
        if (typeof actualizarCarrito === "function") {
            actualizarCarrito();
        }
    } else {
        cuponAplicado = null; // Borramos cualquier cupón anterior
        
        // Mensaje de Error
        mensajeUI.innerHTML = "❌ Cupón inválido o expirado.";
        mensajeUI.style.color = "#cc0000"; // Rojo
        
        if (typeof actualizarCarrito === "function") {
            actualizarCarrito();
        }
    }
}


// ================= EFECTOS VISUALES (CINTILLA Y POPUP) =================
document.addEventListener("DOMContentLoaded", () => {
    iniciarCintillaAnimada();
    setTimeout(mostrarPopupBienvenida, 5000);
});

function iniciarCintillaAnimada() {
    const items = document.querySelectorAll('.announcement-item');
    if (items.length === 0) return;
    let indexActual = 0;
    items.forEach((item, i) => {
        item.style.display = (i === 0) ? 'block' : 'none';
        item.style.animation = 'fadeIn 0.5s ease-in-out';
    });
    setInterval(() => {
        items[indexActual].style.display = 'none'; 
        indexActual++; 
        if (indexActual >= items.length) indexActual = 0; 
        items[indexActual].style.display = 'block'; 
    }, 3500);
}

function mostrarPopupBienvenida() {
    if (localStorage.getItem('popupMostrado_la12')) return;
    const popupHTML = `
        <div id="promo-popup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.5s;">
            <div style="background: #111; border: 2px solid #d4af37; border-radius: 8px; padding: 40px; max-width: 400px; width: 90%; text-align: center; position: relative; box-shadow: 0 10px 40px rgba(212,175,55,0.2);">
                <span onclick="cerrarPopup()" style="position: absolute; top: 10px; right: 15px; font-size: 28px; color: #fff; cursor: pointer;">&times;</span>
                <h2 style="color: #d4af37; margin-bottom: 10px; font-size: 28px;">¡Bienvenido a La 12!</h2>
                <p style="color: #ccc; margin-bottom: 20px;">Llévate un <strong>10% de descuento</strong> en tu primer pedido usando este código en el carrito:</p>
                <div style="background: #222; border: 1px dashed #d4af37; padding: 15px; font-size: 24px; font-weight: bold; color: #fff; letter-spacing: 2px; margin-bottom: 20px;">PRIMERA12</div>
                <button onclick="copiarCupoYcerrar()" style="background: #d4af37; color: #000; border: none; padding: 15px; font-weight: bold; border-radius: 30px; cursor: pointer; width: 100%;">COPIAR CÓDIGO</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function cerrarPopup() {
    const popup = document.getElementById('promo-popup');
    if (popup) popup.remove();
    localStorage.setItem('popupMostrado_la12', 'true');
}

function copiarCupoYcerrar() {
    navigator.clipboard.writeText("PRIMERA12").then(() => {
        alert("¡Cupón copiado! Pégalo en tu carrito de compras.");
        cerrarPopup();
    }).catch(err => {
        alert("Usa el código PRIMERA12 en tu carrito.");
        cerrarPopup();
    });
}