# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom LED neon sign designer web application that allows users to create personalized neon signs with various fonts, colors, materials, and customization options. The project is built as a client-side application using vanilla HTML, CSS, and JavaScript, deployed on Vercel with edge middleware.

## Architecture

- **Frontend**: Single-page application using vanilla JavaScript with Canvas API for real-time preview
- **Deployment**: Vercel with Edge Middleware for security headers
- **Font System**: Custom font loading with 40+ specialty fonts for neon sign design
- **Theme System**: Dark/light mode toggle with CSS custom properties
- **Material System**: Multiple backing materials (Forex, MDF, Acrylic, etc.) with thickness visualization

## Key Components

### Main Files
- `index.html` - Main application interface with neon sign customizer
- `js/index.js` - Core application logic for preview rendering, font management, and user interactions
- `middleware.js` - Vercel Edge Middleware for security headers
- `styles/styles.css` - Primary styles with CSS custom properties for theming
- `styles/responsive.css` - Responsive design styles

### Font Management
The application uses a sophisticated font loading system:
- Fonts are stored in `/fonts/` directory
- Font preloading system in `js/index.js:preloadFonts()`
- Custom dropdown with keyboard navigation for font selection
- Font files include specialty display fonts for neon aesthetics

### Canvas Rendering System
Located in `js/index.js:updatePreview()`:
- Real-time preview using HTML5 Canvas
- Neon glow effects with shadows and gradients
- Material texture rendering for non-neon signs
- Dimension lines and measurements display
- Background image selection

## Development Commands

Since this is a static web application with no build process:
- **Local Development**: Open `index.html` in a browser or use a local server
- **Deployment**: Push to Vercel (configured in package.json)
- **Dependencies**: Only has `@vercel/edge` for middleware

## Key Features to Understand

### Theme Toggle System
- CSS custom properties in `:root` and `[data-theme="dark"]`
- Theme persistence via localStorage
- Logo switching between dark/light variants

### Custom Select Component
- Keyboard-accessible dropdown in `js/index.js:initCustomSelect()`
- Font preview in dropdown options
- Arrow key navigation support

### Material vs Neon Mode
- Toggle between LED neon signs and material cut signs
- Different rendering methods for each mode
- Material thickness visualization

### Font Loading Strategy
- Preloads all fonts on page load
- Fallback to Arial if custom fonts fail
- Uses Font Loading API with error handling

## Working with Fonts

When adding new fonts:
1. Add font file to `/fonts/` directory
2. Update font list in `preloadFonts()` function
3. Add corresponding CSS class in styles.css
4. Add option to font dropdown in index.html

## Deployment Notes

- Uses Vercel Edge Middleware for security headers
- Static deployment - no server-side processing
- Font files and assets served directly from repository