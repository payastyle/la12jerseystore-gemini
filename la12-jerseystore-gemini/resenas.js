/* ==========================================================================
   LÓGICA DE RESEÑAS Y CUPONES - LA 12 (resenas.js)
   ========================================================================== */

function enviarResenaWhatsApp() {
    // 1. Capturar los valores del formulario
    const nombre = document.getElementById("resena-nombre").value.trim();
    const calificacion = document.getElementById("resena-estrellas").value;
    const mensajeResena = document.getElementById("resena-comentario").value.trim();

    // 2. Validación básica para que no te manden mensajes vacíos
    if (nombre === "" || mensajeResena === "") {
        alert("⚠️ Por favor, llena tu nombre y tu comentario para poder generar tu cupón.");
        return;
    }

    // 3. Construir el mensaje estructurado para WhatsApp
    let mensajeWS = `*NUEVA RESEÑA DE CLIENTE - LA 12* ⭐️\n\n`;
    mensajeWS += `👤 *Cliente:* ${nombre}\n`;
    mensajeWS += `🏅 *Calificación:* ${calificacion}\n`;
    mensajeWS += `💬 *Comentario:* "${mensajeResena}"\n\n`;
    mensajeWS += `🎁 *Vengo a solicitar mi cupón del 20% OFF por haber dejado mi reseña.*`;

    // 4. Configurar tu número y enviar
    // OJO: Recuerda reemplazar las 'X' por tu número real con código de país (Ej: 5218112345678)
    const numeroTuWhatsApp = "521XXXXXXXXXX"; 
    const url = `https://wa.me/${numeroTuWhatsApp}?text=${encodeURIComponent(mensajeWS)}`;

    // Abre WhatsApp en una nueva pestaña
    window.open(url, '_blank');

    // 5. Limpiar el formulario y agradecer al cliente
    document.getElementById("resena-nombre").value = "";
    document.getElementById("resena-comentario").value = "";
    document.getElementById("resena-estrellas").selectedIndex = 0; // Regresa a las 5 estrellas por defecto

    alert("¡Gracias por tu reseña! 🎉\n\nSerás redirigido a WhatsApp donde te entregaremos tu código de descuento.");
}