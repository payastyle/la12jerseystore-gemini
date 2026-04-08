// ==========================================
// BASE DE DATOS - LA 12 JERSEY STORE
// ==========================================
// Nota: Usa tu página admin.html para generar el código de nuevos productos 
// y solo pégalos aquí adentro de los corchetes [ ].

const productos = [
    {
        id: "TIGRES-UANL-LOCAL-24-25",
        nombre: "Tigres UANL Local 24/25",
        precioNormal: 1699,
        precio: 1199,
        tipoProducto: "Jugador",
        liga: "Liga MX",
        marca: "Adidas",
        equipo: "Tigres",
        descripcion: "Jersey oficial de local. Versión jugador con escudos termosellados y tecnología de ventilación avanzada. Calidad premium 1:1.",
        imagenes: ["img/tigres-local-1.jpg", "img/tigres-local-2.jpg"],
        stock: true
    },
    {
        id: "REAL-MADRID-LOCAL-23-24",
        nombre: "Real Madrid Local 23/24",
        precioNormal: 1499,
        precio: 999,
        tipoProducto: "Fan",
        liga: "La Liga",
        marca: "Adidas",
        equipo: "Real Madrid",
        descripcion: "El clásico blanco del Rey de Europa. Versión fan con escudo bordado, ideal para uso casual o para ir al estadio.",
        imagenes: ["img/rm-local-1.jpg"],
        stock: true
    },
    {
        id: "MAN-CITY-VISITA-23-24",
        nombre: "Manchester City Visita 23/24",
        precioNormal: 1599,
        precio: 1099,
        tipoProducto: "Fan",
        liga: "Premier League",
        marca: "Puma",
        equipo: "Manchester City",
        descripcion: "Jersey de visita de los actuales campeones. Detalles texturizados y corte recto súper cómodo.",
        imagenes: ["img/city-visita-1.jpg"],
        stock: true
    },
    {
        id: "ARSENAL-LOCAL-KIDS-24",
        nombre: "Arsenal Local 23/24 (Niño)",
        precioNormal: 1299,
        precio: 799,
        tipoProducto: "Kids",
        liga: "Premier League",
        marca: "Adidas",
        equipo: "Arsenal",
        descripcion: "Kit completo para los más pequeños. Tela resistente y cómoda para jugar todo el día.",
        imagenes: ["img/arsenal-kids-1.jpg"],
        stock: true
    },
    {
        id: "MEXICO-RETRO-98",
        nombre: "Selección Mexicana Retro 1998",
        precioNormal: 1700,
        precio: 1200,
        tipoProducto: "Retro",
        liga: "Selecciones",
        marca: "Otro",
        equipo: "México",
        descripcion: "El mítico jersey del calendario Azteca de Francia 98. Reedición exacta con la marca ABA Sport. Una joya para coleccionistas.",
        imagenes: ["img/mexico-98-1.jpg"],
        stock: true
    }
];