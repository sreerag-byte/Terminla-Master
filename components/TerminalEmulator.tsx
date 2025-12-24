
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Circle, Command, Cpu, Zap, Wifi } from 'lucide-react';
import { COMMANDS } from '../constants/commands';

interface Line {
  type: 'input' | 'output' | 'error' | 'system' | 'header';
  content: string;
}

interface TerminalEmulatorProps {
  onCommandRun?: (cmd: string) => void;
}

export const TerminalEmulator: React.FC<TerminalEmulatorProps> = ({ onCommandRun }) => {
  const [input, setInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [history, setHistory] = useState<Line[]>([]);
  const [fs, setFs] = useState<string[]>(['src', 'docs', 'kernel.sys']);
  const [currentDir, setCurrentDir] = useState('/home/master');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bootLines: Line[] = [
      { type: 'header', content: '>>> MASTER_PRO COMPACT v2.6.4' },
      { type: 'system', content: '[ OK ] Modules loaded.' },
      { type: 'output', content: 'Ready.' },
    ];
    let timer: any;
    const animateBoot = (idx: number) => {
      if (idx < bootLines.length) {
        setHistory(prev => [...prev, bootLines[idx]]);
        timer = setTimeout(() => animateBoot(idx + 1), 150);
      } else setIsBooting(false);
    };
    animateBoot(0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) return;
    const parts = rawInput.split(' ');
    const cmdText = parts[0].toLowerCase();
    const args = parts.slice(1);
    const newHistory: Line[] = [...history, { type: 'input', content: rawInput }];
    if (onCommandRun) onCommandRun(cmdText);

    switch (cmdText) {
      case 'help':
        newHistory.push({ type: 'output', content: 'CMDS: ls, pwd, whoami, date, clear, help' });
        break;
      case 'ls':
        newHistory.push({ type: 'output', content: fs.join('  ') });
        break;
      case 'pwd':
        newHistory.push({ type: 'output', content: currentDir });
        break;
      case 'whoami':
        newHistory.push({ type: 'output', content: 'admin@master' });
        break;
      case 'clear':
        setHistory([{ type: 'header', content: '--- Buffer Flushed ---' }]);
        setInput('');
        return;
      default:
        const found = COMMANDS.find(c => c.cmd.toLowerCase().startsWith(cmdText));
        if (found) newHistory.push({ type: 'output', content: found.desc });
        else newHistory.push({ type: 'error', content: `sh: not found: ${cmdText}` });
        break;
    }
    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="glass-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[350px] lg:h-[400px] relative transition-all hover:border-indigo-500/30">
      <div className="bg-zinc-900/90 px-4 py-2 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5">
          <Circle size={8} className="fill-rose-500/60 text-transparent" />
          <Circle size={8} className="fill-amber-500/60 text-transparent" />
          <Circle size={8} className="fill-emerald-500/60 text-transparent" />
        </div>
        <div className="text-zinc-600 text-[8px] font-mono font-black uppercase tracking-widest flex items-center gap-2">
           <Command size={10} className="text-indigo-500" /> ~{currentDir.split('/').pop()}
        </div>
        <Maximize2 size={10} className="text-zinc-700" />
      </div>

      <div ref={scrollRef} className="flex-1 p-5 font-mono text-[10px] overflow-y-auto bg-[#020617] relative">
        <div className="space-y-1 relative z-10">
          {history.map((line, i) => (
            <div key={i} className={`
              ${line.type === 'error' ? 'text-rose-500' : ''}
              ${line.type === 'system' ? 'text-zinc-700' : ''}
              ${line.type === 'output' ? 'text-emerald-400/80' : ''}
              ${line.type === 'header' ? 'text-indigo-400 font-bold mb-1' : ''}
            `}>
              {line.type === 'input' ? (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">➜</span>
                  <span className="text-white">{line.content}</span>
                </div>
              ) : line.content}
            </div>
          ))}
          {!isBooting && (
            <form onSubmit={handleCommand} className="flex items-center mt-3 gap-2">
              <span className="text-emerald-500">➜</span>
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full caret-indigo-500 font-bold"
                autoFocus placeholder="..."
              />
            </form>
          )}
        </div>
      </div>

      <div className="px-4 py-1.5 bg-zinc-950/80 text-[8px] text-zinc-700 font-mono tracking-widest flex justify-between items-center border-t border-white/5 uppercase font-bold">
        <span>MEM: 24MB</span>
        <div className="flex items-center gap-2">
          <span>{fs.length} UNITS</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </div>
  );
};
