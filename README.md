# Medi Consult: Multi-Agent Swarm Integrated Diagnostic & Management System

## Project Structure
- `backend/`: Node.js Express server with MongoDB
- `frontend/`: React + Vite + Tailwind CSS

## Prerequisites
- Node.js installed
- MongoDB installed and running locally

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file (already provided)
4. `npm run seed` (to seed initial admin and doctor data)
5. `npm run dev` (starts on port 5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (starts on port 5173)

## Login Credentials
- **Admin**: ADM1001 / Admin@123
- **Doctor**: DOC1001 / Password@123
- **Patient**: Register a new account or use seeded PAT1001 (if added to seed)

## Features
- Unified Login with Auto-Role Detection
- Role-based Dashboards (Patient, Doctor, Admin)
- AI Report Analysis (Mocked API)
- Emergency QR Health Card
- OP Token System UI
- Responsive Medical Theme
