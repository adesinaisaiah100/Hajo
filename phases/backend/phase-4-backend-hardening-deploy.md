# Backend Phase 4 - Hardening & Deploy

**Phase reference:** Backend Phase 4
**Scope:** Health checks, logging, deployment readiness, security reviews, monitoring and runbooks.

## Goal
Harden the backend for demo and initial production: health endpoints, improved logging, observability, and deploy automation.

## Deliverables
- `backend/src/app.js` — health endpoint (`/health`)
- `backend/src/utils/logger.js` — structured logs
- `backend/Dockerfile` or Render/Vercel deploy scripts
- CI: run `prisma migrate deploy` and DB migrations in deploy flow
- `backend/src/monitoring/` — basic alerts and metrics (optional)

## Important snippets

### Health endpoint (app.js)
```js
app.get('/health', (req, res) => res.status(200).json({ success: true, uptime: process.uptime() }));
```

### Structured logger
```js
const logger = winston.createLogger({ level: 'info', format: winston.format.json(), transports: [new winston.transports.Console()] });
```

## Verification checklist
- `/health` returns 200 on deployed instance
- Migrations run in CI/CD step
- Logs are structured and searchable in console
- Webhook delivery failures are logged and retriable

## Docker Deployment

**Goal:** Enable developers and end-users to run Hajo backend in a containerized environment locally or in production.

### Files Created

- `backend/Dockerfile` — Multi-stage build for Express + Node.js
- `docker-compose.yml` — Full-stack orchestration (backend + frontend + postgres)
- `.env.docker` — Environment template for Docker containers
- `docs/docker-deployment-guide.md` — Comprehensive Docker runbook

### Docker Strategy

**For Local Development:**

Developers run the full stack using docker-compose without manual database setup or dependency conflicts:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (Supabase replica for local testing)
- Express backend (port 3001) with hot-reload on `src/` changes
- Next.js frontend (port 3000) with hot-reload
- Automatic health checks and service dependencies

**For Production Deployment:**

Backend image is built as a standalone artifact that can be:
- Pushed to a container registry (Docker Hub, Azure ACR, etc.)
- Deployed to Kubernetes, Docker Swarm, or other orchestrators
- Run on any machine with Docker installed

### Important snippets

### Multi-stage Dockerfile
```dockerfile
# Stage 1: Build with dev dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
COPY prisma ./prisma
RUN npx prisma generate

# Stage 2: Runtime with prod deps only
FROM node:20-alpine
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
HEALTHCHECK --interval=10s CMD curl -f http://localhost:3001/health
CMD ["node", "src/app.js"]
```

### docker-compose.yml (Backend service)
```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  environment:
    DATABASE_URL: postgresql://postgres:password@postgres:5432/hajo_dev
    SQUAD_API_KEY: ${SQUAD_API_KEY}
    ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    TERMII_API_KEY: ${TERMII_API_KEY}
  ports:
    - "3001:3001"
  depends_on:
    postgres:
      condition: service_healthy
  volumes:
    - ./backend/src:/app/src  # Hot-reload
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
    interval: 10s
    retries: 5
```

### Quick Reference

**Start local stack:**
```bash
cp .env.docker .env
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f backend
```

**Run migrations:**
```bash
docker-compose exec backend npx prisma migrate deploy
```

**Access backend:**
```bash
curl http://localhost:3001/health
```

See `docs/docker-deployment-guide.md` for comprehensive Docker documentation, including troubleshooting, production deployment, and multi-environment setup.

## Verification checklist
- `/health` returns 200 on deployed instance
- Migrations run in CI/CD step
- Logs are structured and searchable in console
- Webhook delivery failures are logged and retriable
- Backend service starts in docker-compose and responds to health check
- Volumes mount correctly for hot-reload in development
- Production image builds without errors and runs standalone

## Risks & follow-ups
- Add tracing (OpenTelemetry) if time permits
- Add Sentry or similar for error capturing
- Monitor container resource usage (memory, CPU) in production
- Set up image registry and CI/CD pipeline for automatic image builds and pushes
