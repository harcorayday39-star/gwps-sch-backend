
GWPSS Backend - Production-ready
==================================

What this provides:
- Node.js + Express backend
- MongoDB (mongoose) models: User (admin/student), Exam, Config
- Routes: /api/auth, /api/students, /api/exams, /api/results, /api/config
- JWT-based auth for admin & student
- File upload support (multer) for receipts (stored in-memory / render-friendly)

Quick start (local):
  cp .env.example .env
  # edit .env and set MONGO_URI & JWT_SECRET
  npm install
  npm start

Deploy to Render:
  - Create new Web Service -> connect GitHub repo
  - Build command: npm install
  - Start command: npm start
  - Add environment variables:
     MONGO_URI  (your Atlas connection string)
     JWT_SECRET (a long random string)
