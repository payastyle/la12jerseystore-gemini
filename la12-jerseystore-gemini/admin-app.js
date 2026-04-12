// ==========================================
// LÓGICA DEL PANEL DE ADMINISTRACIÓN - LA 12
// ==========================================

let baseDeDatosAdmin = JSON.parse(localStorage.getItem('adminLa12_productos')) || [];
let baseDeDatosPromos = JSON.parse(localStorage.getItem('adminLa12_promos')) || [];

// --- 1. FUNCIÓN PARA GENERAR TALLAS DINÁMICAMENTE ---
function actualizarTallas() {
    const tipo = document.getElementById('f_tipo_talla').value;
    const contenedor = document.getElementById('f_tallas_container');
    
    if(!contenedor) return;
    
    contenedor.innerHTML = "";

    const tallasAdulto = ["S", "M", "L", "XL", "2XL"];
    const tallasNino = ["16", "18", "20", "22", "24", "26", "28"];

    const listaATrabajar = (tipo === "Adulto") ? tallasAdulto : tallasNino;

    listaATrabajar.forEach(talla => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${talla}" class="check-talla"> ${talla}`;
        contenedor.appendChild(label);
    });
}

// --- 1.5 FUNCIÓN PARA MOSTRAR/OCULTAR PRECIOS DE JUGADOR ---
function togglePreciosJugador() {
    const checkbox = document.getElementById('f_tiene_jugador');
    const filaJugador = document.getElementById('fila_precios_jugador');
    if(filaJugador) {
        filaJugador.style.display = checkbox.checked ? 'flex' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarTallas();
    togglePreciosJugador();
});

// --- 2. FUNCIÓN PARA CAMBIAR DE PESTAÑAS ---
function cambiarPestana(idSeccion, botonPresionado) {
    document.querySelectorAll('.seccion-admin').forEach(sec => sec.classList.remove('activa'));
    document.getElementById(idSeccion).classList.add('activa');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('activa'));
    botonPresionado.classList.add('activa');
    
    document.getElementById('titulo-seccion').innerText = botonPresionado.innerText.replace(/📦|🏷️|📁|⚽|✔️/g, '').trim();
}

// --- 3. GUARDAR PRODUCTO ---
const formProducto = document.getElementById('form-producto');
if(formProducto) {
    formProducto.addEventListener('submit', function(e) {
        e.preventDefault();

        let tallasSeleccionadas = [];
        document.querySelectorAll('.check-talla:checked').forEach(checkbox => {
            tallasSeleccionadas.push(checkbox.value);
        });

        let rawImagenes = document.getElementById('f_imagenes_extra').value.trim();
        let arrayImagenesExtra = rawImagenes !== "" ? rawImagenes.split(',').map(img => img.trim()) : [];

        let nuevoId = baseDeDatosAdmin.length > 0 ? baseDeDatosAdmin[baseDeDatosAdmin.length - 1].id + 1 : 1;
        let hoy = new Date().toISOString().split('T')[0]; 

        // Evaluamos si tiene versión jugador para guardar o no sus precios
        const tieneJugador = document.getElementById('f_tiene_jugador').checked;

        const nuevoProducto = {
            id: nuevoId,
            fecha_creacion: hoy,
            equipo: document.getElementById('f_equipo').value.trim(),
            nombre: document.getElementById('f_nombre').value.trim(),
            descripcion: document.getElementById('f_descripcion').value.trim(),
            liga: document.getElementById('f_liga').value.trim(),
            categoria: document.getElementById('f_categoria').value.trim(),
            marca: document.getElementById('f_marca').value.trim(),
            
            versiones: {
                tiene_fan: true,
                tiene_jugador: tieneJugador
            },
            
            // ESTRUCTURA DE PRECIOS SEPARADA Y ORDENADA
            precios: {
                fan: {
                    normal: parseFloat(document.getElementById('f_precio_fan').value),
                    oferta: document.getElementById('f_oferta_fan').value ? parseFloat(document.getElementById('f_oferta_fan').value) : null
                },
                jugador: tieneJugador ? {
                    normal: document.getElementById('f_precio_jugador').value ? parseFloat(document.getElementById('f_precio_jugador').value) : null,
                    oferta: document.getElementById('f_oferta_jugador').value ? parseFloat(document.getElementById('f_oferta_jugador').value) : null
                } : null
            },
            
            tipo_talla: document.getElementById('f_tipo_talla').value,
            tallas_disponibles: tallasSeleccionadas,
            jugador_destacado: document.getElementById('f_jugador').value.trim(),
            
            imagenes: {
                principal: document.getElementById('f_img_principal').value.trim(),
                hover: document.getElementById('f_img_hover').value.trim(),
                galeria: arrayImagenesExtra
            },
            
            activo: document.getElementById('f_activo').checked
        };

        baseDeDatosAdmin.push(nuevoProducto);
        localStorage.setItem('adminLa12_productos', JSON.stringify(baseDeDatosAdmin));

        alert(`¡Éxito! "${nuevoProducto.equipo}" guardado en la base de datos.`);
        document.getElementById('form-producto').reset();
        actualizarTallas(); 
        togglePreciosJugador(); // Resetea visualmente la fila de jugador
    });
}

// --- 4. FUNCIONES DE PROMOCIONES ---
function generarCodigoRandom() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = 'LA12-';
    for (let i = 0; i < 5; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    document.getElementById('p_codigo').value = resultado;
}

function actualizarTipoPromo() {
    const tipo = document.getElementById('p_tipo').value;
    const inputValor = document.getElementById('p_valor');
    const labelValor = document.getElementById('label_valor_promo');

    if (tipo === 'porcentaje') {
        labelValor.innerText = "Valor del Descuento (%) *";
        inputValor.disabled = false;
        inputValor.placeholder = "Ej. 30";
    } else if (tipo === 'monto') {
        labelValor.innerText = "Monto a Descontar ($ MXN) *";
        inputValor.disabled = false;
        inputValor.placeholder = "Ej. 200";
    } else if (tipo === 'envio') {
        labelValor.innerText = "No aplica valor (Envío Gratis)";
        inputValor.value = "";
        inputValor.disabled = true;
    }
}

// --- 5. GUARDAR CUPÓN ---
const formPromo = document.getElementById('form-promo');
if(formPromo) {
    formPromo.addEventListener('submit', function(e) {
        e.preventDefault();

        const nuevoCupon = {
            codigo: document.getElementById('p_codigo').value.trim().toUpperCase(),
            tipo: document.getElementById('p_tipo').value,
            valor: document.getElementById('p_valor').value ? parseFloat(document.getElementById('p_valor').value) : 0,
            limite_usos: document.getElementById('p_limite').value ? parseInt(document.getElementById('p_limite').value) : "infinito",
            usos_actuales: 0,
            fecha_expiracion: document.getElementById('p_fecha_exp').value || "sin_caducidad",
            activo: document.getElementById('p_activo').checked
        };

        const existe = baseDeDatosPromos.find(c => c.codigo === nuevoCupon.codigo);
        if (existe) {
            alert("¡Cuidado! Ya existe un cupón con ese código.");
            return;
        }

        baseDeDatosPromos.push(nuevoCupon);
        localStorage.setItem('adminLa12_promos', JSON.stringify(baseDeDatosPromos));

        alert(`¡Cupón ${nuevoCupon.codigo} creado exitosamente!`);
        document.getElementById('form-promo').reset();
        actualizarTipoPromo(); 
    });
}

// --- 6. MOTOR DE EXPORTACIÓN ---
function exportarCatalogo() {
    if (baseDeDatosAdmin.length === 0 && baseDeDatosPromos.length === 0) {
        alert("No hay productos ni cupones guardados para exportar.");
        return;
    }

    let codigoJSONProductos = JSON.stringify(baseDeDatosAdmin, null, 4);
    let codigoJSONPromos = JSON.stringify(baseDeDatosPromos, null, 4);
    
    let codigoFinal = `// Archivo generado por Panel Admin LA 12\n\n`;
    codigoFinal += `const catalogo = ${codigoJSONProductos};\n\n`;
    codigoFinal += `const cuponesActivos = ${codigoJSONPromos};\n`;

    document.getElementById('codigo-exportado').value = codigoFinal;
    document.getElementById('modal-exportar').classList.add('visible');
}

function cerrarModal() {
    document.getElementById('modal-exportar').classList.remove('visible');
}

function copiarCodigo() {
    const textoArea = document.getElementById('codigo-exportado');
    textoArea.select();
    document.execCommand('copy');
    alert("¡Código copiado! Ahora pégalo en tu archivo catalogo.js");
}