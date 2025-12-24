
import { OSType } from '../../../types';

export interface Line {
  type: 'input' | 'output' | 'error' | 'system' | 'header';
  content: string;
}

export interface TerminalProps {
  onCommandRun?: (cmd: string) => void;
  os: OSType;
}
