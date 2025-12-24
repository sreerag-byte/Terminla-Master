
import React, { useState, useRef, useEffect } from 'react';
import { Apple, Circle, Maximize2, Terminal as TerminalIcon } from 'lucide-react';
import { TerminalProps, Line } from '../shared/types.ts';
import { COMMANDS } from '../../../constants/commands.ts';

// --- File System Simulation ---
type FSNode = { type: 'file' | 'dir'; content?: string; children?: Record<string, FSNode> };

const INITIAL_FS: Record<string, FSNode> = {
  '~': {
    type: 'dir',
    children: {
      'Projects': {
        type: 'dir',
        children: {
          'website': { type: 'dir', children: { 'index.html': { type: 'file', content: '<html>Hello World</html>' } } },
          'notes.txt': { type: 'file', content: 'Meeting notes:\n- Review PRs\n- Deploy to prod' }
        }
      },
      'Downloads': { type: 'dir', children: {} },
      'config.yml': { type: 'file', content: 'theme: dark\nversion: 1.0.0' }
    }
  }
};

export const MacTerminal: React.FC<TerminalProps> = ({ onCommandRun }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Line[]>([]);
  const [cwd, setCwd] = useState<string[]>(['~']);
  const [fs, setFs] = useState<Record<string, FSNode>>(INITIAL_FS);
  const [isBooting, setIsBooting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper to traverse FS
  const getNode = (path: string[]): FSNode | null => {
    if (path.length === 0) return null; // Root
    // For simplicity in this mock, we assume '~' is the top level accessible
    let current = fs['~'];
    if (path[0] !== '~') return null;
    
    for (let i = 1; i < path.length; i++) {
      if (current.type !== 'dir' || !current.children || !current.children[path[i]]) return null;
      current = current.children[path[i]];
    }
    return current;
  };

  useEffect(() => {
    // Boot sequence
    const bootLines = [
      'Darwin kernel version 23.4.0: root:xnu-10063.101.15~2/RELEASE_ARM64_T6000',
      'System Integrity Protection: enabled',
      'Login: admin @ tty1',
      'Last login: ' + new Date().toUTCString()
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setHistory(prev => [...prev, { type: 'system', content: bootLines[i] }]);
        i++;
      } else {
        clearInterval(interval);
        setIsBooting(false);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Check if it's a known command for mastery tracking
    if (onCommandRun) onCommandRun(cmd);

    let output: Line[] = [];

    switch (cmd) {
      case 'clear':
        setHistory([]);
        return;
      case 'help':
        output.push({ type: 'output', content: 'Available shell commands: ls, cd, pwd, mkdir, touch, rm, cat, whoami, date, history, echo' });
        break;
      case 'whoami':
        output.push({ type: 'output', content: 'admin' });
        break;
      case 'pwd':
        output.push({ type: 'output', content: '/' + cwd.join('/').replace('~', 'Users/admin') });
        break;
      case 'hostname':
        output.push({ type: 'output', content: 'macbook-pro.local' });
        break;
      case 'date':
        output.push({ type: 'output', content: new Date().toString() });
        break;
      case 'echo':
        output.push({ type: 'output', content: args.join(' ').replace(/['"]/g, '') });
        break;
      case 'ls':
        const node = getNode(cwd);
        if (node && node.type === 'dir' && node.children) {
          const items = Object.keys(node.children).map(name => {
            const isDir = node.children![name].type === 'dir';
            return isDir ? `${name}/` : name;
          });
          output.push({ type: 'output', content: items.join('  ') });
        }
        break;
      case 'cd':
        if (!args[0] || args[0] === '~') {
          setCwd(['~']);
        } else if (args[0] === '..') {
          if (cwd.length > 1) setCwd(cwd.slice(0, -1));
        } else {
          const target = args[0].replace(/\/$/, '');
          const currNode = getNode(cwd);
          if (currNode && currNode.children && currNode.children[target] && currNode.children[target].type === 'dir') {
            setCwd([...cwd, target]);
          } else {
            output.push({ type: 'error', content: `cd: no such file or directory: ${target}` });
          }
        }
        break;
      case 'mkdir':
        if (args[0]) {
          const newDir = args[0];
          setFs(prev => {
            const copy = JSON.parse(JSON.stringify(prev)); // Deep copy hack
            let ptr = copy['~'];
            for (let i = 1; i < cwd.length; i++) ptr = ptr.children[cwd[i]];
            if (!ptr.children) ptr.children = {};
            ptr.children[newDir] = { type: 'dir', children: {} };
            return copy;
          });
        }
        break;
      case 'touch':
        if (args[0]) {
          const newFile = args[0];
          setFs(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            let ptr = copy['~'];
            for (let i = 1; i < cwd.length; i++) ptr = ptr.children[cwd[i]];
            if (!ptr.children) ptr.children = {};
            ptr.children[newFile] = { type: 'file', content: '' };
            return copy;
          });
        }
        break;
      case 'rm':
        if (args[0]) {
          const target = args[0];
          setFs(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            let ptr = copy['~'];
            for (let i = 1; i < cwd.length; i++) ptr = ptr.children[cwd[i]];
            if (ptr.children && ptr.children[target]) {
              delete ptr.children[target];
            } else {
              output.push({ type: 'error', content: `rm: ${target}: No such file or directory` });
            }
            return copy;
          });
        }
        break;
      case 'cat':
        if (args[0]) {
          const target = args[0];
          const currNode = getNode(cwd);
          if (currNode && currNode.children && currNode.children[target]) {
            if (currNode.children[target].type === 'file') {
              output.push({ type: 'output', content: currNode.children[target].content || '' });
            } else {
              output.push({ type: 'error', content: `cat: ${target}: Is a directory` });
            }
          } else {
            output.push({ type: 'error', content: `cat: ${target}: No such file or directory` });
          }
        }
        break;
      // Mocked Tools
      case 'git':
        if (args[0] === 'status') output.push({ type: 'output', content: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean' });
        else if (args[0] === 'init') output.push({ type: 'output', content: `Initialized empty Git repository in /Users/admin/${cwd.length > 1 ? cwd[cwd.length-1] : ''}/.git/` });
        else output.push({ type: 'output', content: 'usage: git <command> [<args>]' });
        break;
      case 'npm':
        if (args[0] === 'install') output.push({ type: 'output', content: 'added 142 packages, and audited 143 packages in 842ms\n\nfound 0 vulnerabilities' });
        else output.push({ type: 'output', content: 'npm <command>' });
        break;
      default:
        const found = COMMANDS.find(c => c.cmd.toLowerCase().startsWith(cmd) && (c.os === 'Mac' || c.os === 'Universal'));
        if (found) {
          // It's a command we know about but haven't simulated fully. Show description.
          output.push({ type: 'system', content: `[SIMULATED EXECUTION]: ${found.desc}` });
        } else {
          output.push({ type: 'error', content: `zsh: command not found: ${cmd}` });
        }
    }

    setHistory(prev => [...prev, { type: 'input', content: cmdStr }, ...output]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
  };

  const currentDirName = cwd.length === 1 && cwd[0] === '~' ? '~' : cwd[cwd.length - 1];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/5 shadow-2xl font-mono text-[11px]">
      <div className="bg-[#2d2d2d] px-3 py-2 flex items-center justify-between border-b border-black/20">
        <div className="flex gap-1.5">
          <Circle size={8} className="fill-rose-500 text-rose-600/20" />
          <Circle size={8} className="fill-amber-500 text-amber-600/20" />
          <Circle size={8} className="fill-emerald-500 text-emerald-600/20" />
        </div>
        <div className="flex items-center gap-2 text-zinc-400 font-bold opacity-80">
          <TerminalIcon size={10} /> <span>admin — -zsh</span>
        </div>
        <Maximize2 size={10} className="text-zinc-600" />
      </div>
      
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto selection:bg-indigo-500/30">
        {history.map((l, i) => (
          <div key={i} className={`mb-1 break-words leading-relaxed
            ${l.type === 'error' ? 'text-rose-400' : ''}
            ${l.type === 'system' ? 'text-zinc-500 italic' : ''}
            ${l.type === 'output' ? 'text-zinc-300' : ''}
            ${l.type === 'input' ? 'text-white' : ''}
          `}>
            {l.type === 'input' ? (
              <div className="flex gap-2">
                <span className="text-emerald-400 font-bold whitespace-nowrap">admin@macbook <span className="text-blue-400">{currentDirName}</span> %</span>
                <span>{l.content}</span>
              </div>
            ) : <span className="whitespace-pre-wrap">{l.content}</span>}
          </div>
        ))}
        {!isBooting && (
          <form onSubmit={handleCommand} className="flex gap-2 mt-2">
             <span className="text-emerald-400 font-bold whitespace-nowrap">admin@macbook <span className="text-blue-400">{currentDirName}</span> %</span>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="bg-transparent border-none outline-none text-white w-full font-medium" 
              autoFocus 
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        )}
      </div>
    </div>
  );
};
