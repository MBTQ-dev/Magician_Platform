# GitHub Principles and Standardized Procedures

## Overview

This document outlines the GitHub principles, best practices, and standardized procedures for the Magician Platform repository to ensure consistency, quality, and long-term maintainability.

## Repository Alignment

This repository is aligned with the 360 Magicians ecosystem:
- **Primary Repository**: [github.com/MBTQ-dev/Magician_Platform](https://github.com/MBTQ-dev/Magician_Platform)
- **Related Repositories**:
  - [github.com/pinkycollie/360magicians](https://github.com/pinkycollie/360magicians) - 360 Magicians framework
  - [github.com/pinkycollie/mbtq-dev](https://github.com/pinkycollie/mbtq-dev) - MBTQ ecosystem

## Core Principles

### 1. Deaf-First Design
- All features prioritize visual communication and ASL content
- Accessibility is not an afterthought but a core requirement
- WCAG 2.1 Level AA compliance is mandatory

### 2. Type Safety
- TypeScript is used throughout the codebase
- Runtime validation with Zod schemas
- Type-safe database operations with Drizzle ORM

### 3. Security First
- Never commit secrets or credentials
- Use environment variables for all sensitive data
- Regular security audits via GitHub Actions
- Immediate response to security vulnerabilities

### 4. Compliance-Driven
- VR regulations (34 CFR Part 361) compliance
- Workforce development standards (WIOA)
- Complete audit trails for all operations
- Documentation of regulatory requirements

### 5. Automation and Consistency
- Automated testing and quality checks
- Continuous integration and deployment
- Automated dependency updates
- Standardized code formatting and linting

## Branch Strategy

### Main Branches
- `main` - Production-ready code, protected
- `develop` - Integration branch for features

### Feature Branches
- `feature/[feature-name]` - New features
- `bugfix/[bug-name]` - Bug fixes
- `hotfix/[issue]` - Critical production fixes
- `copilot/[task-name]` - AI agent work branches

### Branch Protection Rules
- `main` branch requires:
  - Pull request reviews (at least 1)
  - Status checks to pass
  - Up-to-date with base branch
  - No force pushes
  - No deletions

## Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `security`: Security fixes

### Examples
```
feat(magicians): add Business Magician service

Implement comprehensive business planning and formation guidance
with VR self-employment pathway support.

Closes #123
```

```
fix(auth): resolve JWT token expiration issue

Update token refresh logic to handle edge cases.

Fixes #456
```

## Pull Request Process

### Creating Pull Requests
1. Create feature branch from `develop`
2. Make focused, atomic changes
3. Write clear commit messages
4. Update documentation as needed
5. Add/update tests for new features
6. Ensure all CI checks pass
7. Request review from team members

### PR Template
```markdown
## Description
[Clear description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Compliance
- [ ] VR compliance maintained
- [ ] Accessibility standards met
- [ ] Security review completed

## Related Issues
Closes #[issue number]
```

### Review Process
1. Code review by at least one team member
2. Automated checks must pass:
   - Type checking
   - Build successful
   - Tests passing
   - Security scan clean
3. Approval required before merge
4. Squash and merge for clean history

## Automated Workflows

### 1. Auto-merge (Dependabot)
- Automatically merges patch and minor dependency updates
- Requires passing tests and security checks
- Major updates require manual review

### 2. Auto-test
- Runs on every push and PR
- Type checking, linting, building
- Unit and integration tests
- Security vulnerability scanning

### 3. Auto-update
- Weekly dependency updates
- Creates PRs for review
- Focuses on patch and minor versions

### 4. Production Deployment
- Triggers on push to `main`
- Pre-deployment validation
- Automated deployment to Replit and Vercel
- Post-deployment health checks

### 5. Compliance Checks
- Daily automated compliance audits
- VR and workforce standards validation
- Accessibility testing
- Documentation verification

### 6. Agent Management
- Health monitoring for all 8 Magicians
- Performance audits
- Capacity planning
- Emergency response protocols

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types without justification
- Proper type definitions for all functions
- Interface over type where appropriate

### React Components
- Functional components with hooks
- Proper prop typing with TypeScript
- Accessibility attributes on all interactive elements
- Responsive design for all screen sizes

### API Design
- RESTful principles
- Consistent error handling
- Proper status codes
- Comprehensive request/response validation with Zod

### Database
- Drizzle ORM for all database operations
- Schema changes via migrations
- Proper foreign key constraints
- Indexes on frequently queried columns

## Testing Strategy

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Aim for >80% code coverage

### Integration Tests
- Test API endpoints end-to-end
- Test Magician service interactions
- Validate database operations

### Accessibility Tests
- Automated WCAG compliance checks
- Manual testing with screen readers
- Keyboard navigation verification

### Security Tests
- Dependency vulnerability scans
- OWASP top 10 validation
- Penetration testing for production

## Documentation Standards

### Code Documentation
- JSDoc comments for public APIs
- Inline comments for complex logic
- README files in feature directories
- Type definitions serve as documentation

### API Documentation
- OpenAPI/Swagger specifications
- Request/response examples
- Error code documentation
- Rate limiting information

### User Documentation
- Getting started guides
- Feature tutorials with ASL videos
- Troubleshooting guides
- FAQ with visual aids

### Compliance Documentation
- Regulatory requirement mapping
- Audit trail documentation
- Privacy policy and terms
- Accessibility conformance reports

## Environment Management

### Development
- Local development with Docker Compose
- Hot reload enabled
- Debug logging enabled
- Test data available

### Staging
- Mirror of production configuration
- Integration testing environment
- Pre-release validation
- Performance testing

### Production
- Environment variables via secrets management
- Production logging configuration
- Performance monitoring enabled
- Automated backups

## Security Practices

### Code Security
- Regular dependency updates
- Security vulnerability scanning
- Code review for security issues
- Static analysis with CodeQL

### Authentication
- DeafAuth service for identity
- JWT tokens with expiration
- Rate limiting on authentication endpoints
- Multi-factor authentication support

### Data Protection
- Encryption at rest and in transit
- PII data minimization
- GDPR/CCPA compliance
- Regular security audits

### Incident Response
1. Detect and assess security incident
2. Contain and mitigate impact
3. Investigate root cause
4. Deploy fix and verify
5. Document and learn

## Performance Standards

### Response Times
- API endpoints: <200ms (p95)
- Page load: <2s (p95)
- Database queries: <100ms (p95)

### Scalability
- Horizontal scaling capability
- Database connection pooling
- Caching strategy
- CDN for static assets

### Monitoring
- Application performance monitoring (APM)
- Error tracking and alerting
- User experience monitoring
- Infrastructure monitoring

## Deployment Process

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Rollback plan documented

### Deployment Steps
1. Merge PR to `main` branch
2. Automated CI/CD pipeline triggered
3. Pre-deployment validation
4. Deploy to staging first
5. Run smoke tests
6. Deploy to production
7. Post-deployment health checks
8. Monitor for issues

### Rollback Procedure
1. Identify issue requiring rollback
2. Revert commit or deploy previous version
3. Verify rollback successful
4. Investigate root cause
5. Prepare fix in new PR

## Maintenance and Updates

### Weekly Tasks
- Review and merge dependency updates
- Review open issues and PRs
- Update documentation as needed
- Monitor performance metrics

### Monthly Tasks
- Security audit and review
- Performance optimization review
- Dependency major version planning
- User feedback analysis

### Quarterly Tasks
- Comprehensive code quality review
- Architecture review and optimization
- Compliance audit
- Disaster recovery testing

## Communication Channels

### GitHub Issues
- Bug reports
- Feature requests
- Documentation improvements
- Questions and discussions

### Pull Requests
- Code changes
- Review discussions
- Automated check results

### GitHub Discussions
- General questions
- Community feedback
- Architecture discussions
- Announcements

## Success Metrics

### Code Quality
- TypeScript strict mode compliance: 100%
- Test coverage: >80%
- Build success rate: >95%
- Security vulnerabilities: 0 high/critical

### Performance
- API response time: <200ms (p95)
- Page load time: <2s (p95)
- Uptime: >99.9%

### Compliance
- WCAG 2.1 AA compliance: 100%
- VR regulation compliance: 100%
- Security audit: Pass
- Accessibility audit: Pass

### User Experience
- User satisfaction: >4.5/5
- Task completion rate: >90%
- Error rate: <1%

## Continuous Improvement

### Retrospectives
- Regular team retrospectives
- Learn from incidents
- Celebrate successes
- Identify improvement areas

### Experimentation
- A/B testing for UX improvements
- Performance optimization experiments
- New technology evaluation
- Process improvements

### Learning
- Stay current with accessibility standards
- Follow TypeScript and React best practices
- Learn from security incidents
- Share knowledge within team

## Resources

### Internal
- [README.md](./README.md) - Project overview
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [COMPLIANCE-DOCUMENTATION.md](./COMPLIANCE-DOCUMENTATION.md) - Compliance details
- [AUDIT-SUMMARY.md](./AUDIT-SUMMARY.md) - Audit results

### External
- [34 CFR Part 361](https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-361) - VR regulations
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility guidelines
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)

## Contacts

### Platform Maintainers
- MBTQ Development Team
- 360 Magicians Team

### Related Projects
- github.com/pinkycollie/360magicians
- github.com/pinkycollie/mbtq-dev

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Active

This document is a living document and will be updated as practices evolve.
