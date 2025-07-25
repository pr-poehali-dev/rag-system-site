// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://d9dbd7681a99.ngrok-free.app',
  ENDPOINTS: {
    QUERY: '/api/query',
    DOCUMENTS: '/api/documents',
    SEARCH: '/api/search'
  }
};

// Database options
export const DATABASE_OPTIONS = [
  { id: '1', name: 'База знаний 1', description: 'Общие вопросы' },
  { id: '2', name: 'База знаний 2', description: 'Специализированные запросы' }
];

// API function for document AI queries
export const askDocumentAi = async (question: string, dbId: string) => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUERY}`;
  const payload = {
    question: question,
    db_id: dbId
  };

  console.log('🚀 Отправка запроса:', {
    url,
    method: 'POST',
    payload
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 Ответ получен:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP ошибка:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Данные получены:', data);
    
    if (data.status === 'success') {
      return {
        answer: data.data.answer,
        sources: data.data.sources || []
      };
    } else {
      console.error('❌ Ошибка в ответе сервера:', data);
      throw new Error(`Ошибка сервера: ${data.message || 'Неизвестная ошибка'}`);
    }
  } catch (error) {
    console.error('💥 Критическая ошибка запроса:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Детальная диагностика ошибки
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { error: 'Ошибка сети: не удается подключиться к серверу. Проверьте CORS настройки.' };
    } else if (error.message.includes('CORS')) {
      return { error: 'Ошибка CORS: сервер блокирует запросы с этого домена.' };
    } else {
      return { error: `Ошибка подключения: ${error.message}` };
    }
  }
};