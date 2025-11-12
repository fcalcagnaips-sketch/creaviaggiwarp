<?php
/**
 * LLM Service per CreaViaggi
 * Integrazione con OpenRouter per intelligenza artificiale
 */

// Headers CORS per chiamate AJAX - DEVONO essere prima di qualsiasi output
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Gestione richieste OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Disabilita output di errori per non rompere il JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

class LLMService {
    private $apiKey;
    private $model;
    private $baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

    public function __construct() {
        $this->loadEnv();
        $this->apiKey = $_ENV['OPENROUTER_API_KEY'] ?? '';
        $this->model = $_ENV['OPENROUTER_MODEL'] ?? 'meta-llama/llama-3.1-8b-instruct:free';
    }

    /**
     * Carica variabili dal file .env
     */
    private function loadEnv() {
        $envPath = dirname(__DIR__) . '/.env';
        
        if (!file_exists($envPath)) {
            error_log('File .env non trovato');
            return;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            
            list($name, $value) = explode('=', $line, 2);
            $_ENV[trim($name)] = trim($value);
        }
    }

    /**
     * Estrae parametri di ricerca da linguaggio naturale
     */
    public function parseNaturalLanguage($userInput) {
        $systemPrompt = 'Extract travel data from text. Return ONLY JSON, no explanations.

Rules:
- Extract destination city name
- Extract number of travelers (default: 2)
- Extract nights/days (default: 7)
- Extract budget per person in euros (default: 500)
- Set accommodation: hotel|apartment|bnb (default: hotel)
- Extract any preferences mentioned

JSON format: {"destination":"Paris","travelers":2,"nights":5,"budget":600,"accommodation":"hotel","preferences":"cultural"}';

        $userPrompt = 'Extract from: ' . $userInput;
        
        return $this->makeRequest($systemPrompt, $userPrompt);
    }

    /**
     * Suggerisce destinazioni in base a preferenze e budget
     */
    public function suggestDestinations($travelers, $nights, $budget, $preferences = '') {
        $systemPrompt = 'You suggest European travel destinations. Return ONLY JSON array, no explanations.

Format: [{"city":"Rome","country":"Italy","reason":"History and food","score":90}]

Consider: budget, attractions, accessibility.';

        $userPrompt = "Suggest 5 destinations for: $travelers travelers, $nights nights, €$budget/person budget" . ($preferences ? ", preferences: $preferences" : "");

        return $this->makeRequest($systemPrompt, $userPrompt);
    }

    /**
     * Genera descrizione personalizzata per un pacchetto viaggio
     */
    public function generatePackageDescription($destination, $nights, $budget, $accommodation) {
        $systemPrompt = "Sei un copywriter di viaggi. Crea una descrizione accattivante per un pacchetto viaggio. Max 150 caratteri.
Formato: breve descrizione che invoglia all'acquisto, menziona punti di forza della destinazione.";

        $userPrompt = "Destinazione: $destination, $nights notti, €$budget/persona, alloggio: $accommodation";

        return $this->makeRequest($systemPrompt, $userPrompt);
    }

    /**
     * Crea itinerario giornaliero per il viaggio
     */
    public function createItinerary($destination, $nights, $preferences = '') {
        $systemPrompt = "Sei una guida turistica esperta. Crea un itinerario giorno per giorno in formato JSON:
[
  {\"day\":1,\"title\":\"Titolo giornata\",\"activities\":[\"attività1\",\"attività2\"],\"highlights\":\"cosa non perdere\"},
  ...
]

Max 3 attività per giorno. Considera: attrazioni principali, food, cultura, relax.";

        $userPrompt = "Destinazione: $destination, durata: $nights notti, preferenze: $preferences";

        return $this->makeRequest($systemPrompt, $userPrompt);
    }

    /**
     * Risponde a domande generiche sul viaggio
     */
    public function answerQuestion($question, $context = '') {
        $systemPrompt = "Sei un assistente virtuale per viaggi. Rispondi in modo conciso e utile in italiano. Max 200 caratteri.";
        $userPrompt = $context ? "$context\n\nDomanda: $question" : $question;

        return $this->makeRequest($systemPrompt, $userPrompt);
    }

    /**
     * Esegue chiamata HTTP all'API OpenRouter
     */
    private function makeRequest($systemPrompt, $userMessage) {
        if (empty($this->apiKey)) {
            return [
                'success' => false,
                'error' => 'API key OpenRouter non configurata'
            ];
        }

        $data = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userMessage]
            ],
            'temperature' => 0.3,
            'max_tokens' => 1000
        ];

        $ch = curl_init($this->baseUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
                'HTTP-Referer: http://localhost',
                'X-Title: CreaViaggi'
            ],
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return [
                'success' => false,
                'error' => 'Errore connessione: ' . $error
            ];
        }

        if ($httpCode !== 200) {
            return [
                'success' => false,
                'error' => 'Errore API (HTTP ' . $httpCode . ')',
                'response' => $response
            ];
        }

        $result = json_decode($response, true);
        
        if (!isset($result['choices'][0]['message'])) {
            return [
                'success' => false,
                'error' => 'Risposta API non valida',
                'debug' => $result
            ];
        }

        $message = $result['choices'][0]['message'];
        
        // DeepSeek R1 può avere reasoning separato
        $content = $message['content'] ?? '';
        $reasoning = $message['reasoning'] ?? '';
        
        // Se content è vuoto, usa reasoning
        if (empty($content) && !empty($reasoning)) {
            $content = $reasoning;
        }
        
        // Cerca JSON nel contenuto (utile per DeepSeek R1 che mette JSON nel reasoning)
        if (preg_match('/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/', $content, $matches)) {
            // Trovato un JSON, proviamo a validarlo
            $jsonCandidate = $matches[0];
            $decoded = json_decode($jsonCandidate, true);
            if ($decoded !== null) {
                // JSON valido trovato, usa quello
                $content = $jsonCandidate;
            }
        }
        
        if (empty($content)) {
            return [
                'success' => false,
                'error' => 'Contenuto vuoto nella risposta',
                'debug' => $message
            ];
        }

        return [
            'success' => true,
            'content' => trim($content),
            'usage' => $result['usage'] ?? null
        ];
    }
}

// Gestione richieste POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $llm = new LLMService();
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['action'])) {
            echo json_encode(['success' => false, 'error' => 'Action non specificata']);
            exit;
        }

        $result = null;
        
        switch ($input['action']) {
            case 'parse':
                $result = $llm->parseNaturalLanguage($input['text'] ?? '');
                break;
                
            case 'suggest':
                $result = $llm->suggestDestinations(
                    $input['travelers'] ?? 2,
                    $input['nights'] ?? 7,
                    $input['budget'] ?? 500,
                    $input['preferences'] ?? ''
                );
                break;
                
            case 'describe':
                $result = $llm->generatePackageDescription(
                    $input['destination'] ?? '',
                    $input['nights'] ?? 7,
                    $input['budget'] ?? 500,
                    $input['accommodation'] ?? 'hotel'
                );
                break;
                
            case 'itinerary':
                $result = $llm->createItinerary(
                    $input['destination'] ?? '',
                    $input['nights'] ?? 7,
                    $input['preferences'] ?? ''
                );
                break;
                
            case 'question':
                $result = $llm->answerQuestion(
                    $input['question'] ?? '',
                    $input['context'] ?? ''
                );
                break;
                
            default:
                $result = ['success' => false, 'error' => 'Action non valida'];
        }
        
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Errore server: ' . $e->getMessage()
        ]);
    }
}
?>
