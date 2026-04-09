document.addEventListener("DOMContentLoaded", () => {
    inyectarComponentes();
    cargarEstadoTema();
});

function inyectarComponentes() {
    const headerPlace = document.getElementById('header-placeholder');
    const footerPlace = document.getElementById('footer-placeholder');

    if (headerPlace) {
        headerPlace.innerHTML = `
        <header class="navbar">
            <div onclick="openNav()" style="cursor:pointer; font-size:24px;">☰</div>
            <div class="logo" onclick="window.location.href='index.html'"><img src="img/ui/logo.png"></div>
            <div class="nav-right">
                <div onclick="toggleTheme()" style="cursor:pointer;">🌓</div>
                <div onclick="window.location.href='carrito.html'" style="position:relative; cursor:pointer;">
                    🛒 <span id="cart-count" style="background:var(--dorado); color:#000; padding:2px 5px; border-radius:50%; font-size:10px;">0</span>
                </div>
            </div>
        </header>
        <div id="sidenav" class="sidenav">
            <span style="position:absolute; top:10px; right:25px; font-size:30px; cursor:pointer;" onclick="closeNav()">&times;</span>
            <p class="nav-section-title">TIENDA</p>
            <a href="catalogo.html?cat=temporada">Temporada 25/26</a>
            <a href="catalogo.html?cat=mundial">Copa del Mundo</a>
            <a href="catalogo.html?cat=retro-clubes">Retro Clubes</a>
            <a href="catalogo.html?cat=retro-selecciones">Retro Selecciones</a>
            <a href="catalogo.html?cat=kids">Kids</a>
            <a href="catalogo.html?cat=anime">⚽ Ediciones Anime</a>
            <a href="ligas.html">Ligas</a>
            <a href="marcas.html">Marcas</a>
            <p class="nav-section-title">SOPORTE</p>
            <a href="resenas.html">Opiniones</a>
            <a href="tracking.html">Rastrear Pedido</a>
            <a href="cuidados.html">Cuidados del Jersey</a>
            <a href="tallas.html">Guía de Tallas</a>
            <a href="contacto.html">Contáctanos</a>
            <a href="faq.html">Preguntas Frecuentes</a>
        </div>`;
    }

    if (footerPlace) {
        footerPlace.innerHTML = `
        <footer>
            <img src="img/ui/logo.png" class="footer-logo" onclick="window.location.href='index.html'">
            
            <div class="footer-search">
                <input type="text" placeholder="Buscar jersey...">
                <button>🔍</button>
            </div>

            <div class="footer-socials">
                <a href="#"><img src="img/ui/tiktok.png" alt="TikTok"></a>
                <a href="#"><img src="img/ui/instagram.png" alt="Instagram"></a>
                <a href="#"><img src="img/ui/facebook.png" alt="Facebook"></a>
            </div>

            <div class="footer-grid">
                <div class="footer-col">
                    <h4>ZONA 1: TIENDA</h4>
                    <a href="index.html">Inicio</a>
                    <a href="catalogo.html">Catálogo</a>
                    <a href="carrito.html">Carrito</a>
                </div>
                <div class="footer-col">
                    <h4>ZONA 2: COLECCIONES</h4>
                    <a href="ligas.html">Ligas</a>
                    <a href="marcas.html">Marcas</a>
                </div>
                <div class="footer-col">
                    <h4>ZONA 3: SOPORTE</h4>
                    <a href="tracking.html">Rastreo</a>
                    <a href="faq.html">Preguntas</a>
                    <a href="politicas.html">Privacidad</a>
                    <a href="tallas.html">Tallas</a>
                    <a href="cuidados.html">Cuidados</a>
                    <a href="resenas.html">Reseñas</a>
                </div>
            </div>
            <p style="font-size:11px; opacity:0.5;">© 2026 LA 12 JERSEY STORE - PREMIUM 1:1</p>
        </footer>`;
    }
}

// FUNCIONES DE UI
function openNav() { document.getElementById("sidenav").style.width = "280px"; }
function closeNav() { document.getElementById("sidenav").style.width = "0"; }

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function cargarEstadoTema() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}