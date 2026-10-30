import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const HOOK_MARKER = 'harness-evidence-guard-v1';
const OID = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i;
const BLOCKED_DIRECTORIES = new Set(['.artifacts','artifacts','coverage','.nyc_output','.pytest_cache','playwright-report','blob-report','test-results','test-reports','allure-results','allure-report','screenshots','capturas','evidence','evidences','evidencias']);
const USAGE = 'evidence-guard.mjs --staged | --tracked | --commits BASE HEAD | --hook pre-commit/pre-push';

function git(cwd, args) {
  try { return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['pipe','pipe','pipe'] }); }
  catch { throw new Error(`Git could not execute ${args[0]}; verify repository/revisions and fetch the base before checking.`); }
}
function optionalConfig(cwd, key, scope) {
  try { return execFileSync('git', ['config',scope,'--get',key],{cwd,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim(); }
  catch { return null; }
}
const names = output => output.split('\0').filter(Boolean);

/** Classifies generated outputs by purpose/path, without banning product images or source test fixtures. */
export function artifactReason(value) {
  const name=value.replace(/\\/g,'/').toLowerCase();
  const parts=name.split('/'), filename=parts.at(-1);
  const instructions=/^readme(?:\.[a-z-]+)?\.md$/.test(filename);
  if(parts.some(part=>BLOCKED_DIRECTORIES.has(part)) && !(instructions && !parts.some(part=>['.artifacts','artifacts','coverage','.nyc_output'].includes(part)))) return 'generated-evidence-directory';
  if(/^(?:docs|design|prototypes|prototipos)(?:\/[^/]+)*\/exports\//.test(name) && !instructions) return 'generated-design-export';
  if(/(?:^|\/)(?:coverage(?:-final|-summary)?\.json|lcov\.info|junit\.xml|test-results\.(?:json|xml|html)|test-report\.(?:json|xml|html)|trace\.zip)$/.test(name)) return 'test-run-output';
  if(/^(?:screenshot|screen-capture|captura)[-_.].*\.(?:png|jpe?g|webp|gif|mp4|webm)$/.test(filename)) return 'screen-capture';
  if(filename.endsWith('.log') && !/(?:^|\/)(?:fixtures|__fixtures__)\//.test(name)) return 'execution-log';
  if(/^(?:inventario|inventory)-pen-.*\.json$/.test(filename)) return 'generated-design-inventory';
  if(/^specs\/.*\/(?:evidence|evidencias)\.md$/.test(name)) return 'execution-evidence-report';
  if(/^docs\/(?:execucao|execution)\/(?:validacao|validation|relatorio|report|revisao|parecer|status|retomada|complemento-pen)[^/]*\.(?:md|json|html|xml|txt)$/.test(name) && !instructions) return 'execution-evidence-report';
  if(/^docs\/(?:execucao|execution)\/release-\d+\.\d+\.\d+\.json$/.test(name)) return 'generated-release-receipt';
  return null;
}

function findings(paths, commit) {
  return paths.flatMap(name=>{const reason=artifactReason(name);return reason?[{path:name,reason,...(commit?{commit}:{})}]:[];});
}
export function checkStaged(cwd) { return findings(names(git(cwd,['diff','--cached','--name-only','--diff-filter=ACMR','-z']))); }
export function checkTracked(cwd) { return findings(names(git(cwd,['ls-files','--cached','-z']))); }
function resolveCommit(cwd, revision) { return git(cwd,['rev-parse','--verify','--end-of-options',`${revision}^{commit}`]).trim(); }
function checkCommit(cwd, revision) {
  const id=resolveCommit(cwd,revision);
  const parents=git(cwd,['rev-list','--parents','-n','1',id]).trim().split(/\s+/).slice(1);
  const args=parents.length
    ? ['diff','--name-only','--diff-filter=ACMR','-z',parents[0],id]
    : ['diff-tree','--root','--no-commit-id','-r','--name-only','--diff-filter=ACMR','-z',id];
  return findings(names(git(cwd,args)),id);
}
export function checkCommits(cwd, base, head) {
  const commits=git(cwd,['rev-list','--reverse',`${resolveCommit(cwd,base)}..${resolveCommit(cwd,head)}`]).trim().split(/\s+/).filter(Boolean);
  return commits.flatMap(id=>checkCommit(cwd,id));
}
export function outgoingCommits(cwd, input) {
  const commits=new Set();
  for(const line of input.trim().split('\n').filter(Boolean)) {
    const fields=line.trim().split(/\s+/);
    if(fields.length!==4 || !OID.test(fields[1]) || !OID.test(fields[3])) throw new Error('Invalid pre-push input; push blocked.');
    const [,local,,remote]=fields;
    if(/^0+$/.test(local)) continue;
    const args=/^0+$/.test(remote)
      ? ['rev-list','--reverse',resolveCommit(cwd,local),'--not','--remotes']
      : ['rev-list','--reverse',`${resolveCommit(cwd,remote)}..${resolveCommit(cwd,local)}`];
    for(const id of git(cwd,args).trim().split(/\s+/).filter(Boolean)) commits.add(id);
  }
  return [...commits];
}

function originalHook(cwd, hook, directory, global) {
  const backup=path.join(directory,`${hook}.before-evidence-guard`);
  if(existsSync(backup)) return backup;
  const previous=global
    ? optionalConfig(cwd,'harness.evidence.previousGlobalHooksPath','--global')
    : optionalConfig(cwd,'harness.evidence.previousHooksPath','--local');
  const parent=previous && previous!=='__default__'
    ? path.resolve(cwd,previous.replace(/^~(?=[/\\])/,process.env.USERPROFILE||process.env.HOME||''))
    : path.resolve(cwd,git(cwd,['rev-parse','--git-common-dir']).trim(),'hooks');
  const candidate=path.join(parent,hook);
  if(!existsSync(candidate)) return null;
  if(path.relative(directory,path.dirname(candidate))==='' && readFileSync(candidate,'utf8').slice(0,512).includes(HOOK_MARKER)) return null;
  return candidate;
}
function runOriginalHook(cwd, hook, directory, global, input, args) {
  const original=originalHook(cwd,hook,directory,global);
  if(!original) return 0;
  const temporary=mkdtempSync(path.join(tmpdir(),'harness-hook-'));
  try {
    const stdinPath=path.join(temporary,'stdin');writeFileSync(stdinPath,input,{mode:0o600});
    const result=spawnSync('git',['-c',`core.hooksPath=${path.dirname(original)}`,'hook','run','--ignore-missing',`--to-stdin=${stdinPath}`,path.basename(original),'--',...args],{cwd,stdio:'inherit'});
    return result.status??2;
  } finally {
    const resolved=path.resolve(temporary);
    if(path.dirname(resolved)!==path.resolve(tmpdir()) || !path.basename(resolved).startsWith('harness-hook-')) throw new Error('Unsafe temporary cleanup path.');
    rmSync(resolved,{recursive:true,force:true});
  }
}

export function runCli(args,{cwd=process.cwd(),write=console.error,input,hookDirectory=path.dirname(fileURLToPath(import.meta.url))}={}) {
  try {
    if(args[0]==='--help'){write(USAGE);return 0;}
    git(cwd,['rev-parse','--git-dir']);
    let result, hook, global=false, hookArgs=[];
    if(args.length===1 && args[0]==='--staged') result=checkStaged(cwd);
    else if(args.length===1 && args[0]==='--tracked') result=checkTracked(cwd);
    else if(args.length===3 && args[0]==='--commits') result=checkCommits(cwd,args[1],args[2]);
    else if(args[0]==='--hook' && ['pre-commit','pre-push'].includes(args[1])) {
      hook=args[1];global=args[2]==='--global-hook';hookArgs=args.slice(global?3:2);
      input=input??(hook==='pre-push'?readFileSync(0,'utf8'):'');
      result=hook==='pre-commit'?checkStaged(cwd):outgoingCommits(cwd,input).flatMap(id=>checkCommit(cwd,id));
    } else { write(USAGE);return 2; }
    if(result.length){
      write('[EVIDENCE GUARD] Commit/push blocked. Keep generated evidence in ignored .artifacts/<task>/ or approved CI/release artifacts.');
      for(const item of result)write(JSON.stringify(item));
      return 1;
    }
    return hook?runOriginalHook(cwd,hook,hookDirectory,global,input,hookArgs):0;
  }catch(error){write(`[EVIDENCE GUARD] ${error.message}`);return 2;}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) process.exitCode=runCli(process.argv.slice(2));
