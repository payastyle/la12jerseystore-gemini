// admin.js - Lógica para el Panel de Administración de La 12

function generarProducto() {
    // 1. Capturar todos los valores del formulario (Incluyendo el nuevo campo de Marca)
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const tipo = document.getElementById('tipo').value;
    const marca = document.getElementById('marca').value; 
    const liga = document.getElementById('liga').value;
    const equipo = document.getElementById('equipo').value;
    const img1 = document.getElementById('img1').value;
    const img2 = document.getElementById('img2').value;
    const desc = document.getElementById('desc').value;

    // 2. Validación básica para no generar productos rotos
    if (!nombre || !precio || !img1) {
        alert('⚠️ Por favor, llena al menos el Nombre, Precio y la Imagen 1 (Principal).');
        return;
    }

    // 3. Generar un ID automático (Todo en mayúsculas y espacios reemplazados por guiones)
    const id = nombre.toUpperCase().trim().replace(/\s+/g, '-');
    
    // 4. Formatear el arreglo de imágenes (si hay una segunda imagen, la incluye)
    const imagenes = img2 ? `["${img1}", "${img2}"]` : `["${img1}"]`;
    
    // 5. Calcular el precio tachado (Precio Normal) sumándole 500 para el efecto de descuento
    const precioSugerido = parseInt(precio) + 500;

    // 6. Construir el código final del producto (Con la sintaxis exacta para productos.js)
    const resultado = `{
    id: "${id}",
    nombre: "${nombre}",
    precioNormal: ${precioSugerido},
    precio: ${parseInt(precio)},
    tipoProducto: "${tipo}",
    liga: "${liga}",
    marca: "${marca}",
    equipo: "${equipo}",
    descripcion: "${desc}",
    imagenes: ${imagenes},
    stock: true
},`;

    // 7. Mostrar el resultado en la pantalla del Panel
    const contenedorResultado = document.getElementById('resultado-producto');
    contenedorResultado.innerText = resultado;
    
    // Efecto visual: iluminar el borde de verde para confirmar que se generó
    contenedorResultado.style.borderColor = '#25D366';
    setTimeout(() => {
        contenedorResultado.style.borderColor = 'var(--border-admin)';
    }, 1000);
}

// 🎁 BONUS: Función Pro para copiar el código con un botón
function copiarCodigo() {
    const codigo = document.getElementById('resultado-producto').innerText;
    
    if (codigo === "Esperando datos..." || codigo === "") {
        alert('Primero llena los datos y haz clic en "Generar Código".');
        return;
    }
    
    // Copiar al portapapeles del usuario
    navigator.clipboard.writeText(codigo).then(() => {
        alert('✅ ¡Código copiado! Ve a tu archivo productos.js y pégalo.');
    }).catch(err => {
        console.error('Error al copiar el texto: ', err);
        alert('Hubo un error al copiar. Por favor, selecciona el texto manualmente.');
    });
}