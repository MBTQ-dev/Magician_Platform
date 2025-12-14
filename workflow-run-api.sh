#!/bin/bash
# Run the unified API server

# Exit on error
set -e

# Run the main server (uses npm dev script which runs tsx server/index.ts)
echo "Starting unified 360 Business Magician Platform server..."
npm run dev
