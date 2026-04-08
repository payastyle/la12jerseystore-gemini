// ==========================================
// SISTEMA DE CUPONES - LA 12 JERSEY STORE
// ==========================================

// 1. Aquí defines tus cupones válidos. 
// Escríbelos SIEMPRE EN MAYÚSCULAS para evitar errores.
const cuponesValidos = [
    "LA12VIP",         // Cupón para clientes frecuentes
    "PRIMERACOMPRA",   // Cupón para nuevos clientes
    "TIGRES10",        // Ejemplo de promo por equipo
    "BUENFIN12"        // Ejemplo de promo de temporada
];

function aplicarCupon() {
    // Tomamos lo que escribió el cliente, le quitamos espacios y lo hacemos mayúsculas
    const inputCupon = document.getElementById('input-cupon').value.trim().toUpperCase();
    const mensajeEl = document.getElementById('mensaje-cupon');

    // Validación si está vacío
    if (inputCupon === "") {
        mensajeEl.style.color = "#ff4444"; // Rojo de error
        mensajeEl.innerText = "⚠️ Por favor, ingresa un código.";
        return;
    }

    // Verificar si el cupón existe en nuestra lista
    if (cuponesValidos.includes(inputCupon)) {
        
        // 1. Cupón Válido: Mostramos mensaje verde con la palabra "aplicado"
        mensajeEl.style.color = "#25D366"; // Verde WhatsApp/Éxito
        mensajeEl.innerText = `✅ Cupón ${inputCupon} aplicado.`;
        
        // 2. Le avisamos a app.js que recalcule el total con el 10% de descuento
        if (typeof actualizarTotales === 'function') {
            actualizarTotales();
        }

        // Opcional: Bloquear el input para que no metan más de uno
        document.getElementById('input-cupon').disabled = true;

    } else {
        
        // 1. Cupón Inválido: Mensaje de error
        mensajeEl.style.color = "#ff4444";
        mensajeEl.innerText = "❌ Cupón inválido o expirado.";
        
        // 2. Si se equivoca, recalculamos por si ya tenía uno bueno antes y lo borró
        if (typeof actualizarTotales === 'function') {
            actualizarTotales();
        }
    }
}