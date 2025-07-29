# Running Frontend and Backend Separately

This guide shows you how to run the frontend and backend in separate terminals.

## Prerequisites

Make sure you have:

- Node.js installed
- MongoDB Atlas connection configured (already done)
- Dependencies installed in both folders

## Method 1: Using Separate Terminals

### Terminal 1 - Backend Server

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not done already)
npm install

# Start the backend server
npm run dev
```

The backend will run on: http://localhost:3001

### Terminal 2 - Frontend Development Server

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not done already)
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on: http://localhost:5173

## Method 2: Using npm Scripts from Root

### Terminal 1 - Backend Only

```bash
npm run dev:backend
```

### Terminal 2 - Frontend Only

```bash
npm run dev:frontend
```

## Verification

- Backend API health check: http://localhost:3001/api/health
- Frontend application: http://localhost:5173
- Backend API endpoints: http://localhost:3001/api/forms

## Notes

- Make sure the backend is running before using the frontend
- The frontend is configured to proxy API calls to localhost:3001
- Both servers support hot reload for development
- Use Ctrl+C to stop either server
