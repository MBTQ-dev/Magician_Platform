#!/bin/bash
# Run the unified API server

# Exit on error
set -e

# Verify npm dev script exists before running
# Uses jq for robust JSON parsing if available, falls back to grep
if command -v jq &> /dev/null; then
  if ! jq -e '.scripts.dev' package.json > /dev/null 2>&1; then
    echo "Error: 'dev' script not found in package.json"
    exit 1
  fi
else
  # Fallback to grep with more specific pattern
  if ! grep -q '"dev"[[:space:]]*:[[:space:]]*"' package.json; then
    echo "Error: 'dev' script not found in package.json"
    echo "Note: Install jq for more reliable verification"
    exit 1
  fi
fi

# Run the main server (uses npm dev script which runs tsx server/index.ts)
echo "Starting unified 360 Business Magician Platform server..."
npm run dev


