// Amadeus API Integration Module
class AmadeusAPI {
    constructor() {
        // Test credentials - sostituire con variabili d'ambiente in produzione
        this.clientId = 'XkJ41lnqYnVsArVvvarsCR4wj16gNFFM';
        this.clientSecret = 'm6HiG4alvAqewv7A';
        this.baseUrl = 'https://test.api.amadeus.com';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    /**
     * Ottiene un token di accesso OAuth2 da Amadeus
     * @returns {Promise<string>} Token di accesso
     */
    async getAccessToken() {
        // Controlla se il token è ancora valido
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`
            });

            if (!response.ok) {
                throw new Error(`Errore autenticazione: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            // Il token scade in 29 minuti (1740 secondi), impostiamo scadenza con margine
            this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
            
            console.log('🔑 Token Amadeus ottenuto con successo');
            return this.accessToken;
        } catch (error) {
            console.error('❌ Errore nell\'autenticazione Amadeus:', error);
            throw new Error('Impossibile autenticarsi con le API Amadeus');
        }
    }

    /**
     * Mapping città italiane per la ricerca aeroporti
     */
    getCityMapping() {
        return {
            // Città italiane
            'roma': 'rome',
            'milano': 'milan', 
            'napoli': 'naples',
            'venezia': 'venice',
            'firenze': 'florence',
            'torino': 'turin',
            'palermo': 'palermo',
            'bari': 'bari',
            'catania': 'catania',
            'bologna': 'bologna',
            'genova': 'genoa',
            'verona': 'verona',
            'trieste': 'trieste',
            'pisa': 'pisa',
            'rimini': 'rimini',
            'ancona': 'ancona',
            'cagliari': 'cagliari',
            'bergamo': 'bergamo',
            'brescia': 'brescia',
            'parma': 'parma',
            // Città internazionali principali
            'londra': 'london',
            'parigi': 'paris',
            'madrid': 'madrid',
            'barcellona': 'barcelona',
            'berlino': 'berlin',
            'monaco': 'munich',
            'vienna': 'vienna',
            'amsterdam': 'amsterdam',
            'bruxelles': 'brussels',
            'zurigo': 'zurich',
            'ginevra': 'geneva',
            'lisbona': 'lisbon',
            'dublino': 'dublin',
            'stoccolma': 'stockholm',
            'copenaghen': 'copenhagen',
            'helsinki': 'helsinki',
            'oslo': 'oslo',
            'varsavia': 'warsaw',
            'praga': 'prague',
            'budapest': 'budapest',
            'atene': 'athens',
            'istanbul': 'istanbul',
            'mosca': 'moscow',
            'san pietroburgo': 'saint petersburg',
            'new york': 'new york',
            'los angeles': 'los angeles',
            'miami': 'miami',
            'tokyo': 'tokyo',
            'pechino': 'beijing',
            'shanghai': 'shanghai',
            'hong kong': 'hong kong',
            'singapore': 'singapore',
            'bangkok': 'bangkok',
            'dubai': 'dubai',
            'abu dhabi': 'abu dhabi',
            'doha': 'doha',
            'il cairo': 'cairo',
            'casablanca': 'casablanca',
            'città del capo': 'cape town',
            'johannesburg': 'johannesburg',
            'sydney': 'sydney',
            'melbourne': 'melbourne',
            'auckland': 'auckland',
            'rio de janeiro': 'rio de janeiro',
            'san paolo': 'sao paulo',
            'buenos aires': 'buenos aires',
            'città del messico': 'mexico city',
            'toronto': 'toronto',
            'montreal': 'montreal',
            'vancouver': 'vancouver'
        };
    }

    /**
     * Cerca aeroporti per parola chiave con supporto italiano
     * @param {string} keyword - Parola chiave per la ricerca (es: "Roma", "Milano", "FCO")
     * @param {number} limit - Numero massimo di risultati (default: 10)
     * @returns {Promise<Array>} Array di aeroporti trovati
     */
    async searchAirports(keyword, limit = 10) {
        if (!keyword || keyword.length < 2) {
            return [];
        }

        try {
            const token = await this.getAccessToken();
            
            // Converti termine italiano in inglese se necessario
            const cityMapping = this.getCityMapping();
            let searchKeyword = keyword.toLowerCase();
            
            // Controlla se è un nome di città in italiano
            if (cityMapping[searchKeyword]) {
                searchKeyword = cityMapping[searchKeyword];
                console.log(`🔄 Tradotto "${keyword}" in "${searchKeyword}"`);
            } else {
                // Se non è nel mapping, usa il termine originale
                searchKeyword = keyword;
            }
            
            const url = new URL(`${this.baseUrl}/v1/reference-data/locations`);
            url.searchParams.append('subType', 'AIRPORT');
            url.searchParams.append('keyword', searchKeyword);
            url.searchParams.append('page[limit]', limit.toString());

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Errore ricerca aeroporti: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Formatta i risultati per l'uso nell'applicazione
            const airports = data.data.map(airport => ({
                id: airport.id,
                name: airport.name,
                iataCode: airport.iataCode,
                city: airport.address.cityName,
                country: airport.address.countryName,
                displayName: `${airport.name} (${airport.iataCode}) - ${airport.address.cityName}, ${airport.address.countryName}`
            }));
            
            console.log(`🔍 Trovati ${airports.length} aeroporti per "${keyword}"`);
            return airports;
            
        } catch (error) {
            console.error('❌ Errore nella ricerca aeroporti:', error);
            throw error;
        }
    }

    /**
     * Cerca offerte di volo
     * @param {Object} searchParams - Parametri di ricerca
     * @param {string} searchParams.origin - Codice IATA aeroporto di partenza
     * @param {string} searchParams.destination - Codice IATA aeroporto di destinazione
     * @param {string} searchParams.departureDate - Data partenza (YYYY-MM-DD)
     * @param {string} [searchParams.returnDate] - Data ritorno (YYYY-MM-DD) per andata e ritorno
     * @param {number} searchParams.adults - Numero di adulti (1-9)
     * @param {number} [searchParams.children=0] - Numero di bambini (0-9)
     * @param {string} [searchParams.travelClass='ECONOMY'] - Classe di viaggio
     * @param {number} [searchParams.max=50] - Numero massimo di risultati
     * @returns {Promise<Array>} Array di offerte volo
     */
    async searchFlights(searchParams) {
        const { origin, destination, departureDate, returnDate, adults, children = 0, travelClass = 'ECONOMY', max = 50 } = searchParams;

        if (!origin || !destination || !departureDate || !adults) {
            throw new Error('Parametri obbligatori mancanti per la ricerca voli');
        }

        try {
            const token = await this.getAccessToken();
            const url = new URL(`${this.baseUrl}/v2/shopping/flight-offers`);
            
            url.searchParams.append('originLocationCode', origin);
            url.searchParams.append('destinationLocationCode', destination);
            url.searchParams.append('departureDate', departureDate);
            if (returnDate) {
                url.searchParams.append('returnDate', returnDate);
            }
            url.searchParams.append('adults', adults.toString());
            if (children > 0) {
                url.searchParams.append('children', children.toString());
            }
            url.searchParams.append('travelClass', travelClass);
            url.searchParams.append('max', max.toString());

            console.log('🔍 Ricerca voli:', url.toString());

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Errore ricerca voli: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Formatta i risultati per l'uso nell'applicazione
            return data.data.map(offer => this.formatFlightOffer(offer));
        } catch (error) {
            console.error('❌ Errore nella ricerca voli:', error);
            throw error;
        }
    }

    /**
     * Formatta un'offerta di volo per la visualizzazione
     * @param {Object} offer - Offerta volo grezza da Amadeus
     * @returns {Object} Offerta formattata
     */
    formatFlightOffer(offer) {
        const outbound = offer.itineraries[0];
        const inbound = offer.itineraries[1] || null;

        return {
            id: offer.id,
            price: {
                total: parseFloat(offer.price.total),
                currency: offer.price.currency,
                formatted: `${offer.price.total} ${offer.price.currency}`
            },
            outbound: this.formatItinerary(outbound),
            inbound: inbound ? this.formatItinerary(inbound) : null,
            numberOfBookableSeats: offer.numberOfBookableSeats,
            validatingAirlineCodes: offer.validatingAirlineCodes
        };
    }

    /**
     * Formatta un itinerario (andata o ritorno)
     * @param {Object} itinerary - Itinerario grezzo
     * @returns {Object} Itinerario formattato
     */
    formatItinerary(itinerary) {
        const segments = itinerary.segments.map(segment => ({
            departure: {
                iataCode: segment.departure.iataCode,
                terminal: segment.departure.terminal,
                time: new Date(segment.departure.at),
                timeFormatted: new Date(segment.departure.at).toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            },
            arrival: {
                iataCode: segment.arrival.iataCode,
                terminal: segment.arrival.terminal,
                time: new Date(segment.arrival.at),
                timeFormatted: new Date(segment.arrival.at).toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            },
            carrierCode: segment.carrierCode,
            aircraft: segment.aircraft?.code,
            duration: segment.duration,
            stops: segment.numberOfStops
        }));

        return {
            duration: itinerary.duration,
            segments: segments,
            totalStops: segments.reduce((total, seg) => total + seg.stops, 0)
        };
    }

    /**
     * Converte durata ISO 8601 in formato leggibile
     * @param {string} duration - Durata in formato ISO 8601 (es: "PT1H30M")
     * @returns {string} Durata formattata (es: "1h 30m")
     */
    formatDuration(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?/);
        if (!match) return duration;

        const hours = match[1] ? match[1].replace('H', 'h ') : '';
        const minutes = match[2] ? match[2].replace('M', 'm') : '';
        
        return (hours + minutes).trim();
    }

    /**
     * Verifica lo stato della connessione alle API
     * @returns {Promise<boolean>} True se la connessione funziona
     */
    async checkConnection() {
        try {
            await this.getAccessToken();
            return true;
        } catch (error) {
            console.error('❌ Connessione Amadeus non disponibile:', error);
            return false;
        }
    }
}

// Crea un'istanza globale dell'API
window.amadeusAPI = new AmadeusAPI();

// Esporta la classe per uso con moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmadeusAPI;
}
