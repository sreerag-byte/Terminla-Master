
export type OSType = 'Universal' | 'Mac' | 'Linux' | 'Windows';

export interface Command {
  cmd: string;
  desc: string;
  category: string;
  os: OSType;
  longDesc?: string;
  exampleOutput?: string[];
}

export type Category = 
  | 'Essential' 
  | 'File System' 
  | 'Network & Wifi' 
  | 'System Admin' 
  | 'Git & Version Control'
  | 'Docker & Containers'
  | 'Kubernetes & Orch'
  | 'Cloud & CLI'
  | 'Database & Data'
  | 'DevOps & CI/CD'
  | 'Security & Perms'
  | 'Package Management'
  | 'Process Management'
  | 'Search & Text'
  | 'Compression'
  | 'Platform Specific';
