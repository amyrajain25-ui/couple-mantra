import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.join(__dirname, '..');

function getGitHubToken() {
  try {
    const token = execSync('bin/gh auth token', { cwd: workspaceRoot, encoding: 'utf8' }).trim();
    return token;
  } catch {
    return null;
  }
}

async function pushRepo(token) {
  const GIT_DIR = workspaceRoot;
  const REPO_URL = 'https://github.com/amyrajain25-ui/couple-mantra';
  
  console.log(`📤  Pushing code to ${REPO_URL} main branch...`);
  try {
    await git.push({
      fs,
      http,
      dir: GIT_DIR,
      remote: 'origin',
      ref: 'refs/heads/main',
      onAuth: () => ({ username: token, password: '' }),
      force: true
    });
    console.log('🎉  Successfully pushed all files to GitHub repository!');
  } catch (err) {
    console.error('❌  Push failed:', err.message);
    process.exit(1);
  }
}

function setDockerSecrets(dockerUser, dockerPass) {
  const repo = 'amyrajain25-ui/couple-mantra';
  console.log(`🔒  Setting DOCKER_USERNAME and DOCKER_PASSWORD secrets on GitHub repo ${repo}...`);
  try {
    execSync(`bin/gh secret set DOCKER_USERNAME --body "${dockerUser}" --repo ${repo}`, { cwd: workspaceRoot, stdio: 'inherit' });
    execSync(`bin/gh secret set DOCKER_PASSWORD --body "${dockerPass}" --repo ${repo}`, { cwd: workspaceRoot, stdio: 'inherit' });
    console.log('✅  GitHub repository secrets set successfully!');
  } catch (err) {
    console.error('❌  Failed to set repository secrets:', err.message);
    process.exit(1);
  }
}

const cmd = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

const token = getGitHubToken();

if (!token) {
  console.error('\n❌  GitHub CLI not authenticated.');
  console.error('    Please run the following command in your terminal to authenticate:');
  console.error('    ./bin/gh auth login\n');
  process.exit(1);
}

if (cmd === 'push') {
  pushRepo(token).catch(console.error);
} else if (cmd === 'secrets') {
  if (!arg1 || !arg2) {
    console.error('❌  Usage: node db/github_setup.mjs secrets [docker_username] [docker_password]');
    process.exit(1);
  }
  setDockerSecrets(arg1, arg2);
} else {
  console.log(`
GitHub Setup Helper:
  node db/github_setup.mjs push
  node db/github_setup.mjs secrets [docker_username] [docker_password]
`);
}
