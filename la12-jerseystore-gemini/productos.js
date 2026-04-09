// ==========================================
// ZONA 4: productos.js - BASE DE DATOS
// ==========================================

const productos = [
    {
        id: "TIG-LOC-25",
        nombre: "Tigres Local 25/26",
        precioNormal: 1599,
        precio: 1199,
        categoria: "temporada", // temporada, mundial, retro-clubes, retro-selecciones, kids, anime
        liga: "Liga MX",
        marca: "Adidas",
        fecha: "2026-04-09", // <--- NUEVA PROPIEDAD
        equipo: "Tigres UANL",
        descripcion: "Calidad Premium 1:1 con parches oficiales.",
        imagenes: ["img/temporada/tigres-1.jpg", "img/temporada/tigres-2.jpg"],
        stock: true,
        destacado: true,
        jugador: "Cristiano Ronaldo" // Para la sección de ídolos
    }
];