# TCDS — Convergencia de Repositorios
Tema oscuro, botones “filosos” con destellos, JSON-LD y descarga directa de catálogo.

## Uso
1. Abre `https://geozunac3536-jpg.github.io/TCDS-Convergencia/`.
2. Deja `geozunac3536-jpg` o cambia el usuario. Pulsa **Construir Catálogo**.
3. Descarga `catalogo.json` y `tcds_convergencia.jsonld`.

## Estructura
- `index.html` — página principal + SEO + JSON-LD WebSite.
- `assets/css/style.css` — tema oscuro con destellos neón.
- `assets/js/app.js` — constructor de catálogo y JSON-LD DataCatalog.
- `tcds_convergencia.jsonld` — semilla para rastreadores (se puede reemplazar por el generado).
- `robots.txt` y `sitemap.xml` — indexación.
- `.github/workflows/deploy-pages.yml` — despliegue vía GitHub Actions.

## Licencia
- CC BY 4.0 para contenido textual y metadatos.
- MIT para el código JavaScript. Ver `LICENSE`.
