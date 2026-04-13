document.addEventListener('DOMContentLoaded', () => {
    // 1. Leer parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const liga = params.get('liga');
    const marca = params.get('marca');
    const cat = params.get('cat');

    // 2. Ejecutar el filtrado inicial
    if (query) filtrarYRenderizar(query, "busqueda");
    else if (liga) filtrarYRenderizar(liga, "liga");
    else if (marca) filtrarYRenderizar(marca, "marca");
    else if (cat) filtrarYRenderizar(cat, "categoria");
    else filtrarYRenderizar(); // Mostrar todo
});

function filtrarYRenderizar(valor = "Todos", tipo = "Todos") {
    const contenedor = document.getElementById("contenedor-plp");
    const titulo = document.getElementById("plp-titulo");
    const contador = document.getElementById("plp-resultado-count");

    if (!contenedor || typeof catalogo === 'undefined') return;

    let productos = [];

    // Lógica de filtrado
    if (tipo === "Todos") {
        productos = catalogo;
        titulo.innerText = "TODOS NUESTROS JERSEYS";
    } else if (tipo === "busqueda") {
        const q = valor.toLowerCase();
        productos = catalogo.filter(p => 
            p.equipo.toLowerCase().includes(q) || p.nombre.toLowerCase().includes(q)
        );
        titulo.innerText = `RESULTADOS: "${valor}"`;
    } else {
        productos = catalogo.filter(p => p[tipo]?.toLowerCase() === valor.toLowerCase());
        titulo.innerText = valor.replace('-', ' ');
    }

    contador.innerText = `${productos.length} jerseys encontrados`;
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<div class="text-center py-5 w-100"><h4>No encontramos lo que buscas 😢</h4><a href="plp.html" class="btn btn-dark mt-3">Ver todo el catálogo</a></div>`;
        return;
    }

    // Dibujar tarjetas
    productos.forEach(p => {
        const precioFan = p.precios.fan.oferta || p.precios.fan.normal;
        contenedor.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="producto-card h-100 shadow-sm border-0" onclick="location.href='producto.html?id=${p.id}'">
                    <div class="img-wrapper p-3">
                        <img src="${p.imagenes.principal}" class="img-fluid" alt="${p.equipo}">
                        ${p.precios.fan.oferta ? '<span class="badge-oferta-plp">SALE</span>' : ''}
                    </div>
                    <div class="p-3 text-center">
                        <h6 class="fw-bold mb-1">${p.equipo}</h6>
                        <p class="text-muted x-small mb-2">${p.nombre}</p>
                        <span class="text-gold fw-bold">$${precioFan}.00</span>
                    </div>
                </div>
            </div>
        `;
    });
}