# CI/CD Pipeline Documentation

This directory contains the GitHub Actions workflows for the VarTex Learning Management System.

## 📋 Workflow Overview

### 1. **CI Pipeline** (`ci.yml`)

Runs on every push to `main`/`develop` branches and pull requests.

**Jobs:**

- **Test**: Runs linting, type checking, and tests with PostgreSQL
- **Build**: Builds the application and uploads artifacts
- **Security**: Runs security audits and vulnerability checks

### 2. **CD Pipeline** (`cd.yml`)

Deploys to production when CI passes on the `main` branch.

**Jobs:**

- **Deploy**: Deploys to production environment
- **Post-deploy**: Runs health checks and smoke tests

### 3. **Staging Pipeline** (`cd-staging.yml`)

Deploys to staging environment for testing.

**Jobs:**

- **Deploy-staging**: Deploys to staging environment
- **Staging-tests**: Runs tests against staging deployment

## 🔧 Required GitHub Secrets

### Production Environment

```bash
# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ENDPOINT_URL_S3=https://...

# Authentication
AUTH_GITHUB_CLIENT_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_secret

# Security
ARCJET_KEY=your_arcjet_key

# Email
RESEND_API_KEY=your_resend_api_key

# Vercel (if using Vercel)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Staging Environment

```bash
# Database
STAGING_DATABASE_URL=postgresql://...

# Stripe (test keys)
STAGING_STRIPE_SECRET_KEY=sk_test_...
STAGING_STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
STAGING_AWS_ENDPOINT_URL_S3=https://...

# Authentication
STAGING_AUTH_GITHUB_CLIENT_ID=your_staging_github_client_id
STAGING_AUTH_GITHUB_SECRET=your_staging_github_secret

# Security
STAGING_ARCJET_KEY=your_staging_arcjet_key

# Email
STAGING_RESEND_API_KEY=your_staging_resend_api_key
```

## 🚀 Deployment Platforms

### Vercel (Recommended for Next.js)

The workflows are configured for Vercel deployment by default. To use:

1. Connect your repository to Vercel
2. Add Vercel secrets to GitHub
3. Uncomment the Vercel deployment step

### Alternative Platforms

#### Railway

```yaml
- name: Deploy to Railway
  uses: railway/deploy@v1
  with:
    railway_token: ${{ secrets.RAILWAY_TOKEN }}
    service: ${{ secrets.RAILWAY_SERVICE }}
```

#### DigitalOcean App Platform

```yaml
- name: Deploy to DigitalOcean App Platform
  uses: digitalocean/app_action@main
  with:
    app_name: vartex
    token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
```

#### AWS (ECS/Fargate)

```yaml
- name: Deploy to AWS ECS
  uses: aws-actions/amazon-ecs-deploy-task-definition@v1
  with:
    task-definition: task-definition.json
    service: vartex-service
    cluster: vartex-cluster
    wait-for-service-stability: true
```

## 📊 Branch Strategy

```
main (production)
├── develop (staging)
├── feature/feature-name
└── hotfix/hotfix-name
```

- **`main`**: Production deployments
- **`develop`**: Staging deployments
- **`feature/*`**: Feature development
- **`hotfix/*`**: Emergency fixes

## 🔍 Monitoring & Notifications

### Health Checks

Add health check endpoints to your application:

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({ status: "healthy" });
  } catch (error) {
    return Response.json({ status: "unhealthy" }, { status: 500 });
  }
}
```

### Notifications

Configure notifications for deployment status:

#### Slack

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: "#deployments"
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### Discord

```yaml
- name: Notify Discord
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
```

## 🧪 Testing Strategy

### Unit Tests

```bash
pnpm test
```

### Integration Tests

```bash
pnpm test:integration
```

### E2E Tests

```bash
pnpm test:e2e
```

### Smoke Tests

```bash
pnpm test:smoke
```

## 🔒 Security Considerations

### Secrets Management

- Never commit secrets to the repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Use different secrets for staging/production

### Database Migrations

- Always run migrations in CI/CD
- Test migrations on staging first
- Have rollback strategies ready

### Environment Variables

- Validate environment variables in CI
- Use different values for each environment
- Document all required variables

## 📈 Performance Optimization

### Caching

- Cache pnpm store for faster installs
- Cache build artifacts
- Cache Docker layers (if using containers)

### Parallel Jobs

- Run independent jobs in parallel
- Use job dependencies for sequential steps
- Optimize job execution time

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**

   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is accessible

3. **Deployment Failures**
   - Check platform-specific logs
   - Verify environment variables
   - Check resource limits

### Debug Mode

Enable debug logging by setting:

```bash
ACTIONS_STEP_DEBUG=true
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vercel Documentation](https://vercel.com/docs)
