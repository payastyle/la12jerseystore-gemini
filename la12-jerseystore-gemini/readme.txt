Los archivos que siempre deben de inlcuir los html son:
1. El Esqueleto: global.css
Es el archivo más importante para la identidad visual. Contiene las reglas del Cintillo Dorado, el Header de 130px, el Menú Lateral y el Footer Negro. Sin este archivo, el header se verá como una lista de texto desordenada.

2. El Motor de Carga: componentes.js
Es el script encargado de realizar la "inyección". Sin él, los archivos header.html y footer.html se quedarían guardados en tu carpeta y nunca aparecerían en la pantalla del cliente.

3. La Lógica de Usuario: app.js
Este archivo debe cargarse siempre porque contiene las funciones que le dan vida a los componentes inyectados, como toggleMenu() para que el menú abra al hacer clic o abrirCarrito().

4. Los Datos: catalogo.js
Aunque parece que solo sirve para los productos, es necesario cargarlo siempre porque el Menú Lateral y el Footer suelen usar información del catálogo (como las categorías de Ligas y Marcas) para mostrar los enlaces correctos.