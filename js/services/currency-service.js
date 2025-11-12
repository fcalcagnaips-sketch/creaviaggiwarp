// Currency Conversion Services
import { API_CONFIG } from '../api-config.js';

class CurrencyService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 60 * 60 * 1000; // 1 ora
    }

    async getExchangeRates(baseCurrency = 'EUR') {
        const cacheKey = `rates_${baseCurrency}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(
                `${API_CONFIG.EXCHANGERATE.baseUrl}${API_CONFIG.EXCHANGERATE.endpoints.latest}/${baseCurrency}`
            );

            if (!response.ok) {
                throw new Error(`Exchange rate API error: ${response.status}`);
            }

            const data = await response.json();
            this.setCache(cacheKey, data.rates);
            return data.rates;

        } catch (error) {
            console.error('Errore tassi di cambio:', error);
            // Fallback con tassi di cambio approssimativi
            return this.getFallbackRates(baseCurrency);
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return amount;

        try {
            const rates = await this.getExchangeRates(fromCurrency);
            const rate = rates[toCurrency];
            
            if (!rate) {
                throw new Error(`Tasso di cambio non disponibile per ${toCurrency}`);
            }

            return Math.round((amount * rate) * 100) / 100;

        } catch (error) {
            console.error('Errore conversione valuta:', error);
            return amount; // Ritorna l'importo originale in caso di errore
        }
    }

    async getCurrencySymbol(currencyCode) {
        const symbols = {
            'EUR': '€',
            'USD': '$',
            'GBP': '£',
            'JPY': '¥',
            'CHF': 'Fr',
            'CAD': 'C$',
            'AUD': 'A$',
            'CNY': '¥',
            'INR': '₹',
            'BRL': 'R$',
            'RUB': '₽',
            'KRW': '₩',
            'SEK': 'kr',
            'NOK': 'kr',
            'DKK': 'kr',
            'PLN': 'zł',
            'CZK': 'Kč',
            'HUF': 'Ft',
            'TRY': '₺',
            'ZAR': 'R',
            'MXN': '$',
            'NZD': 'NZ$',
            'SGD': 'S$',
            'HKD': 'HK$',
            'THB': '฿'
        };

        return symbols[currencyCode] || currencyCode;
    }

    async formatCurrency(amount, currencyCode, locale = 'it-IT') {
        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currencyCode
            }).format(amount);
        } catch (error) {
            // Fallback se la valuta non è supportata
            const symbol = await this.getCurrencySymbol(currencyCode);
            return `${symbol}${amount.toFixed(2)}`;
        }
    }

    getFallbackRates(baseCurrency) {
        // Tassi di cambio approssimativi da EUR (aggiornare periodicamente)
        const eurRates = {
            'USD': 1.10,
            'GBP': 0.85,
            'JPY': 130,
            'CHF': 1.05,
            'CAD': 1.35,
            'AUD': 1.45,
            'CNY': 7.20,
            'INR': 82,
            'BRL': 5.50,
            'RUB': 75,
            'KRW': 1300,
            'SEK': 10.5,
            'NOK': 10.8,
            'DKK': 7.45,
            'PLN': 4.30,
            'CZK': 24.5,
            'HUF': 380,
            'TRY': 20,
            'ZAR': 18,
            'MXN': 20,
            'NZD': 1.60,
            'SGD': 1.45,
            'HKD': 8.50,
            'THB': 37
        };

        if (baseCurrency === 'EUR') {
            return { ...eurRates, 'EUR': 1 };
        }

        // Conversione inversa se la base non è EUR
        const baseRate = eurRates[baseCurrency];
        if (!baseRate) return { [baseCurrency]: 1 };

        const rates = { [baseCurrency]: 1 };
        rates['EUR'] = 1 / baseRate;

        Object.entries(eurRates).forEach(([currency, rate]) => {
            if (currency !== baseCurrency) {
                rates[currency] = rate / baseRate;
            }
        });

        return rates;
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

    clearExpiredCache() {
        const now = Date.now();
        for (const [key, cached] of this.cache.entries()) {
            if (now - cached.timestamp > this.cacheExpiry) {
                this.cache.delete(key);
            }
        }
    }
}

export { CurrencyService };
