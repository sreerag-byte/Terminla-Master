
import { Command } from '../types.ts';
import { UNIVERSAL_COMMANDS } from './universal/commands.ts';
import { MAC_COMMANDS } from './mac/commands.ts';
import { LINUX_COMMANDS } from './linux/commands.ts';
import { WINDOWS_COMMANDS } from './windows/commands.ts';

export const COMMANDS: Command[] = [
  ...UNIVERSAL_COMMANDS,
  ...MAC_COMMANDS,
  ...LINUX_COMMANDS,
  ...WINDOWS_COMMANDS,
];
