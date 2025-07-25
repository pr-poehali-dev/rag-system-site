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
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUERY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({
        question: question,
        db_id: dbId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Ответ сервера:', data);
    
    if (data.status === 'success') {
      return {
        answer: data.data.answer,
        sources: data.data.sources || []
      };
    } else {
      throw new Error('Ошибка сервера');
    }
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return { error: 'Сервер недоступен' };
  }
};