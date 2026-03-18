@echo off
echo.
echo ============================================
echo   HR Workflow Platform - Windows Setup
echo ============================================
echo.

REM ── Step 1: Check Node.js is installed ──────────────────────────
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed.
    echo Please download it from: https://nodejs.org
    echo Install the LTS version, then re-run this file.
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node --version

REM ── Step 2: Install root dependencies (concurrently) ────────────
echo.
echo [1/4] Installing root dependencies...
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Root npm install failed.
    pause
    exit /b 1
)

REM ── Step 3: Install server dependencies ─────────────────────────
echo.
echo [2/4] Installing server dependencies (Express, Mongoose, etc)...
cd server
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Server npm install failed.
    cd ..
    pause
    exit /b 1
)
cd ..

REM ── Step 4: Install client dependencies ─────────────────────────
echo.
echo [3/4] Installing client dependencies (React, Vite, Tailwind)...
cd client
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Client npm install failed.
    cd ..
    pause
    exit /b 1
)
cd ..

REM ── Step 5: Copy .env if it doesn't exist ───────────────────────
if not exist "server\.env" (
    copy "server\.env.example" "server\.env"
    echo [OK] Created server/.env from example template.
    echo.
    echo [IMPORTANT] Open server/.env and set your MONGO_URI if needed.
    echo Default is: mongodb://localhost:27017/hr_workflow
)

REM ── Step 6: Seed the database ────────────────────────────────────
echo.
echo [4/4] Seeding database with demo data...
node server/config/seed.js
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] Database seeding failed.
    echo Make sure MongoDB is running on localhost:27017
    echo Or update MONGO_URI in server/.env with your MongoDB Atlas connection string.
    echo.
    echo You can seed later by running:  node server/config/seed.js
)

REM ── Done ─────────────────────────────────────────────────────────
echo.
echo ============================================
echo   Setup complete! Starting the app...
echo ============================================
echo.
echo   Frontend  -^>  http://localhost:5173
echo   Backend   -^>  http://localhost:5000
echo.
echo   Admin login:    admin@company.com    / admin123
echo   Employee login: employee@company.com / emp123
echo.
echo   Press Ctrl+C to stop the servers.
echo.

npm run dev
pause
