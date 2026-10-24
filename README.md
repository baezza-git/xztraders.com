# xztraders.com

Landing estática del grupo VIP de **XZ TRADERS**. HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Estructura

```
index.html              Página principal
assets/css/styles.css   Estilos (tokens de color y tipografía al inicio)
assets/js/main.js       Enlaces y animaciones (incluida la tarjeta VIP 3D del hero)
assets/js/beams.js      Fondo animado del hero (three.js; si no hay WebGL se usa el fondo CSS)
assets/img/             Logo (logo.svg), favicons e imagen para redes (og-cover.jpg)
assets/fonts/           Fuentes Geist y Geist Mono (licencia OFL)
assets/vendor/three/    three.js r180 (licencia MIT), copiado de npm y verificado
```

## Cambiar los enlaces

Todos los enlaces están en un solo lugar, al principio de `assets/js/main.js`:

```js
const LINKS = {
  lbank: 'https://www.lbank.com/ref/XZTRADERS',    // enlace de referido de LBANK
  telegram: 'https://t.me/xztraders_aibot',    // bot de Telegram para enviar el UID
};
```

Los botones con `data-link="lbank"` o `data-link="telegram"` usan esos valores y abren en una pestaña nueva.

## Diseño "VIP dorado"

Esta versión de la web (rama `diseno-vip-dorado`) cambia solo el aspecto; enlaces, textos de LBANK y lógica son los mismos de `main`.

- **Colores:** tokens al principio de `assets/css/styles.css` (`--gold`, `--gold-hi`, `--gold-lo`, `--bg`…).
- **Tarjeta VIP del hero** (`index.html`, bloque `TARJETA VIP`):
  - Número de miembro: `Miembro n.º <b>0501</b>`.
  - Fecha de alta: se rellena sola con el mes y año de la visita (`initVipDate` en `main.js`). Para una fecha fija, borra `data-alta` del `<dd>` y escribe la fecha.
  - Ventajas: los `<span>` dentro de `.vip__perks`.
  - Inclinación con el cursor y balanceo: `initVipCard` en `main.js`.
- **Cifras del hero:** bloque `<dl class="stats">` en `index.html`.

## Ver en local

```bash
npx serve .
```

Y abrir la dirección que muestra la consola.

## Publicación

Se publica con GitHub Pages desde la rama `main` (carpeta raíz). El archivo `CNAME` fija el dominio `xztraders.com`.

## Seguridad

- La web no carga nada de fuera: fuentes y three.js están en el propio repo. Así no depende de ningún CDN ni envía datos de los visitantes a terceros.
- `index.html` lleva una política de seguridad (`Content-Security-Policy`) que solo permite recursos de este dominio y bloquea scripts inyectados.
- El `<script>` y el `<style>` que van dentro del `<head>` están autorizados por su huella SHA-256 en esa política. **Si cambias cualquiera de los dos, hay que actualizar su huella** o el navegador los bloqueará. Para calcularla:

```bash
printf '%s' 'CONTENIDO_EXACTO_ENTRE_LAS_ETIQUETAS' | openssl dgst -sha256 -binary | base64
```

- Si alguien mete la web dentro de un iframe en otra página, se oculta (protección básica contra clickjacking).
