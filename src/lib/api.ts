// API Configuration
const API_URL = 'https://3e817a23be6e.ngrok-free.app/api/query';

// Database options
export const DATABASE_OPTIONS = [
  { id: '1', name: 'База знаний 1', description: 'Общие вопросы' },
  { id: '2', name: 'База знаний 2', description: 'Специализированные запросы' }
];

// Simple API function for document AI queries
export const askDocumentAi = async (question: string, dbId: string = '1') => {
  console.log('🚀 Отправка запроса:', { question, dbId });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: question,
        db_id: dbId
      })
    });

    console.log('📡 Статус ответа:', response.status, response.statusText);

    const data = await response.json();
    console.log('✅ Данные получены:', data);
    
    return {
      answer: data.data.answer,
      sources: data.data.sources || []
    };
  } catch (error) {
    console.error('💥 Ошибка запроса:', error);
    return { error: `Ошибка подключения: ${error.message}` };
  }
};