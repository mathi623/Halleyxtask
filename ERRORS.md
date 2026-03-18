# Troubleshooting — Common Errors & Fixes

---

## ❌ Error: `npm: command not found` / `node: command not found`

**Cause:** Node.js is not installed.

**Fix:**
1. Go to https://nodejs.org
2. Download and install the **LTS** version
3. Restart your terminal / VS Code
4. Run `node --version` — it should print a version number

---

## ❌ Error: `Cannot find module 'concurrently'`

**Cause:** Root dependencies not installed yet.

**Fix — run this from the project ROOT folder:**
```bash
npm install
```

---

## ❌ Error: `MongooseServerSelectionError` or `ECONNREFUSED 127.0.0.1:27017`

**Cause:** MongoDB is not running on your machine.

**Fix Option A — Install & run MongoDB locally:**
1. Download from https://www.mongodb.com/try/download/community
2. Install it
3. Start it: `mongod` (Mac/Linux) or it runs as a Windows service automatically

**Fix Option B — Use MongoDB Atlas (free cloud database, recommended):**
1. Go to https://cloud.mongodb.com
2. Create a free account → Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string (looks like `mongodb+srv://...`)
5. Open `server/.env` and replace the `MONGO_URI` line:
   ```
   MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/hr_workflow
   ```
6. Re-run the seeder: `node server/config/seed.js`

---

## ❌ Error: `ENOENT: no such file or directory, open 'server/.env'`

**Cause:** The `.env` file is missing.

**Fix:**
```bash
cd server
cp .env.example .env
cd ..
```

---

## ❌ Error: `Port 5000 is already in use`

**Cause:** Something else is already running on port 5000.

**Fix:** Change the port in `server/.env`:
```
PORT=5001
```
Then also update `client/vite.config.js` proxy target:
```js
proxy: {
  '/api': { target: 'http://localhost:5001' }
}
```

---

## ❌ Error: `Port 5173 is already in use`

**Cause:** Another Vite dev server is already running.

**Fix Option A:** Stop the other process (Ctrl+C in the terminal running it).

**Fix Option B:** Change the client port in `client/vite.config.js`:
```js
server: {
  port: 5174,
  ...
}
```

---

## ❌ Error: `nodemon: command not found`

**Cause:** nodemon is not installed in the server folder.

**Fix:**
```bash
cd server
npm install
cd ..
```

---

## ❌ Error: `Cannot find module 'express'` or `'mongoose'`

**Cause:** Server dependencies not installed.

**Fix:**
```bash
cd server
npm install
cd ..
```

---

## ❌ Error: `Failed to resolve import "react"` or Tailwind not working

**Cause:** Client dependencies not installed.

**Fix:**
```bash
cd client
npm install
cd ..
```

---

## ❌ Error: `SyntaxError: Cannot use import statement in a module` (server)

**Cause:** Server files use `require()` (CommonJS) — this is correct and expected.
If you see this, you may have accidentally renamed a server file to `.mjs`.

**Fix:** Make sure all server files use `.js` extension and `require()` syntax, not `import`.

---

## ❌ Blank white screen when opening localhost:5173

**Cause:** Usually a JavaScript error in the console.

**Fix:**
1. Open the browser DevTools (F12)
2. Click the **Console** tab
3. Read the red error message
4. Most common cause: the backend is not running.
   Make sure `npm run dev` started BOTH servers (you should see two startup messages).

---

## ❌ Login says "Invalid email or password" even with correct credentials

**Cause:** Database not seeded yet.

**Fix:** Run the seeder:
```bash
node server/config/seed.js
```

Then try:
- Admin: `admin@company.com` / `admin123`
- Employee: `employee@company.com` / `emp123`

---

## ✅ Clean reinstall (nuclear option — fixes almost everything)

If nothing else works, delete all `node_modules` and reinstall everything:

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules, server/node_modules, client/node_modules
npm run install:all
```

**Mac/Linux:**
```bash
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

---

## How to run the project (step by step)

```bash
# 1. Open the hr-workflow-platform folder in VS Code

# 2. Open the terminal (Ctrl + `)

# 3. Install everything (one time only)
npm run install:all

# 4. Copy the env file (one time only)
cd server && cp .env.example .env && cd ..

# 5. Fill your MongoDB URI in server/.env (if using Atlas)

# 6. Seed the database (one time only)
node server/config/seed.js

# 7. Start the app
npm run dev

# 8. Open your browser to http://localhost:5173
```
