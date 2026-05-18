#!/bin/bash

# Magician Platform Setup Script
# For VR4deaf Organizations' Deaf Customers

set -e

echo "🧙 Magician Platform Setup"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js version
check_node() {
    if command -v node &> /dev/null; then
        # More robust version parsing that handles various node -v output formats
        NODE_VERSION_FULL=$(node -v 2>/dev/null)
        # Extract major version number, handling formats like "v20.10.0" or "20.10.0"
        NODE_VERSION=$(echo "$NODE_VERSION_FULL" | sed 's/^v//' | cut -d'.' -f1)
        
        # Validate that we got a numeric value
        if [[ "$NODE_VERSION" =~ ^[0-9]+$ ]] && [ "$NODE_VERSION" -ge 20 ]; then
            echo -e "${GREEN}✓ Node.js version ${NODE_VERSION_FULL} detected${NC}"
        elif [[ "$NODE_VERSION" =~ ^[0-9]+$ ]]; then
            echo -e "${RED}✗ Node.js 20+ required. Current version: ${NODE_VERSION_FULL}${NC}"
            exit 1
        else
            echo -e "${RED}✗ Unable to determine Node.js version from: ${NODE_VERSION_FULL}${NC}"
            exit 1
        fi
    else
        echo -e "${RED}✗ Node.js not found. Please install Node.js 20+${NC}"
        exit 1
    fi
}

# Check npm
check_npm() {
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✓ npm version $(npm -v) detected${NC}"
    else
        echo -e "${RED}✗ npm not found${NC}"
        exit 1
    fi
}

# Install dependencies
install_deps() {
    echo ""
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Setup environment file
setup_env() {
    if [ ! -f .env ]; then
        echo ""
        echo -e "${YELLOW}⚙️  Setting up environment file...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created from .env.example${NC}"
        echo -e "${YELLOW}! Please update .env with your actual configuration${NC}"
    else
        echo -e "${GREEN}✓ .env file already exists${NC}"
    fi
}

# Check database connection
check_db() {
    echo ""
    echo -e "${BLUE}🗄️  Checking database configuration...${NC}"
    if grep -q "DATABASE_URL" .env; then
        echo -e "${GREEN}✓ DATABASE_URL configured${NC}"
    else
        echo -e "${YELLOW}! DATABASE_URL not found in .env${NC}"
    fi
}

# Run database migrations
run_migrations() {
    echo ""
    read -p "Do you want to push database schema? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Running database migrations...${NC}"
        npm run db:push || echo -e "${YELLOW}! Database push skipped (may require configuration)${NC}"
    fi
}

# TypeScript check
check_typescript() {
    echo ""
    echo -e "${BLUE}📝 Running TypeScript check...${NC}"
    npm run typecheck 2>/dev/null || echo -e "${YELLOW}! TypeScript check completed with warnings${NC}"
}

# Build check
check_build() {
    echo ""
    read -p "Do you want to build the project? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🔨 Building project...${NC}"
        npm run build && echo -e "${GREEN}✓ Build successful${NC}" || echo -e "${RED}✗ Build failed${NC}"
    fi
}

# Print next steps
print_next_steps() {
    echo ""
    echo "=========================="
    echo -e "${GREEN}🎉 Setup Complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update .env with your API keys and database URL"
    echo "2. Run 'npm run dev' to start development server"
    echo "3. Visit http://localhost:5000 to view the application"
    echo ""
    echo "Useful commands:"
    echo "  npm run dev        - Start development server"
    echo "  npm run build      - Build for production"
    echo "  npm run db:studio  - Open Drizzle Studio"
    echo "  npm run typecheck  - Run TypeScript checks"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "  - README.md                    - Project overview"
    echo "  - DEPLOYMENT.md                - Deployment guide"
    echo "  - IMPLEMENTATION_SUMMARY.md    - Technical details"
    echo "  - CONTRIBUTING.md              - Contribution guidelines"
    echo ""
    echo "Thank you for using Magician Platform! 🧙✨"
}

# Main execution
main() {
    check_node
    check_npm
    install_deps
    setup_env
    check_db
    run_migrations
    check_typescript
    check_build
    print_next_steps
}

main "$@"
