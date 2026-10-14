# MERN E-Commerce Platform
Beginner starter: React + Vite frontend, Express/Node API, MongoDB/Mongoose product catalog, search, and browser shopping cart.

## Run backend
1. Install Node.js and MongoDB (or use MongoDB Atlas).
2. In PowerShell: `cd server`
3. `npm install`
4. Copy `.env.example` to `.env` and set `MONGODB_URI`.
5. `npm run dev`

## Run frontend (second terminal)
1. `cd client`
2. `npm install`
3. `npm run dev`
4. Open the Vite URL, usually http://localhost:5173.

API routes: GET `/api/health`, GET `/api/products?search=...`, POST `/api/products`.
POST is for learning only and is not protected. Authentication, orders, and payments are not implemented. Do not deploy without adding authorization and validation.
