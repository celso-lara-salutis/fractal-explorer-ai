import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat as GenAIChat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from './types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Olá! Sou seu tutor de Fractais. Posso ensinar sobre a matemática dos fractais (Mandelbrot, Julia) ou sobre o conceito de **Fractal Organizacional** aplicado à gestão. O que vamos explorar?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize Chat Session Ref to persist context
  const chatSessionRef = useRef<GenAIChat | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setMessages(prev => [...prev, { role: 'model', text: '⚠️ API Key não encontrada. Configure process.env.API_KEY para usar o chat.', timestamp: Date.now() }]);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSessionRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Você é um professor expert em Geometria Fractal e, simultaneamente, um consultor de gestão organizacional "sem rodeios".
        
        SEUS DOIS MODOS DE OPERAÇÃO:

        --- MODO 1: FRACTAIS MATEMÁTICOS E NATURAIS ---
        Ensine sobre Mandelbrot (z=z^2+c), auto-similaridade, Sierpinski, etc.
        Seja visual, didático e entusiasta.

        --- MODO 2: FRACTAL ORGANIZACIONAL ---
        Se o usuário perguntar sobre gestão, liderança ou "Fractal Organizacional", adote uma postura direta, pragmática e focada em CAUSA e EFEITO.
        
        Conceito Central: A organização inteira age a partir de uma regra simples repetida em todos os níveis (do estagiário ao CEO).
        A Regra Simples (O Mantra): "Que mudança concreta isso vai gerar quando estiver pronto?"
        
        Princípios:
        1. Se ninguém sabe responder, a atividade é inútil.
        2. Se a resposta é vaga, o propósito é confuso.
        3. O fractal acontece quando o líder, o gestor e o analista usam essa mesma pergunta para filtrar ações.
        4. Substituir cultura de "entregar tarefa" por cultura de "gerar impacto".

        DINÂMICA DO JOGO ORGANIZACIONAL:
        Se o usuário quiser "Jogar" ou simular:
        1. Peça uma tarefa da lista dele.
        2. Pergunte: "Que mudança concreta isso gera quando terminar?"
        3. Julgue a resposta:
           - Se for vaga ("vai melhorar o processo"), critique (construtivamente) e peça algo concreto.
           - Se for concreta ("vai reduzir o tempo de espera em 10%"), parabenize e explique como isso fortalece o fractal.
        
        Responda sempre em Português do Brasil. Use Markdown.`
      }
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Streaming response
      const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullResponseText = '';
      const modelMsgId = Date.now();
      
      // Add placeholder for model message
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: modelMsgId }]);

      for await (const chunk of resultStream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        fullResponseText += chunkText;
        
        // Update the last message with accumulated text
        setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg.role === 'model' && lastMsg.timestamp === modelMsgId) {
                lastMsg.text = fullResponseText;
            }
            return newMsgs;
        });
      }
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-cyan-700 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {/* Simple Markdown-like rendering could be added here. For now, preserving whitespace. */}
              <div className="whitespace-pre-wrap font-light text-sm leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700">
               <div className="flex space-x-2">
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva uma tarefa ou pergunte sobre fractais..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none h-14 custom-scrollbar"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="h-14 w-14 flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;