# 🌍 CreaViaggi - Travel Planning Platform

<div align="center">

**Una piattaforma completa per organizzare viaggi personalizzati con intelligenza artificiale**

[![PHP Version](https://img.shields.io/badge/PHP-8.0+-blue.svg)](https://www.php.net/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/)
[![Amadeus API](https://img.shields.io/badge/Amadeus-API-orange.svg)](https://developers.amadeus.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-LLM-green.svg)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

</div>

---

## 📋 Indice

- [Caratteristiche](#-caratteristiche)
- [Demo e Screenshot](#-demo-e-screenshot)
- [Tecnologie](#️-tecnologie-utilizzate)
- [Installazione](#-installazione)
- [Configurazione](#️-configurazione)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Funzionalità Principali](#-funzionalità-principali)
- [Integrazione AI](#-integrazione-ai-llm)
- [API e Backend](#-api-e-backend)
- [Roadmap](#-roadmap)
- [Contribuire](#-contribuire)
- [Licenza](#-licenza)

---

## ✨ Caratteristiche

### 🎯 Core Features

- **🔍 Ricerca Voli Intelligente**: Integrazione completa con API Amadeus per ricerca voli in tempo reale
- **🏨 Ricerca Hotel**: Scopri le migliori sistemazioni per la tua destinazione
- **📦 Pacchetti Completi**: Combinazioni volo + hotel + taxi con calcolo automatico costi
- **🤖 Assistente AI**: Parsing linguaggio naturale per facilitare le ricerche ("Voglio andare a Parigi 5 giorni con 600€")
- **📄 Download PDF**: Genera riepilogo completo del viaggio in formato PDF
- **🗺️ Mappe Interattive**: Visualizzazione delle destinazioni con mappe delle città
- **🌐 Multilingua**: Supporto completo per lingua italiana
- **📱 Responsive Design**: Interfaccia ottimizzata per desktop, tablet e mobile

### 🚀 Funzionalità Avanzate

- **OAuth2 Implementation**: Autenticazione sicura con Amadeus API
- **Smart Caching**: Sistema di cache per ottimizzare chiamate API
- **Error Handling**: Gestione robusta degli errori con retry automatico
- **Real-time Validation**: Validazione in tempo reale dei dati inseriti
- **Budget Calculator**: Calcolo intelligente del budget totale e per persona
- **Destinazioni Popolari**: Suggerimenti per le mete europee più richieste

---

## 🖼️ Demo e Screenshot

### Pagina Principale
Home page con ricerca voli e accesso rapido alle funzionalità principali.

### Organizza Viaggi
Creazione di pacchetti completi con suggerimenti AI e calcolo costi in tempo reale.

### Dettaglio Viaggio
Visualizzazione completa del pacchetto selezionato con opzione download PDF.

---

## 🛠️ Tecnologie Utilizzate

### Frontend

- **HTML5**: Struttura semantica e accessibile
- **CSS3**: Styling moderno con Flexbox e Grid
- **JavaScript ES6+**: Logica applicativa con async/await, Fetch API, modules
- **Vanilla JS**: Nessuna dipendenza da framework pesanti per performance ottimali

### Backend

- **PHP 8.0+**: Server-side logic e API proxy
- **OAuth2**: Autenticazione sicura con token management
- **RESTful APIs**: Architettura API moderna e scalabile

### Integrazioni Esterne

- **[Amadeus API](https://developers.amadeus.com/)**: 
  - Flight Search API
  - Hotel Search API
  - Airport & City Search API
  - Location APIs

- **[OpenRouter](https://openrouter.ai/)**: 
  - LLM per parsing linguaggio naturale
  - Suggerimenti destinazioni intelligenti
  - Generazione descrizioni e itinerari
  - Modelli gratuiti: Llama 3.2, Gemma 2, DeepSeek, Qwen

### Development Tools

- **XAMPP**: Ambiente di sviluppo locale (Apache + PHP)
- **Git**: Version control system
- **Chrome DevTools**: Debugging e performance profiling

---

## 🚀 Installazione

### Prerequisiti

- [XAMPP](https://www.apachefriends.org/) o altro server locale (Apache + PHP 8.0+)
- Account [Amadeus for Developers](https://developers.amadeus.com/) (gratuito)
- Account [OpenRouter](https://openrouter.ai/) (opzionale, per funzionalità AI)
- Browser moderno (Chrome, Firefox, Edge)

### Passo 1: Clona il Repository

```bash
cd C:\xampp\htdocs
git clone https://github.com/tuo-username/creaviaggi.git
cd creaviaggi
```

### Passo 2: Configura il Server

1. Avvia **XAMPP Control Panel**
2. Avvia i moduli **Apache** e (opzionalmente) **MySQL**
3. Verifica che il progetto sia accessibile su `http://localhost/creaviaggi`

### Passo 3: Configura le API Keys

```bash
# Copia il file di esempio
cp .env.example .env
```

Modifica il file `.env` con le tue credenziali:

```env
# Amadeus API (obbligatorio)
AMADEUS_CLIENT_ID=tua_client_id_qui
AMADEUS_CLIENT_SECRET=tuo_client_secret_qui

# OpenRouter API (opzionale - per funzionalità AI)
OPENROUTER_API_KEY=sk-or-v1-tua_chiave_qui

# Modello LLM (gratuito)
OPENROUTER_MODEL=deepseek/deepseek-r1-0528-qwen3-8b:free
```

> 📝 **Nota**: Il file `.env` è ignorato da Git per sicurezza. Non committarlo mai!

### Passo 4: Verifica l'Installazione

1. Apri il browser su `http://localhost/creaviaggi`
2. Dovresti vedere la home page
3. Testa la ricerca voli per verificare la connessione Amadeus
4. (Opzionale) Apri `test-llm.html` per testare l'integrazione AI

---

## ⚙️ Configurazione

### Amadeus API Setup

1. Registrati su [Amadeus for Developers](https://developers.amadeus.com/register)
2. Crea una nuova App nel dashboard
3. Copia **API Key** e **API Secret**
4. Inseriscile nel file `.env`

📖 Guida completa: `API_SETUP.md`

### OpenRouter Setup (Opzionale)

1. Registrati su [OpenRouter](https://openrouter.ai/)
2. Genera una API key nel dashboard
3. Inseriscila nel file `.env`
4. Scegli un modello gratuito (es: `deepseek/deepseek-r1-0528-qwen3-8b:free`)

📖 Guida completa: `README_LLM.md`

### Modelli LLM Gratuiti Consigliati

| Modello | Velocità | Qualità | Italiano | Consigliato per |
|---------|----------|---------|----------|------------------|
| `deepseek/deepseek-r1-0528-qwen3-8b:free` | ⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ | Parsing, suggerimenti |
| `meta-llama/llama-3.2-3b-instruct:free` | ⚡⚡⚡ | ⭐⭐⭐ | ✅ | Risposte veloci |
| `google/gemma-2-9b-it:free` | ⚡⚡ | ⭐⭐⭐⭐⭐ | ✅✅ | Italiano perfetto |
| `qwen/qwen-2-7b-instruct:free` | ⚡⚡ | ⭐⭐⭐⭐ | ✅ | Alternativa solida |

---

## 📁 Struttura del Progetto

```
creaviaggi/
│
├── 📄 index.html                 # Home page con ricerca voli
├── 📄 hotels.html                # Pagina ricerca hotel
├── 📄 organizza_viaggi.html      # Creazione pacchetti completi
├── 📄 viaggio_dettaglio.html     # Dettaglio viaggio e download PDF
├── 📄 info.html                  # Informazioni sul progetto
│
├── 🎨 css/
│   ├── style.css                 # Stili globali
│   ├── flights.css               # Stili pagina voli
│   ├── hotels.css                # Stili pagina hotel
│   └── viaggi.css                # Stili pacchetti viaggio
│
├── 💻 js/
│   ├── app.js                    # Logica principale
│   ├── auth.js                   # Gestione OAuth2 Amadeus
│   ├── flights.js                # API voli
│   ├── hotels.js                 # API hotel
│   ├── llm-client.js             # Client OpenRouter (AI)
│   └── utils.js                  # Utility functions
│
├── 🔌 api/
│   ├── amadeus-proxy.php         # Proxy per chiamate Amadeus
│   ├── llm-service.php           # Backend servizio LLM
│   └── config.php                # Configurazione generale
│
├── 🖼️ images/
│   ├── destinations/             # Immagini destinazioni
│   ├── icons/                    # Icone UI
│   └── logo.png                  # Logo app
│
├── 🧪 Test Files
│   ├── test-llm.html             # Test integrazione AI
│   ├── test-backend.php          # Debug backend
│   └── test.html                 # Test generici
│
├── 📚 Documentazione
│   ├── README.md                 # Questo file
│   ├── README_LLM.md             # Guida integrazione AI
│   ├── API_SETUP.md              # Setup Amadeus API
│   └── WARP.md                   # Note sviluppo
│
├── ⚙️ Configurazione
│   ├── .env                      # Variabili ambiente (non tracciato)
│   ├── .env.example              # Template configurazione
│   ├── .gitignore                # File ignorati da Git
│   ├── .htaccess                 # Configurazione Apache
│   └── package.json              # Metadati progetto
│
└── 📜 LICENSE                    # Licenza MIT
```

---

## 🎯 Funzionalità Principali

### 1. 🔍 Ricerca Voli (index.html)

**Funzionalità:**
- Ricerca voli in tempo reale tramite Amadeus API
- Autocompletamento aeroporti IATA
- Filtri per data, numero passeggeri, classe di viaggio
- Visualizzazione prezzi e disponibilità
- Ordinamento risultati per prezzo/durata

**Come usare:**
1. Seleziona aeroporto di partenza e arrivo
2. Scegli date andata e ritorno
3. Imposta numero passeggeri
4. Clicca "Cerca Voli"

### 2. 🏨 Ricerca Hotel (hotels.html)

**Funzionalità:**
- Ricerca hotel per città o coordinate
- Filtri per prezzo, stelle, servizi
- Visualizzazione mappa
- Recensioni e rating

**Come usare:**
1. Inserisci destinazione
2. Seleziona date check-in/check-out
3. Imposta numero ospiti
4. Applica filtri e cerca

### 3. 📦 Organizza Viaggi (organizza_viaggi.html)

**Funzionalità:**
- Creazione pacchetti completi volo + hotel + taxi
- Calcolo automatico costi totali
- Suggerimenti destinazioni AI-powered
- Ricerca in linguaggio naturale
- Selezione e confronto pacchetti

**Come usare:**
1. Inserisci parametri viaggio (o usa ricerca naturale)
2. Visualizza pacchetti suggeriti
3. Confronta prezzi e servizi
4. Seleziona il pacchetto preferito
5. Vai al dettaglio per conferma

### 4. 📄 Dettaglio Viaggio (viaggio_dettaglio.html)

**Funzionalità:**
- Riepilogo completo del pacchetto selezionato
- Informazioni volo, hotel, trasferimenti
- Costi dettagliati
- **Download PDF** del riepilogo viaggio
- Condivisione social

**Come usare:**
1. Visualizza tutti i dettagli del pacchetto
2. Clicca "Download PDF" per salvare il riepilogo
3. Stampa o condividi il documento

---

## 🤖 Integrazione AI (LLM)

### Ricerca in Linguaggio Naturale

Scrivi frasi come:
- "Voglio andare a Parigi 5 giorni con 600 euro"
- "3 persone, Barcellona, una settimana, budget 1500€"
- "Weekend romantico a Venezia, 2 notti, 400 euro"

L'AI estrae automaticamente:
- ✈️ Destinazione
- 👥 Numero persone
- 🌙 Notti/giorni
- 💰 Budget (per persona o totale)
- 🏨 Preferenze alloggio

### Suggerimenti Intelligenti

L'AI analizza:
- Budget disponibile
- Periodo dell'anno
- Preferenze utente (mare, cultura, avventura...)
- Durata del viaggio

E suggerisce le **migliori destinazioni** con score di compatibilità.

### Descrizioni Personalizzate

Per ogni pacchetto, l'AI genera:
- 📝 Descrizione accattivante
- 🗓️ Itinerario giorno per giorno
- 💡 Consigli su cosa vedere
- 🍽️ Suggerimenti gastronomici

📖 **Guida completa**: `README_LLM.md`

---

## 🔌 API e Backend

### Amadeus APIs

**Endpoints utilizzati:**

```javascript
// Autenticazione OAuth2
POST /v1/security/oauth2/token

// Ricerca voli
GET /v2/shopping/flight-offers

// Ricerca hotel
GET /v3/shopping/hotel-offers

// Aeroporti e città
GET /v1/reference-data/locations
```

### OpenRouter LLM Service

**Backend PHP:** `api/llm-service.php`

```php
// Endpoint: /api/llm-service.php
// Metodo: POST
// Body: { "action": "parse|suggest|describe|itinerary", "data": {...} }
```

**Client JavaScript:** `js/llm-client.js`

```javascript
// Parsing linguaggio naturale
await llmClient.parseNaturalLanguage(text);

// Suggerimenti destinazioni
await llmClient.suggestDestinations(travelers, nights, budget, preferences);

// Generazione descrizione
await llmClient.generateDescription(destination, nights, budget, accommodation);

// Creazione itinerario
await llmClient.createItinerary(destination, nights, preferences);
```

### Rate Limiting

**Amadeus (Test Tier):**
- 1 transazione/secondo per API
- 10.000 chiamate/mese

**OpenRouter (Free Tier):**
- ~200 richieste/giorno
- ~10-20 richieste/minuto

> 💡 Il sistema implementa **automatic retry** e **exponential backoff** per gestire rate limits.

---

## 🗺️ Roadmap

### ✅ Completato (v1.0)

- [x] Ricerca voli con Amadeus API
- [x] Ricerca hotel e alloggi
- [x] Creazione pacchetti completi
- [x] Integrazione AI con OpenRouter
- [x] Download PDF riepilogo viaggio
- [x] Interfaccia responsive
- [x] Sistema OAuth2
- [x] Gestione sicura credenziali

### 🚧 In Sviluppo (v1.1)

- [ ] Sistema utenti e autenticazione
- [ ] Salvataggio viaggi preferiti
- [ ] Storico ricerche
- [ ] Notifiche prezzi (price alerts)
- [ ] Confronto pacchetti side-by-side

### 🔮 Future Features (v2.0)

- [ ] **Chat Assistant AI**: Chatbot per assistenza in tempo reale
- [ ] **Multi-destinazione**: Itinerari con tappe multiple
- [ ] **Sentiment Analysis**: Analisi recensioni con AI
- [ ] **Traduzioni automatiche**: Multilingua con AI
- [ ] **Calendario prezzi**: Visualizzazione prezzi per periodo
- [ ] **Social sharing**: Condivisione viaggi su social network
- [ ] **Mobile App**: App nativa iOS/Android
- [ ] **Progressive Web App**: Supporto offline
- [ ] **Payment Integration**: Pagamento diretto in-app
- [ ] **Blockchain Booking**: NFT per prenotazioni sicure

---

## 🤝 Contribuire

Contribuzioni, segnalazioni bug e richieste feature sono benvenute!

### Come Contribuire

1. **Fork** il progetto
2. Crea un **branch** per la tua feature (`git checkout -b feature/NuovaFeature`)
3. **Commit** le modifiche (`git commit -m '✨ Aggiunta NuovaFeature'`)
4. **Push** sul branch (`git push origin feature/NuovaFeature`)
5. Apri una **Pull Request**

### Convenzioni Commit

Usiamo [Conventional Commits](https://www.conventionalcommits.org/):

```
✨ feat: Nuova funzionalità
🐛 fix: Correzione bug
📝 docs: Documentazione
💄 style: Formattazione codice
♻️ refactor: Refactoring
⚡️ perf: Performance
✅ test: Test
🔧 chore: Manutenzione
```

### Codice di Condotta

Questo progetto segue il [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Partecipando, ti impegni a mantenere un ambiente rispettoso e inclusivo.

---

## 🐛 Bug e Problemi

### Segnalare Bug

Aprire una [Issue](https://github.com/tuo-username/creaviaggi/issues) includendo:

1. 🖥️ **Sistema operativo** e browser
2. 📝 **Descrizione dettagliata** del problema
3. 🔄 **Passaggi per riprodurre** il bug
4. 📸 **Screenshot** (se applicabile)
5. 📋 **Log errori** dalla console

### Problemi Comuni

**Errore: "API key non valida"**
- Verifica che il file `.env` esista
- Controlla che le credenziali siano corrette
- Assicurati che Amadeus API sia attiva

**Errore: "No flights found"**
- Verifica date (devono essere future)
- Controlla codici aeroporto IATA (es: MXP, FCO)
- Prova con destinazioni popolari

**Errore: "LLM offline"**
- Verifica API key OpenRouter
- Controlla rate limits (attendi qualche minuto)
- Usa un modello gratuito con suffisso `:free`

---

## 📞 Supporto

- 📧 **Email**: support@creaviaggi.com
- 💬 **Discord**: [CreaViaggi Community](https://discord.gg/creaviaggi)
- 📖 **Documentazione**: [docs.creaviaggi.com](https://docs.creaviaggi.com)
- 🐦 **Twitter**: [@CreaViaggi](https://twitter.com/creaviaggi)

---

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**. Vedi il file [LICENSE](LICENSE) per dettagli.

```
MIT License

Copyright (c) 2025 CreaViaggi Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Ringraziamenti

- **[Amadeus for Developers](https://developers.amadeus.com/)** per le API travel
- **[OpenRouter](https://openrouter.ai/)** per l'accesso a modelli LLM gratuiti
- **[Meta AI](https://ai.meta.com/)** per Llama 3.2
- **[Google DeepMind](https://deepmind.google/)** per Gemma 2
- **[DeepSeek](https://www.deepseek.com/)** per DeepSeek-R1
- Tutti i **contributors** che hanno reso possibile questo progetto

---

<div align="center">

**Fatto con ❤️ da CreaViaggi Team**

⭐ Se ti piace il progetto, lascia una stella su GitHub!

[🌐 Website](https://creaviaggi.com) • [📖 Docs](https://docs.creaviaggi.com) • [💬 Community](https://discord.gg/creaviaggi)

</div>
