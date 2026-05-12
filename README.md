# Hajo

A peer-to-peer credit matching and financial coordination platform built with Next.js, Express, and Supabase.

## Quick Start with Docker (Recommended)

The easiest way to run Hajo locally is with Docker and docker-compose:

```bash
# Copy environment template and populate with your API keys
cp .env.docker .env

# Start the full stack (frontend + backend + database)
docker-compose up -d

# View logs
docker-compose logs -f
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

**Backend API:** [http://localhost:3001](http://localhost:3001)

See [docs/docker-deployment-guide.md](docs/docker-deployment-guide.md) for comprehensive Docker documentation, troubleshooting, and production deployment.

## Manual Setup (Without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
# Backend runs on http://localhost:3001
```

### Frontend Setup

```bash
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

Edit [app/page.tsx](app/page.tsx) to see changes reflected in real-time.

## Documentation

- **[System Design](System_design_nextjs.md)** — Architecture, tech stack, and system overview
- **[Docker Deployment Guide](docs/docker-deployment-guide.md)** — Local dev, troubleshooting, production deployment
- **[Design System](docs/design.md)** — UI/UX specifications, component anatomy, tailwind tokens
- **[Phase Documentation](phases/README.md)** — Development phases, implementation roadmap
- **[Agent Workflow Rules](AGENTS.md)** — Phase-based development discipline and best practices

## Project Structure

```
app/                 # Next.js frontend (App Router)
backend/             # Express API server
prisma/              # Database schema and migrations
docs/                # Documentation
phases/              # Development phases (backend/ and frontend/)
public/              # Static assets
```

## Environment Variables

Copy `.env.example` to `.env` and populate with your credentials:

```bash
cp .env.example .env
```

Required API keys:
- `SQUAD_API_KEY` — Financial transaction provider
- `ANTHROPIC_API_KEY` — Claude AI for provider matching
- `TERMII_API_KEY` — SMS/OTP provider
- `SUPABASE_URL` and `SUPABASE_KEY` — Database credentials

## Development Workflow

### Code Standards

Before committing, run linting:

```bash
npm run lint
```

### Database Migrations

After schema changes:

```bash
npx prisma migrate dev --name "your_migration_name"
```

### Testing

Backend API tests run from TypeScript files in `backend/tests/`:

```bash
node backend/tests/your-test.ts
```

## Deployment

### Frontend
- **Vercel** (recommended) — Auto-deploy from git
- **Docker** — See docker-compose.yml or frontend/Dockerfile

### Backend
- **Render** (recommended) — Postgres + Express
- **Docker** — See backend/Dockerfile

See [phases/backend/phase-4-backend-hardening-deploy.md](phases/backend/phase-4-backend-hardening-deploy.md) and [phases/frontend/phase-4-frontend-polish-deploy.md](phases/frontend/phase-4-frontend-polish-deploy.md) for deployment details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## Contributing

Follow the phase-based workflow documented in [AGENTS.md](AGENTS.md):
1. Read the relevant phase doc before implementing
2. Follow design discipline and testing requirements
3. Run lint and tests after each feature
4. Commit per phase with clear messages

