# Demo Setup Guide (No Docker)

Since you are demoing on a different laptop without Docker, follow these steps to get everything running with a single command.

## Prerequisites

1.  **Node.js (v18 or higher)**: [Download here](https://nodejs.org/)
2.  **PostgreSQL**: [Download here](https://www.postgresql.org/download/windows/)
    *   During installation, set the password to `password` (to match the `.env` file).
    *   Once installed, open **pgAdmin 4** or **psql** and create a database named `hajo_dev`.

## One-Command Start

1.  Open a terminal (Command Prompt or PowerShell) in the project root folder.
2.  Run the following command:
    ```cmd
    .\setup_and_run.bat
    ```

### What this script does:
- Installs all necessary dependencies for both Backend and Frontend.
- Syncs the database schema using Prisma.
- **Seeds the demo data**: Creates 30 artisans across different categories (Plumbing, Electrical, etc.) and a pre-configured negotiation demo.
- Starts the **Backend** (port 3001) in a separate window.
- Starts the **Frontend** (port 3000) in the current window.

## Important Demo URLs
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

## Troubleshooting
- **Database Connection Error**: Ensure PostgreSQL is running and the `DATABASE_URL` in `backend/.env` matches your local Postgres credentials (User: `postgres`, Password: `password`, Port: `5432`).
- **Port Conflict**: Ensure no other services are running on ports 3000 or 3001.
