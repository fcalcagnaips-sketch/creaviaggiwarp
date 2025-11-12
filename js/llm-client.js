/**
 * LLM Client per CreaViaggi
 * Client JavaScript per comunicare con il servizio LLM backend
 */

class LLMClient {
    constructor() {
        this.apiUrl = 'api/llm-service.php';
    }

    /**
     * Parsing linguaggio naturale
     * Esempio: "Voglio andare a Parigi 5 giorni con 600€"
     */
    async parseNaturalLanguage(text) {
        try {
            const response = await this.makeRequest('parse', { text });
            
            if (response.success) {
                // Prova a parsare il JSON dalla risposta
                try {
                    // Prima prova parsing diretto
                    const parsed = JSON.parse(response.content);
                    return { success: true, data: parsed };
                } catch (e) {
                    // Se fallisce, cerca JSON nel testo
                    const jsonMatch = response.content.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
                    if (jsonMatch) {
                        try {
                            const parsed = JSON.parse(jsonMatch[0]);
                            return { success: true, data: parsed };
                        } catch (e2) {
                            console.warn('JSON estratto non valido:', jsonMatch[0]);
                        }
                    }
                    console.warn('Risposta non contiene JSON valido:', response.content);
                    return { success: false, error: 'Formato risposta non valido', raw: response.content };
                }
            }
            
            return response;
        } catch (error) {
            console.error('Errore parsing:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Suggerisce destinazioni in base ai parametri
     */
    async suggestDestinations(travelers, nights, budget, preferences = '') {
        try {
            const response = await this.makeRequest('suggest', {
                travelers,
                nights,
                budget,
                preferences
            });
            
            if (response.success) {
                try {
                    const suggestions = JSON.parse(response.content);
                    return { success: true, data: suggestions };
                } catch (e) {
                    console.warn('Risposta non è JSON valido:', response.content);
                    return { success: false, error: 'Formato risposta non valido' };
                }
            }
            
            return response;
        } catch (error) {
            console.error('Errore suggerimenti:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Genera descrizione per un pacchetto viaggio
     */
    async generateDescription(destination, nights, budget, accommodation) {
        try {
            const response = await this.makeRequest('describe', {
                destination,
                nights,
                budget,
                accommodation
            });
            
            return response;
        } catch (error) {
            console.error('Errore generazione descrizione:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Crea itinerario giornaliero
     */
    async createItinerary(destination, nights, preferences = '') {
        try {
            const response = await this.makeRequest('itinerary', {
                destination,
                nights,
                preferences
            });
            
            if (response.success) {
                try {
                    const itinerary = JSON.parse(response.content);
                    return { success: true, data: itinerary };
                } catch (e) {
                    console.warn('Risposta non è JSON valido:', response.content);
                    return { success: false, error: 'Formato risposta non valido' };
                }
            }
            
            return response;
        } catch (error) {
            console.error('Errore creazione itinerario:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Risponde a domande sul viaggio
     */
    async askQuestion(question, context = '') {
        try {
            const response = await this.makeRequest('question', {
                question,
                context
            });
            
            return response;
        } catch (error) {
            console.error('Errore domanda:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Esegue richiesta HTTP al backend
     */
    async makeRequest(action, data = {}) {
        const requestData = {
            action,
            ...data
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Errore richiesta LLM:', error);
            throw error;
        }
    }

    /**
     * Verifica disponibilità del servizio
     */
    async checkHealth() {
        try {
            const response = await this.askQuestion('test');
            return response.success;
        } catch (error) {
            return false;
        }
    }
}

// Crea istanza globale
window.llmClient = new LLMClient();

// Export per moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LLMClient;
}
