
import { Command } from '../../types';

export const UNIVERSAL_COMMANDS: Command[] = [
  // --- Essential ---
  { cmd: 'clear', desc: 'Clears the terminal screen buffer', category: 'Essential', os: 'Universal' },
  { cmd: 'history', desc: 'View previously run commands', category: 'Essential', os: 'Universal' },
  { cmd: 'exit', desc: 'Closes the current shell session', category: 'Essential', os: 'Universal' },
  { cmd: 'whoami', desc: 'Shows the current logged-in user', category: 'Essential', os: 'Universal' },
  { cmd: 'date', desc: 'Displays current date and time', category: 'Essential', os: 'Universal' },
  { cmd: 'echo "text"', desc: 'Prints text to the terminal', category: 'Essential', os: 'Universal' },
  { cmd: 'man command', desc: 'Show manual/help for a command', category: 'Essential', os: 'Universal' },

  // --- File System ---
  { cmd: 'ls -la', desc: 'List all files (detailed + hidden)', category: 'File System', os: 'Universal' },
  { cmd: 'pwd', desc: 'Print working directory path', category: 'File System', os: 'Universal' },
  { cmd: 'cd ..', desc: 'Move back one directory level', category: 'File System', os: 'Universal' },
  { cmd: 'cd ~', desc: 'Go to home directory', category: 'File System', os: 'Universal' },
  { cmd: 'mkdir -p a/b/c', desc: 'Create nested directories', category: 'File System', os: 'Universal' },
  { cmd: 'rm -rf folder', desc: 'Force remove dir and contents (Careful!)', category: 'File System', os: 'Universal' },
  { cmd: 'cp -r source dest', desc: 'Copy directory recursively', category: 'File System', os: 'Universal' },
  { cmd: 'mv source dest', desc: 'Move or rename file/directory', category: 'File System', os: 'Universal' },
  { cmd: 'touch file.txt', desc: 'Create empty file or update timestamp', category: 'File System', os: 'Universal' },
  { cmd: 'du -sh .', desc: 'Show size of current directory', category: 'File System', os: 'Universal' },

  // --- Git & Version Control ---
  { cmd: 'git init', desc: 'Initialize new repository', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git clone URL', desc: 'Clone a remote repository', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git status', desc: 'Check file status', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git add .', desc: 'Stage all changes', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git commit -m "msg"', desc: 'Commit staged changes', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git push origin main', desc: 'Push changes to remote', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git pull', desc: 'Pull changes from remote', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git branch', desc: 'List branches', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git checkout -b name', desc: 'Create and switch branch', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git merge branch', desc: 'Merge branch into current', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git stash', desc: 'Stash uncommitted changes', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git log --oneline', desc: 'Compact commit history', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git reset --hard', desc: 'Discard all local changes', category: 'Git & Version Control', os: 'Universal' },
  { cmd: 'git clean -fd', desc: 'Remove untracked files', category: 'Git & Version Control', os: 'Universal' },

  // --- Docker & Containers ---
  { cmd: 'docker ps', desc: 'List running containers', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker ps -a', desc: 'List all containers (incl. stopped)', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker images', desc: 'List available images', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker run -d -p 80:80 nginx', desc: 'Run nginx in background on port 80', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker exec -it ID sh', desc: 'Shell into running container', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker logs -f ID', desc: 'Tail container logs', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker stop ID', desc: 'Stop a container', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker rm $(docker ps -aq)', desc: 'Remove all stopped containers', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker rmi $(docker images -q)', desc: 'Remove all images', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker-compose up -d', desc: 'Start services in background', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker-compose down', desc: 'Stop and remove services', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker build -t name .', desc: 'Build image from Dockerfile', category: 'Docker & Containers', os: 'Universal' },
  { cmd: 'docker system prune -a', desc: 'Deep clean all unused data', category: 'Docker & Containers', os: 'Universal' },

  // --- Kubernetes & Orch ---
  { cmd: 'kubectl get pods', desc: 'List pods in default namespace', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl get svc', desc: 'List services', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl logs pod-name', desc: 'Print pod logs', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl describe pod name', desc: 'Detailed pod info/events', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl exec -it pod -- bash', desc: 'Interactive shell in pod', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl apply -f file.yaml', desc: 'Apply config from file', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl delete pod name', desc: 'Delete a specific pod', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl config current-context', desc: 'Show current cluster context', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'kubectl get all -A', desc: 'Show resources in all namespaces', category: 'Kubernetes & Orch', os: 'Universal' },
  { cmd: 'helm list', desc: 'List installed helm charts', category: 'Kubernetes & Orch', os: 'Universal' },

  // --- Database & Data ---
  { cmd: 'psql -U user -d db', desc: 'Connect to PostgreSQL', category: 'Database & Data', os: 'Universal' },
  { cmd: 'mysql -u user -p', desc: 'Connect to MySQL', category: 'Database & Data', os: 'Universal' },
  { cmd: 'redis-cli', desc: 'Connect to Redis interface', category: 'Database & Data', os: 'Universal' },
  { cmd: 'mongo', desc: 'Connect to MongoDB shell', category: 'Database & Data', os: 'Universal' },
  { cmd: 'sqlite3 db.sqlite', desc: 'Open SQLite database', category: 'Database & Data', os: 'Universal' },
  
  // --- Search & Text ---
  { cmd: 'grep -r "str" .', desc: 'Recursive search for string', category: 'Search & Text', os: 'Universal' },
  { cmd: 'find . -name "*.js"', desc: 'Find files by extension', category: 'Search & Text', os: 'Universal' },
  { cmd: 'sed -i "s/old/new/g" file', desc: 'Replace text in file', category: 'Search & Text', os: 'Universal' },
  { cmd: 'awk "{print $1}" file', desc: 'Print first column of file', category: 'Search & Text', os: 'Universal' },
  { cmd: 'sort file.txt', desc: 'Sort lines alphabetically', category: 'Search & Text', os: 'Universal' },
  { cmd: 'uniq', desc: 'Filter adjacent duplicate lines', category: 'Search & Text', os: 'Universal' },
  { cmd: 'wc -l file.txt', desc: 'Count lines in a file', category: 'Search & Text', os: 'Universal' },

  // --- DevOps & CI/CD ---
  { cmd: 'npm install', desc: 'Install node dependencies', category: 'DevOps & CI/CD', os: 'Universal' },
  { cmd: 'npm run build', desc: 'Run build script', category: 'DevOps & CI/CD', os: 'Universal' },
  { cmd: 'pip install -r req.txt', desc: 'Install Python requirements', category: 'DevOps & CI/CD', os: 'Universal' },
  { cmd: 'terraform init', desc: 'Initialize Terraform directory', category: 'DevOps & CI/CD', os: 'Universal' },
  { cmd: 'terraform plan', desc: 'Show execution plan', category: 'DevOps & CI/CD', os: 'Universal' },
  { cmd: 'terraform apply', desc: 'Apply Terraform changes', category: 'DevOps & CI/CD', os: 'Universal' },
  { cmd: 'ansible-playbook site.yml', desc: 'Run Ansible playbook', category: 'DevOps & CI/CD', os: 'Universal' },
];
