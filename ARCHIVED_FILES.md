# Archived Legacy Files

This document tracks files that have been archived from the root directory to clean up the project structure.

## Archive Date
December 14, 2025

## Reason for Archiving
These files were moved to `archived_legacy_files/` directory as they were:
- Duplicate implementations of functionality now in `server/index.ts` and `server/routes/`
- Legacy test files no longer needed
- Standalone scripts that are redundant with the main server architecture

## Archived Files

### Legacy Notion Integration Files
- **api-server-notion.js** - Standalone server with Notion integration (superseded by server/services/notionService.ts)
- **generate-idea-to-notion.js** - Standalone script for generating ideas to Notion (functionality in main server)
- **server/services/notionService.js** - Duplicate JS version (TypeScript version .ts is kept)
- **run-notion-test.sh** - Shell script for testing Notion integration
- **notion-test.html** - HTML test file for Notion

### Legacy API Files
- **api-server.js** - Standalone Express API server (superseded by server/index.ts)
- **api-server.ts** - Another standalone API server (superseded by server/index.ts)
- **run-api.js** - Script to run legacy API server
- **run-api.sh** - Shell script for running API
- **run-api-server.sh** - Another API server runner
- **api-server-notion.sh** - Shell script for Notion API server
- **api-server.sh** - Another API server shell script

### Legacy Test and Bridge Files
- **flask-bridge.js** - Flask integration bridge (no longer needed)
- **test-server.js** - Test server file
- **working-magician-server.js** - Working copy of server (superseded)
- **northwest-api-test.js** - Northwest API test file
- **run-northwest-test.sh** - Northwest test runner
- **start-vr-flow.js** - VR flow starter (functionality in main server)

## Current Architecture

The platform now uses a consolidated architecture:
- **Main Server**: `server/index.ts` - Express server with lazy-loaded routes
- **Routes**: `server/routes/*.ts` - Modular route handlers
- **Services**: `server/services/*.ts` - Business logic and external integrations
- **Notion Integration**: `server/services/notionService.ts` (TypeScript version)

## How to Access Archived Files

If you need to reference or restore any archived files:
```bash
cd archived_legacy_files/
ls -la
```

## Migration Notes

All functionality from the archived files has been integrated into the main server architecture. No features were lost in the archiving process.
