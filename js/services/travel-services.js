// Flight and Hotel Services
import { API_CONFIG } from '../api-config.js';

class FlightService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minuti
    }

    // Ricerca voli - usa dati mock se l'API non è configurata
    async searchFlights(originCity, destinationCity, departureDate, returnDate, passengers = 1) {
        const cacheKey = `flights_${originCity}_${destinationCity}_${departureDate}_${returnDate}_${passengers}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        // Controlla se l'API Amadeus è configurata
        if (API_CONFIG.AMADEUS.apiKey && !API_CONFIG.AMADEUS.apiKey.startsWith('YOUR_')) {
            try {
                return await this.searchRealFlights(originCity, destinationCity, departureDate, returnDate, passengers);
            } catch (error) {
                console.warn('Errore API voli, uso dati mock:', error);
            }
        }

        // Fallback con dati mock
        const mockFlights = this.generateMockFlights(originCity, destinationCity, departureDate, returnDate, passengers);
        this.setCache(cacheKey, mockFlights);
        return mockFlights;
    }

    async searchRealFlights(origin, destination, departure, returnDate, passengers) {
        // Implementazione API Amadeus (richiede autenticazione OAuth2)
        console.warn('API Amadeus non implementata completamente - richiede setup OAuth2');
        throw new Error('API non disponibile');
    }

    generateMockFlights(origin, destination, departure, returnDate, passengers) {
        const basePrice = this.calculateBasePrice(origin, destination);
        const flights = [];

        // Genera 3-5 opzioni di volo mock
        for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
            const variation = (Math.random() - 0.5) * 0.4; // ±20% variazione
            const price = Math.round(basePrice * (1 + variation) * passengers);
            
            flights.push({
                id: `mock_${Date.now()}_${i}`,
                airline: this.getRandomAirline(),
                origin,
                destination,
                departureDate: departure,
                returnDate: returnDate,
                price: price,
                currency: 'EUR',
                duration: this.calculateFlightDuration(origin, destination),
                stops: Math.random() > 0.6 ? 0 : 1,
                bookingUrl: '#',
                mock: true
            });
        }

        return flights.sort((a, b) => a.price - b.price);
    }

    calculateBasePrice(origin, destination) {
        // Prezzi base approssimativi per voli europei
        const europeanCities = {
            'Roma': { lat: 41.9, lon: 12.5 },
            'Milano': { lat: 45.5, lon: 9.2 },
            'Napoli': { lat: 40.8, lon: 14.3 },
            'Firenze': { lat: 43.8, lon: 11.2 },
            'Venezia': { lat: 45.4, lon: 12.3 },
            'Torino': { lat: 45.1, lon: 7.7 },
            'Parigi': { lat: 48.9, lon: 2.3 },
            'Londra': { lat: 51.5, lon: -0.1 },
            'Madrid': { lat: 40.4, lon: -3.7 },
            'Barcellona': { lat: 41.4, lon: 2.2 },
            'Amsterdam': { lat: 52.4, lon: 4.9 },
            'Berlino': { lat: 52.5, lon: 13.4 },
            'Vienna': { lat: 48.2, lon: 16.4 },
            'Praga': { lat: 50.1, lon: 14.4 }
        };

        const originCoords = europeanCities[origin] || { lat: 45, lon: 10 };
        const destCoords = europeanCities[destination] || { lat: 50, lon: 15 };

        // Calcola distanza approssimativa
        const distance = this.calculateDistance(
            originCoords.lat, originCoords.lon,
            destCoords.lat, destCoords.lon
        );

        // Prezzo base: €0.15 per km + costi fissi
        return Math.max(80, Math.round(distance * 0.15 + 50));
    }

    calculateFlightDuration(origin, destination) {
        // Durata approssimativa in ore
        const distance = this.calculateBasePrice(origin, destination) / 0.15 - 50;
        return `${Math.floor(distance / 800 + 1)}h ${Math.floor((distance % 800) / 13)}m`;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    getRandomAirline() {
        const airlines = ['Alitalia', 'Ryanair', 'EasyJet', 'Lufthansa', 'Air France', 'KLM', 'Vueling', 'Iberia'];
        return airlines[Math.floor(Math.random() * airlines.length)];
    }

    setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
}

class HotelService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 60 * 60 * 1000; // 1 ora
    }

    async searchHotels(city, checkinDate, checkoutDate, guests = 2, rooms = 1) {
        const cacheKey = `hotels_${city}_${checkinDate}_${checkoutDate}_${guests}_${rooms}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        // Per ora usa solo dati mock - le API hotel richiedono spesso partnership commerciali
        const mockHotels = this.generateMockHotels(city, checkinDate, checkoutDate, guests, rooms);
        this.setCache(cacheKey, mockHotels);
        return mockHotels;
    }

    generateMockHotels(city, checkinDate, checkoutDate, guests, rooms) {
        const nights = Math.ceil((new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24));
        const basePrice = this.calculateBaseHotelPrice(city);
        const hotels = [];

        // Genera 5-8 opzioni hotel mock
        const hotelTypes = [
            { type: 'Luxury', stars: 5, priceMultiplier: 2.5 },
            { type: 'Boutique', stars: 4, priceMultiplier: 1.8 },
            { type: 'Business', stars: 4, priceMultiplier: 1.5 },
            { type: 'Comfort', stars: 3, priceMultiplier: 1.0 },
            { type: 'Budget', stars: 3, priceMultiplier: 0.7 },
            { type: 'Hostel', stars: 2, priceMultiplier: 0.4 }
        ];

        hotelTypes.forEach((hotel, index) => {
            const variation = (Math.random() - 0.5) * 0.3;
            const pricePerNight = Math.round(basePrice * hotel.priceMultiplier * (1 + variation));
            const totalPrice = pricePerNight * nights * rooms;

            hotels.push({
                id: `hotel_${Date.now()}_${index}`,
                name: `${hotel.type} Hotel ${city}`,
                stars: hotel.stars,
                city: city,
                pricePerNight: pricePerNight,
                totalPrice: totalPrice,
                currency: 'EUR',
                checkinDate,
                checkoutDate,
                nights,
                rooms,
                guests,
                amenities: this.getRandomAmenities(hotel.type),
                rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
                bookingUrl: '#',
                mock: true
            });
        });

        return hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
    }

    calculateBaseHotelPrice(city) {
        // Prezzi base approssimativi per hotel europei (per notte)
        const cityPrices = {
            'Roma': 120,
            'Milano': 110,
            'Napoli': 80,
            'Firenze': 100,
            'Venezia': 130,
            'Torino': 90,
            'Parigi': 150,
            'Londra': 140,
            'Madrid': 100,
            'Barcellona': 110,
            'Amsterdam': 130,
            'Berlino': 90,
            'Vienna': 100,
            'Praga': 70
        };

        return cityPrices[city] || 85;
    }

    getRandomAmenities(hotelType) {
        const allAmenities = {
            'Luxury': ['Wi-Fi gratuito', 'Spa', 'Piscina', 'Ristorante', 'Bar', 'Concierge', 'Palestra'],
            'Boutique': ['Wi-Fi gratuito', 'Ristorante', 'Bar', 'Terrazza', 'Design unico'],
            'Business': ['Wi-Fi gratuito', 'Centro business', 'Sala conferenze', 'Palestra'],
            'Comfort': ['Wi-Fi gratuito', 'Colazione inclusa', 'Parcheggio'],
            'Budget': ['Wi-Fi gratuito', 'Reception 24h'],
            'Hostel': ['Wi-Fi gratuito', 'Cucina condivisa', 'Area comune']
        };

        return allAmenities[hotelType] || ['Wi-Fi gratuito'];
    }

    setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
}

export { FlightService, HotelService };
