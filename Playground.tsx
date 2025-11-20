import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FractalConfig } from './types';

const Playground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState<FractalConfig>({
    maxIterations: 100,
    zoom: 1,
    offsetX: -0.5,
    offsetY: 0,
    colorScheme: 'neon',
  });

  const [isRendering, setIsRendering] = useState(false);

  const drawFractal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const { maxIterations, zoom, offsetX, offsetY, colorScheme } = config;
    
    // Mandelbrot viewport
    // We want to map pixel (x,y) to complex plane
    // base range is approx -2.5 to 1 on real axis
    const baseScale = 3.0; 
    const scale = baseScale / zoom;
    
    const xMin = offsetX - scale * (width / height) / 2;
    const yMin = offsetY - scale / 2;

    for (let py = 0; py < height; py++) {
      const y0 = yMin + (py / height) * scale;
      for (let px = 0; px < width; px++) {
        const x0 = xMin + (px / width) * scale * (width / height); // Correct aspect ratio

        let x = 0;
        let y = 0;
        let iteration = 0;
        let x2 = 0;
        let y2 = 0;

        while (x2 + y2 <= 4 && iteration < maxIterations) {
          y = 2 * x * y + y0;
          x = x2 - y2 + x0;
          x2 = x * x;
          y2 = y * y;
          iteration++;
        }

        const pixelIndex = (py * width + px) * 4;

        if (iteration === maxIterations) {
          // Inside the set (Black)
          data[pixelIndex] = 0;
          data[pixelIndex + 1] = 0;
          data[pixelIndex + 2] = 0;
          data[pixelIndex + 3] = 255;
        } else {
          // Outside the set (Coloring)
          const t = iteration / maxIterations;
          let r, g, b;

          if (colorScheme === 'fire') {
             r = Math.floor(255 * t * 2);
             g = Math.floor(128 * t);
             b = Math.floor(50 * t);
          } else if (colorScheme === 'ice') {
             r = Math.floor(50 * t);
             g = Math.floor(150 * t);
             b = Math.floor(255 * Math.min(1, t * 1.5));
          } else { // Neon
             r = Math.floor(Math.sin(t * Math.PI * 2) * 127 + 128);
             g = Math.floor(Math.sin(t * Math.PI * 2 + 2) * 127 + 128);
             b = Math.floor(Math.sin(t * Math.PI * 2 + 4) * 127 + 128);
          }

          data[pixelIndex] = r;
          data[pixelIndex + 1] = g;
          data[pixelIndex + 2] = b;
          data[pixelIndex + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsRendering(false);
  }, [config]);

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Set actual canvas size to match display size for sharpness
      // Lower resolution for performance if needed, but let's try full res first
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
    
    // Use a timeout to debounce rendering during rapid state changes if needed,
    // but for now direct render
    requestAnimationFrame(drawFractal);
  }, [drawFractal, config.maxIterations, config.colorScheme]); // Resize triggers are separate

  // Handle Interaction
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const newZoom = e.deltaY < 0 ? config.zoom * zoomFactor : config.zoom / zoomFactor;
    setConfig(prev => ({ ...prev, zoom: newZoom }));
  };

  const handlePan = (dx: number, dy: number) => {
    // Map pixel delta to complex plane delta
    const canvas = canvasRef.current;
    if(!canvas) return;
    
    const baseScale = 3.0;
    const scale = baseScale / config.zoom;
    
    // Move opposite to drag
    const moveX = -(dx / canvas.width) * scale * (canvas.width/canvas.height);
    const moveY = -(dy / canvas.height) * scale;

    setConfig(prev => ({
      ...prev,
      offsetX: prev.offsetX + moveX,
      offsetY: prev.offsetY + moveY
    }));
  };

  // Simple drag implementation
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    handlePan(dx, dy);
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-cyan-400">Mandelbrot Explorer</h2>
        <div className="flex gap-4 items-center text-sm">
          <div className="flex flex-col">
            <label className="text-slate-400 text-xs">Iterações ({config.maxIterations})</label>
            <input 
              type="range" 
              min="50" 
              max="500" 
              step="10"
              value={config.maxIterations} 
              onChange={(e) => setConfig({...config, maxIterations: Number(e.target.value)})}
              className="w-32 accent-cyan-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-slate-400 text-xs">Zoom ({config.zoom.toFixed(1)}x)</label>
            <div className="flex gap-1">
              <button 
                onClick={() => setConfig(p => ({...p, zoom: p.zoom / 1.5}))}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
              >-</button>
               <button 
                onClick={() => setConfig(p => ({...p, zoom: p.zoom * 1.5}))}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
              >+</button>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-slate-400 text-xs">Cores</label>
            <select 
              value={config.colorScheme}
              onChange={(e) => setConfig({...config, colorScheme: e.target.value as any})}
              className="bg-slate-700 border-none rounded text-xs py-1 px-2 text-white"
            >
              <option value="neon">Neon</option>
              <option value="fire">Fogo</option>
              <option value="ice">Gelo</option>
            </select>
          </div>
           <button 
              onClick={() => setConfig({ maxIterations: 100, zoom: 1, offsetX: -0.5, offsetY: 0, colorScheme: 'neon' })}
              className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs border border-red-500/30"
            >
              Reset
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex-1 relative overflow-hidden cursor-move bg-black"
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full"
        />
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-3 py-2 rounded text-xs text-slate-300 border border-slate-700 pointer-events-none">
          <p>Use o <b>scroll</b> para zoom</p>
          <p>Clique e <b>arraste</b> para mover</p>
        </div>
      </div>
    </div>
  );
};

export default Playground;