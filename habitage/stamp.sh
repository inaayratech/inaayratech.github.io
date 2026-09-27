#!/bin/sh
# Cache-bust: GitHub Pages serves every file with max-age=600, and a phone can
# pair a fresh index.html with a stale site.css for up to 10 minutes (the page
# then renders unstyled — cards piled up). Stamp the page's own CSS/JS with a
# content hash so a new page always asks for its matching files. Run before
# every commit that touches site.css / site.js.
cd "$(dirname "$0")"
c=$(shasum site.css | cut -c1-10); j=$(shasum site.js | cut -c1-10)
sed -i '' -E "s#href=\"site\.css(\?v=[0-9a-f]+)?\"#href=\"site.css?v=$c\"#; s#src=\"site\.js(\?v=[0-9a-f]+)?\"#src=\"site.js?v=$j\"#" index.html
grep -n 'site\.css\|site\.js' index.html
