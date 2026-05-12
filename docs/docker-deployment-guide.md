# Docker Deployment Guide

This guide explains how to run Hajo (frontend + backend + database) locally using Docker and docker-compose.

## Quick Start

### Prerequisites
- Docker (version 20+)
- docker-compose (version 2+)
- Git

### 1. Environment Setup

Copy the environment template and populate with your API keys:

```bash
cp .env.docker .env
```

Edit `.env` with your actual values for:
- `SQUAD_API_KEY` — Financial transaction API
- `ANTHROPIC_API_KEY` — Claude AI provider
- `TERMII_API_KEY` — SMS/OTP provider
- `SUPABASE_URL` and `SUPABASE_KEY` — Database credentials

### 2. Start the Full Stack

```bash
# Start all services (postgres, backend, frontend)
docker-compose up -d

# Follow logs in real-time
docker-compose logs -f

# Check service status
docker-compose ps
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432 (postgres / password)
- **Health check:** http://localhost:3001/health

### 4. Database Migrations

Migrations run automatically when the backend service starts. To manually trigger:

```bash
docker-compose exec backend npx prisma migrate deploy
```

To create a new migration after schema changes:

```bash
docker-compose exec backend npx prisma migrate dev --name "your_migration_name"
```

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Run Commands Inside Containers

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec postgres psql -U postgres -d hajo_dev
```

### Restart Services

```bash
# Restart a single service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend
```

### Stop and Clean Up

```bash
# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes database)
docker-compose down -v
```

## Development Workflow

### Hot Reload

The docker-compose configuration includes volume mounts for hot-reload:

- **Backend:** `./backend/src` is mounted — changes auto-reload with nodemon
- **Frontend:** `./app` and `./src` are mounted — changes auto-reload with Next.js dev server

Edit your code locally and changes will reflect in the running containers.

### Adding New Dependencies

```bash
# Backend
docker-compose exec backend npm install package-name
# Commit the updated package-lock.json

# Frontend
docker-compose exec frontend npm install package-name
# Commit the updated package-lock.json
```

## Troubleshooting

### Service Fails to Start

```bash
# Check service logs
docker-compose logs backend

# Rebuild the image
docker-compose up --build backend
```

### Database Connection Error

```bash
# Ensure postgres is healthy
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Port Already in Use

If a port (3000, 3001, 5432) is already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "3001:3001"  # Change first number to unused port, e.g., "3002:3001"
```

Then restart:

```bash
docker-compose up -d --build
```

### Out of Disk Space

Docker volumes can accumulate over time. Clean up:

```bash
# Remove unused volumes
docker volume prune

# Remove all images (WARNING: deletes all local images)
docker image prune -a
```

## Production Deployment

### Building Production Images

```bash
# Build images for production
docker-compose -f docker-compose.yml build

# Tag images for registry
docker tag hajo-backend:latest myregistry.azurecr.io/hajo-backend:latest
docker tag hajo-frontend:latest myregistry.azurecr.io/hajo-frontend:latest
```

### Pushing to a Registry

```bash
# Login to registry (e.g., Azure Container Registry)
docker login myregistry.azurecr.io

# Push images
docker push myregistry.azurecr.io/hajo-backend:latest
docker push myregistry.azurecr.io/hajo-frontend:latest
```

### Running in Production

Create a production docker-compose file with:
- External Supabase/managed database (not local postgres)
- Environment variables from secrets management
- Proper resource limits (memory, CPU)
- Logging to centralized service (e.g., CloudWatch, DataDog)

Example structure:

```yaml
services:
  backend:
    image: myregistry.azurecr.io/hajo-backend:latest
    environment:
      DATABASE_URL: ${DATABASE_URL}  # From secrets
      SQUAD_API_KEY: ${SQUAD_API_KEY}  # From secrets
    resources:
      limits:
        memory: 512M
        cpus: 0.5
    restart: always
```

## Health Checks & Monitoring

### Service Health

All services include health checks:

```bash
# Check status
docker-compose ps

# Manual health test
curl http://localhost:3001/health
```

### View Resource Usage

```bash
# Real-time monitoring
docker stats

# Specific container
docker stats hajo-backend
```

## Next Steps

- **Local Development:** Use `docker-compose up` for isolated, reproducible development
- **CI/CD Integration:** Use these Dockerfiles in GitHub Actions, GitLab CI, or similar
- **Kubernetes Deployment:** Generate Kubernetes manifests from docker-compose (e.g., using Kompose)
- **Multi-Environment Setup:** Create separate docker-compose files for staging, QA, and production

---

For questions or issues, refer to [System Design](../System_design_nextjs.md) and the phase documentation in [phases/](../phases/README.md).
