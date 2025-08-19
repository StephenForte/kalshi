#!/bin/bash

echo "🚀 Starting Kalshi Market Viewer..."
echo "📁 Current directory: $(pwd)"
echo "🌐 Server will be available at: http://localhost:8002"
echo ""

# Check if port 8002 is already in use
if lsof -Pi :8002 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8002 is already in use. Stopping existing server..."
    pkill -f "python3 -c"
    sleep 2
fi

echo "🔧 Starting Python HTTP server with CORS support..."

# Start server with CORS headers
python3 -c "
import http.server
import socketserver
import os

PORT = 8002
os.chdir('$(pwd)')

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

with socketserver.TCPServer(('', PORT), CORSHTTPRequestHandler) as httpd:
    print(f'✅ Server started successfully!')
    print(f'📱 Open your browser and go to: http://localhost:{PORT}')
    print(f'🛑 To stop the server, press Ctrl+C')
    httpd.serve_forever()
" &

SERVER_PID=$!

echo ""
echo "✅ Server started successfully!"
echo "📱 Open your browser and go to:"
echo "   http://localhost:8002"
echo ""
echo "🛑 To stop the server, press Ctrl+C or run: kill $SERVER_PID"
echo ""

# Wait for user input to keep the script running
read -p "Press Enter to stop the server..."
kill $SERVER_PID 2>/dev/null
echo "🛑 Server stopped."
