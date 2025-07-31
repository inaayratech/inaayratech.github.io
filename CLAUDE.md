# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the marketing website for Inaayra Tech's Notch-Tasker macOS application. It's a static website built with vanilla HTML, CSS, and JavaScript - no build tools or frameworks required.

## Development Commands

Since this is a static website with no build process:
- **Run locally**: Open `index.html` in a web browser or use a local server (e.g., `python -m http.server 8000` or Live Server extension in VS Code)
- **No build/test commands**: This project has no package.json, build process, or test suite

## Architecture & Key Implementation Details

### File Structure
- `index.html` - Main landing page with all sections
- `privacy.html`, `terms.html` - Legal pages
- `script.js` - All JavaScript functionality including animated background
- `style.css` - All styling with CSS variables for theming
- `assets/` - Images, videos, and logo files

### Important Technical Details

1. **Canvas Animation System**: The background uses a sophisticated circle animation on canvas (`#animated-bg-canvas`). Configuration is controlled via CSS variables:
   - `--animation-circle-opacity`: Controls circle visibility
   - `--animation-circle-spacing`: Controls density
   - Resize events are debounced (150ms) for performance

2. **Header Offset**: Fixed at 80px for smooth scrolling (script.js:19). Update this value if header height changes.

3. **Mobile Navigation**: Toggle system that handles both internal hash links and external pages differently. Mobile breakpoint is at 768px.

4. **Asset Fallbacks**: Images use onerror handlers to show placeholders if assets are missing:
   ```html
   onerror="this.src='https://via.placeholder.com/[size]'"
   ```

5. **External Dependencies**:
   - Google Fonts (Inter)
   - Font Awesome 6.4.0 (CDN)
   - No JavaScript libraries

### CSS Variable System

The project uses a comprehensive CSS variable system for theming:
- Primary colors: Rose color scheme (#f43f5e, #fb7185)
- Shadow system: Multiple levels from xs to 2xl
- Border radius: Consistent rounding values
- All defined in `:root` selector in style.css

### Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet) and 1024px (desktop)
- Mobile menu replaces desktop navigation below 768px
- Grid layouts adapt from 1 to 3 columns

## Common Tasks

- **Update copyright year**: Automatically handled by JavaScript
- **Add new page**: Create HTML file, include standard header/footer, add to navigation
- **Modify animations**: Adjust CSS variables or animation parameters in script.js:74+
- **Change theme colors**: Update CSS variables in style.css :root selector