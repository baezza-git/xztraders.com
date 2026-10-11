# xztraders.com

Landing estática del grupo VIP de **XZ TRADERS**. HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Estructura

```
index.html              Página principal
assets/css/styles.css   Estilos (tokens de color y tipografía al inicio)
assets/js/main.js       Enlaces y animaciones
assets/img/             Logo (logo.svg), favicons e imagen para redes (og-cover.jpg)
```

## Cambiar los enlaces

Todos los enlaces están en un solo lugar, al principio de `assets/js/main.js`:

```js
const LINKS = {
  lbank: 'https://www.lbank.com/ref/62R2M',    // enlace de referido de LBANK
  telegram: 'https://t.me/xztraders_aibot',    // bot de Telegram para enviar el UID
};
```

Los botones con `data-link="lbank"` o `data-link="telegram"` usan esos valores y abren en una pestaña nueva.

## Ver en local

```bash
npx serve .
```

Y abrir la dirección que muestra la consola.
