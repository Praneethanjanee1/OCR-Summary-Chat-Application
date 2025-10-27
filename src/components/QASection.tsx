import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Bot, User } from 'lucide-react';
import { ocrService } from '../services/ocrService';
import { motion, AnimatePresence } from 'framer-motion';

interface QASectionProps {
  context: string;
  onBack: () => void;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
};

export const QASection: React.FC<QASectionProps> = ({ context, onBack }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [question]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question.trim(),
      timestamp: new Date()
    };

    // Clear input immediately for better UX
    const currentQuestion = question.trim();
    setQuestion('');
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Generate a temporary ID for the assistant message
      const tempMessageId = `temp-${Date.now()}`;
      
      // Add a temporary message that will be replaced
      setMessages(prev => [
        ...prev, 
        {
          id: tempMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isLoading: true
        }
      ]);
      
      // Get the AI response
      const answer = await ocrService.askQuestion(currentQuestion, context);
      
      // Update the temporary message with the actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessageId 
            ? { ...msg, content: answer, isLoading: false } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error getting answer:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestQuestions = [
    'Can you summarize the main points?',
    'What are the key findings?',
    'Are there any important dates mentioned?',
    'What action items are there?'
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 w-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Back to summary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Document Q&A</h1>
            <div className="ml-auto flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-500">AI Assistant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-0 w-full">
        <div className="max-w-full w-full px-4 sm:px-6 space-y-6">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ask about this document</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Get instant answers to your questions about the document content.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {suggestQuestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setQuestion(suggestion)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-blue-100 text-blue-600 ml-3' 
                          : 'bg-purple-100 text-purple-600 mr-3'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Bot className="w-5 h-5" />
                        )}
                      </div>
                      <div className={`p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
                      }`}>
                        {message.isLoading ? (
                          <div className="flex space-x-1.5">
                            <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-wrap text-base leading-relaxed">
                              {message.content}
                            </div>
                            <div className={`text-xs mt-2 text-right ${
                              message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                            }`}>
                              {formatTime(message.timestamp)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[60px] max-h-40 px-6 py-4 pr-16 text-gray-900 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base"
                placeholder="Ask anything about the document..."
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className={`absolute right-2 bottom-2 p-2 rounded-full ${
                  question.trim() && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } transition-colors`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-center text-gray-500">
              The AI may produce inaccurate information. Verify important details.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};