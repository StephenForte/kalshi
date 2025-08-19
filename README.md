# Kalshi Market Viewer

A modern, responsive web application that displays real-time market information from Kalshi.com via their public REST API.

## Features

- **Real-time Market Data**: Fetches live market information from Kalshi's elections API
- **Volume-based Sorting**: Markets are automatically sorted by trading volume (highest first)
- **Pagination**: Navigate through markets 25 at a time with Previous/Next buttons
- **Market Details**: View market name, category, volume, status, and current odds
- **Thumbnail Support**: Displays market thumbnails when available from the API
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Auto-refresh**: Manual refresh button to get the latest data
- **Modern UI**: Beautiful gradient design with smooth animations and hover effects

## What's Displayed

For each market, the application shows:

- **Market Title**: The name of the prediction market
- **Category**: The market category (Politics, Economics, World, etc.)
- **Volume**: Total dollar volume traded (color-coded: green for high, yellow for medium, red for low)
- **Status**: Current market status (Active, Closed, Finalized)
- **Current Odds**: Yes Bid, Yes Ask, and Last Price in cents
- **Thumbnail**: Market image if available, otherwise category-based icon

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Running the Application

**⚠️ Important**: Due to CORS (Cross-Origin Resource Sharing) restrictions, you **must** run this application through a local web server. Opening the HTML file directly in a browser will result in a CORS error.

#### Option 1: Quick Start (Recommended)
```bash
# Run the CORS-enabled server
python3 server.py

# Then open http://localhost:8002 in your browser
```

#### Option 2: Using the startup script
```bash
# Run the startup script
./start.sh

# Then open http://localhost:8002 in your browser
```

#### Option 3: Manual Server Setup (Basic)
```bash
# Using Python 3 (Note: This won't solve CORS issues)
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

#### Option 4: Using npm (if you have Node.js installed)
```bash
npm install
npm run serve
```

**Note**: Simply double-clicking `index.html` will not work due to browser security restrictions when making API calls.

## API Information

The application fetches data from Kalshi's public elections API:
- **Original Endpoint**: `https://api.elections.kalshi.com/v1/events/`
- **CORS Solution**: Uses a public CORS proxy service (allorigins.win) to bypass browser restrictions
- **Data**: Real-time market data including volume, odds, and status
- **Rate Limits**: Subject to both Kalshi API and CORS proxy service limits

### CORS Issue and Solution

The Kalshi API does not allow direct browser requests due to CORS (Cross-Origin Resource Sharing) restrictions. This is a common security measure for APIs. The current solution uses a public CORS proxy service as a workaround.

**For Production Use**: Implement your own backend server that:
1. Fetches data from Kalshi API server-side
2. Serves the data to your frontend
3. Adds proper CORS headers
4. Handles rate limiting and caching

## Technical Details

### Architecture
- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **API**: RESTful API calls using Fetch API
- **Styling**: Modern CSS with Flexbox and Grid layouts
- **Responsive**: Mobile-first design approach

### Key Features
- **Object-Oriented Design**: Uses ES6 classes for clean code organization
- **Error Handling**: Graceful error handling for API failures
- **Performance**: Efficient data processing and rendering
- **Accessibility**: Semantic HTML and keyboard navigation support

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Usage

1. **Loading**: The application automatically loads the top 25 markets by volume when opened
2. **Navigation**: Use the Previous/Next buttons to browse through all available markets
3. **Refresh**: Click the Refresh button to get the latest market data
4. **Responsive**: Resize your browser window to see the responsive design in action

## Data Sources

All market data comes from Kalshi.com's public API:
- Market information and odds
- Trading volume and status
- Event categories and descriptions
- Market thumbnails (when available)

## Contributing

This is a simple, self-contained application. To modify or extend:

1. Edit `script.js` for functionality changes
2. Edit the `<style>` section in `index.html` for design changes
3. Test in multiple browsers to ensure compatibility

## License

This project is open source and available under the MIT License.

## Troubleshooting

### CORS Error
If you see a CORS error in the browser console:
- **Problem**: "Access to fetch at 'https://api.elections.kalshi.com/v1/events/' from origin 'X' has been blocked by CORS policy"
- **Cause**: The Kalshi API doesn't allow direct browser requests due to security restrictions
- **Current Solution**: The app uses a public CORS proxy service (allorigins.win)
- **If Still Failing**: The CORS proxy service might be temporarily unavailable - try refreshing the page

### Network Error
If you see a network error:
- Check your internet connection
- The Kalshi API might be temporarily unavailable
- Try refreshing the page

### Server Won't Start
If the server won't start:
- Make sure port 8000 is not already in use
- Try a different port: `python3 -m http.server 8001`
- Check that you're in the correct directory

## Support

For issues or questions:
1. Check that your browser supports modern JavaScript features
2. Ensure you have an active internet connection
3. Try refreshing the page if data doesn't load initially
4. Make sure you're running through a local server (not opening the file directly)

---

**Note**: This application is for informational purposes only. All market data is provided by Kalshi.com and should not be considered as financial advice.
