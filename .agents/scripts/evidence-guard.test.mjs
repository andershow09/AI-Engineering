import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { artifactReason, checkStaged, checkTracked, checkCommits, outgoingCommits, runCli } from './evidence-guard.mjs';
import { installRepository, installGlobal } from './install-evidence-guard.mjs';

const base = path.dirname(fileURLToPath(import.meta.url));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim();
function repository() {
  const cwd = mkdtempSync(path.join(tmpdir(), 'harness-guard-'));
  git(cwd,'init','-b','test/guard'); git(cwd,'config','user.email','guard@example.test'); git(cwd,'config','user.name','Guard Test');
  git(cwd,'config','core.hooksPath','.git/hooks'); git(cwd,'config','core.autocrlf','false');
  const excludes=path.join(cwd,'.git','fixture-excludes');writeFileSync(excludes,'');git(cwd,'config','core.excludesFile',excludes);
  return cwd;
}
function file(cwd, name, content='synthetic') { const target=path.join(cwd,name);mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,content);if(content.startsWith('#!'))chmodSync(target,0o755); }
function commit(cwd,message='test: synthetic source') { git(cwd,'add','.');git(cwd,'commit','--quiet','-m',message);return git(cwd,'rev-parse','HEAD'); }

test('blocks generated evidence, without banning product assets, source fixtures or instructions', () => {
  for(const name of ['.artifacts/run/receipt.json','artifacts/test/result.txt','docs/design/evidencias/login.png','docs/design/exports/pen/a.png','coverage/lcov.info','apps/api/coverage/coverage-final.json','playwright-report/index.html','test-results/trace.zip','screenshots/login.jpg','docs/execucao/validacao-upload-2026-10-29.json','docs/execucao/validacao-pwa-2026-10-21.md','specs/001/evidence.md','results/junit.xml','screenshot-login.webp','diagnostic.log','docs/design/inventario-pen-2026-10-22.json']) assert(artifactReason(name),name);
  for(const name of ['apps/web/public/logo.png','assets/brand.svg','tests/fixtures/photo.jpg','tests/upload.spec.ts','tests/guard.test.mjs','docs/design/evidencias/README.md','specs/001/spec.md','specs/001/tasks.md','docs/design/prototipos-pen.json','src/reports/report.service.ts','src/screens/login.ts','README.md']) assert.equal(artifactReason(name),null,name);
  assert(artifactReason('docs\\design\\evidencias\\UPPER.PNG'));
});

test('checks the staged index, catches forced additions and permits removal', () => {
  const cwd=repository(); file(cwd,'.gitignore','.artifacts/\n');commit(cwd);
  file(cwd,'.artifacts/a.png');git(cwd,'add','-f','.artifacts/a.png');
  assert.equal(checkStaged(cwd)[0].path,'.artifacts/a.png');
  git(cwd,'-c','core.hooksPath=.git/hooks','commit','--quiet','-m','test: legacy artifact');
  assert.equal(checkTracked(cwd).length,1);
  git(cwd,'rm','--cached','.artifacts/a.png');assert.equal(checkStaged(cwd).length,0);assert.equal(checkTracked(cwd).length,0);
  assert(existsSync(path.join(cwd,'.artifacts/a.png')));
});

test('range catches an artifact committed then removed, and does not reject an old baseline deletion', () => {
  const cwd=repository();file(cwd,'source.ts');const first=commit(cwd);
  file(cwd,'screenshots/a.png');const bad=commit(cwd);git(cwd,'rm','screenshots/a.png');const last=commit(cwd);
  assert.equal(checkCommits(cwd,first,last)[0].commit,bad);
  assert.equal(checkCommits(cwd,bad,last).length,0);
});

test('new branches scan only outgoing commits, and deletions do not create false positives', () => {
  const cwd=repository();file(cwd,'source.ts');const first=commit(cwd);git(cwd,'update-ref','refs/remotes/origin/main',first);
  file(cwd,'screenshots/new.png');const next=commit(cwd);const zero='0'.repeat(40);
  const input=`refs/heads/test/guard ${next} refs/heads/test/guard ${zero}\n`;
  assert.deepEqual(outgoingCommits(cwd,input),[next]);
  assert.deepEqual(outgoingCommits(cwd,`(delete) ${zero} refs/heads/old ${first}\n`),[]);
  assert.throws(()=>outgoingCommits(cwd,'malformed input'));
});

test('CLI audits tracked files and commits, validates arguments, and fails closed outside a repository', () => {
  const cwd=repository();file(cwd,'source.ts');const first=commit(cwd);file(cwd,'capture.log');commit(cwd);
  const errors=[],write=message=>errors.push(message);
  assert.equal(runCli(['--tracked'],{cwd,write}),1);assert.equal(runCli(['--commits',first,'HEAD'],{cwd,write}),1);
  assert.equal(runCli(['--help'],{cwd,write}),0);assert.equal(runCli(['--unknown'],{cwd,write}),2);
  assert.equal(runCli(['--commits'],{cwd,write}),2);
  assert.equal(runCli(['--staged'],{cwd:tmpdir(),write}),2);assert(errors.some(s=>s.includes('capture.log')));
});

test('installed pre-commit blocks forced screenshots; existing hooks and stdin are preserved', () => {
  const cwd=repository();file(cwd,'source.ts');commit(cwd);
  git(cwd,'config','core.hooksPath','.githooks');
  file(cwd,'.githooks/pre-commit','#!/bin/sh\nprintf legacy > legacy-ran\n');
  file(cwd,'.githooks/pre-push','#!/bin/sh\ncat > legacy-stdin\n');
  installRepository(cwd,{sourceDirectory:base});installRepository(cwd,{sourceDirectory:base});
  assert(existsSync(path.join(cwd,'.githooks/pre-commit.before-evidence-guard')));
  file(cwd,'.artifacts/capture.png');git(cwd,'add','-f','.artifacts/capture.png');
  const rejected=spawnSync('git',['commit','-m','test: forbidden screenshot'],{cwd,encoding:'utf8'});
  assert.notEqual(rejected.status,0);assert(rejected.stdout+rejected.stderr);assert(!existsSync(path.join(cwd,'legacy-ran')));
  git(cwd,'rm','--cached','.artifacts/capture.png');file(cwd,'allowed.ts');git(cwd,'add','allowed.ts');git(cwd,'commit','-m','test: allowed source');
  assert.equal(readFileSync(path.join(cwd,'legacy-ran'),'utf8'),'legacy');
  assert.equal(runCli(['--hook','pre-commit'],{cwd,hookDirectory:path.join(cwd,'.githooks')}),0);
  const head=git(cwd,'rev-parse','HEAD');git(cwd,'update-ref','refs/remotes/origin/main',head);
  const input=`refs/heads/test/guard ${head} refs/heads/test/guard ${head}\n`;
  const pushed=spawnSync('git',['hook','run','--to-stdin='+writeInput(cwd,input),'pre-push'],{cwd,encoding:'utf8'});
  assert.equal(pushed.status,0,pushed.stderr);assert.equal(readFileSync(path.join(cwd,'legacy-stdin'),'utf8'),input);
  assert.equal(runCli(['--hook','pre-push'],{cwd,input,hookDirectory:path.join(cwd,'.githooks')}),0);
  assert.equal(readFileSync(path.join(cwd,'legacy-stdin'),'utf8'),input);
});

function writeInput(cwd,input){const target=path.join(cwd,'push-input');writeFileSync(target,input);return target;}

test('global installation works in a fresh repository and retains default per-repository hooks', () => {
  const home=mkdtempSync(path.join(tmpdir(),'harness-global-'));const config=path.join(home,'gitconfig');
  const env={...process.env,GIT_CONFIG_GLOBAL:config,GIT_CONFIG_NOSYSTEM:'1'};
  installGlobal({home,env,sourceDirectory:base});
  const cwd=repository();git(cwd,'config','--unset','core.hooksPath');
  file(cwd,'.git/hooks/pre-commit','#!/bin/sh\nprintf default > default-hook-ran\n');
  file(cwd,'allowed.ts');git(cwd,'add','allowed.ts');
  const result=spawnSync('git',['commit','-m','test: source'],{cwd,env,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);assert.equal(readFileSync(path.join(cwd,'default-hook-ran'),'utf8'),'default');
  assert.equal(runCli(['--hook','pre-commit','--global-hook'],{cwd,hookDirectory:path.join(home,'.agents/git-hooks')}),0);
  file(cwd,'screenshots/bad.png');git(cwd,'add','screenshots/bad.png');
  const rejected=spawnSync('git',['commit','-m','test: generated artifact'],{cwd,env,encoding:'utf8'});assert.notEqual(rejected.status,0);
});

test('direct hook checks fail before running legacy hooks and retain existing rejecting custom hooks', () => {
  const cwd=repository();file(cwd,'source.ts');commit(cwd);git(cwd,'config','core.hooksPath','.custom-hooks');
  file(cwd,'.custom-hooks/pre-commit','#!/bin/sh\nexit 7\n');installRepository(cwd,{sourceDirectory:base});
  assert.equal(runCli(['--hook','pre-commit'],{cwd,hookDirectory:path.join(cwd,'.githooks')}),7);
  file(cwd,'screenshots/rejected.png');git(cwd,'add','screenshots/rejected.png');
  const write=()=>{};
  assert.equal(runCli(['--hook','pre-commit'],{cwd,hookDirectory:path.join(cwd,'.githooks'),write}),1);
  assert.equal(runCli(['--hook','pre-push'],{cwd,input:'bad input',write}),2);
});

test('installer retains hooks on a backup conflict and rejects a non-root destination', () => {
  const cwd=repository();file(cwd,'.githooks/pre-commit','#!/bin/sh\nexit 6\n');file(cwd,'.githooks/pre-commit.before-evidence-guard','preserved');
  assert.throws(()=>installRepository(cwd,{sourceDirectory:base}),/conflict/);
  assert.equal(readFileSync(path.join(cwd,'.githooks/pre-commit'),'utf8'),'#!/bin/sh\nexit 6\n');
  mkdirSync(path.join(cwd,'child'));assert.throws(()=>installRepository(path.join(cwd,'child'),{sourceDirectory:base}),/root/);
});

test('installer preserves an existing global hook and ignore file across reinstalls', () => {
  const home=mkdtempSync(path.join(tmpdir(),'harness-global-'));const config=path.join(home,'gitconfig');
  const env={...process.env,GIT_CONFIG_GLOBAL:config,GIT_CONFIG_NOSYSTEM:'1'};
  const original=path.join(home,'original-hooks'),ignored=path.join(home,'custom-ignore');
  file(home,'original-hooks/pre-commit','#!/bin/sh\nprintf custom > custom-hook-ran\n');writeFileSync(ignored,'private-local/\n');
  file(home,'.agents/git-evidence-ignore','old-managed-pattern/\n');
  execFileSync('git',['config','--global','core.hooksPath',original],{env,cwd:home});
  execFileSync('git',['config','--global','core.excludesFile',ignored],{env,cwd:home});
  installGlobal({home,env,sourceDirectory:base});installGlobal({home,env,sourceDirectory:base});
  assert.match(readFileSync(path.join(home,'.agents/git-evidence-ignore'),'utf8'),/private-local/);
  assert.match(readFileSync(path.join(home,'.agents/git-evidence-ignore'),'utf8'),/old-managed-pattern/);
  const cwd=repository();git(cwd,'config','--unset','core.hooksPath');file(cwd,'allowed.ts');git(cwd,'add','allowed.ts');
  const previous=process.env.GIT_CONFIG_GLOBAL;process.env.GIT_CONFIG_GLOBAL=config;
  try { assert.equal(runCli(['--hook','pre-commit','--global-hook'],{cwd,hookDirectory:path.join(home,'.agents/git-hooks')}),0); }
  finally { if(previous===undefined)delete process.env.GIT_CONFIG_GLOBAL;else process.env.GIT_CONFIG_GLOBAL=previous; }
  assert.equal(readFileSync(path.join(cwd,'custom-hook-ran'),'utf8'),'custom');
});

test('CLI entrypoints install a repository and reject unsupported commands without bypass flags', () => {
  const cwd=repository();file(cwd,'source.ts');commit(cwd);
  const installer=path.join(base,'install-evidence-guard.mjs'),checker=path.join(base,'evidence-guard.mjs');
  assert.equal(spawnSync(process.execPath,[installer,'--repo',cwd],{cwd,encoding:'utf8'}).status,0);
  assert.equal(spawnSync(process.execPath,[installer,'--bad'],{cwd,encoding:'utf8'}).status,1);
  assert.equal(spawnSync(process.execPath,[checker,'--staged'],{cwd,encoding:'utf8'}).status,0);
  assert.equal(runCli(['--staged'],{cwd}),0);
});

test('real pre-push blocks outgoing evidence even when a later commit removes it', () => {
  const remote=mkdtempSync(path.join(tmpdir(),'harness-remote-'));git(remote,'init','--bare');
  const cwd=repository();file(cwd,'source.ts');const first=commit(cwd);git(cwd,'remote','add','origin',remote);git(cwd,'push','origin','HEAD:refs/heads/topic');
  file(cwd,'screenshots/temporary.png');commit(cwd);git(cwd,'rm','screenshots/temporary.png');commit(cwd);
  installRepository(cwd,{sourceDirectory:base});
  const rejected=spawnSync('git',['push','origin','HEAD:refs/heads/topic'],{cwd,encoding:'utf8'});
  assert.notEqual(rejected.status,0);assert.match(rejected.stdout+rejected.stderr,/EVIDENCE GUARD/);
  assert.equal(git(remote,'rev-parse','refs/heads/topic'),first);
});

test('repository installation retains inherited global hooks, including the managed global chain', () => {
  for(const managed of [false,true]){
    const home=mkdtempSync(path.join(tmpdir(),'harness-inherited-')),config=path.join(home,'gitconfig');
    const env={...process.env,GIT_CONFIG_GLOBAL:config,GIT_CONFIG_NOSYSTEM:'1'};
    file(home,'custom/pre-commit','#!/bin/sh\nprintf inherited > inherited-hook-ran\n');
    execFileSync('git',['config','--global','core.hooksPath',path.join(home,'custom')],{env,cwd:home});
    if(managed)installGlobal({home,env,sourceDirectory:base});
    const cwd=repository();git(cwd,'config','--unset','core.hooksPath');installRepository(cwd,{env,sourceDirectory:base});
    file(cwd,'allowed.ts');git(cwd,'add','allowed.ts');
    const result=spawnSync('git',['commit','-m','test: inherited global policy'],{cwd,env,encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);assert.equal(readFileSync(path.join(cwd,'inherited-hook-ran'),'utf8'),'inherited');
  }
});
