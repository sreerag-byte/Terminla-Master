
import React, { useState, useRef, useEffect } from 'react';
import { MonitorDot, Circle, Maximize2 } from 'lucide-react';
import { TerminalProps, Line } from '../shared/types.ts';
import { COMMANDS } from '../../../constants/commands.ts';

// --- Windows FS Simulation ---
type FSNode = { type: 'file' | 'dir'; content?: string; children?: Record<string, FSNode> };
const INITIAL_FS: Record<string, FSNode> = {
  'Users': {
    type: 'dir',
    children: {
      'Administrator': {
        type: 'dir',
        children: {
          'Documents': { type: 'dir', children: { 'report.docx': { type: 'file', content: 'SECRET REPORT' } } },
          'Downloads': { type: 'dir', children: { 'installer.exe': { type: 'file', content: 'BINARY DATA' } } },
          'Desktop': { type: 'dir', children: {} }
        }
      }
    }
  },
  'Windows': { type: 'dir', children: { 'System32': { type: 'dir', children: {} } } }
};

export const WindowsTerminal: React.FC<TerminalProps> = ({ onCommandRun }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Line[]>([]);
  // Start in C:\Users\Administrator
  const [cwd, setCwd] = useState<string[]>(['Users', 'Administrator']);
  const [fs, setFs] = useState<Record<string, FSNode>>(INITIAL_FS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bootLines = [
      'Windows PowerShell',
      'Copyright (C) Microsoft Corporation. All rights reserved.',
      '',
      'Try the new cross-platform PowerShell https://aka.ms/pscore6',
      ''
    ];
    // Immediate boot for Windows
    setHistory(bootLines.map(c => ({ type: 'system', content: c })));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  // Helper to traverse
  const getNode = (path: string[]): FSNode | null => {
    let current = fs[path[0]]; // Initial check
    if (!current && path.length > 0) return null; // Root handling loose

    // This is simplified. Assuming path starts from virtual Root which contains 'Users', 'Windows'
    // But our `fs` state IS the root children.
    let ptr: FSNode | undefined = fs[path[0]];
    if (!ptr) return null;

    for (let i = 1; i < path.length; i++) {
      if (!ptr.children || !ptr.children[path[i]]) return null;
      ptr = ptr.children[path[i]];
    }
    return ptr;
  };

  const executeCommand = (cmdStr: string) => {
    const parts = cmdStr.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    if (onCommandRun) onCommandRun(cmd);

    let output: Line[] = [];

    switch (cmd) {
      case 'cls':
      case 'clear':
        setHistory([]);
        return;
      case 'help':
        output.push({ type: 'output', content: 'PowerShell Commands: dir, cd, cls, echo, type, mkdir, del, ipconfig, systeminfo...' });
        break;
      case 'pwd': // alias
        output.push({ type: 'output', content: 'Path\n----\nC:\\' + cwd.join('\\') });
        break;
      case 'whoami':
        output.push({ type: 'output', content: 'nt authority\\system' });
        break;
      case 'echo':
      case 'write-host':
        output.push({ type: 'output', content: args.join(' ').replace(/['"]/g, '') });
        break;
      case 'ls':
      case 'dir':
      case 'gci':
        const node = getNode(cwd);
        if (node && node.children) {
          const table = Object.entries(node.children).map(([k, v]) => {
            const mode = v.type === 'dir' ? 'd-----' : '-a----';
            const date = new Date().toLocaleDateString();
            const time = new Date().toLocaleTimeString();
            return `${mode}        ${date}     ${time}            ${k}`;
          });
          output.push({ type: 'output', content: `    Directory: C:\\${cwd.join('\\')}\n\nMode                LastWriteTime         Length Name\n----                -------------         ------ ----\n${table.join('\n')}` });
        }
        break;
      case 'cd':
      case 'chdir':
        if (!args[0] || args[0] === '\\') setCwd(['Users', 'Administrator']);
        else if (args[0] === '..') { if (cwd.length > 0) setCwd(cwd.slice(0, -1)); }
        else {
          const target = args[0].replace(/\\$/, '');
          const curr = getNode(cwd);
          if (curr && curr.children && curr.children[target]?.type === 'dir') setCwd([...cwd, target]);
          else output.push({ type: 'error', content: `cd : Cannot find path 'C:\\${cwd.join('\\')}\\${target}' because it does not exist.` });
        }
        break;
      case 'mkdir':
      case 'md':
      case 'ni':
        if (args[0]) {
           setFs(prev => {
             const copy = JSON.parse(JSON.stringify(prev));
             // Traverse
             let ptr: any = copy[cwd[0]];
             for (let i = 1; i < cwd.length; i++) ptr = ptr.children[cwd[i]];
             
             if (!ptr.children) ptr.children = {};
             // Create
             ptr.children[args[0]] = { type: 'dir', children: {} };
             
             output.push({ type: 'output', content: `    Directory: C:\\${cwd.join('\\')}\n\nMode                LastWriteTime         Length Name\n----                -------------         ------ ----\nd-----        ${new Date().toLocaleTimeString()}                ${args[0]}` });
             return copy;
           });
        }
        break;
      case 'cat':
      case 'type':
      case 'gc':
        if (args[0]) {
           const curr = getNode(cwd);
           if (curr && curr.children && curr.children[args[0]]?.type === 'file') output.push({ type: 'output', content: curr.children[args[0]].content || '' });
           else output.push({ type: 'error', content: `type : Cannot find path 'C:\\${cwd.join('\\')}\\${args[0]}' because it does not exist.` });
        }
        break;
      // Windows Specifics
      case 'ipconfig':
        output.push({ type: 'output', content: '\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : localdomain\n   IPv6 Address. . . . . . . . . . . : fe80::a00:27ff:fe36:e31e%4\n   IPv4 Address. . . . . . . . . . . : 10.0.2.15\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 10.0.2.2' });
        break;
      case 'systeminfo':
        output.push({ type: 'output', content: 'Host Name:                 DESKTOP-MASTER\nOS Name:                   Microsoft Windows 11 Pro\nOS Version:                10.0.22621 N/A Build 22621\nSystem Manufacturer:       MasterPro Systems\nSystem Type:               x64-based PC\nProcessor(s):              1 Processor(s) Installed.' });
        break;
      default:
        const found = COMMANDS.find(c => c.cmd.toLowerCase().startsWith(cmd) && (c.os === 'Windows' || c.os === 'Universal'));
        if (found) {
           output.push({ type: 'output', content: `Success: Executed ${cmd}\n${found.desc}` });
        } else {
           output.push({ type: 'error', content: `${cmd} : The term '${cmd}' is not recognized as the name of a cmdlet, function, script file, or operable program.` });
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

  const pathDisplay = `PS C:\\${cwd.join('\\')}>`;

  return (
    <div className="flex flex-col h-full bg-[#012456] rounded-xl overflow-hidden border border-white/5 shadow-2xl font-mono text-[11px]">
      <div className="bg-[#e6f3ff] px-3 py-1 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5"><Circle size={8} className="fill-zinc-400 text-transparent" /></div>
        <div className="flex items-center gap-2 text-black font-semibold text-[10px]">
          <MonitorDot size={10} /> <span>Administrator: Windows PowerShell</span>
        </div>
        <Maximize2 size={10} className="text-zinc-400" />
      </div>
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto selection:bg-white/20">
        {history.map((l, i) => (
          <div key={i} className={`mb-0.5 break-words leading-snug ${l.type === 'error' ? 'text-red-300 bg-red-900/20 py-1' : l.type === 'system' ? 'text-zinc-400' : 'text-zinc-100'}`}>
            {l.type === 'input' ? <div className="flex gap-2 mt-2"><span className="text-white font-normal">{pathDisplay}</span> <span>{l.content}</span></div> : <span className="whitespace-pre-wrap font-medium">{l.content}</span>}
          </div>
        ))}
        <form onSubmit={handleCommand} className="flex gap-2 mt-1">
          <span className="text-white whitespace-nowrap">{pathDisplay}</span>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} className="bg-transparent border-none outline-none text-white w-full" autoFocus spellCheck={false} autoComplete="off" />
        </form>
      </div>
    </div>
  );
};
