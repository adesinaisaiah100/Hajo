# Frontend Phase 4 - Polish, Accessibility & Deploy

**Phase reference:** Frontend Phase 4
**Scope:** Visual polish, accessibility, responsive tweaks, performance improvements, deploy readiness and final QA.

## Goal
Ensure the frontend is visually polished, accessible, and stable for deployment and demo.

## Deliverables
- `app/(provider)/score/page.tsx` — score detail UI
- `app/(provider)/insights/page.tsx` — AI insights UI
- `app/(provider)/settings/page.tsx` — settings screens
- Finalized `src/components/ui/*` with accessible primitives
- Tailwind configuration with brand tokens and animations
- Lighthouse performance and accessibility checks

## Important snippets

### Focus ring standard (global CSS)
```css
:focus { outline: none; box-shadow: 0 0 0 3px rgba(20,184,166,0.15); }
```

## Verification checklist
- Axe/Lighthouse accessibility score acceptable (>90 where possible)
- Responsive checks at common device sizes
- Visual polish consistent across route groups
- Deployment preview on Vercel matches local build

## Docker Deployment

**Goal:** Enable developers and end-users to run Hajo frontend in a containerized environment alongside the backend.

### Files Created

- `frontend/Dockerfile` — Multi-stage build for Next.js (optimization for production)
- `docker-compose.yml` — Full-stack orchestration (frontend + backend + postgres)
- `.env.docker` — Environment template for Docker containers
- `docs/docker-deployment-guide.md` — Comprehensive Docker runbook

### Docker Strategy

**For Local Development:**

Developers run the full stack using docker-compose without environment setup conflicts:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (Supabase replica for local testing)
- Express backend (port 3001) with hot-reload
- Next.js frontend (port 3000) with hot-reload on `app/` and `src/` changes

The frontend automatically connects to the backend at `http://localhost:3001` via `NEXT_PUBLIC_API_URL` environment variable.

**For Production Deployment:**

Frontend image is built as an optimized static+SSR artifact that can be:
- Pushed to a container registry
- Deployed to Kubernetes or container platforms
- Run on any machine with Docker installed
- Served behind a reverse proxy (nginx, Cloudflare, etc.)

### Important snippets

### Multi-stage Dockerfile for Next.js
```dockerfile
# Stage 1: Build with dev dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json next.config.ts postcss.config.mjs ./
RUN npm ci
COPY app ./app
COPY src ./src
COPY public ./public
RUN npm run build

# Stage 2: Runtime with prod deps only
FROM node:20-alpine
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
HEALTHCHECK --interval=10s CMD curl -f http://localhost:3000/
CMD ["npm", "start"]
```

### docker-compose.yml (Frontend service)
```yaml
frontend:
  build:
    context: ./
    dockerfile: frontend/Dockerfile
  environment:
    NODE_ENV: development
    NEXT_PUBLIC_API_URL: http://localhost:3001
  ports:
    - "3000:3000"
  depends_on:
    backend:
      condition: service_healthy
  volumes:
    - ./app:/app/app        # Hot-reload
    - ./src:/app/src        # Hot-reload
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/"]
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
docker-compose logs -f frontend
```

**Access frontend:**
```bash
# Browser: http://localhost:3000
curl http://localhost:3000
```

**Build production image:**
```bash
docker build -f frontend/Dockerfile -t hajo-frontend:latest .
```

See `docs/docker-deployment-guide.md` for comprehensive Docker documentation, including troubleshooting, production deployment, and multi-environment setup.

## Verification checklist
- Axe/Lighthouse accessibility score acceptable (>90 where possible)
- Responsive checks at common device sizes
- Visual polish consistent across route groups
- Deployment preview on Vercel matches local build
- Frontend service starts in docker-compose and responds to health check
- Environment variables are correctly injected from docker-compose.yml
- Hot-reload works for `app/` and `src/` directory changes
- Production build completes without errors and optimizes assets

## Risks & follow-ups
- Address any color-contrast violations before demo day
- Audit keyboard navigation across modals and drawers
- Monitor frontend bundle size in production image builds
- Set up automated image builds and pushes to registry via CI/CD
