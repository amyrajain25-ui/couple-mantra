import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.join(__dirname, '..');

// Load environment variables from .env manually
function loadEnv() {
  try {
    const envPath = path.join(workspaceRoot, '.env');
    if (!fs.existsSync(envPath)) return;
    const raw = fs.readFileSync(envPath, 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch (err) {
    console.warn('⚠️  Could not load .env file:', err.message);
  }
}

loadEnv();

const GIT_DIR = workspaceRoot;
const REPO_URL = 'https://github.com/amyrajain25-ui/couple-mantra';

function isIgnored(relPath) {
  const parts = relPath.split(path.sep);
  // Ignore specific directories
  const ignoreDirs = ['node_modules', '.node_env', '.gemini', '.git', 'dist', 'build', '.vscode', '.idea'];
  if (parts.some(p => ignoreDirs.includes(p))) return true;
  
  const filename = parts[parts.length - 1];
  if (filename === '.DS_Store' || filename === 'Thumbs.db') return true;
  if (filename.startsWith('.env') && filename !== '.env.example') return true; // keep env.example, ignore .env and .env.local
  if (filename.endsWith('.log')) return true;
  
  return false;
}

// Get all files recursively that are not ignored
function getFiles(dir, allFiles = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(workspaceRoot, fullPath);
    
    if (isIgnored(relPath)) continue;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, allFiles);
    } else {
      allFiles.push(relPath);
    }
  }
  return allFiles;
}

async function init() {
  console.log('🚀  Initializing Git repository...');
  await git.init({ fs, dir: GIT_DIR });
  console.log('✅  Git repository initialized.');
  
  // Set remote origin
  console.log(`🔗  Setting remote origin to ${REPO_URL}...`);
  try {
    await git.addRemote({
      fs,
      dir: GIT_DIR,
      remote: 'origin',
      url: REPO_URL,
      force: true
    });
    console.log('✅  Remote origin set.');
  } catch (err) {
    console.log('⚠️  Remote origin already set or error:', err.message);
  }
}

async function commit(message) {
  if (!message) {
    console.error('❌  Please provide a commit message.');
    process.exit(1);
  }
  
  await init();
  
  console.log('📁  Staging files...');
  const files = getFiles(workspaceRoot);
  console.log(`Found ${files.length} files to stage.`);
  
  for (const file of files) {
    await git.add({ fs, dir: GIT_DIR, filepath: file });
  }
  console.log('✅  All files staged.');
  
  console.log('✍️  Creating commit...');
  const commitSha = await git.commit({
    fs,
    dir: GIT_DIR,
    author: {
      name: 'Amy Rajain',
      email: 'amy@localhost.dev'
    },
    message: message
  });
  console.log(`✅  Commit created successfully! SHA: ${commitSha}`);
}

async function push() {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    console.error('❌  GITHUB_PAT is not set in environment or .env file.');
    console.error('    Please add GITHUB_PAT=ghp_... to your .env file and try again.');
    process.exit(1);
  }
  
  console.log(`📤  Pushing to GitHub remote origin (${REPO_URL}) main branch...`);
  try {
    await git.push({
      fs,
      http,
      dir: GIT_DIR,
      remote: 'origin',
      ref: 'refs/heads/main',
      // Since it might be the first push, set the tracking branch
      // isomorphic-git handles authentication using headers or callbacks
      onAuth: () => ({ username: token, password: '' }),
      force: true
    });
    console.log('🎉  Successfully pushed to GitHub repository!');
  } catch (err) {
    console.error('❌  Push failed:', err.message);
    if (err.message.includes('auth') || err.message.includes('credential')) {
      console.error('    Please verify that your GITHUB_PAT is correct and has "repo" permissions.');
    }
    process.exit(1);
  }
}

async function status() {
  console.log('🔍  Checking repository status...');
  try {
    const files = getFiles(workspaceRoot);
    console.log(`Total tracked files (non-ignored): ${files.length}`);
    const branch = await git.currentBranch({ fs, dir: GIT_DIR });
    console.log(`Current branch: ${branch || 'none (no commits yet)'}`);
  } catch (err) {
    console.error('❌  Status failed:', err.message);
  }
}

const cmd = process.argv[2];
const arg = process.argv[3];

if (cmd === 'init') {
  init().catch(console.error);
} else if (cmd === 'commit') {
  commit(arg || 'feat: initial commit').catch(console.error);
} else if (cmd === 'push') {
  push().catch(console.error);
} else if (cmd === 'status') {
  status().catch(console.error);
} else {
  console.log(`
Usage:
  node db/git_helper.mjs init
  node db/git_helper.mjs commit [message]
  node db/git_helper.mjs push
  node db/git_helper.mjs status
`);
}
