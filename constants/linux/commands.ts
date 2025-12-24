
import { Command } from '../../types';

export const LINUX_COMMANDS: Command[] = [
  // --- System Admin ---
  { cmd: 'sudo su', desc: 'Switch to root user', category: 'System Admin', os: 'Linux' },
  { cmd: 'uname -a', desc: 'Show detailed kernel info', category: 'System Admin', os: 'Linux' },
  { cmd: 'uptime', desc: 'Show system uptime & load', category: 'System Admin', os: 'Linux' },
  { cmd: 'lscpu', desc: 'Display CPU architecture info', category: 'System Admin', os: 'Linux' },
  { cmd: 'free -h', desc: 'Show memory usage (Human readable)', category: 'System Admin', os: 'Linux' },
  { cmd: 'lsblk', desc: 'List block devices (disks)', category: 'System Admin', os: 'Linux' },
  { cmd: 'df -h', desc: 'Disk space usage', category: 'System Admin', os: 'Linux' },
  { cmd: 'journalctl -xe', desc: 'View system logs (end)', category: 'System Admin', os: 'Linux' },
  { cmd: 'systemctl status ssh', desc: 'Check service status', category: 'System Admin', os: 'Linux' },
  { cmd: 'systemctl restart nginx', desc: 'Restart a service', category: 'System Admin', os: 'Linux' },
  { cmd: 'crontab -e', desc: 'Edit cron jobs', category: 'System Admin', os: 'Linux' },
  
  // --- Process Management ---
  { cmd: 'ps aux', desc: 'List all running processes', category: 'Process Management', os: 'Linux' },
  { cmd: 'top', desc: 'Real-time system monitor', category: 'Process Management', os: 'Linux' },
  { cmd: 'htop', desc: 'Interactive process viewer', category: 'Process Management', os: 'Linux' },
  { cmd: 'kill PID', desc: 'Terminate process by ID', category: 'Process Management', os: 'Linux' },
  { cmd: 'killall firefox', desc: 'Kill process by name', category: 'Process Management', os: 'Linux' },
  { cmd: 'bg', desc: 'Resume job in background', category: 'Process Management', os: 'Linux' },
  { cmd: 'fg', desc: 'Bring job to foreground', category: 'Process Management', os: 'Linux' },

  // --- Network & Wifi ---
  { cmd: 'ip addr', desc: 'Show IP addresses', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'ifconfig', desc: 'Network interface config (legacy)', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'ping 8.8.8.8', desc: 'Check connectivity', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'netstat -tulpn', desc: 'Show listening ports', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'ss -tulpn', desc: 'Modern netstat alternative', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'nmcli dev wifi', desc: 'Scan for Wifi networks', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'dig domain.com', desc: 'DNS lookup', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'curl ifconfig.me', desc: 'Get public IP address', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'wget URL', desc: 'Download file from URL', category: 'Network & Wifi', os: 'Linux' },
  { cmd: 'ufw status', desc: 'Check firewall status', category: 'Network & Wifi', os: 'Linux' },

  // --- Package Management ---
  { cmd: 'apt update', desc: 'Update package list (Debian/Ubuntu)', category: 'Package Management', os: 'Linux' },
  { cmd: 'apt upgrade', desc: 'Upgrade installed packages', category: 'Package Management', os: 'Linux' },
  { cmd: 'apt install pkg', desc: 'Install a package', category: 'Package Management', os: 'Linux' },
  { cmd: 'yum install pkg', desc: 'Install package (RHEL/CentOS)', category: 'Package Management', os: 'Linux' },
  { cmd: 'pacman -S pkg', desc: 'Install package (Arch)', category: 'Package Management', os: 'Linux' },
  { cmd: 'snap install app', desc: 'Install Snap package', category: 'Package Management', os: 'Linux' },
  
  // --- Security & Perms ---
  { cmd: 'chmod 777 file', desc: 'Read/Write/Exec for all (Unsafe)', category: 'Security & Perms', os: 'Linux' },
  { cmd: 'chmod +x script.sh', desc: 'Make script executable', category: 'Security & Perms', os: 'Linux' },
  { cmd: 'chown user:group file', desc: 'Change file ownership', category: 'Security & Perms', os: 'Linux' },
  { cmd: 'passwd', desc: 'Change user password', category: 'Security & Perms', os: 'Linux' },
  { cmd: 'ssh-keygen -t rsa', desc: 'Generate SSH keys', category: 'Security & Perms', os: 'Linux' },
  
  // --- Compression ---
  { cmd: 'tar -czvf name.tar.gz dir', desc: 'Compress dir to tar.gz', category: 'Compression', os: 'Linux' },
  { cmd: 'tar -xzvf archive.tar.gz', desc: 'Extract tar.gz', category: 'Compression', os: 'Linux' },
  { cmd: 'zip -r name.zip dir', desc: 'Zip a directory', category: 'Compression', os: 'Linux' },
  { cmd: 'unzip file.zip', desc: 'Unzip a file', category: 'Compression', os: 'Linux' },
];
