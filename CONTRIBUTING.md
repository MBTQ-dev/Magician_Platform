# Contributing to Magician Platform

Thank you for considering contributing to Magician Platform! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Code Style and Guidelines](#code-style-and-guidelines)
4. [Submitting Changes](#submitting-changes)
5. [Database Management](#database-management)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [GitHub Principles](#github-principles)

## Project Overview

The Magician Platform is a comprehensive AI agent ecosystem featuring 8 specialized "Magician" services designed to support deaf individuals through:

- **Vocational Rehabilitation (VR)** programs and self-employment pathways
- **Workforce Development** and job placement services
- **Business Formation** and entrepreneurship support
- **Software Development** and technical training
- **Creative Services** and ASL content creation

All services are built with deaf-first accessibility and maintain strict compliance with federal VR regulations (34 CFR Part 361) and workforce development standards.

### Related Repositories
- [github.com/pinkycollie/360magicians](https://github.com/pinkycollie/360magicians) - 360 Magicians framework
- [github.com/pinkycollie/mbtq-dev](https://github.com/pinkycollie/mbtq-dev) - MBTQ ecosystem

## Development Environment Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database (or Docker)
- Git
- npm or yarn

### Setting Up Your Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/MBTQ-dev/Magician_Platform.git
   cd Magician_Platform
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker (Alternative)

We provide a Docker Compose configuration for easier setup:

```bash
docker-compose up -d
```

The application will be available at http://localhost:8080

### Using Replit

The project is configured for Replit deployment:

1. Import the repository into Replit
2. Dependencies will be installed automatically
3. Configure secrets in Replit
4. Click "Run" to start the application

## Code Style and Guidelines

### General Principles

1. **Deaf-First Design**: Prioritize visual communication and ASL content
2. **Type Safety**: Use TypeScript with strict mode
3. **Accessibility**: WCAG 2.1 Level AA compliance is mandatory
4. **Security**: Never commit secrets or credentials
5. **Testing**: Write tests for new features

### TypeScript

- Use strict mode
- Avoid `any` types without justification
- Provide proper type definitions for all functions
- Use interfaces over types where appropriate

### React Components

- Use functional components with hooks
- Provide proper TypeScript prop types
- Include accessibility attributes on interactive elements
- Ensure responsive design for all screen sizes
- Add ASL video content where appropriate

### Naming Conventions

- **Files**: Use kebab-case for file names (e.g., `business-magician.ts`)
- **Components**: Use PascalCase (e.g., `BusinessMagician`)
- **Functions**: Use camelCase (e.g., `checkMagiciansHealth`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Code Documentation

- Add JSDoc comments for public APIs
- Include inline comments for complex logic
- Keep comments up-to-date with code changes

## Submitting Changes

### Branch Strategy

- `main` - Production-ready code (protected)
- `develop` - Integration branch for features
- `feature/[name]` - New features
- `bugfix/[name]` - Bug fixes
- `hotfix/[name]` - Critical production fixes

### Creating a Pull Request

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes with clear, atomic commits:
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request on GitHub

5. Ensure all CI checks pass:
   - Type checking
   - Build successful
   - Tests passing
   - Security scan clean

### Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `security`: Security fixes

**Example:**
```
feat(magicians): add Business Magician service

Implement comprehensive business planning and formation guidance
with VR self-employment pathway support.

Closes #123
```

### Pull Request Template

Your PR should include:

- [ ] Clear description of changes
- [ ] Type of change (bug fix, feature, etc.)
- [ ] Testing completed
- [ ] Documentation updated
- [ ] Compliance maintained
- [ ] Related issues referenced

### Code Review Process

1. At least one team member must review
2. All automated checks must pass
3. Approval required before merge
4. Use "Squash and merge" for clean history

## Database Management

We use Drizzle ORM for database operations.

### Schema Changes

1. Update the schema definition in `shared/schema.ts`

2. Generate migrations:
   ```bash
   npm run db:generate
   ```

3. Apply changes to the database:
   ```bash
   npm run db:push
   ```

4. Verify changes:
   ```bash
   npm run db:check
   ```

### Database Best Practices

- Use Drizzle ORM for all database operations
- Never write raw SQL without proper sanitization
- Use transactions for multi-step operations
- Add indexes for frequently queried columns
- Document complex queries

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run all validation
npm run validate
```

### Writing Tests

- Write tests for new features
- Include unit tests for functions
- Add integration tests for APIs
- Test accessibility with screen readers
- Aim for >80% code coverage

### Test Structure

```typescript
describe('BusinessMagician', () => {
  it('should generate business ideas', async () => {
    // Arrange
    const magician = new BusinessMagician();
    
    // Act
    const result = await magician.execute({
      action: 'generate_business_idea',
      payload: { industry: 'tech' }
    });
    
    // Assert
    expect(result.success).toBe(true);
  });
});
```

## Deployment

### Replit Deployment

1. Push to main branch
2. Replit auto-deploys
3. Monitor deployment logs
4. Verify health checks

### Vercel Deployment

1. Configure environment variables in Vercel
2. Push to main branch or deploy manually:
   ```bash
   vercel deploy --prod
   ```

### Environment Variables

Required environment variables:

```env
DATABASE_URL=postgres://...
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_CLOUD_BUCKET_NAME=...
JWT_SECRET=...
NODE_ENV=production
```

### Health Checks

After deployment, verify:

1. Application is accessible
2. All 8 Magician services are operational
3. Database connectivity
4. Storage service configured
5. Authentication working

Health check endpoint: `GET /api/health`

## GitHub Principles

For detailed information about our GitHub principles, standards, and workflows, see [GITHUB-PRINCIPLES.md](./GITHUB-PRINCIPLES.md).

### Automated Workflows

We have several automated workflows:

1. **Auto-merge**: Automatically merges minor dependency updates
2. **Auto-test**: Runs tests on every push and PR
3. **Auto-update**: Weekly dependency updates
4. **Production Deploy**: Automated deployment to production
5. **Compliance Checks**: Daily compliance audits
6. **Agent Management**: Health monitoring for Magicians

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Regular security audits via GitHub Actions
- Immediate response to security vulnerabilities
- Follow OWASP top 10 guidelines

### Accessibility Standards

- WCAG 2.1 Level AA compliance mandatory
- ASL video content throughout
- Full keyboard navigation support
- Screen reader optimization
- Visual notification system

## Additional Resources

### Documentation
- [README.md](./README.md) - Project overview
- [GITHUB-PRINCIPLES.md](./GITHUB-PRINCIPLES.md) - GitHub standards
- [COMPLIANCE-DOCUMENTATION.md](./COMPLIANCE-DOCUMENTATION.md) - Compliance details
- [AUDIT-SUMMARY.md](./AUDIT-SUMMARY.md) - Audit results

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [34 CFR Part 361](https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-361) - VR regulations

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community feedback
- **Documentation**: Check the docs first
- **Team Contact**: Reach out to maintainers

## Code of Conduct

### Our Pledge

We pledge to make participation in our community a harassment-free experience for everyone, regardless of:
- Age, disability, ethnicity
- Gender identity and expression
- Level of experience
- Nationality, personal appearance
- Race, religion, or sexual orientation

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Respecting differing viewpoints
- Accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behavior:**
- Trolling, insulting, or derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Project documentation
- Release notes

Thank you for contributing to making the Magician Platform better for the deaf community!

---

**Questions?** Open an issue or start a discussion on GitHub.