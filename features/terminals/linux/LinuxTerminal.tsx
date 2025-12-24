
import React, { useState, useRef, useEffect } from 'react';
import { Tally3, Circle, Maximize2 } from 'lucide-react';
import { TerminalProps, Line } from '../shared/types.ts';
import { COMMANDS } from '../../../constants/commands.ts';

// --- Linux FS Simulation ---
type FSNode = { type: 'file' | 'dir'; content?: string; children?: Record<string, FSNode> };
const INITIAL_FS: Record<string, FSNode> = {
  '~': {
    type: 'dir',
    children: {
      'scripts': { type: 'dir', children: { 'deploy.sh': { type: 'file', content: '#!/bin/bash\necho "Deploying..."' } } },
      'server.conf': { type: 'file', content: 'port=8080\nhost=localhost' }
    }
  }
};

export const LinuxTerminal: React.FC<TerminalProps> = ({ onCommandRun }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Line[]>([]);
  const [cwd, setCwd] = useState<string[]>(['~']);
  const [fs, setFs] = useState<Record<string, FSNode>>(INITIAL_FS);
  const [isBooting, setIsBooting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getNode = (path: string[]): FSNode | null => {
    let current = fs['~'];
    for (let i = 1; i < path.length; i++) {
      if (!current.children || !current.children[path[i]]) return null;
      current = current.children[path[i]];
    }
    return current;
  };

  useEffect(() => {
    const bootLines = [
      'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)',
      ' * Documentation:  https://help.ubuntu.com',
      ' * Management:     https://landscape.canonical.com',
      ' * Support:        https://ubuntu.com/pro',
      '',
      'System information as of ' + new Date().toUTCString(),
      'System load:  0.08               Processes:             102',
      'Usage of /:   12.4% of 38.60GB   Users logged in:       1',
      'Memory usage: 24%                IPv4 address for eth0: 192.168.1.42',
      '',
      '0 updates can be applied immediately.'
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
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    if (onCommandRun) onCommandRun(cmd);

    let output: Line[] = [];

    switch (cmd) {
      case 'clear': setHistory([]); return;
      case 'help':
        output.push({ type: 'output', content: 'GNU bash, version 5.1.16(1)-release. Commands: ls, cd, mkdir, rm, cat, apt, sudo, top...' });
        break;
      case 'whoami': output.push({ type: 'output', content: 'root' }); break;
      case 'pwd': output.push({ type: 'output', content: '/home/root/' + cwd.slice(1).join('/') }); break;
      case 'hostname': output.push({ type: 'output', content: 'ubuntu-server' }); break;
      case 'date': output.push({ type: 'output', content: new Date().toUTCString() }); break;
      case 'echo': output.push({ type: 'output', content: args.join(' ').replace(/['"]/g, '') }); break;
      case 'ls':
        const node = getNode(cwd);
        if (node && node.children) {
          const items = Object.entries(node.children).map(([k, v]) => v.type === 'dir' ? `\x1b[34m${k}/\x1b[0m` : k);
          // Simple colored mock using a span in render
          output.push({ type: 'output', content: items.join('  ') });
        }
        break;
      case 'cd':
        if (!args[0] || args[0] === '~') setCwd(['~']);
        else if (args[0] === '..') { if (cwd.length > 1) setCwd(cwd.slice(0, -1)); }
        else {
          const target = args[0].replace(/\/$/, '');
          const curr = getNode(cwd);
          if (curr && curr.children && curr.children[target]?.type === 'dir') setCwd([...cwd, target]);
          else output.push({ type: 'error', content: `bash: cd: ${target}: No such file or directory` });
        }
        break;
      case 'mkdir':
        if (args[0]) {
           setFs(prev => {
             const copy = JSON.parse(JSON.stringify(prev));
             let ptr = copy['~'];
             for (let i=1; i<cwd.length; i++) ptr = ptr.children[cwd[i]];
             if (!ptr.children) ptr.children = {};
             ptr.children[args[0]] = { type: 'dir', children: {} };
             return copy;
           });
        }
        break;
      case 'rm':
        if (args[0]) {
          setFs(prev => {
             const copy = JSON.parse(JSON.stringify(prev));
             let ptr = copy['~'];
             for (let i=1; i<cwd.length; i++) ptr = ptr.children[cwd[i]];
             if (ptr.children && ptr.children[args[0]]) delete ptr.children[args[0]];
             else output.push({ type: 'error', content: `rm: cannot remove '${args[0]}': No such file` });
             return copy;
          });
        }
        break;
      case 'cat':
        if (args[0]) {
           const curr = getNode(cwd);
           if (curr && curr.children && curr.children[args[0]]?.type === 'file') output.push({ type: 'output', content: curr.children[args[0]].content || '' });
           else output.push({ type: 'error', content: `cat: ${args[0]}: No such file or directory` });
        }
        break;
      // Linux Specifics
      case 'sudo':
        if (args.length === 0) output.push({ type: 'output', content: 'usage: sudo -h | -K | -k | -V | -v | -l | -L ...' });
        else output.push({ type: 'output', content: '[sudo] password for root: \nSorry, try again.' });
        break;
      case 'apt':
      case 'apt-get':
        if (args[0] === 'update') output.push({ type: 'output', content: 'Hit:1 http://us.archive.ubuntu.com/ubuntu jammy InRelease\nGet:2 http://us.archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]\nFetched 119 kB in 1s (132 kB/s)\nReading package lists... Done' });
        else if (args[0] === 'install') output.push({ type: 'output', content: `Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed:\n  ${args[1] || 'package'}\n0 upgraded, 1 newly installed, 0 to remove.\nNeed to get 1,420 kB of archives.\nUnpacking ${args[1] || 'package'}...\nSetting up ${args[1] || 'package'}...` });
        else output.push({ type: 'output', content: 'apt 2.4.5 (amd64)' });
        break;
      case 'top':
      case 'htop':
         output.push({ type: 'system', content: '[Interactive process viewer simulation started... press Ctrl+C to exit]' });
         break;
      default:
        const found = COMMANDS.find(c => c.cmd.toLowerCase().startsWith(cmd) && (c.os === 'Linux' || c.os === 'Universal'));
        if (found) output.push({ type: 'system', content: `> Executing: ${cmd}\n${found.desc}` });
        else output.push({ type: 'error', content: `${cmd}: command not found` });
    }
    setHistory(prev => [...prev, { type: 'input', content: cmdStr }, ...output]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
  };

  const dirDisplay = cwd.length === 1 ? '~' : '~/' + cwd.slice(1).join('/');

  return (
    <div className="flex flex-col h-full bg-[#120818] rounded-xl overflow-hidden border border-white/5 shadow-2xl font-mono text-[11px]">
      <div className="bg-[#2a1b35] px-3 py-2 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5"><Circle size={8} className="fill-zinc-600/50 text-transparent" /><Circle size={8} className="fill-zinc-600/50 text-transparent" /></div>
        <div className="flex items-center gap-2 text-zinc-300 font-bold opacity-80">
          <Tally3 size={10} className="text-orange-500" /> <span>root@ubuntu: {dirDisplay}</span>
        </div>
        <Maximize2 size={10} className="text-zinc-500" />
      </div>
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto selection:bg-orange-500/30">
        {history.map((l, i) => (
          <div key={i} className={`mb-1 break-words leading-relaxed ${l.type === 'error' ? 'text-red-400' : l.type === 'system' ? 'text-zinc-500' : l.type === 'input' ? 'text-white' : 'text-zinc-300'}`}>
            {l.type === 'input' ? (
              <div className="flex gap-2">
                <span className="text-emerald-500 font-bold whitespace-nowrap">root@ubuntu:<span className="text-blue-500">{dirDisplay}</span>#</span>
                <span>{l.content}</span>
              </div>
            ) : <span className="whitespace-pre-wrap">{l.content}</span>}
          </div>
        ))}
        {!isBooting && (
          <form onSubmit={handleCommand} className="flex gap-2 mt-2">
            <span className="text-emerald-500 font-bold whitespace-nowrap">root@ubuntu:<span className="text-blue-500">{dirDisplay}</span>#</span>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} className="bg-transparent border-none outline-none text-white w-full font-bold" autoFocus spellCheck={false} autoComplete="off" />
          </form>
        )}
      </div>
    </div>
  );
};
