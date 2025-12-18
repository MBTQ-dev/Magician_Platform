# Archived Files Documentation

This document tracks files that have been archived or removed from the repository to streamline the project structure.

## Latest Archive Date
December 18, 2024

## Repository Streamlining (December 18, 2024)

As part of repository reorganization for the MBTQ Platform structure:

### Removed Files
- **360-magician-demo.html** - Outdated demo file
- **360magicians.html** - Outdated magicians demo
- **gateway** - Incomplete code snippet
- **polygist** - Incomplete workflow snippet  
- **reorganize** - Placeholder file
- **var** - Incomplete code snippet

### Removed Shell Scripts
- **run-minimal.sh** - Redundant run script
- **run-super-minimal.sh** - Redundant run script
- **run-ultra-minimal.sh** - Redundant run script
- **start-minimal.sh** - Redundant startup script
- **workflow-run-minimal.sh** - Redundant workflow script
- **workflow-run-api.sh** - Redundant workflow script
- **workflow-run-htmx.sh** - Redundant workflow script

### Moved to archived-docs/
- **AUDIT-SUMMARY.md** - Historical audit information
- **AUTOMATION-DEMO.md** - Old automation demo
- **DENO_TRANSITION_SUMMARY.md** - Historical Deno transition notes
- **FIX-SUMMARY.md** - Historical fix summary
- **GITHUB-REPOSITORY-TEMPLATE.md** - Old template
- **IMPLEMENTATION_SUMMARY.md** - Superseded by current docs
- **PLATFORM-INTEGRATION-SUMMARY.md** - Superseded by MBTQ Platform docs
- **README-GENERATOR.md** - Old generator docs
- **REMOVING_CLOUD_RUN_STATUS_CHECK.md** - Specific fix documentation
- **SUMMARY.md** - Generic summary file
- **SYSTEM_TRANSFORMATION_SUMMARY.md** - Historical transformation notes
- **implementation-plan.md** - Old implementation plan
- **gcp-vercel-deployment.md** - Old deployment guide (superseded by DEPLOYMENT_GUIDE.md)
- **api-definition.md** - Old API definition (superseded by API_ROUTES.md)

## Previous Archive Date
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
