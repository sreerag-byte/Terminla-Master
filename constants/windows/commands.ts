
import { Command } from '../../types';

export const WINDOWS_COMMANDS: Command[] = [
  // --- System Admin ---
  { cmd: 'systeminfo', desc: 'Detailed system configuration', category: 'System Admin', os: 'Windows' },
  { cmd: 'tasklist', desc: 'List running processes', category: 'System Admin', os: 'Windows' },
  { cmd: 'taskkill /IM notepad.exe', desc: 'Force stop process', category: 'System Admin', os: 'Windows' },
  { cmd: 'sfc /scannow', desc: 'Scan/Fix system files', category: 'System Admin', os: 'Windows' },
  { cmd: 'chkdsk /f', desc: 'Check disk for errors', category: 'System Admin', os: 'Windows' },
  { cmd: 'shutdown /r /t 0', desc: 'Restart immediately', category: 'System Admin', os: 'Windows' },
  { cmd: 'gpupdate /force', desc: 'Update group policy', category: 'System Admin', os: 'Windows' },
  { cmd: 'whoami /groups', desc: 'Show user groups/permissions', category: 'System Admin', os: 'Windows' },
  
  // --- File System ---
  { cmd: 'dir', desc: 'List files (like ls)', category: 'File System', os: 'Windows' },
  { cmd: 'copy src dest', desc: 'Copy file', category: 'File System', os: 'Windows' },
  { cmd: 'move src dest', desc: 'Move file', category: 'File System', os: 'Windows' },
  { cmd: 'ren old new', desc: 'Rename file', category: 'File System', os: 'Windows' },
  { cmd: 'del file', desc: 'Delete file', category: 'File System', os: 'Windows' },
  { cmd: 'type file.txt', desc: 'Print file content (cat)', category: 'File System', os: 'Windows' },
  { cmd: 'robocopy src dest /mir', desc: 'Mirror directory (Robust Copy)', category: 'File System', os: 'Windows' },
  
  // --- Network & Wifi ---
  { cmd: 'ipconfig /all', desc: 'Full network config info', category: 'Network & Wifi', os: 'Windows' },
  { cmd: 'ipconfig /flushdns', desc: 'Clear DNS resolver cache', category: 'Network & Wifi', os: 'Windows' },
  { cmd: 'ping google.com', desc: 'Test connectivity', category: 'Network & Wifi', os: 'Windows' },
  { cmd: 'tracert google.com', desc: 'Trace route to host', category: 'Network & Wifi', os: 'Windows' },
  { cmd: 'netstat -an', desc: 'Active connections & ports', category: 'Network & Wifi', os: 'Windows' },
  { cmd: 'nslookup domain.com', desc: 'Query DNS record', category: 'Network & Wifi', os: 'Windows' },
  { cmd: 'netsh wlan show profiles', desc: 'List Wifi profiles', category: 'Network & Wifi', os: 'Windows' },
  { cmd: 'netsh wlan show profile name="SSID" key=clear', desc: 'Show Wifi password', category: 'Network & Wifi', os: 'Windows' },
  
  // --- PowerShell Specific ---
  { cmd: 'Get-Process', desc: 'List processes (PS)', category: 'Platform Specific', os: 'Windows' },
  { cmd: 'Get-Service', desc: 'List services (PS)', category: 'Platform Specific', os: 'Windows' },
  { cmd: 'Get-Help cmd', desc: 'Get documentation (PS)', category: 'Platform Specific', os: 'Windows' },
  { cmd: 'Get-Command *wifi*', desc: 'Search for commands', category: 'Platform Specific', os: 'Windows' },
  { cmd: 'Invoke-WebRequest -Uri URL', desc: 'Curl equivalent (PS)', category: 'Platform Specific', os: 'Windows' },
  { cmd: 'Set-ExecutionPolicy RemoteSigned', desc: 'Allow script execution', category: 'Platform Specific', os: 'Windows' },
  
  // --- Search & Text ---
  { cmd: 'findstr "text" file', desc: 'Search for string in file', category: 'Search & Text', os: 'Windows' },
  { cmd: 'where python', desc: 'Locate executable path', category: 'Search & Text', os: 'Windows' },
  { cmd: 'clip < file.txt', desc: 'Copy file content to clipboard', category: 'Search & Text', os: 'Windows' },
];
