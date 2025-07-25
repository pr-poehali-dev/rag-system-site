import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { apiCall, API_CONFIG } from '@/lib/api';

const Index = () => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'Привет! Я ваш AI помощник с RAG системой. Задавайте вопросы по вашим документам.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Real API call to your ngrok endpoint
      const response = await apiCall(API_CONFIG.ENDPOINTS.CHAT, {
        method: 'POST',
        body: JSON.stringify({ 
          message: inputValue,
          conversation_id: Date.now() // or use a proper conversation ID
        }),
      });
      
      const aiResponse = {
        type: 'assistant',
        content: response.answer || response.message || 'No response received'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse = {
        type: 'assistant',
        content: 'Извините, произошла ошибка при обработке запроса.'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const models = [
    { name: 'GPT-4', status: 'inactive', accuracy: 94 },
    { name: 'YandexGPT-5-Lite-8B-instruct', status: 'active', accuracy: 95 },
    { name: 'LLaMA-2', status: 'inactive', accuracy: 87 },
  ];

  const stats = [
    { label: 'Обработано запросов', value: '2,847', icon: 'MessageSquare' },
    { label: 'Точность ответов', value: '94.2%', icon: 'Target' },
    { label: 'Среднее время ответа', value: '1.3с', icon: 'Clock' },
    { label: 'Активных документов', value: '156', icon: 'FileText' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Brain" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">RAG System</h1>
                <p className="text-sm text-slate-500">Интеллектуальная система поиска</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Icon name="Circle" className="w-2 h-2 fill-current mr-1" />
                Система активна
              </Badge>
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Демо интерфейс RAG системы
                </CardTitle>
                <CardDescription>
                  Задавайте вопросы по вашим документам. Система найдет релевантную информацию и даст точный ответ.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary text-white' 
                          : message.type === 'system'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-white border text-slate-900'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin">
                            <Icon name="Loader2" size={16} />
                          </div>
                          <span className="text-slate-500">Обрабатываю запрос...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Задайте вопрос по вашим документам..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="BarChart3" size={20} className="mr-2" />
                  Статистика системы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name={stat.icon} size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-600">{stat.label}</span>
                    </div>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Available Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Cpu" size={20} className="mr-2" />
                  Доступные модели
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {models.map((model, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{model.name}</span>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status === 'active' ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <span>Точность:</span>
                      <Progress value={model.accuracy} className="flex-1 h-2" />
                      <span>{model.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Technical Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Code" size={20} className="mr-2" />
                  API & Интеграция
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs font-mono text-slate-600 mb-1">Colab endpoint:</div>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    https://colab.research.google.com/...
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  <Icon name="ExternalLink" size={14} className="mr-2" />
                  Открыть в Colab
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Icon name="FileCode" size={14} className="mr-2" />
                  API документация
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Возможности RAG системы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Семантический поиск</h3>
                <p className="text-sm text-slate-600">
                  Находит релевантную информацию даже при неточных запросах
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Zap" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Быстрые ответы</h3>
                <p className="text-sm text-slate-600">
                  Среднее время ответа менее 2 секунд
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Высокая точность</h3>
                <p className="text-sm text-slate-600">
                  94% точность ответов благодаря продвинутым алгоритмам
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;