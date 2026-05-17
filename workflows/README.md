# Reusable Workflow Templates

This directory contains modular, reusable workflow templates that can be copied into any project to add compliance checking, accessibility auditing, security validation, and more.

> **Note**: The workflows use `npm ci --legacy-peer-deps` due to a known peer dependency conflict between Vite 7.x and @vitejs/plugin-react 4.x in the Magician Platform. When adapting these workflows for your own project, you may not need this flag if your dependencies are compatible.

## 📁 Available Workflows

### VR Compliance Workflows
- **`vr-compliance-check.yml`** - Validates VR enrollment, service records, and milestone tracking
- **`vr-reporting.yml`** - Generates compliance reports for VR agencies

### Accessibility Workflows
- **`accessibility-audit.yml`** - WCAG 2.1 AA compliance checking
- **`keyboard-navigation-test.yml`** - Automated keyboard accessibility testing

### Security Workflows
- **`security-audit.yml`** - Dependency scanning and security vulnerability checks
- **`secrets-scan.yml`** - Scan for exposed secrets and credentials

### Workforce Development Workflows
- **`workforce-compliance.yml`** - WIOA program compliance validation
- **`employment-outcomes.yml`** - Track and validate employment outcome data

### Database Workflows
- **`database-validation.yml`** - Schema validation and integrity checks
- **`migration-safety.yml`** - Safe database migration testing

## 🚀 Quick Start

### 1. Copy Workflow to Your Project

```bash
# Copy a workflow template to your .github/workflows directory
cp workflows/vr-compliance-check.yml .github/workflows/
```

### 2. Configure Environment Variables

Edit the workflow file and add your configuration:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  # Add other required environment variables
```

### 3. Customize Triggers

Adjust when the workflow runs:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
```

### 4. Commit and Push

```bash
git add .github/workflows/vr-compliance-check.yml
git commit -m "Add VR compliance checking workflow"
git push
```

## 📋 Workflow Categories

### Compliance Validation

These workflows ensure your application meets regulatory requirements:

- **VR Compliance** - 34 CFR Part 361 requirements
- **Workforce Compliance** - WIOA Title I standards
- **Accessibility Compliance** - WCAG 2.1 Level AA
- **Data Privacy** - GDPR/CCPA compliance checks

### Quality Assurance

Automated testing and validation workflows:

- **Code Quality** - Linting and type checking
- **Security Scanning** - Dependency and code vulnerability scans
- **Accessibility Testing** - Automated accessibility audits
- **Performance Testing** - Load and performance benchmarks

### Reporting

Generate compliance and audit reports:

- **VR Agency Reports** - Federal reporting requirements
- **Accessibility Reports** - VPAT and compliance documentation
- **Security Reports** - Vulnerability and dependency reports
- **Audit Trail Reports** - Complete audit log exports

## 🔧 Configuration Examples

### Basic VR Compliance Check

```yaml
name: VR Compliance Validation
on: [push, pull_request]

jobs:
  vr-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Validate VR schemas
        run: npm run validate:vr
        
      - name: Check regulation alignment
        run: npm run check:vr-regulations
```

### Advanced Accessibility Audit

```yaml
name: Accessibility Audit
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Run Pa11y accessibility tests
        run: npx pa11y-ci --sitemap https://example.com/sitemap.xml
        
      - name: Generate WCAG report
        run: npm run report:wcag
        
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-report
          path: reports/accessibility/
```

## 🎯 Integration Patterns

### Pattern 1: Standalone Workflows

Copy individual workflows for specific needs:

```bash
# Just VR compliance
cp workflows/vr-compliance-check.yml .github/workflows/

# Just accessibility
cp workflows/accessibility-audit.yml .github/workflows/
```

### Pattern 2: Composite Workflow

Create a master workflow that runs multiple checks:

```yaml
name: Compliance Suite
on: [push, pull_request]

jobs:
  vr-compliance:
    uses: ./.github/workflows/vr-compliance-check.yml
    
  accessibility:
    uses: ./.github/workflows/accessibility-audit.yml
    
  security:
    uses: ./.github/workflows/security-audit.yml
```

### Pattern 3: Conditional Execution

Run workflows based on file changes:

```yaml
on:
  push:
    paths:
      - 'server/services/vr*.ts'
      - 'shared/schema.ts'
      - 'client/src/components/vr4deaf/**'
```

## 📊 Reporting and Notifications

### Slack Notifications

Add Slack notifications to any workflow:

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Reports

Send email reports on completion:

```yaml
- name: Send compliance report
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.SMTP_USERNAME }}
    password: ${{ secrets.SMTP_PASSWORD }}
    subject: VR Compliance Report - ${{ github.repository }}
    to: compliance@agency.gov
    from: noreply@yourorg.com
    body: file://reports/vr-compliance.txt
    attachments: reports/vr-compliance.pdf
```

## 🔐 Security Best Practices

### Secrets Management

Always use GitHub Secrets for sensitive data:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

### Branch Protection

Configure branch protection rules to require workflows to pass:

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Require status checks to pass before merging
4. Select your compliance workflows

## 🧪 Testing Workflows Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run a workflow
act -j vr-compliance
```

## 📖 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Reusable Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)

## 🤝 Contributing

To add a new workflow template:

1. Create the workflow file in `workflows/`
2. Add comprehensive comments explaining each step
3. Include configuration examples in this README
4. Test the workflow thoroughly
5. Submit a pull request

## 📝 License

These workflow templates are part of the Magician Platform and are available under the MIT License.

---

**Need help?** Open an issue or check our [Integration Guide](../docs/integration-guide.html)
