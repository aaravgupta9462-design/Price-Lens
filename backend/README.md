# PriceLens Backend Service

Production-ready REST API backend service for PriceLens platform built with Node.js, Express, PostgreSQL, and Prisma.

## Setup & Running

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in local configuration:
   ```bash
   cp .env.example .env
   ```

3. **Prisma Generation**:
   ```bash
   npm run prisma:generate
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Endpoints

- **Health Check**: `GET http://localhost:5000/health`
- **API v1 Root**: `GET http://localhost:5000/v1`
- **Auth API Route**: `GET http://localhost:5000/v1/auth/status`
