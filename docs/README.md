# VR4Deaf Apps Documentation Site

This directory contains the GitHub Pages documentation site for the MBTQ Platform and VR4Deaf Apps.

## Structure

- **index.html** - Main MBTQ Platform landing page (auto-published to GitHub Pages)
  - Overview of the three-pillar architecture (DeafAUTH, PinkSync, Fibonrose)
  - Integration entry points and instructions
  - Organization map of all repos
  
- **platform.html** - Source file for the platform page (kept as backup/reference)

- **old-magician-platform-index.html** - Legacy Magician Platform documentation (archived)

- **compliance-dashboard.html** - Interactive compliance dashboard demo

- **integration-guide.html** - Detailed integration guide for developers

## Assets

- **assets/css/** - Stylesheets
  - `styles.css` - Main stylesheet for the platform pages
  - `dashboard.css` - Compliance dashboard styles
  
- **assets/js/** - JavaScript files
  - `main.js` - Main JavaScript functionality
  - `dashboard.js` - Dashboard interactivity
  - `integration-guide.js` - Integration guide features

## Viewing Locally

To view the documentation site locally:

```bash
# Using Python 3
cd docs
python3 -m http.server 8000

# Or using Node.js
npx http-server docs -p 8000
```

Then open http://localhost:8000 in your browser.

## GitHub Pages

This site is published to: **https://mbtq-dev.github.io/VR4Deaf-Apps/**

The site automatically updates when changes are pushed to the main branch.

## MBTQ Platform

The main landing page (index.html) serves as the central documentation for:

- **🔐 DeafAUTH** - Authentication and identity management
- **⚡ PinkSync** - Real-time synchronization and accessibility
- **⭐ Fibonrose** - Reputation and trust scoring

These three pillars form the foundation of the MBTQ Platform ecosystem, used by vr4deaf.org and future accessible applications.
