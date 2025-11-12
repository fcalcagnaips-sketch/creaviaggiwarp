// Geocoding and City Services
import { API_CONFIG, rateLimiter } from '../api-config.js';

class GeocodingService {
    constructor() {
        this.cache = new Map(); // Cache per evitare chiamate duplicate
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 ore
    }

    // Cerca città con autocompletamento
    async searchCities(query, limit = 5) {
        if (!query || query.length < 3) return [];

        const cacheKey = `search_${query}_${limit}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            await rateLimiter.wait('nominatim', API_CONFIG.NOMINATIM.rateLimit);

            const url = new URL(API_CONFIG.NOMINATIM.baseUrl + API_CONFIG.NOMINATIM.endpoints.search);
            url.searchParams.set('q', query);
            url.searchParams.set('format', 'json');
            url.searchParams.set('addressdetails', '1');
            url.searchParams.set('limit', limit.toString());
            url.searchParams.set('featureType', 'city');
            url.searchParams.set('accept-language', 'it');

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.status}`);
            }

            const data = await response.json();
            const cities = data.map(item => ({
                name: item.display_name.split(',')[0],
                fullName: item.display_name,
                country: item.address?.country || '',
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                type: item.type,
                importance: item.importance
            })).filter(city => city.type === 'city' || city.type === 'town' || city.type === 'village');

            this.setCache(cacheKey, cities);
            return cities;

        } catch (error) {
            console.error('Errore ricerca città:', error);
            return [];
        }
    }

    // Ottieni coordinate da nome città
    async getCityCoordinates(cityName) {
        const cacheKey = `coords_${cityName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            await rateLimiter.wait('nominatim', API_CONFIG.NOMINATIM.rateLimit);

            const url = new URL(API_CONFIG.NOMINATIM.baseUrl + API_CONFIG.NOMINATIM.endpoints.search);
            url.searchParams.set('q', cityName);
            url.searchParams.set('format', 'json');
            url.searchParams.set('limit', '1');
            url.searchParams.set('addressdetails', '1');

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.status}`);
            }

            const data = await response.json();
            if (data.length === 0) {
                throw new Error('Città non trovata');
            }

            const result = {
                name: cityName,
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                country: data[0].address?.country || '',
                countryCode: data[0].address?.country_code || ''
            };

            this.setCache(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Errore coordinate città:', error);
            throw error;
        }
    }

    // Ottieni informazioni città da coordinate
    async getCityFromCoordinates(lat, lon) {
        const cacheKey = `reverse_${lat}_${lon}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            await rateLimiter.wait('nominatim', API_CONFIG.NOMINATIM.rateLimit);

            const url = new URL(API_CONFIG.NOMINATIM.baseUrl + API_CONFIG.NOMINATIM.endpoints.reverse);
            url.searchParams.set('lat', lat.toString());
            url.searchParams.set('lon', lon.toString());
            url.searchParams.set('format', 'json');
            url.searchParams.set('addressdetails', '1');

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Reverse geocoding error: ${response.status}`);
            }

            const data = await response.json();
            const result = {
                name: data.address?.city || data.address?.town || data.address?.village || 'Località sconosciuta',
                country: data.address?.country || '',
                countryCode: data.address?.country_code || '',
                lat: parseFloat(data.lat),
                lon: parseFloat(data.lon)
            };

            this.setCache(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Errore reverse geocoding:', error);
            throw error;
        }
    }

    // Calcola distanza tra due città (formula di Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raggio della Terra in km
        const dLat = this.degreesToRadians(lat2 - lat1);
        const dLon = this.degreesToRadians(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Gestione cache
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > this.cacheExpiry;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    // Pulisci cache scaduta
    clearExpiredCache() {
        const now = Date.now();
        for (const [key, cached] of this.cache.entries()) {
            if (now - cached.timestamp > this.cacheExpiry) {
                this.cache.delete(key);
            }
        }
    }
}

// Servizio per informazioni sui paesi
class CountryService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 giorni
    }

    async getCountryInfo(countryName) {
        const cacheKey = `country_${countryName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(
                `${API_CONFIG.REST_COUNTRIES.baseUrl}${API_CONFIG.REST_COUNTRIES.endpoints.name}/${encodeURIComponent(countryName)}`
            );

            if (!response.ok) {
                throw new Error(`Country API error: ${response.status}`);
            }

            const data = await response.json();
            if (!data || data.length === 0) {
                throw new Error('Paese non trovato');
            }

            const country = data[0];
            const result = {
                name: country.name.common,
                nativeName: country.name.nativeName,
                capital: country.capital?.[0] || 'N/A',
                region: country.region,
                subregion: country.subregion,
                population: country.population,
                currencies: country.currencies,
                languages: country.languages,
                flag: country.flag,
                timezones: country.timezones
            };

            this.setCache(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Errore informazioni paese:', error);
            return null;
        }
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > this.cacheExpiry;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }
}

export { GeocodingService, CountryService };
