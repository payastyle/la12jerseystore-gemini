/* ==========================================================================
   BASE DE DATOS DE PRODUCTOS - LA 12 JERSEY STORE
   
   INSTRUCCIONES:
   - Este archivo es el "inventario" de tu tienda.
   - Cada producto está encerrado entre llaves { ... } y separado por una coma.
   - Cuando uses tu Panel de Administración (admin.html), copia el texto que 
     te genera y pégalo al final de esta lista, justo antes del corchete final ].
   ========================================================================== */

const productos = [
    {
        id: "RM-LOCAL-25",
        nombre: "Real Madrid Local 25/26",
        precioNormal: 1499,
        precio: 899,
        tipoProducto: "temporada",
        liga: "La Liga",
        marca: "Adidas",
        equipo: "Real Madrid",
        descripcion: "El nuevo jersey del rey de Europa para la temporada actual. Cuenta con tecnología transpirable y escudo termosellado en versión jugador.",
        imagenes: ["img/temporada/rm-local-frente.jpg", "img/temporada/rm-local-espalda.jpg"],
        stock: true
    },
    {
        id: "TIGRES-LOCAL-25",
        nombre: "Tigres UANL Local 25/26",
        precioNormal: 1399,
        precio: 849,
        tipoProducto: "temporada",
        liga: "Liga MX",
        marca: "Adidas",
        equipo: "Tigres UANL",
        descripcion: "El manto incomparable. Jersey de local de los Tigres de la UANL. Calidad Premium 1:1, ideal para alentar en el Volcán.",
        imagenes: ["img/temporada/tigres-local-frente.jpg", "img/temporada/tigres-local-espalda.jpg"],
        stock: true
    },
    {
        id: "MILAN-RETRO-07",
        nombre: "AC Milan Local 2006/07",
        precioNormal: 1599,
        precio: 949,
        tipoProducto: "retro-clubes",
        liga: "Serie A",
        marca: "Adidas",
        equipo: "AC Milan",
        descripcion: "El icónico jersey con el que conquistaron Europa. Un clásico indispensable para cualquier coleccionista con detalles fieles a la época.",
        imagenes: ["img/retro-clubes/milan-07-frente.jpg", "img/retro-clubes/milan-07-espalda.jpg"],
        stock: true
    },
    {
        id: "MEX-RETRO-98",
        nombre: "México Local 1998",
        precioNormal: 1699,
        precio: 999,
        tipoProducto: "retro-selecciones",
        liga: "Selecciones",
        marca: "ABA Sport",
        equipo: "México",
        descripcion: "El legendario jersey del Calendario Azteca usado en Francia 98. Telas y diseño idénticos a los originales de los años 90.",
        imagenes: ["img/retro-selecciones/mexico-98-frente.jpg", "img/retro-selecciones/mexico-98-espalda.jpg"],
        stock: true
    }
];