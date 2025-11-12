# Configurazione API - Travel Planner

Questa guida spiega come configurare le API esterne per arricchire l'applicazione Travel Planner con dati reali.

## API Gratuite Disponibili

### 1. OpenWeatherMap (Meteo) - **CONSIGLIATA**
- **Registrazione**: https://openweathermap.org/api
- **Piano gratuito**: 1.000 chiamate/giorno
- **Configurazione**: Modifica `js/api-config.js` → `API_CONFIG.OPENWEATHER.apiKey`

### 2. ExchangeRate API (Cambio Valute)
- **URL**: https://exchangerate-api.com/
- **Piano gratuito**: 1.000 richieste/mese
- **Nota**: Funziona già senza chiavi API per il piano gratuito

### 3. OpenStreetMap Nominatim (Geocoding)
- **URL**: https://nominatim.openstreetmap.org/
- **Completamente gratuito**
- **Nota**: Già configurato, funziona senza API key

### 4. REST Countries (Informazioni Paesi)
- **URL**: https://restcountries.com/
- **Completamente gratuito**
- **Nota**: Già configurato, funziona senza API key

## API Avanzate (Opzionali)

### Amadeus (Voli)
- **Registrazione**: https://developers.amadeus.com/
- **Piano gratuito**: 2.000 chiamate/mese
- **Setup complesso**: Richiede OAuth2
- **Nota**: Al momento usa dati mock

### RapidAPI Hotels
- **URL**: https://rapidapi.com/apidojo/api/hotels-com-provider/
- **Costo**: Varia per provider
- **Nota**: Al momento usa dati mock

## Setup Veloce (Solo Meteo)

1. **Registrati su OpenWeatherMap**:
   - Vai su https://openweathermap.org/api
   - Crea un account gratuito
   - Ottieni la tua API key

2. **Configura l'API key**:
   ```javascript
   // In js/api-config.js
   OPENWEATHER: {
       baseUrl: 'https://api.openweathermap.org/data/2.5',
       apiKey: 'la-tua-api-key-qui', // Sostituisci questo
       endpoints: {
           current: '/weather',
           forecast: '/forecast'
       }
   }
   ```

3. **Salva e ricarica l'applicazione**

## Funzionalità Senza API

Anche senza configurare API esterne, l'applicazione funziona con:
- ✅ Calcoli budget e durata viaggio
- ✅ Validazione form completa
- ✅ Salvataggio dati locali
- ✅ Interfaccia responsive
- ⚠️ Meteo: Messaggio "API key non configurata"
- ⚠️ Voli/Hotel: Dati di esempio realistici

## Test delle API

Dopo aver configurato le API, testa:

1. **Meteo**: Inserisci una città famosa (es. "Roma") e verifica che vengano mostrate le condizioni meteo reali
2. **Geocoding**: Le città dovrebbero essere riconosciute automaticamente
3. **Valute**: I tassi di cambio dovrebbero essere aggiornati (se implementati)

## Risoluzione Problemi

### Errore CORS
Se vedi errori CORS, assicurati di:
- Utilizzare XAMPP/server web (non aprire index.html direttamente)
- Le API gratuite generalmente supportano CORS

### API Key Non Valida
- Controlla di aver copiato correttamente la chiave
- Verifica che l'account API sia attivo
- Alcune API richiedono qualche minuto per attivarsi

### Rate Limiting
- Le API gratuite hanno limiti di utilizzo
- L'app usa cache per ridurre le chiamate
- Se superi i limiti, vedrai dati di fallback

## Contatto

Per problemi di configurazione, controlla:
1. Console browser (F12 → Console)
2. Messaggi di errore nell'interfaccia
3. File `WARP.md` per documentazione tecnica
