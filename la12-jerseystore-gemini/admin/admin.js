// ================= NAVEGACIÓN =================
function abrirSeccion(id){
  // Ocultar inicio
  document.getElementById("inicio-admin").style.display = "none";

  // Ocultar todas las secciones
  document.querySelectorAll(".seccion").forEach(sec=>{
    sec.style.display = "none";
  });

  // Mostrar sección seleccionada
  document.getElementById(id).style.display = "block";
}

function volverInicio(){
  // Ocultar todas las secciones
  document.querySelectorAll(".seccion").forEach(sec=>{
    sec.style.display = "none";
  });

  // Mostrar inicio
  document.getElementById("inicio-admin").style.display = "flex";
}

// ================= GENERAR ID =================
function generarID(nombre){
  const base = nombre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

  const numero = Math.floor(Math.random() * 1000);

  return `${base}-${numero}`;
}

// ================= PRODUCTOS =================
function generarProducto(){
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value;
  const tipo = document.getElementById("tipoProducto").value;
  const liga = document.getElementById("liga").value.toLowerCase().trim();
  const equipo = document.getElementById("equipo").value.toLowerCase().trim();
  const imagen1 = document.getElementById("imagen").value;
  const imagen2 = document.getElementById("imagen2").value;
  const descripcion = document.getElementById("descripcion").value;

  if(!nombre || !precio || !imagen1){
    alert("Completa los campos obligatorios");
    return;
  }

  const id = generarID(nombre);

  let imagenes = [`"${imagen1}"`];

  if(imagen2){
    imagenes.push(`"${imagen2}"`);
  }

  const producto = `
  {
    id: "${id}",
    nombre: "${nombre}",
    precio: ${precio},
    tipoProducto: "${tipo}",
    liga: "${liga}",
    equipo: "${equipo}",
    descripcion: "${descripcion}",
    imagenes: [${imagenes.join(", ")}]
  },`;

  document.getElementById("resultado-producto").innerText = producto;
}

// ================= RESEÑAS =================
function generarResena(){
  const nombre = document.getElementById("resena-nombre").value.trim();
  const estrellas = document.getElementById("resena-estrellas").value;
  const comentario = document.getElementById("resena-comentario").value;
  const imagen = document.getElementById("resena-imagen").value;

  if(!nombre || !comentario || !imagen){
    alert("Completa todos los campos");
    return;
  }

  const resena = `
  {
    nombre: "${nombre}",
    estrellas: ${estrellas},
    comentario: "${comentario}",
    imagen: "${imagen}"
  },`;

  document.getElementById("resultado-resena").innerText = resena;
}

// ================= PROMOS =================
function generarPromo(){
  const codigo = document.getElementById("cupon-codigo").value;
  const descuento = document.getElementById("cupon-descuento").value;
  const expiracion = document.getElementById("cupon-expira").value;

  if(!codigo || !descuento || !expiracion){
    alert("Completa todos los datos del cupón");
    return;
  }

  // Genera solo el objeto del cupón para agregarlo al array 'cupones'
  const resultado = `
    {
      codigo: "${codigo}",
      descuento: ${descuento},
      activo: true,
      expiracion: "${expiracion}"
    },`;

  document.getElementById("resultado-promo").innerText = resultado;
}

// ================= COPIAR AL PORTAPAPELES =================
function copiarTexto(idElemento) {
  const texto = document.getElementById(idElemento).innerText;
  if (!texto) {
    alert("No hay nada que copiar. Genera el código primero.");
    return;
  }
  navigator.clipboard.writeText(texto).then(() => {
    alert("¡Código copiado al portapapeles! 📋");
  }).catch(err => {
    console.error('Error al copiar: ', err);
  });
}