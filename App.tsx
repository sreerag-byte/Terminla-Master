
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, Search, LayoutGrid, ChevronRight, Zap,
  FolderTree, Globe, Settings as SettingsIcon, GitBranch, Rocket, Shield, Copy,
  Check, Home as HomeIcon, BookOpen, Monitor, Sparkles, Trophy,
  Activity, Lock, Cpu, MonitorDot, Apple, Tally3, TerminalSquare,
  Maximize2, Minimize2, Sun, Moon, Trash2, Sliders, Info, CornerDownRight, X, GripHorizontal,
  Cloud, Database, Box, Server, Key, Archive, ListFilter, Command, ArrowLeft
} from 'lucide-react';
import { MacTerminal } from './features/terminals/mac/MacTerminal.tsx';
import { LinuxTerminal } from './features/terminals/linux/LinuxTerminal.tsx';
import { WindowsTerminal } from './features/terminals/windows/WindowsTerminal.tsx';
import { COMMANDS } from './constants/commands.ts';
import { Category, OSType } from './types.ts';

const CATEGORIES: Category[] = [
  'Essential', 
  'File System', 
  'Network & Wifi', 
  'System Admin', 
  'Git & Version Control',
  'Docker & Containers',
  'Kubernetes & Orch',
  'Cloud & CLI',
  'Database & Data',
  'DevOps & CI/CD',
  'Security & Perms',
  'Package Management',
  'Process Management',
  'Search & Text',
  'Compression',
  'Platform Specific'
];

type View = 'Home' | 'Terminal' | 'Commands' | 'Tree' | 'Settings';

const NAV_ITEMS = [
  { id: 'Home', icon: <HomeIcon size={20} />, label: 'Nexus' },
  { id: 'Commands', icon: <BookOpen size={20} />, label: 'Codex' },
  { id: 'Tree', icon: <FolderTree size={20} />, label: 'Nodes' },
  { id: 'Terminal', icon: <TerminalSquare size={20} />, label: 'Kernel' },
  { id: 'Settings', icon: <SettingsIcon size={20} />, label: 'Set' },
] as const;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Home');
  const [activeCategory, setActiveCategory] = useState<Category>('Essential');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeOSType, setActiveOSType] = useState<OSType>('Mac');
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);
  const [masteredCommands, setMasteredCommands] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('terminal_mastery_progress');
    const savedTheme = localStorage.getItem('master_theme') as 'dark' | 'light';
    if (saved) try { setMasteredCommands(JSON.parse(saved)); } catch (e) { console.error(e); }
    if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('terminal_mastery_progress', JSON.stringify(masteredCommands));
  }, [masteredCommands]);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  const toggleTheme = () => {
    triggerHaptic();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('master_theme', newTheme);
    document.documentElement.className = newTheme;
  };

  const recordMastery = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().split(' ')[0];
    if (!masteredCommands.includes(cleanCmd)) setMasteredCommands(prev => [...prev, cleanCmd]);
  };

  const clearMastery = () => {
    triggerHaptic();
    if (confirm('Reset all mastery progress?')) {
        setMasteredCommands([]);
        alert('Mastery database purged.');
    }
  };

  const masteryPercentage = Math.round((masteredCommands.length / COMMANDS.length) * 100);

  const filteredCommands = useMemo(() => {
    return COMMANDS.filter(c => {
      const matchesCategory = c.category === activeCategory;
      const matchesSearch = c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && (searchQuery ? true : matchesCategory);
    });
  }, [activeCategory, searchQuery]);

  const handleCopy = (cmd: string) => {
    triggerHaptic();
    navigator.clipboard.writeText(cmd);
    setCopiedId(cmd);
    recordMastery(cmd);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getIcon = (cat: Category) => {
    const s = 14;
    switch (cat) {
      case 'Essential': return <Zap size={s} className="text-amber-500" />;
      case 'File System': return <FolderTree size={s} className="text-emerald-500" />;
      case 'Network & Wifi': return <Globe size={s} className="text-blue-500" />;
      case 'System Admin': return <SettingsIcon size={s} className="text-zinc-500" />;
      case 'Git & Version Control': return <GitBranch size={s} className="text-rose-500" />;
      case 'Docker & Containers': return <Box size={s} className="text-sky-500" />;
      case 'Kubernetes & Orch': return <Tally3 size={s} className="text-blue-600" />;
      case 'Cloud & CLI': return <Cloud size={s} className="text-indigo-400" />;
      case 'Database & Data': return <Database size={s} className="text-yellow-500" />;
      case 'DevOps & CI/CD': return <Rocket size={s} className="text-indigo-500" />;
      case 'Security & Perms': return <Lock size={s} className="text-red-500" />;
      case 'Process Management': return <Activity size={s} className="text-green-500" />;
      case 'Package Management': return <Archive size={s} className="text-purple-500" />;
      case 'Compression': return <Minimize2 size={s} className="text-pink-500" />;
      case 'Search & Text': return <Search size={s} className="text-teal-500" />;
      case 'Platform Specific': return <MonitorDot size={s} className="text-teal-500" />;
      default: return <TerminalSquare size={s} />;
    }
  };

  const renderTerminal = () => {
    switch (activeOSType) {
      case 'Windows': return <WindowsTerminal onCommandRun={recordMastery} os="Windows" />;
      case 'Linux': return <LinuxTerminal onCommandRun={recordMastery} os="Linux" />;
      default: return <MacTerminal onCommandRun={recordMastery} os="Mac" />;
    }
  };

  // --- BIG STYLISH LOGO ---
  const MainLogo = () => (
    <div className="relative w-48 h-48 mx-auto mb-8 perspective-1000 group">
      <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-1000"></div>
      <div className="relative w-full h-full preserve-3d group-hover:rotate-y-12 transition-transform duration-700">
        <div className="absolute inset-0 glass-ui rounded-[2.5rem] border-indigo-500/30 flex items-center justify-center translate-z-10 shadow-2xl ring-1 ring-white/10">
           <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
           </div>
           <TerminalIcon className="w-20 h-20 text-indigo-500 filter drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" strokeWidth={2.5} />
        </div>
        <div className="absolute -top-4 -right-4 bg-emerald-500/90 text-black px-3 py-1 rounded-lg font-mono text-[9px] font-black rotate-12 translate-z-20 animate-bounce shadow-lg">$ git init</div>
        <div className="absolute -bottom-2 -left-4 bg-rose-500/90 text-white px-3 py-1 rounded-lg font-mono text-[9px] font-black -rotate-12 translate-z-20 animate-pulse shadow-lg">ERROR_0x1</div>
      </div>
    </div>
  );

  // --- Sub-View Header ---
  const BackHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
     <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
        <button 
           onClick={() => { triggerHaptic(); setCurrentView('Home'); }}
           className="p-2 rounded-xl glass-ui hover:bg-white/10 text-zinc-400 hover:text-white transition-colors active:scale-95"
        >
           <ArrowLeft size={18} />
        </button>
        <div>
           <h2 className="text-lg font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{title}</h2>
           {subtitle && <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{subtitle}</p>}
        </div>
     </div>
  );

  const HomeView = () => (
    <div className="flex flex-col items-center justify-center py-6 md:py-12 animate-fade-in-up">
      <div className="max-w-2xl w-full text-center space-y-4">
        <MainLogo />
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-ui border border-indigo-500/20 text-indigo-400 text-[9px] font-black tracking-[0.2em] uppercase shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
            <Activity size={10} /> Terminal Mastery v2.6.4
          </div>
          <h1 className="text-display tracking-tightest leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-indigo-100 to-indigo-500/50 py-2 drop-shadow-sm">
            Command <span className="text-indigo-500">Everything.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-lg mx-auto leading-relaxed font-bold">
            The elite architecture for command line intelligence. Tier-1 access to cross-platform nodes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <button 
              onClick={() => { triggerHaptic(); setCurrentView('Commands'); }} 
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-black flex items-center gap-2 spring-hover text-[10px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] active:scale-95 transition-transform"
            >
              Codex Index <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => { triggerHaptic(); setCurrentView('Terminal'); }} 
              className="px-6 py-3 glass-ui text-zinc-600 dark:text-zinc-200 rounded-xl font-black flex items-center gap-2 spring-hover text-[10px] uppercase tracking-widest border border-white/10 active:scale-95 transition-transform hover:border-indigo-500/30"
            >
              Launch Shell <Monitor size={14} />
            </button>
            <button 
              onClick={() => { triggerHaptic(); setCurrentView('Tree'); }} 
              className="px-6 py-3 glass-ui text-zinc-600 dark:text-zinc-200 rounded-xl font-black flex items-center gap-2 spring-hover text-[10px] uppercase tracking-widest border border-white/10 active:scale-95 transition-transform hover:border-emerald-500/30"
            >
              Explore Nodes <FolderTree size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-12">
          {[
            { label: "Mastery", val: `${masteryPercentage}%`, color: "text-indigo-400" },
            { label: "Arch", val: "X86_64", color: "text-emerald-400" },
            { label: "Uptime", val: "99.9%", color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className={`p-4 glass-ui rounded-2xl border border-white/5 shadow-depth group hover:scale-105 transition-all delay-${(i+1)*100} animate-fade-in-up hover:border-white/20`}>
              <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mb-1">{stat.label}</p>
              <p className={`text-sm font-black font-mono ${stat.color} drop-shadow-md`}>{stat.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="max-w-2xl mx-auto py-2 animate-fade-in-up space-y-6">
      <BackHeader title="System Preferences" subtitle="Config" />
      <div className="grid gap-4">
        <section className="glass-ui rounded-2xl p-6 border border-white/5 space-y-6 shadow-depth">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Moon size={20} /></div>
                 <div>
                    <h3 className="text-sm font-bold text-white">Appearance Theme</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Switch between Porcelain Light and Deep Void Dark</p>
                 </div>
              </div>
              <button onClick={toggleTheme} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform hover:bg-indigo-500">
                Toggle {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
           </div>
           <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><TerminalIcon size={20} /></div>
                 <div>
                    <h3 className="text-sm font-bold text-white">Default Shell Node</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Pick your primary operational environment</p>
                 </div>
              </div>
              <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                 {['Mac', 'Linux', 'Windows'].map(os => (
                   <button key={os} onClick={() => { triggerHaptic(); setActiveOSType(os as OSType); }} className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${activeOSType === os ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'} active:scale-95`}>{os}</button>
                 ))}
              </div>
           </div>
        </section>
        <section className="glass-ui rounded-2xl p-6 border border-white/5 space-y-4 shadow-depth">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400"><Trash2 size={20} /></div>
                 <div>
                    <h3 className="text-sm font-bold text-white">Clear Mastery Cache</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Reset all recorded progress to zero state</p>
                 </div>
              </div>
              <button onClick={clearMastery} className="px-5 py-2.5 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95">
                Purge Database
              </button>
           </div>
        </section>
      </div>
    </div>
  );

  const TerminalView = () => (
    <div className="max-w-3xl mx-auto w-full space-y-4 py-2 animate-fade-in-up">
      <div className="flex items-center justify-between">
          <BackHeader title="Virtual Kernel" subtitle="Shell" />
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            {['Mac', 'Linux', 'Windows'].map(os => (
              <button key={os} onClick={() => { triggerHaptic(); setActiveOSType(os as OSType); }} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeOSType === os ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'} active:scale-95`}>{os}</button>
            ))}
          </div>
      </div>
      <div className="h-[400px] lg:h-[500px] shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="relative h-full">
            {renderTerminal()}
        </div>
      </div>
    </div>
  );

  const TreeView = () => {
    const [treeSearch, setTreeSearch] = useState('');
    const [isFloatingSearchOpen, setIsFloatingSearchOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const floatingInputRef = useRef<HTMLInputElement>(null);
    
    // Smooth Automatic Expand/Collapse Logic
    const handleTreeScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const isMobile = window.innerWidth < 768;
      const scrollTop = e.currentTarget.scrollTop;
      
      if (!isMobile) return;
      
      // Auto-Expand Logic: physics threshold
      if (!isTreeExpanded && scrollTop > 40) {
        triggerHaptic();
        setIsTreeExpanded(true);
      }
      
      // Auto-Collapse Logic
      if (isTreeExpanded && scrollTop <= 0) {
        triggerHaptic();
        setIsTreeExpanded(false);
      }
    };

    const osCommands = COMMANDS.filter(c => (c.os === activeOSType || c.os === 'Universal'));
    const filteredOSCommands = treeSearch 
      ? osCommands.filter(c => c.cmd.toLowerCase().includes(treeSearch.toLowerCase()) || c.desc.toLowerCase().includes(treeSearch.toLowerCase()))
      : osCommands;
    const osCategories = CATEGORIES.filter(cat => filteredOSCommands.some(c => c.category === cat));

    return (
      <div 
        className={`will-change-transform transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isTreeExpanded 
            ? 'fixed inset-0 z-[200] bg-[#020617]/95 backdrop-blur-3xl p-0 m-0' 
            : 'max-w-4xl mx-auto w-full py-2 relative px-0'
          }`}
      >
        <div className={`flex flex-col h-full w-full transition-all duration-700 delay-100 relative ${isTreeExpanded ? 'p-0' : ''}`}>
           
           {/* HEADER AREA */}
           <div className={`
             flex flex-col gap-3 glass-ui p-4 border-white/5 shadow-depth 
             transition-all duration-500 z-50 backdrop-blur-xl origin-top
             ${isTreeExpanded ? 'fixed top-0 left-0 right-0 rounded-b-3xl border-b border-x-0 border-t-0 pt-safe-top' : 'sticky top-0 rounded-2xl border mb-4'}
           `}>
             {!isTreeExpanded && (
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setCurrentView('Home')} className="p-1.5 rounded-lg hover:bg-white/10"><ArrowLeft size={14}/></button>
                    <span className="text-xs font-bold text-zinc-400">Back to Nexus</span>
                </div>
             )}
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 ring-1 ring-white/10 transition-all ${isTreeExpanded ? 'scale-110' : ''}`}>
                      <FolderTree size={20} />
                  </div>
                  <div>
                    <h2 className="text-xs font-black tracking-tight uppercase text-white">Root Directory</h2>
                    <p className="text-[9px] text-zinc-500 font-bold hidden md:block">/{activeOSType.toLowerCase()}/bin/</p>
                  </div>
                </div>

                {/* Main Search Bar */}
                 <div className={`relative group transition-all duration-300 ${isTreeExpanded ? 'opacity-0 pointer-events-none w-0' : 'opacity-100 w-auto'}`}>
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5" />
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Filter nodes..." 
                      value={treeSearch} 
                      onChange={(e) => setTreeSearch(e.target.value)} 
                      className="bg-black/20 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-32 md:w-48 font-bold transition-all focus:w-40 md:focus:w-56 text-white placeholder-zinc-600" 
                    />
                </div>
            </div>

            {/* OS Switcher */}
            <div className="flex w-full bg-black/20 p-1.5 rounded-xl border border-white/5 relative">
              {['Mac', 'Linux', 'Windows'].map((os) => (
                <button
                  key={os}
                  onClick={() => { triggerHaptic(); setActiveOSType(os as OSType); }}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                    activeOSType === os 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>
          </div>
          
          {/* FLOATING SEARCH BUTTON - Overlaps Tree when Expanded */}
          <div className={`fixed top-5 right-5 z-[60] transition-all duration-500 ease-spring ${isTreeExpanded ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 -translate-y-10'}`}>
             <div className="flex items-center gap-2">
                 <input 
                    ref={floatingInputRef}
                    type="text"
                    value={treeSearch}
                    onChange={(e) => setTreeSearch(e.target.value)}
                    placeholder="Search..."
                    className={`bg-black/60 backdrop-blur-xl border border-white/20 rounded-full h-10 px-4 text-xs text-white outline-none transition-all duration-300 origin-right ${isFloatingSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
                 />
                 <button 
                    onClick={() => {
                      triggerHaptic();
                      setIsFloatingSearchOpen(!isFloatingSearchOpen);
                      if (!isFloatingSearchOpen) setTimeout(() => floatingInputRef.current?.focus(), 100);
                    }}
                    className="w-10 h-10 rounded-full glass-ui border border-white/20 flex items-center justify-center text-indigo-400 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-90 transition-transform bg-[#020617]"
                 >
                    {isFloatingSearchOpen ? <X size={18} /> : <Search size={18} />}
                 </button>
             </div>
          </div>

          {/* TREE SCROLL CONTAINER */}
          <div 
            ref={containerRef}
            onScroll={handleTreeScroll}
            className={`
              overflow-y-auto no-scrollbar scroll-smooth transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${isTreeExpanded 
                ? 'flex-1 rounded-none border-0 bg-transparent shadow-none pt-36' 
                : 'rounded-3xl border border-white/5 max-h-[600px] min-h-[400px] p-1 bg-transparent' 
              }
            `}
          >
            <div className={`space-y-8 ${isTreeExpanded ? 'px-6 pb-32 pt-2' : 'p-5'}`}>
              
              {/* Vertical Data Line */}
              <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent hidden md:block"></div>

              {osCategories.map((cat, catIdx) => {
                const catCommands = filteredOSCommands.filter(c => c.category === cat);
                return (
                  <div key={cat} className={`space-y-3 animate-fade-in-up relative pl-0 md:pl-8`} style={{ animationDelay: `${catIdx * 50}ms` }}>
                    
                    {/* Horizontal Branch Connector */}
                    <div className="absolute left-0 top-6 w-8 h-px bg-indigo-500/30 hidden md:block"></div>
                    <div className="absolute left-[-2px] top-[22px] w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] hidden md:block"></div>

                    {/* Category Header */}
                    <div className="flex items-center gap-3 py-2 z-10 sticky top-[130px] md:top-0">
                       <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 shadow-sm backdrop-blur-md">{getIcon(cat)}</span>
                       <span className="uppercase tracking-[0.15em] text-[10px] font-black text-white/90 drop-shadow-md">{cat}</span>
                       <span className="text-[8px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full ml-auto">{catCommands.length}</span>
                    </div>

                    {/* Nodes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative">
                      {catCommands.map((cmd) => (
                        <div 
                          key={cmd.cmd} 
                          onClick={() => handleCopy(cmd.cmd)}
                          className="group relative flex flex-col gap-1 py-3 px-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 cursor-pointer transition-all duration-200 active:scale-[0.98]"
                        >
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2 overflow-hidden">
                                <CornerDownRight size={10} className="text-zinc-600 shrink-0" />
                                <code className="text-[11px] font-mono font-bold text-indigo-300 group-hover:text-white break-all transition-colors">{cmd.cmd}</code>
                             </div>
                             {copiedId === cmd.cmd && <Check size={12} className="text-emerald-500 animate-in fade-in zoom-in" />}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-medium truncate group-hover:text-zinc-400 transition-colors pl-5">{cmd.desc}</span>
                          
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CommandsView = () => (
    <div className="grid grid-cols-12 gap-6 py-2 animate-fade-in-up">
      <aside className="col-span-12 lg:col-span-3 space-y-4 lg:sticky lg:top-4 h-fit">
        <div className="mb-4">
            <button onClick={() => setCurrentView('Home')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <div className="p-1.5 rounded-lg bg-white/5"><ArrowLeft size={14}/></div>
                <span className="text-xs font-bold">Nexus</span>
            </button>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5" />
          <input type="text" placeholder="Search index..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full glass-ui rounded-xl pl-9 pr-3 py-2.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-black shadow-depth text-white placeholder-zinc-600" />
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[60vh] pr-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { triggerHaptic(); setActiveCategory(cat); setSearchQuery(''); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[10px] transition-all group active:scale-95 border ${activeCategory === cat && !searchQuery ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-300'}`}>
              <div className="flex items-center gap-2">
                <span className={`transition-transform duration-300 group-hover:scale-125 ${activeCategory === cat && !searchQuery ? 'text-indigo-400' : 'opacity-70'}`}>{getIcon(cat)}</span>
                <span className="font-bold tracking-wide">{cat}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 glass-ui rounded-xl space-y-3 border border-white/5 shadow-depth">
           <div className="flex justify-between text-[8px] font-black uppercase text-zinc-500 tracking-widest"><span>Mastery</span><span>{masteryPercentage}%</span></div>
           <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden p-[1px]"><div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${masteryPercentage}%` }} /></div>
        </div>
      </aside>
      <main className="col-span-12 lg:col-span-9 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{searchQuery ? 'Search Filter' : activeCategory}</h2>
          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">{filteredCommands.length} NODES</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-12 perspective-1000">
          {filteredCommands.map((command, idx) => {
            const isM = masteredCommands.includes(command.cmd.toLowerCase().split(' ')[0]);
            return (
              <div key={idx} onClick={() => handleCopy(command.cmd)} className={`glass-ui p-4 rounded-xl transition-all cursor-pointer hover:bg-white/[0.03] spring-hover preserve-3d shadow-depth active:scale-95 group ${isM ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : 'border-white/5'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                    <code className="text-indigo-300 font-mono text-[10px] font-black tracking-tight group-hover:text-white transition-colors">{command.cmd}</code>
                  </div>
                  {copiedId === command.cmd ? <Check size={12} className="text-emerald-500" /> : isM && <Trophy size={10} className="text-amber-500" />}
                </div>
                <p className="text-[10px] text-zinc-500 font-bold leading-relaxed group-hover:text-zinc-400 transition-colors">{command.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/20">
      <div className="glow-orb top-[-10vw] right-[-5vw] opacity-20"></div>
      
      {/* MAIN NAV - ONLY VISIBLE ON HOME VIEW */}
      {currentView === 'Home' && (
        <nav className="sticky top-0 z-[100] glass-ui border-b border-white/5 px-4 py-3 transition-all duration-500 shadow-lg animate-fade-in-up">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { triggerHaptic(); setCurrentView('Home'); }}>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 rounded-xl shadow-lg group-hover:rotate-12 transition-transform ring-1 ring-white/20"><TerminalIcon className="text-white w-4 h-4" /></div>
                <h1 className="text-sm font-black tracking-tighter uppercase text-white">Master<span className="text-indigo-400">Pro</span></h1>
            </div>
            
            <div className="hidden md:flex items-center gap-1 bg-black/20 p-1.5 rounded-2xl ring-1 ring-white/5 backdrop-blur-md">
                {NAV_ITEMS.map((nav) => (
                <button key={nav.id} onClick={() => { triggerHaptic(); setCurrentView(nav.id as View); }} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-2 active:scale-95 ${currentView === nav.id ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    {nav.icon} <span>{nav.label}</span>
                </button>
                ))}
            </div>
            
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="p-2.5 bg-white/5 text-zinc-400 rounded-xl hover:bg-white/10 hover:text-white transition-all active:scale-95 ring-1 ring-white/5 shadow-lg">
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
            </div>
        </nav>
      )}
      
      <main className={`flex-1 max-w-4xl mx-auto w-full px-4 mb-24 md:mb-20 transition-all ${isTreeExpanded ? 'p-0 max-w-none mb-0' : ''}`}>
        {currentView === 'Home' && <HomeView />}
        {currentView === 'Terminal' && <TerminalView />}
        {currentView === 'Commands' && <CommandsView />}
        {currentView === 'Tree' && <TreeView />}
        {currentView === 'Settings' && <SettingsView />}
      </main>

      {!isTreeExpanded && currentView === 'Home' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-ui border-t border-white/10 bg-[#020617]/90 backdrop-blur-xl pb-6 pt-3 px-6 flex justify-between items-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] animate-fade-in-up">
            {NAV_ITEMS.map((nav) => (
              <button
                key={nav.id}
                onClick={() => { triggerHaptic(); setCurrentView(nav.id as View); }}
                className={`relative flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 ${currentView === nav.id ? 'text-indigo-400 scale-105' : 'text-zinc-600 dark:text-zinc-500 hover:text-zinc-300'}`}
              >
                {currentView === nav.id && (
                   <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-b-full shadow-[0_2px_10px_rgba(99,102,241,0.5)] animate-in fade-in zoom-in"></span>
                )}
                <div className="p-1">{React.cloneElement(nav.icon as any, { size: 22 })}</div>
                <span className="text-[9px] font-black uppercase tracking-widest">{nav.label}</span>
              </button>
            ))}
        </div>
      )}

      {!isTreeExpanded && currentView === 'Home' && (
        <footer className="hidden md:block w-full glass-ui border-t border-white/5 py-6 backdrop-blur-xl mt-auto">
          <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
             <div className="flex items-center gap-4 text-[9px] font-black uppercase text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1"><Cpu size={10} /> v2.6.4 Stable</span>
                <span className="opacity-30">|</span>
                <span className="tracking-widest">MasterPro Systems</span>
             </div>
             <div className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 text-indigo-500">
                INIT_BY_GEMINI_3
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
