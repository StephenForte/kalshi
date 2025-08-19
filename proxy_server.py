#!/usr/bin/env python3
"""
Proxy server for the Kalshi Market Viewer.
This server acts as a proxy to fetch data from the Kalshi API and serve it to the frontend,
bypassing CORS restrictions.
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import os
import sys
from urllib.error import URLError, HTTPError

PORT = 8002
KALSHI_API_BASE = "https://api.elections.kalshi.com/v1"

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with proxy support for Kalshi API."""
    
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
    
    def do_GET(self):
        """Handle GET requests, including API proxy."""
        # Check if this is an API request
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            # Serve static files normally
            super().do_GET()
    
    def handle_api_request(self):
        """Handle API proxy requests to Kalshi."""
        try:
            # Remove /api prefix and construct the full Kalshi URL
            api_path = self.path[4:]  # Remove '/api'
            kalshi_url = f"{KALSHI_API_BASE}{api_path}"
            
            print(f"📡 Proxying request to: {kalshi_url}")
            
            # Make request to Kalshi API
            with urllib.request.urlopen(kalshi_url) as response:
                data = response.read()
                content_type = response.headers.get('Content-Type', 'application/json')
                
                # Send successful response
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.end_headers()
                self.wfile.write(data)
                
                print(f"✅ Successfully proxied {len(data)} bytes")
                
        except HTTPError as e:
            print(f"❌ HTTP Error {e.code}: {e.reason}")
            self.send_error(e.code, f"Kalshi API Error: {e.reason}")
        except URLError as e:
            print(f"❌ URL Error: {e.reason}")
            self.send_error(500, f"Connection Error: {e.reason}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            self.send_error(500, f"Server Error: {str(e)}")

def main():
    """Start the proxy server."""
    # Change to the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("🚀 Starting Kalshi Market Viewer Proxy Server...")
    print(f"📁 Serving from: {script_dir}")
    print(f"🌐 Server URL: http://localhost:{PORT}")
    print(f"🔗 API Proxy: /api/* -> {KALSHI_API_BASE}/*")
    print("🔧 CORS headers enabled")
    print("")
    
    try:
        with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
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
            print(f"💡 Try stopping existing servers: pkill -f 'python3'")
            sys.exit(1)
        else:
            print(f"❌ Error starting server: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()

