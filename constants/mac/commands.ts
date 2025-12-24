
import { Command } from '../../types';

export const MAC_COMMANDS: Command[] = [
  // --- Platform Specific ---
  { cmd: 'brew install pkg', desc: 'Install package (Homebrew)', category: 'Package Management', os: 'Mac' },
  { cmd: 'brew update', desc: 'Update Homebrew', category: 'Package Management', os: 'Mac' },
  { cmd: 'brew cask install app', desc: 'Install GUI App', category: 'Package Management', os: 'Mac' },
  { cmd: 'brew cleanup', desc: 'Remove old versions', category: 'Package Management', os: 'Mac' },
  { cmd: 'open .', desc: 'Open current folder in Finder', category: 'Platform Specific', os: 'Mac' },
  { cmd: 'pbcopy < file.txt', desc: 'Copy content to clipboard', category: 'Platform Specific', os: 'Mac' },
  { cmd: 'pbpaste', desc: 'Paste from clipboard', category: 'Platform Specific', os: 'Mac' },
  { cmd: 'say "Hello"', desc: 'Text-to-speech', category: 'Platform Specific', os: 'Mac' },
  { cmd: 'caffeinate', desc: 'Prevent sleep while running', category: 'Platform Specific', os: 'Mac' },
  { cmd: 'sw_vers', desc: 'Show macOS version info', category: 'Platform Specific', os: 'Mac' },
  
  // --- Network & Wifi ---
  { cmd: 'networksetup -listallhardwareports', desc: 'List network interfaces', category: 'Network & Wifi', os: 'Mac' },
  { cmd: '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I', desc: 'Detailed Wifi Info', category: 'Network & Wifi', os: 'Mac' },
  { cmd: 'lsof -i :8080', desc: 'Check what is using port 8080', category: 'Network & Wifi', os: 'Mac' },
  
  // --- System ---
  { cmd: 'diskutil list', desc: 'List disks and partitions', category: 'System Admin', os: 'Mac' },
  { cmd: 'top -o cpu', desc: 'Monitor system (Order by CPU)', category: 'Process Management', os: 'Mac' },
  { cmd: 'sysctl -a', desc: 'View kernel state', category: 'System Admin', os: 'Mac' },
  { cmd: 'launchctl list', desc: 'List launchd jobs', category: 'System Admin', os: 'Mac' },
];
