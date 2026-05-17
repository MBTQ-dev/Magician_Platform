# Development Container Configuration

This directory contains the development container configuration for the Magician Platform. Using a devcontainer ensures a consistent development environment across all contributors.

## Features

- **Node.js 20**: Primary runtime environment
- **Deno**: For optional Deno/Fresh application in `/deno-app`
- **PostgreSQL**: Database support (requires external instance or docker-compose)
- **Git**: Version control
- **Docker-in-Docker**: For building and testing containers

## Quick Start

### VS Code

1. Install the "Dev Containers" extension
2. Open the project in VS Code
3. Click "Reopen in Container" when prompted
4. Wait for the container to build and dependencies to install

### GitHub Codespaces

1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for the environment to initialize
3. Start developing!

## Ports

- **3000**: Vite dev server (client)
- **5000**: Express API server
- **5432**: PostgreSQL database (if using docker-compose)

## Environment Setup

1. Copy `.env.example` to `.env` in the repository root
2. Configure necessary environment variables
3. Run `npm run db:push` to initialize the database schema

## Related Files

- `/.replit`: Replit-specific configuration
- `/docker-compose.yml`: Multi-service orchestration
- `/Dockerfile`: Production container image

## Compliance Notes

This devcontainer configuration is designed to support:
- Vocational Rehabilitation (VR) compliance testing
- Workforce development standards validation
- Accessibility testing tools
- Multi-repository synchronization with 360magicians and MBTQ-dev ecosystems
