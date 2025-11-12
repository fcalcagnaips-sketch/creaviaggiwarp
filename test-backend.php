<?php
/**
 * Script di debug per verificare il backend LLM
 */

echo "<h1>🔍 Debug Backend LLM</h1>";
echo "<style>body{font-family:Arial;padding:20px;background:#f5f5f5;}h2{color:#667eea;margin-top:30px;}pre{background:#fff;padding:15px;border-left:4px solid #667eea;overflow-x:auto;}.success{color:green;}. error{color:red;}</style>";

// Test 1: Verifica CURL
echo "<h2>1. Verifica CURL</h2>";
if (function_exists('curl_version')) {
    $curl_version = curl_version();
    echo "<p class='success'>✅ CURL è abilitato</p>";
    echo "<pre>Versione: " . $curl_version['version'] . "</pre>";
} else {
    echo "<p class='error'>❌ CURL NON è abilitato!</p>";
    echo "<p>Soluzione: Abilita extension=curl in php.ini</p>";
}

// Test 2: Verifica file .env
echo "<h2>2. Verifica file .env</h2>";
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    echo "<p class='success'>✅ File .env trovato</p>";
    
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $config = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $config[trim($name)] = trim($value);
        }
    }
    
    if (isset($config['OPENROUTER_API_KEY']) && $config['OPENROUTER_API_KEY'] !== 'your_openrouter_api_key_here') {
        echo "<p class='success'>✅ API Key configurata</p>";
        echo "<pre>Key: " . substr($config['OPENROUTER_API_KEY'], 0, 20) . "...</pre>";
    } else {
        echo "<p class='error'>❌ API Key NON configurata</p>";
    }
    
    if (isset($config['OPENROUTER_MODEL'])) {
        echo "<p class='success'>✅ Modello configurato: {$config['OPENROUTER_MODEL']}</p>";
    }
} else {
    echo "<p class='error'>❌ File .env NON trovato</p>";
}

// Test 3: Test chiamata OpenRouter
echo "<h2>3. Test Chiamata OpenRouter</h2>";

if (!function_exists('curl_version') || !isset($config['OPENROUTER_API_KEY'])) {
    echo "<p class='error'>❌ Prerequisiti non soddisfatti</p>";
} else {
    $apiKey = $config['OPENROUTER_API_KEY'];
    $model = $config['OPENROUTER_MODEL'] ?? 'deepseek/deepseek-r1-distill-qwen-32b:free';
    
    $data = [
        'model' => $model,
        'messages' => [
            ['role' => 'system', 'content' => 'Rispondi solo con: OK'],
            ['role' => 'user', 'content' => 'test']
        ],
        'max_tokens' => 10
    ];
    
    $ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'HTTP-Referer: http://localhost',
            'X-Title: CreaViaggi-Debug'
        ],
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    echo "<p>Invio richiesta a OpenRouter...</p>";
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    echo "<pre>HTTP Code: $httpCode</pre>";
    
    if ($curlError) {
        echo "<p class='error'>❌ Errore CURL: $curlError</p>";
    } elseif ($httpCode === 200) {
        echo "<p class='success'>✅ Connessione OpenRouter funzionante!</p>";
        $result = json_decode($response, true);
        if (isset($result['choices'][0]['message']['content'])) {
            echo "<pre>Risposta LLM: " . htmlspecialchars($result['choices'][0]['message']['content']) . "</pre>";
        }
    } elseif ($httpCode === 401) {
        echo "<p class='error'>❌ API Key non valida</p>";
    } elseif ($httpCode === 402) {
        echo "<p class='error'>❌ Crediti esauriti o modello non gratuito</p>";
    } elseif ($httpCode === 429) {
        echo "<p class='error'>❌ Rate limit superato</p>";
    } else {
        echo "<p class='error'>❌ Errore HTTP $httpCode</p>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
    }
}

// Test 4: Verifica LLM Service
echo "<h2>4. Test LLM Service Class</h2>";

require_once __DIR__ . '/api/llm-service.php';

try {
    $llm = new LLMService();
    echo "<p class='success'>✅ Classe LLMService caricata correttamente</p>";
} catch (Exception $e) {
    echo "<p class='error'>❌ Errore caricamento classe: " . $e->getMessage() . "</p>";
}

echo "<hr><p><a href='test-llm.html'>← Torna al Test LLM</a></p>";
?>
