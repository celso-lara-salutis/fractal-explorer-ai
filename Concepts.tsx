import React from 'react';
import { ConceptCard } from './types';

interface ConceptsProps {
  onAskTutor: (question: string) => void;
}

const conceptsData: ConceptCard[] = [
  {
    id: 'org-fractal',
    title: 'Fractal Organizacional',
    description: 'Um princípio de gestão onde a organização inteira age a partir de uma regra simples que se repete em todos os níveis. A regra é a pergunta: "Que mudança concreta isso vai gerar quando estiver pronto?". Isso transforma uma cultura de "entregar tarefas" em uma cultura de "gerar impacto", do estagiário ao CEO.',
    promptSuggestions: ['Vamos jogar o Jogo do Fractal Organizacional', 'Como aplicar a regra na liderança?', 'Analise minha tarefa pelo método fractal']
  },
  {
    id: 'intro',
    title: 'O que são Fractais?',
    description: 'Fractais são formas geométricas complexas que exibem "auto-similaridade". Isso significa que, se você der um zoom em qualquer parte deles, verá uma versão menor da imagem inteira. Eles são infinitamente complexos e são criados repetindo um processo simples várias vezes.',
    promptSuggestions: ['Como explicar fractais para uma criança?', 'Qual a diferença entre geometria euclidiana e fractal?']
  },
  {
    id: 'mandelbrot',
    title: 'Conjunto de Mandelbrot',
    description: 'O rei dos fractais. Definido pela equação simples Z = Z² + C. Apesar da simplicidade da fórmula, ela gera uma das estruturas mais complicadas e bonitas da matemática. A área preta representa os números que não escapam para o infinito, enquanto as cores mostram quão rápido os números escapam.',
    promptSuggestions: ['Explique a fórmula Z = Z² + C', 'Quem descobriu o conjunto de Mandelbrot?']
  },
  {
    id: 'nature',
    title: 'Fractais na Natureza',
    description: 'A natureza ama fractais! Eles são a maneira mais eficiente de preencher espaço. Você pode vê-los em flocos de neve, brócolis romanesco, sistemas de raízes de plantas, relâmpagos, linhas costeiras e até mesmo nos vasos sanguíneos de seus pulmões.',
    promptSuggestions: ['Dê 5 exemplos de fractais na natureza', 'Por que as árvores são fractais?']
  },
  {
    id: 'dimension',
    title: 'Dimensão Fractal',
    description: 'Na geometria clássica, linhas são 1D, planos 2D e cubos 3D. Fractais quebram essa regra! Eles têm dimensões fracionárias. Por exemplo, uma linha costeira rugosa preenche mais espaço do que uma linha reta simples, mas não chega a ser uma área 2D completa. Sua dimensão pode ser 1.26, por exemplo.',
    promptSuggestions: ['O que significa ter dimensão 1.5?', 'Como calcular a dimensão fractal?']
  }
];

const Concepts: React.FC<ConceptsProps> = ({ onAskTutor }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto overflow-y-auto h-full custom-scrollbar">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
          Aprenda Fractais
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Da matemática pura à gestão organizacional: descubra como padrões simples criam resultados complexos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Destaque para o novo conceito */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-cyan-500/30 overflow-hidden hover:border-cyan-500 transition-colors shadow-lg shadow-cyan-900/10">
            <div className="p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Novo</span>
                        <h3 className="text-2xl font-bold text-white">{conceptsData[0].title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                        {conceptsData[0].description}
                    </p>
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Simule com IA:</p>
                        <div className="flex flex-wrap gap-2">
                        {conceptsData[0].promptSuggestions.map((prompt, idx) => (
                            <button
                            key={idx}
                            onClick={() => onAskTutor(prompt)}
                            className="text-sm bg-cyan-900/30 hover:bg-cyan-600 border border-cyan-700/50 text-cyan-100 hover:text-white px-4 py-2 rounded-lg transition-colors text-left"
                            >
                            {prompt}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
                {/* Visual simples para o fractal organizacional */}
                <div className="hidden md:flex flex-col gap-2 opacity-50 select-none">
                     <div className="flex justify-center"><div className="w-4 h-4 bg-cyan-500 rounded-full"></div></div>
                     <div className="flex gap-8 justify-center">
                        <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                        <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                     </div>
                     <div className="flex gap-2 justify-center">
                        <div className="w-2 h-2 bg-cyan-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-cyan-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-cyan-700 rounded-full"></div>
                        <div className="w-2 h-2 bg-cyan-700 rounded-full"></div>
                     </div>
                     <div className="text-center text-xs text-cyan-500 mt-2 font-mono">Regra única.<br/>Múltiplos níveis.</div>
                </div>
            </div>
        </div>

        {conceptsData.slice(1).map((concept) => (
          <div key={concept.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-colors shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">{concept.title}</h3>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                {concept.description}
              </p>
              
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Pergunte ao Tutor:</p>
                <div className="flex flex-wrap gap-2">
                  {concept.promptSuggestions.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onAskTutor(prompt)}
                      className="text-xs bg-slate-700 hover:bg-purple-600 text-slate-200 hover:text-white px-3 py-2 rounded-lg transition-colors text-left"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl border border-white/10 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Quer ver a matemática?</h3>
        <p className="text-slate-300 mb-4">Vá para o Playground e manipule o Conjunto de Mandelbrot em tempo real.</p>
        <button 
            onClick={() => onAskTutor("NAVIGATE_PLAYGROUND")} 
            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-cyan-50 transition-colors"
        >
            Ir para o Playground
        </button>
      </div>
    </div>
  );
};

export default Concepts;