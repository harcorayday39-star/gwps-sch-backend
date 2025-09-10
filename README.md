
GWPSS Backend - Ready to deploy
==================================
This backend uses Node.js + Express + MongoDB (mongoose).

Quick start (local):
  cp .env.example .env
  # edit .env and set MONGO_URI & JWT_SECRET
  npm install
  npm start

Deploy to Render:
  - Create new Web Service -> connect GitHub repo
  - Root directory: leave blank (package.json at repo root)
  - Build command: npm install
  - Start command: npm start
  - Add environment variable MONGO_URI with your Atlas connection string
  - Add JWT_SECRET

Postman collection included in /postman to help testing endpoints.
