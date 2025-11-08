#!/bin/bash

# Run frontend and backend concurrently

# Start backend
cd backend
npm run start &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID
