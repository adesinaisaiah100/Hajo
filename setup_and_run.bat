@echo off
setlocal

echo ==========================================
echo    Hajo Project Setup & Start Script
echo ==========================================

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js (v18+) to run this project.
    pause
    exit /b 1
)

:: Check for PostgreSQL
:: We try to see if pg_isready or psql exists to warn the user
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL (psql) not found in PATH. 
    echo Ensure PostgreSQL is running on localhost:5432 and the database 'hajo_dev' exists.
    echo.
)

:: Install Backend Dependencies
echo [1/4] Installing backend dependencies...
cd backend
call npm install --silent
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies.
    pause
    exit /b 1
)

:: Setup Database
echo [2/4] Setting up database with Prisma...
echo This will migrate the schema and seed the demo data.
call npx prisma migrate dev --name init
call npm run prisma:generate
echo Running comprehensive demo seed...
node src/db/seeds/comprehensive-demo.seed.js
node src/db/seeds/demo-quotation.seed.js

:: Install Frontend Dependencies
echo [3/4] Installing frontend dependencies...
cd ../frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies.
    pause
    exit /b 1
)

:: Start Both Services
echo [4/4] Starting Hajo Services...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Use Ctrl+C to stop the services.

:: Start backend in a new window
start "Hajo Backend" cmd /c "cd ../backend && npm run dev"

:: Start frontend in this window (keep it open)
npm run dev

pause
