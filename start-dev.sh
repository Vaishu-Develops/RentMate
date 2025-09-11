#!/bin/bash

echo "Starting RentMate Development Servers..."
echo

# Check if ports are available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "WARNING: Port 5000 is already in use!"
    echo "Please stop any running backend servers first."
    exit 1
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "WARNING: Port 3000 is already in use!"
    echo "Please stop any running frontend servers first."
    exit 1
fi

echo "Ports are available. Starting servers..."
echo

# Start backend in background
echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend in background
echo "Starting Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "Both servers are running:"
echo "Backend: http://localhost:5000 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait