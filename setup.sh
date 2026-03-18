#!/bin/bash

echo ""
echo "============================================"
echo "  HR Workflow Platform - Mac/Linux Setup"
echo "============================================"
echo ""

# ── Step 1: Check Node.js is installed ──────────────────────────
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "Please install it from: https://nodejs.org"
    echo "Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi
echo "[OK] Node.js found: $(node --version)"

# ── Step 2: Install root dependencies ───────────────────────────
echo ""
echo "[1/4] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then echo "[ERROR] Root install failed."; exit 1; fi

# ── Step 3: Install server dependencies ─────────────────────────
echo ""
echo "[2/4] Installing server dependencies..."
cd server && npm install
if [ $? -ne 0 ]; then echo "[ERROR] Server install failed."; cd ..; exit 1; fi
cd ..

# ── Step 4: Install client dependencies ─────────────────────────
echo ""
echo "[3/4] Installing client dependencies..."
cd client && npm install
if [ $? -ne 0 ]; then echo "[ERROR] Client install failed."; cd ..; exit 1; fi
cd ..

# ── Step 5: Copy .env if missing ────────────────────────────────
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "[OK] Created server/.env from template."
    echo ""
    echo "[IMPORTANT] Edit server/.env and set your MONGO_URI if needed."
    echo "Default is: mongodb://localhost:27017/hr_workflow"
fi

# ── Step 6: Seed the database ────────────────────────────────────
echo ""
echo "[4/4] Seeding database with demo data..."
node server/config/seed.js
if [ $? -ne 0 ]; then
    echo ""
    echo "[WARNING] Seeding failed. Make sure MongoDB is running."
    echo "You can seed later with:  node server/config/seed.js"
fi

# ── Start ────────────────────────────────────────────────────────
echo ""
echo "============================================"
echo "  Setup complete! Starting the app..."
echo "============================================"
echo ""
echo "  Frontend  ->  http://localhost:5173"
echo "  Backend   ->  http://localhost:5000"
echo ""
echo "  Admin login:    admin@company.com    / admin123"
echo "  Employee login: employee@company.com / emp123"
echo ""
echo "  Press Ctrl+C to stop."
echo ""

npm run dev
