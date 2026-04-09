// ==========================================
// LÓGICA ESPECÍFICA DEL HOME - LA 12
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    cargarSeccionIdolo();
    cargarProductosDestacados();
    cargarResenasAleatorias();
});

// 1. FUNCIONAMIENTO DE LOS CARRUSELES (FLECHAS)
function moveCarousel(trackId, direction) {
    const track = document.getElementById(trackId);
    const scrollAmount = 300; // Lo que avanza en cada clic
    track.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// 2. SECCIÓN "VISTE COMO TU ÍDOLO" (ALEATORIA)
function cargarSeccionIdolo() {
    const idoloContainer = document.getElementById('idolo-container');
    const idolos = [
        {
            nombre: "CRISTIANO RONALDO",
            frase: "VISTE COMO EL 'BICHO'",
            imagen: "img/ui/idolo-cr7.jpg",
            filtro: "Cristiano Ronaldo"
        },
        {
            nombre: "LIONEL MESSI",
            frase: "EL ESTILO DEL CAMPEÓN",
            imagen: "img/ui/idolo-messi.jpg",
            filtro: "Lionel Messi"
        },
        {
            nombre: "ERLING HAALAND",
            frase: "POTENCIA EN TU JERSEY",
            imagen: "img/ui/idolo-haaland.jpg",
            filtro: "Erling Haaland"
        }
    ];

    // Seleccionar uno al azar
    const idolo = idolos[Math.floor(Math.random() * idolos.length)];

    idoloContainer.innerHTML = `
        <img src="${idolo.imagen}" class="idolo-img" alt="${idolo.nombre}">
        <div class="idolo-info">
            <p style="color:var(--dorado); letter-spacing:3px; font-weight:bold;">${idolo.frase}</p>
            <h2>${idolo.nombre}</h2>
            <p style="margin-bottom:20px; color:#ccc;">Consigue los jerseys oficiales de las ligas y selecciones donde ha brillado.</p>
            <button onclick="window.location.href='catalogo.html?search=${idolo.filtro}'" class="btn-principal" style="width:fit-content;">VER COLECCIÓN</button>
        </div>
    `;
}

// 3. PRODUCTOS DESTACADOS (ALEATORIOS DE productos.js)
function cargarProductosDestacados() {
    const grid = document.getElementById('destacados-home');
    if (!grid || typeof productos === 'undefined') return;

    // Mezclar productos y tomar 4
    const seleccionados = [...productos].sort(() => 0.5 - Math.random()).slice(0, 4);

    grid.innerHTML = seleccionados.map(p => `
        <div class="producto-card" onclick="window.location.href='producto.html?id=${p.id}'">
            <div class="prod-img-container">
                <img src="${p.imagenes[0]}" class="prod-img">
            </div>
            <div class="prod-info" style="padding:15px; text-align:center;">
                <p style="font-size:12px; color:var(--dorado); font-weight:bold;">${p.liga.toUpperCase()}</p>
                <h3 style="font-size:16px; margin:5px 0;">${p.nombre}</h3>
                <div class="precios">
                    <span class="price-old">$${p.precioNormal}</span>
                    <span class="price-new">$${p.precio}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 4. RESEÑAS ALEATORIAS
function cargarResenasAleatorias() {
    const container = document.getElementById('resenas-home');
    // Si aún no tienes resenas-db.js, usaremos estas de ejemplo
    const resenasEjemplo = [
        { nombre: "Carlos M.", texto: "La calidad 1:1 es real, los parches vienen perfectos.", inicial: "C" },
        { nombre: "Andrés R.", texto: "El envío fue gratis por mis 4 jerseys y llegaron en 4 días.", inicial: "A" },
        { nombre: "Luis P.", texto: "Compré la versión jugador y el ajuste es increíble. 10/10.", inicial: "L" }
    ];

    const seleccionadas = resenasEjemplo.sort(() => 0.5 - Math.random()).slice(0, 3);

    container.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:20px; width:100%;">
            ${seleccionadas.map(r => `
                <div style="background:var(--gris-claro); padding:25px; border-radius:15px; border:1px solid var(--color-borde);">
                    <div style="color:var(--dorado); margin-bottom:10px;">★★★★★</div>
                    <p style="font-style:italic; font-size:14px; margin-bottom:15px;">"${r.texto}"</p>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:30px; height:30px; background:var(--dorado); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#000; font-size:12px;">${r.inicial}</div>
                        <span style="font-weight:bold; font-size:13px;">${r.nombre}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}