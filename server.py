#!/usr/bin/env python3
"""
Simple HTTP server with CORS support for the Kalshi Market Viewer.
This server adds the necessary CORS headers to allow API calls to work.
"""

import http.server
import socketserver
import os
import sys

PORT = 8002

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS support."""
    
    def end_headers(self):
        """Add CORS headers to all responses."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight requests."""
        self.send_response(200)
        self.end_headers()

def main():
    """Start the HTTP server."""
    # Change to the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("🚀 Starting Kalshi Market Viewer Server...")
    print(f"📁 Serving from: {script_dir}")
    print(f"🌐 Server URL: http://localhost:{PORT}")
    print("🔧 CORS headers enabled for API calls")
    print("")
    
    try:
        with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
            print(f"✅ Server started successfully!")
            print(f"📱 Open your browser and go to: http://localhost:{PORT}")
            print(f"🛑 To stop the server, press Ctrl+C")
            print("")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user.")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} is already in use.")
            print(f"💡 Try using a different port or stop the existing server.")
            sys.exit(1)
        else:
            print(f"❌ Error starting server: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()

