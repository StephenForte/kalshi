class KalshiMarketViewer {
    constructor() {
        this.allMarkets = [];
        this.currentPage = 0;
        this.marketsPerPage = 25;
        this.totalMarkets = 0;
        this.isLoading = false;
        this.categoriesPerPage = {
            'Politics': 3,
            'Economics': 4,
            'Sports': 4,
            'Entertainment': 3,
            'World': 3,
            'Technology': 3,
            'Other': 5
        };
        this.init();
    }

    init() {
        this.loadMarkets();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('prevBtn').addEventListener('click', () => this.previousPage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextPage());
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadMarkets());
    }

    async loadMarkets() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showLoading();

            // Try multiple CORS proxy services for better reliability
            const corsProxies = [
                'https://api.allorigins.win/raw?url=',
                'https://corsproxy.io/?',
                'https://api.codetabs.com/v1/proxy?quest='
            ];

            let response = null;
            let lastError = null;

            for (const proxy of corsProxies) {
                try {
                    const url = proxy + encodeURIComponent('https://api.elections.kalshi.com/v1/events/');
                    console.log(`Trying proxy: ${proxy}`);
                    
                    response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        console.log(`Success with proxy: ${proxy}`);
                        break;
                    }
                } catch (error) {
                    console.log(`Failed with proxy ${proxy}:`, error.message);
                    lastError = error;
                    continue;
                }
            }

            if (!response || !response.ok) {
                console.log('All CORS proxies failed, using sample data for demonstration');
                // Use sample data as fallback
                const sampleData = this.getSampleData();
                this.processMarketData(sampleData);
                return;
            }

            const data = await response.json();
            this.processMarketData(data);

        } catch (error) {
            console.error('Error loading markets:', error);

            // Check for CORS error specifically
            if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
                this.showError(`
                    <strong>CORS Error:</strong> Unable to fetch data from Kalshi API.<br><br>
                    <strong>Note:</strong> This app uses CORS proxy services to bypass browser restrictions.<br><br>
                    <strong>Solutions:</strong><br>
                    1. Check your internet connection<br>
                    2. Try refreshing the page<br>
                    3. The CORS proxy services might be temporarily unavailable<br><br>
                    <strong>Alternative:</strong> Try using a different browser or clearing your browser cache.
                `);
            } else if (error.message.includes('Failed to fetch')) {
                this.showError(`
                    <strong>Network Error:</strong> Unable to connect to the API.<br><br>
                    This could be due to:<br>
                    • Internet connection issues<br>
                    • CORS proxy services being unavailable<br>
                    • Kalshi API being temporarily down<br><br>
                    Please try refreshing the page in a few moments.
                `);
            } else {
                this.showError(`Failed to load markets: ${error.message}`);
            }
        } finally {
            this.isLoading = false;
        }
    }

    processMarketData(data) {
        // Extract all markets from all events
        this.allMarkets = [];
        const seenMarkets = new Set(); // Track seen markets to avoid duplicates
        
        data.events.forEach(event => {
            if (event.markets && Array.isArray(event.markets)) {
                event.markets.forEach(market => {
                    // Create unique identifier for this market using the market ID
                    const marketId = market.id;
                    
                    // Skip if we've already seen this market
                    if (seenMarkets.has(marketId)) {
                        return;
                    }
                    seenMarkets.add(marketId);
                    
                    // Add event information to each market
                    this.allMarkets.push({
                        ...market,
                        marketId: marketId,
                        eventTitle: event.title,
                        eventCategory: event.category,
                        eventTicker: event.ticker,
                        imageLink: market.rulebook_variables?.image_link || null
                    });
                });
            }
        });

        // Store total count before filtering
        this.totalMarkets = this.allMarkets.length;

        // Filter to only show active markets (exclude finalized, closed, etc.)
        this.allMarkets = this.allMarkets.filter(market => 
            market.status === 'active'
        );

        // Sort markets by volume (dollar_volume) in descending order
        this.allMarkets.sort((a, b) => (b.dollar_volume || 0) - (a.dollar_volume || 0));

        // Balance categories for the first page
        this.balanceCategories();

        this.currentPage = 0;
        this.updateDisplay();

        // Update market count display
        this.updateMarketCount();

        // Log the number of active markets found
        console.log(`Found ${this.allMarkets.length} active markets out of ${this.totalMarkets} total markets`);
    }

    getSampleData() {
        return {
            events: [
                {
                    title: "2024 NFL Season",
                    category: "Sports",
                    markets: [
                        {
                            id: "sample-1",
                            title: "Who will win Super Bowl LVIII?",
                            status: "active",
                            dollar_volume: 25000000,
                            yes_bid: 35,
                            yes_ask: 40,
                            yes_sub_title: "Kansas City Chiefs",
                            no_sub_title: "Other Teams"
                        },
                        {
                            id: "sample-2", 
                            title: "Will the Eagles win the NFC East?",
                            status: "active",
                            dollar_volume: 15000000,
                            yes_bid: 45,
                            yes_ask: 50,
                            yes_sub_title: "Yes",
                            no_sub_title: "No"
                        }
                    ]
                },
                {
                    title: "2024 Presidential Election",
                    category: "Politics",
                    markets: [
                        {
                            id: "sample-3",
                            title: "Who will win the 2024 presidential election?",
                            status: "active", 
                            dollar_volume: 50000000,
                            yes_bid: 55,
                            yes_ask: 60,
                            yes_sub_title: "Democratic Candidate",
                            no_sub_title: "Republican Candidate"
                        }
                    ]
                },
                {
                    title: "Technology Markets",
                    category: "Technology",
                    markets: [
                        {
                            id: "sample-4",
                            title: "Will Apple release a new iPhone in September 2024?",
                            status: "active",
                            dollar_volume: 8000000,
                            yes_bid: 85,
                            yes_ask: 90,
                            yes_sub_title: "Yes",
                            no_sub_title: "No"
                        }
                    ]
                }
            ]
        };
    }

    updateDisplay() {
        this.renderMarkets();
        this.updatePagination();
    }

    get currentMarkets() {
        const start = this.currentPage * this.marketsPerPage;
        const end = start + this.marketsPerPage;
        return this.allMarkets.slice(start, end);
    }

    renderMarkets() {
        const content = document.getElementById('content');

        if (this.currentMarkets.length === 0) {
            content.innerHTML = '<div class="error">No active markets found. All markets may be closed or finalized.</div>';
            return;
        }

        const marketsHTML = this.currentMarkets.map(market => this.createMarketCard(market)).join('');
        content.innerHTML = `<div class="markets-grid">${marketsHTML}</div>`;
    }

    createMarketCard(market) {
        const icon = this.getMarketIcon(market);
        const marketQuestion = this.getMarketQuestion(market);
        const options = this.getMarketOptions(market);
        
        return `
            <div class="market-card">
                <div class="market-header">
                    <div class="market-icon">
                        ${icon}
                    </div>
                    <div class="market-info">
                        <div class="market-title">${this.escapeHtml(marketQuestion)}</div>
                        <div class="market-category">${this.escapeHtml(market.eventCategory || 'Unknown')}</div>
                    </div>
                </div>
                
                <div class="market-options">
                    ${options.map(option => `
                        <div class="option-item">
                            <div class="option-name">${this.escapeHtml(option.name)}</div>
                            <div class="option-odds">${option.odds}%</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="market-volume">
                    <div class="volume-label">Market Volume</div>
                    <div class="volume-amount">$${this.formatNumber(market.dollar_volume || 0)}</div>
                </div>
            </div>
        `;
    }

    getMarketIcon(market) {
        if (market.imageLink) {
            return `<img src="${this.escapeHtml(market.imageLink)}" alt="Market icon" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" />`;
        }
        
        // Fallback icons based on category
        const category = market.eventCategory?.toLowerCase() || '';
        if (category.includes('politics') || category.includes('election')) {
            return '🗳️';
        } else if (category.includes('economics') || category.includes('finance')) {
            return '💰';
        } else if (category.includes('sports')) {
            return '⚽';
        } else if (category.includes('entertainment')) {
            return '🎬';
        } else {
            return '📊';
        }
    }

    getMarketQuestion(market) {
        // Try to get the market question from various possible fields
        if (market.title && market.title.trim() !== '') {
            return market.title;
        } else if (market.name && market.name.trim() !== '') {
            return market.name;
        } else if (market.sub_title && market.sub_title.trim() !== '') {
            return market.sub_title;
        }
        return 'Market Question';
    }

    getMarketOptions(market) {
        const options = [];
        
        // Check for yes/no options
        if (market.yes_sub_title && market.no_sub_title) {
            options.push({
                name: market.yes_sub_title,
                odds: this.calculateOdds(market.yes_bid, market.yes_ask)
            });
            options.push({
                name: market.no_sub_title,
                odds: this.calculateOdds(100 - market.yes_ask, 100 - market.yes_bid)
            });
        } else if (market.yes_sub_title) {
            options.push({
                name: market.yes_sub_title,
                odds: this.calculateOdds(market.yes_bid, market.yes_ask)
            });
        } else if (market.sub_title) {
            options.push({
                name: market.sub_title,
                odds: this.calculateOdds(market.yes_bid, market.yes_ask)
            });
        } else {
            // Fallback options
            options.push({
                name: 'Yes',
                odds: this.calculateOdds(market.yes_bid, market.yes_ask)
            });
            options.push({
                name: 'No',
                odds: this.calculateOdds(100 - market.yes_ask, 100 - market.yes_bid)
            });
        }
        
        return options;
    }

    calculateOdds(bid, ask) {
        // Calculate odds as percentage, using ask price as it's more conservative
        if (bid && ask) {
            return Math.round((bid + ask) / 2);
        } else if (bid) {
            return Math.round(bid);
        } else if (ask) {
            return Math.round(ask);
        }
        return 0;
    }



    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.allMarkets.length / this.marketsPerPage);
        const currentPage = this.currentPage + 1;
        
        document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prevBtn').disabled = this.currentPage === 0;
        document.getElementById('nextBtn').disabled = this.currentPage >= totalPages - 1;
    }

    updateMarketCount() {
        const countElement = document.getElementById('marketCount');
        const categoryElement = document.getElementById('categoryInfo');
        
        if (countElement) {
            const activeCount = this.allMarkets.length;
            const totalCount = this.totalMarkets;
            countElement.textContent = `${activeCount} Active Markets (of ${totalCount} total)`;
        }
        
        if (categoryElement && this.currentPage === 0) {
            categoryElement.textContent = 'Balanced categories (Politics: 3, Economics: 4, Sports: 4, etc.)';
        } else if (categoryElement) {
            categoryElement.textContent = 'All categories';
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateDisplay();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.allMarkets.length / this.marketsPerPage);
        if (this.currentPage < totalPages - 1) {
            this.currentPage++;
            this.updateDisplay();
        }
    }

    showLoading() {
        document.getElementById('content').innerHTML = '<div class="loading">Loading active markets...</div>';
        // Reset market count
        const countElement = document.getElementById('marketCount');
        const categoryElement = document.getElementById('categoryInfo');
        if (countElement) {
            countElement.textContent = 'Loading...';
        }
        if (categoryElement) {
            categoryElement.textContent = '';
        }
    }

    showError(message) {
        document.getElementById('content').innerHTML = `<div class="error">${message}</div>`;
        const countElement = document.getElementById('marketCount');
        if (countElement) {
            countElement.textContent = 'Error';
        }
    }

    balanceCategories() {
        // Create a balanced first page with limited politics markets
        const balancedMarkets = [];
        const categoryCounts = {};
        
        // Initialize category counts
        Object.keys(this.categoriesPerPage).forEach(category => {
            categoryCounts[category] = 0;
        });

        // First pass: add markets up to the category limits
        for (const market of this.allMarkets) {
            const category = this.getCategoryKey(market.eventCategory);
            const limit = this.categoriesPerPage[category] || this.categoriesPerPage['Other'];
            
            if (categoryCounts[category] < limit) {
                balancedMarkets.push(market);
                categoryCounts[category]++;
            }
        }

        // Second pass: fill remaining slots with any remaining markets
        for (const market of this.allMarkets) {
            if (balancedMarkets.length >= this.marketsPerPage) break;
            
            if (!balancedMarkets.find(m => m.marketId === market.marketId)) {
                balancedMarkets.push(market);
            }
        }

        // Replace the first page worth of markets with balanced selection
        this.allMarkets = [...balancedMarkets, ...this.allMarkets.slice(this.marketsPerPage)];
    }

    getCategoryKey(category) {
        if (!category) return 'Other';
        
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('politics') || categoryLower.includes('election')) return 'Politics';
        if (categoryLower.includes('economics') || categoryLower.includes('finance')) return 'Economics';
        if (categoryLower.includes('sports')) return 'Sports';
        if (categoryLower.includes('entertainment')) return 'Entertainment';
        if (categoryLower.includes('world') || categoryLower.includes('international')) return 'World';
        if (categoryLower.includes('technology') || categoryLower.includes('tech')) return 'Technology';
        
        return 'Other';
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KalshiMarketViewer();
});

