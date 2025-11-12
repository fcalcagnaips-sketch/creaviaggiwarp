// API Configuration
// Per sicurezza, in produzione spostare le API key in variabili d'ambiente

const API_CONFIG = {
    // Geocoding - OpenStreetMap Nominatim (Free)
    NOMINATIM: {
        baseUrl: 'https://nominatim.openstreetmap.org',
        endpoints: {
            search: '/search',
            reverse: '/reverse'
        },
        rateLimit: 1000 // ms between requests
    },

    // Weather - OpenWeatherMap (Free tier: 1000 calls/day)
    OPENWEATHER: {
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        apiKey: 'YOUR_OPENWEATHER_API_KEY', // Registrarsi su openweathermap.org
        endpoints: {
            current: '/weather',
            forecast: '/forecast'
        }
    },

    // Currency - ExchangeRate API (Free tier: 1000 requests/month)
    EXCHANGERATE: {
        baseUrl: 'https://api.exchangerate-api.com/v4',
        endpoints: {
            latest: '/latest'
        }
    },

    // Flight prices - Amadeus (Free tier: 2000 calls/month)
    AMADEUS: {
        baseUrl: 'https://test.api.amadeus.com/v2',
        apiKey: 'XkJ41lnqYnVsArVvvarsCR4wj16gNFFM',
        apiSecret: 'm6HiG4alvAqewv7A',
        endpoints: {
            flightOffers: '/shopping/flight-offers',
            airports: '/reference-data/locations/airports'
        }
    },

    // Alternative: AviationStack for flight data (Free tier: 1000 requests/month)
    AVIATIONSTACK: {
        baseUrl: 'http://api.aviationstack.com/v1',
        apiKey: 'YOUR_AVIATIONSTACK_API_KEY',
        endpoints: {
            flights: '/flights'
        }
    },

    // Hotels - RapidAPI Hotels (Free tier varies)
    HOTELS_API: {
        baseUrl: 'https://hotels-com-provider.p.rapidapi.com/v2',
        apiKey: 'YOUR_RAPIDAPI_KEY',
        endpoints: {
            search: '/hotels/search'
        }
    },

    // Country information - REST Countries (Free)
    REST_COUNTRIES: {
        baseUrl: 'https://restcountries.com/v3.1',
        endpoints: {
            name: '/name',
            capital: '/capital'
        }
    }
};

// Rate limiting utility
class RateLimiter {
    constructor() {
        this.lastCall = {};
    }

    async wait(apiName, minInterval = 1000) {
        const now = Date.now();
        const lastCall = this.lastCall[apiName] || 0;
        const timeSince = now - lastCall;

        if (timeSince < minInterval) {
            await new Promise(resolve => setTimeout(resolve, minInterval - timeSince));
        }

        this.lastCall[apiName] = Date.now();
    }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

export { API_CONFIG, rateLimiter };
