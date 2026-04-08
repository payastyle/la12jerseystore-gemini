// ==========================================
// BASE DE DATOS DE RESEÑAS - LA 12 JERSEY STORE
// ==========================================

const resenasData = [
    {
        estrellas: 5,
        texto: "Compré el de Tigres versión jugador y la calidad es brutal. Los estampados vienen perfectos, exactamente igual al que venden en tienda de miles de pesos. Ya estoy armando mi segundo pedido.",
        inicial: "A",
        nombre: "Alejandro T.",
        verificado: true
    },
    {
        estrellas: 5,
        texto: "Increíble la atención por WhatsApp. Pedí un retro del Madrid con mi nombre y llegó en 4 días hasta la puerta de mi casa. Súper confiables.",
        inicial: "C",
        nombre: "Carlos R.",
        verificado: true
    },
    {
        estrellas: 5,
        texto: "La guía de tallas me salvó. Le compré uno a mi hijo (Kids) y otro para mí en Versión Fan. Las telas transpiran súper bien. 10/10.",
        inicial: "M",
        nombre: "Miguel S.",
        verificado: true
    },
    {
        estrellas: 5,
        texto: "Es mi tercera compra con ellos. Lo que más me gusta es que puedo pagar por transferencia directo en WhatsApp y siempre me mandan la guía rápido. Excelente servicio.",
        inicial: "D",
        nombre: "David L.",
        verificado: true
    },
    {
        estrellas: 5,
        texto: "Tenía mis dudas con eso del 1:1, pero al recibir el del Arsenal me quedé impresionado. Todas las etiquetas y bordados vienen idénticos.",
        inicial: "R",
        nombre: "Roberto M.",
        verificado: true
    },
    {
        estrellas: 5,
        texto: "Muy atentos en todo momento. Me equivoqué en el dorsal y me dejaron corregirlo por WhatsApp antes de mandarlo a producción. ¡Mil gracias!",
        inicial: "J",
        nombre: "Javier G.",
        verificado: true
    }
];

// Función para inyectar las reseñas en el HTML
function renderizarResenas() {
    const contenedor = document.getElementById('contenedor-resenas');
    if (!contenedor) return;

    let html = '';

    resenasData.forEach(r => {
        // Dibuja las estrellas basado en el número (ej. 5)
        const estrellasStr = '★'.repeat(r.estrellas) + '☆'.repeat(5 - r.estrellas);
        
        html += `
        <div class="resena-card">
            <div class="resena-estrellas">${estrellasStr}</div>
            <p class="resena-texto">"${r.texto}"</p>
            <div class="resena-cliente">
                <div class="cliente-avatar">${r.inicial}</div>
                <div class="cliente-info">
                    <h4>${r.nombre}</h4>
                    <span style="color: #25D366; font-size: 11px;">✓ Compra Verificada</span>
                </div>
            </div>
        </div>
        `;
    });

    contenedor.innerHTML = html;
}

// Ejecutar automáticamente cuando cargue la página de reseñas
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('contenedor-resenas')) {
        renderizarResenas();
    }
});