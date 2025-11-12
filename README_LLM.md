# 🤖 Integrazione LLM con OpenRouter

## Setup Rapido

### 1. Configura la tua API Key

Modifica il file `.env` e inserisci la tua API key di OpenRouter:

```env
OPENROUTER_API_KEY=sk-or-v1-tua-chiave-qui
```

### 2. Test Connessione

Apri la console del browser su `organizza_viaggi.html` ed esegui:

```javascript
// Test parsing linguaggio naturale
await window.llmClient.parseNaturalLanguage("Voglio andare a Parigi 5 giorni con 600 euro");

// Test suggerimenti destinazioni
await window.llmClient.suggestDestinations(2, 7, 500, "mare e relax");

// Test descrizione pacchetto
await window.llmClient.generateDescription("Parigi", 5, 600, "hotel");
```

## 🎯 Funzionalità Disponibili

### 1. **Parsing Linguaggio Naturale**
Converte frasi come "Voglio andare a Barcellona 1 settimana con 700€" in parametri strutturati.

```javascript
const result = await window.llmClient.parseNaturalLanguage(
    "3 persone, Londra, 5 giorni, budget 500 euro"
);
// Ritorna: { destination, travelers, nights, budget, accommodation, preferences }
```

### 2. **Suggerimenti Destinazioni Intelligenti**
L'LLM suggerisce le migliori destinazioni in base a:
- Budget disponibile
- Numero persone e durata
- Preferenze (mare, cultura, avventura, etc.)

```javascript
const suggestions = await window.llmClient.suggestDestinations(
    2,      // persone
    7,      // notti
    500,    // budget
    "mare e relax"
);
// Ritorna array di destinazioni con score e motivazione
```

### 3. **Descrizioni Personalizzate**
Genera descrizioni accattivanti per ogni pacchetto:

```javascript
const desc = await window.llmClient.generateDescription(
    "Barcellona",
    5,
    600,
    "hotel"
);
```

### 4. **Itinerario Giornaliero**
Crea un piano giorno per giorno:

```javascript
const itinerary = await window.llmClient.createItinerary(
    "Roma",
    5,
    "arte e gastronomia"
);
// Ritorna array con attività per ogni giorno
```

### 5. **Assistente Virtuale**
Risponde a domande sul viaggio:

```javascript
const answer = await window.llmClient.askQuestion(
    "Qual è il periodo migliore per visitare Parigi?",
    "Viaggio di 5 giorni, budget medio"
);
```

## 🔧 Modelli Gratuiti OpenRouter

Il sistema è configurato con `meta-llama/llama-3.1-8b-instruct:free`

Altri modelli gratuiti disponibili:
- `google/gemma-2-9b-it:free` - Ottimo per italiano
- `meta-llama/llama-3.2-3b-instruct:free` - Più veloce, meno preciso
- `qwen/qwen-2-7b-instruct:free` - Alternativa valida

Cambia modello nel file `.env`:
```env
OPENROUTER_MODEL=google/gemma-2-9b-it:free
```

## 🚀 Come Integrare nell'App

### Esempio: Ricerca Intelligente

Aggiungi un campo di ricerca naturale sopra il form:

```html
<div class="smart-search">
    <input type="text" id="naturalSearch" 
           placeholder="Es: Voglio andare a Parigi 5 giorni con 600€">
    <button onclick="parseAndFill()">🤖 Compila Automaticamente</button>
</div>
```

```javascript
async function parseAndFill() {
    const text = document.getElementById('naturalSearch').value;
    const result = await window.llmClient.parseNaturalLanguage(text);
    
    if (result.success) {
        const data = result.data;
        // Compila i campi del form
        document.getElementById('travelers').value = data.travelers;
        document.getElementById('budget').value = data.budget;
        // ...
    }
}
```

## 📊 Limiti Rate (Free Tier)

OpenRouter free tier ha limiti:
- ~200 richieste/giorno per IP
- ~10-20 richieste/minuto

Per produzione considera:
- Caching delle risposte comuni
- Rate limiting lato client
- Piano a pagamento per traffico alto

## 🔒 Sicurezza

✅ **Fatto bene:**
- API key nel file `.env` (non tracciato da git)
- Chiamate LLM tramite backend PHP (mai dal frontend)
- CORS configurato correttamente

❌ **NON fare:**
- Non committare mai il file `.env`
- Non esporre l'API key nel JavaScript
- Non chiamare OpenRouter direttamente dal browser

## 🐛 Troubleshooting

### Errore: "API key non configurata"
Verifica che il file `.env` esista e contenga la chiave corretta.

### Errore: "Formato risposta non valido"
L'LLM a volte non restituisce JSON perfetto. Il sistema riproverà automaticamente.

### Errore HTTP 429: "Rate limit exceeded"
Hai superato il limite di richieste. Attendi qualche minuto.

### Errore HTTP 402: "Payment required"
Modello non gratuito o crediti esauriti. Usa un modello `:free`.

## 💡 Idee per Miglioramenti

1. **Chat Assistant**: Aggiungi un chatbot per assistenza in tempo reale
2. **Preferenze Salvate**: L'LLM impara dalle scelte dell'utente
3. **Sentiment Analysis**: Analizza recensioni hotel in tempo reale
4. **Traduzioni**: Traduci descrizioni in più lingue
5. **Confronto Intelligente**: L'LLM compara pacchetti e consiglia il migliore

## 📝 Note

- Il servizio PHP è in `api/llm-service.php`
- Il client JavaScript è in `js/llm-client.js`
- Tutti i prompt sono ottimizzati per risposte brevi e JSON

## 🆘 Supporto

Per problemi con OpenRouter: https://openrouter.ai/docs
