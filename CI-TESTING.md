# CI/CD and Testing Documentation

## Overview

This document describes the continuous integration, testing, and quality assurance processes for the Magician Platform.

## Build and Test Status

### Main Build Status

The platform uses GitHub Actions for continuous integration. The primary workflow is:
- **auto-test.yml**: Automated testing and quality checks (workflow ID: 215739723)

### Local Testing

#### Quick Smoke Test

Run the smoke test to verify basic functionality:

```bash
./scripts/smoke-test.sh
```

This runs 23+ automated checks including:
- Node.js version verification
- Project structure validation
- Build verification
- Configuration file checks
- DevContainer setup validation
- Documentation completeness

#### Full Build Test

```bash
npm install --legacy-peer-deps
npm run build
```

#### TypeScript Type Checking

```bash
npm run check
```

Note: Some TypeScript errors may exist in legacy code but don't prevent successful builds.

## Branch Testing Strategy

### Automated Testing

All branches are automatically tested on:
1. Push to branch
2. Pull request creation
3. Pull request updates

### Manual Branch Testing

To test a specific branch locally:

```bash
# Checkout the branch
git checkout <branch-name>

# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Run tests
./scripts/smoke-test.sh
npm run build
```

### Known Active Branches

- `main` - Production branch
- `copilot/fix-errors-in-devcontainer` - DevContainer and icon fixes
- `copilot/audit-replit-files-and-procedure` - Replit configuration audit
- Various feature branches (see GitHub)

## Recent Fixes

### Build Failures Fixed (2025-12-14)

**Issue**: Build failing due to incorrect lucide-react icon imports

**Resolution**:
1. `Refresh` → `RotateCw` in AIBusinessAnalytics.tsx
2. `Card` → `CreditCard` in VR4DeafDashboard.tsx
3. `MessageSquareCheck` → `CheckCircle2` in VR4DeafDashboard.tsx

**Verification**: Build now passes successfully ✅

### DevContainer Added

Added comprehensive devcontainer configuration for:
- VS Code Dev Containers
- GitHub Codespaces
- Standardized development environments

## Compliance and Standards

### Vocational Rehabilitation Compliance

The platform maintains compliance with:
- 34 CFR Part 361 (VR regulations)
- Section 508 accessibility standards
- WIOA workforce development standards

### Repository Alignment

Synchronized with ecosystem repositories:
- `github.com/pinkycollie/360magicians` - 360 Magicians framework
- `github.com/pinkycollie/mbtq-dev` - MBTQ ecosystem

## Troubleshooting

### Build Fails with Icon Import Errors

**Solution**: Check lucide-react icon names in the [lucide.dev](https://lucide.dev) documentation

### TypeScript Errors

Most TypeScript errors are in legacy code and don't prevent builds. Focus on build success rather than type check success.

### Dependency Installation Issues

Always use `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

### Port Conflicts

If ports are in use:

```bash
# Kill processes on port 5000
lsof -ti:5000 | xargs kill -9

# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9
```

## Future Improvements

- [ ] Add automated branch testing script
- [ ] Implement comprehensive unit tests
- [ ] Add integration tests for API endpoints
- [ ] Set up automated security scanning
- [ ] Create performance benchmarks
- [ ] Add visual regression testing

## Contact

For issues related to CI/CD or testing:
- Create an issue on GitHub
- Tag with `ci`, `testing`, or `build` labels
- Reference this documentation
