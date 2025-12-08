#!/bin/bash

echo "========================================"
echo "NXGEN Documentation Admin Panel"
echo "========================================"
echo ""
echo "Starting services..."
echo ""

# Start Decap Server in background
echo "[1/2] Starting Decap Server (local backend)..."
npx decap-server &
DECAP_PID=$!

# Wait a bit for decap-server to start
sleep 3

# Start Docusaurus
echo "[2/2] Starting Docusaurus development server..."
npm start &
DOCUSAURUS_PID=$!

echo ""
echo "========================================"
echo "Services started!"
echo "========================================"
echo ""
echo "Admin Panel will be available at:"
echo "http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $DECAP_PID $DOCUSAURUS_PID
