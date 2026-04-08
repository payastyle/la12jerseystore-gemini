/* ==========================================================================
   LÓGICA DEL PANEL ADMIN - LA 12
   ========================================================================== */

// Navegación
function abrirSeccion(id) {
    document.querySelectorAll('.seccion-admin').forEach(s => s.classList.remove('activo'));
    document.getElementById(id).classList.add('activo');
}

function volverInicio() {
    document.querySelectorAll('.seccion-admin').forEach(s => s.classList.remove('activo'));
    document.getElementById('inicio-admin').classList.add('activo');
}

// Generar Producto
function generarProducto() {
    const id = document.getElementById('nombre').value.toUpperCase().replace(/\s+/g, '-');
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const tipo = document.getElementById('tipoProducto').value;
    const liga = document.getElementById('liga').value;
    const equipo = document.getElementById('equipo').value;
    const img1 = document.getElementById('imagen').value;
    const img2 = document.getElementById('imagen2').value;
    const desc = document.getElementById('descripcion').value;

    const imagenes = img2 ? `["${img1}", "${img2}"]` : `["${img1}"]`;

    const resultado = `{
    id: "${id}",
    nombre: "${nombre}",
    precioNormal: ${parseInt(precio) + 500},
    precio: ${parseInt(precio)},
    tipoProducto: "${tipo}",
    liga: "${liga}",
    marca: "Genérica",
    equipo: "${equipo}",
    descripcion: "${desc}",
    imagenes: ${imagenes},
    stock: true
  },`;

    document.getElementById('resultado-producto').innerText = resultado;
}

// Generar Reseña (Para que la pegues en el HTML de reseñas)
function generarResena() {
    const nombre = document.getElementById('resena-nombre').value;
    const estrellas = document.getElementById('resena-estrellas').value;
    const comentario = document.getElementById('resena-comentario').value;
    const producto = document.getElementById('resena-producto').value;
    const letra = nombre.charAt(0).toUpperCase();

    const resultado = `<div class="resena-card">
    <div class="resena-header">
        <div class="resena-cliente">
            <div class="resena-avatar">${letra}</div>
            <div>
                <h4 style="color: #fff; margin: 0 0 5px;">${nombre}</h4>
                <span style="color: #28a745; font-size: 12px;">✔️ Compra Verificada</span>
            </div>
        </div>
        <div class="resena-estrellas">${estrellas}</div>
    </div>
    <p class="resena-texto">"${comentario}"</p>
    <div class="resena-producto">Producto comprado: <span>${producto}</span></div>
</div>`;

    document.getElementById('resultado-resena').innerText = resultado;
}

// Generar Promo
function generarPromo() {
    const codigo = document.getElementById('cupon-codigo').value.toUpperCase();
    const descuento = document.getElementById('cupon-descuento').value;

    const resultado = `{
    codigo: "${codigo}",
    descuento: ${descuento},
    activo: true
  },`;

    document.getElementById('resultado-promo').innerText = resultado;
}

// Copiar al portapapeles
function copiarTexto(id) {
    const texto = document.getElementById(id).innerText;
    if(!texto) return alert("Primero genera el código.");
    
    navigator.clipboard.writeText(texto);
    alert("¡Código copiado! Pégalo en tu archivo .js correspondiente.");
}