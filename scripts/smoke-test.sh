#!/bin/bash

# Smoke Test Script for Magician Platform
# Tests basic functionality across all branches

set -e

echo "🔍 Magician Platform - Smoke Test Suite"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# 1. Node.js version check
run_test "Node.js version >= 20" "node -v | grep -E 'v(2[0-9]|[3-9][0-9])'"

# 2. Package.json exists
run_test "package.json exists" "test -f package.json"

# 3. TypeScript configuration
run_test "tsconfig.json exists" "test -f tsconfig.json"

# 4. Dependencies check
run_test "node_modules exists or can install" "test -d node_modules || npm install --legacy-peer-deps"

# 5. TypeScript check
echo -n "Testing: TypeScript type checking... "
if npm run check > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_RUN=$((TESTS_RUN + 1))

# 6. Build test
echo -n "Testing: Project build... "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_RUN=$((TESTS_RUN + 1))

# 7. Essential directories
run_test "client/ directory exists" "test -d client"
run_test "server/ directory exists" "test -d server"
run_test "shared/ directory exists" "test -d shared"

# 8. Configuration files
run_test ".replit exists" "test -f .replit"
run_test "vite.config.ts exists" "test -f vite.config.ts"
run_test "drizzle.config.ts exists" "test -f drizzle.config.ts"

# 9. DevContainer configuration
run_test ".devcontainer/ exists" "test -d .devcontainer"
run_test "devcontainer.json exists" "test -f .devcontainer/devcontainer.json"

# 10. Workflow files
run_test ".github/workflows/ exists" "test -d .github/workflows"

# 11. Key source files
run_test "server/index.ts exists" "test -f server/index.ts"
run_test "client/src/main.tsx exists" "test -f client/src/main.tsx"

# 12. HTMX configuration
run_test "run-htmx-server.sh exists" "test -f run-htmx-server.sh"
run_test "run-htmx-server.sh is executable" "test -x run-htmx-server.sh"

# 13. Documentation
run_test "README.md exists" "test -f README.md"
run_test "API_ROUTES.md exists" "test -f API_ROUTES.md"

# 14. Compliance documentation
run_test "COMPLIANCE-DOCUMENTATION.md exists" "test -f COMPLIANCE-DOCUMENTATION.md"

# 15. Deno app (optional)
if [ -d "deno-app" ]; then
    run_test "deno-app/deno.json exists" "test -f deno-app/deno.json"
    echo -e "${YELLOW}ℹ Deno app detected${NC}"
fi

# Summary
echo ""
echo "========================================"
echo "Test Summary:"
echo "  Total:  $TESTS_RUN"
echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
fi
echo "========================================"
echo ""

# Exit with error if any tests failed
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
fi
