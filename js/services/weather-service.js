// Weather Services
import { API_CONFIG } from '../api-config.js';

class WeatherService {
    constructor() {
        this.apiKey = API_CONFIG.OPENWEATHER.apiKey;
        this.baseUrl = API_CONFIG.OPENWEATHER.baseUrl;
    }

    async getCurrentWeather(lat, lon, lang = 'it', units = 'metric') {
        if (!this.apiKey || this.apiKey.startsWith('YOUR_')) {
            console.warn('OpenWeather API key non configurata in API_CONFIG.OPENWEATHER.apiKey');
            return null;
        }
        const url = new URL(this.baseUrl + API_CONFIG.OPENWEATHER.endpoints.current);
        url.searchParams.set('lat', lat);
        url.searchParams.set('lon', lon);
        url.searchParams.set('appid', this.apiKey);
        url.searchParams.set('lang', lang);
        url.searchParams.set('units', units);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather error: ${res.status}`);
        return await res.json();
    }

    async getForecast(lat, lon, lang = 'it', units = 'metric') {
        if (!this.apiKey || this.apiKey.startsWith('YOUR_')) {
            console.warn('OpenWeather API key non configurata in API_CONFIG.OPENWEATHER.apiKey');
            return null;
        }
        const url = new URL(this.baseUrl + API_CONFIG.OPENWEATHER.endpoints.forecast);
        url.searchParams.set('lat', lat);
        url.searchParams.set('lon', lon);
        url.searchParams.set('appid', this.apiKey);
        url.searchParams.set('lang', lang);
        url.searchParams.set('units', units);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Forecast error: ${res.status}`);
        return await res.json();
    }
}

export { WeatherService };
