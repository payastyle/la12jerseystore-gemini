// ================== PROMOCIONES ==================
const PROMOS = {

  // ================== ENVÍO GRATIS ==================
  envioGratis: {
    activo: true,
    cantidadMinima: 4,
    costoEnvio: 50
  },

  // ================== PROMO TEXTO (CINTA) ==================
  promoTexto: {
    activo: false,
    mensaje: "🔥 En compras de 4 jerseys o más el envío es GRATIS 🔥"
  },

  // ================== CUPONES ==================
  cupones: [

    {
      codigo: "LA12-20OFF",
      descuento: 0.20, // 20%
      activo: true,
      expiracion: "2026-12-31"
    },

    {
      codigo: "ENVIOGRATIS",
      descuento: 0, // solo envío gratis
      envioGratis: true,
      activo: true,
      expiracion: "2026-10-01"
    }

  ]

};