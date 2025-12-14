#!/bin/bash
# Run the unified API server

# Exit on error
set -e

# Verify npm script exists before running
if ! grep -q '"dev"' package.json; then
  echo "Error: 'dev' script not found in package.json"
  exit 1
fi

# Run the main server (uses npm dev script which runs tsx server/index.ts)
echo "Starting unified 360 Business Magician Platform server..."
npm run dev

