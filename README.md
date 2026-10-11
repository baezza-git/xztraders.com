# xztraders.com

Landing estática del grupo VIP de **XZ TRADERS**. HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Estructura

```
index.html              Página principal
assets/css/styles.css   Estilos (tokens de color y tipografía al inicio)
assets/js/main.js       Enlaces, animaciones y gráfico de ejemplo
assets/img/             Favicon e imagen para redes (og-cover.jpg)
```

## Cambiar los enlaces

Todos los enlaces están en un solo lugar, al principio de `assets/js/main.js`:

```js
const LINKS = {
  lbank: '',     // enlace de referido de LBANK
  telegram: '',  // bot de Telegram para enviar el UID
  instagram: '',
  tiktok: '',
  youtube: '',
  x: '',
};
```

- Los botones con `data-link="lbank"` o `data-link="telegram"` usan esos valores y abren en una pestaña nueva.
- Mientras `lbank` o `telegram` estén vacíos, sus botones llevan a la sección "Cómo entrar".
- Las redes que queden vacías se ocultan del footer.

## Ver en local

```bash
npx serve .
```

Y abrir la dirección que muestra la consola.
