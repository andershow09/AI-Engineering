import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { HOOK_MARKER } from './evidence-guard.mjs';

const sourceDirectory=path.dirname(fileURLToPath(import.meta.url));
const IGNORE_BLOCK=`# BEGIN HARNESS GENERATED EVIDENCE\n.artifacts/\nartifacts/\ncoverage/\n.nyc_output/\nplaywright-report/\nblob-report/\ntest-results/\ntest-reports/\nallure-results/\nallure-report/\nscreenshots/\ncapturas/\n# END HARNESS GENERATED EVIDENCE`;
function git(cwd,args,env){return execFileSync('git',args,{cwd,env,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();}
function config(cwd,key,scope,env){try{return git(cwd,['config',scope,'--get',key],env);}catch{return null;}}
function effectiveConfig(cwd,key,env){try{return git(cwd,['config','--get',key],env);}catch{return null;}}
function installFiles(directory,{global=false,sourceDirectory:source=sourceDirectory}={}) {
  mkdirSync(directory,{recursive:true});copyFileSync(path.join(source,'evidence-guard.mjs'),path.join(directory,'evidence-guard.mjs'));
  for(const hook of ['pre-commit','pre-push']){
    const target=path.join(directory,hook),backup=target+'.before-evidence-guard';
    if(existsSync(target)&&!readFileSync(target,'utf8').slice(0,512).includes(HOOK_MARKER)){
      if(existsSync(backup))throw new Error(`Existing preserved hook conflicts at ${backup}; nothing was overwritten.`);
      copyFileSync(target,backup);chmodSync(backup,0o755);
    }
    const wrapper=`#!/bin/sh\n# ${HOOK_MARKER}\ncommand -v node >/dev/null 2>&1 || { echo '[EVIDENCE GUARD] Node.js 20+ is required.' >&2; exit 2; }\nDIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 2\nexec node "$DIR/evidence-guard.mjs" --hook ${hook}${global?' --global-hook':''} "$@"\n`;
    writeFileSync(target,wrapper,{mode:0o755});chmodSync(target,0o755);
  }
}
export function installRepository(repository,options={}) {
  const cwd=path.resolve(repository),env=options.env||process.env;
  const root=git(cwd,['rev-parse','--show-toplevel'],env);
  if(path.resolve(root)!==cwd)throw new Error('Install from the repository root.');
  const previous=effectiveConfig(cwd,'core.hooksPath',env);
  if(!config(cwd,'harness.evidence.previousHooksPath','--local',env))git(cwd,['config','--local','harness.evidence.previousHooksPath',previous||'__default__'],env);
  installFiles(path.join(cwd,'.githooks'),options);
  git(cwd,['config','--local','core.hooksPath','.githooks'],env);
  return {scope:'repository',root:cwd,hooksPath:'.githooks'};
}
export function installGlobal({home=homedir(),env=process.env,sourceDirectory:source=sourceDirectory}={}) {
  const directory=path.join(home,'.agents','git-hooks');
  const previous=config(home,'core.hooksPath','--global',env);
  if(!config(home,'harness.evidence.previousGlobalHooksPath','--global',env))git(home,['config','--global','harness.evidence.previousGlobalHooksPath',previous||'__default__'],env);
  installFiles(directory,{global:true,sourceDirectory:source});
  const ignoreFile=path.join(home,'.agents','git-evidence-ignore');
  const oldIgnore=config(home,'core.excludesFile','--global',env);
  let content=existsSync(ignoreFile)?readFileSync(ignoreFile,'utf8'):'';
  const expanded=oldIgnore?oldIgnore.replace(/^~(?=[/\\])/,home):path.join(env.XDG_CONFIG_HOME||path.join(home,'.config'),'git','ignore');
  if(path.resolve(expanded)!==path.resolve(ignoreFile) && existsSync(expanded)){
    const inherited=readFileSync(expanded,'utf8').trimEnd();
    if(inherited && !content.includes(inherited))content=content.replace(/\n?# BEGIN HARNESS GENERATED EVIDENCE[\s\S]*?# END HARNESS GENERATED EVIDENCE\n?/g,'').trimEnd()+'\n\n'+inherited;
  }
  if(!content.includes('# BEGIN HARNESS GENERATED EVIDENCE'))content=content.trimEnd()+'\n\n'+IGNORE_BLOCK+'\n';
  writeFileSync(ignoreFile,content);
  git(home,['config','--global','core.excludesFile',ignoreFile.replace(/\\/g,'/')],env);
  git(home,['config','--global','core.hooksPath',directory.replace(/\\/g,'/')],env);
  return {scope:'global',hooksPath:directory,excludesFile:ignoreFile};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  try{
    const args=process.argv.slice(2);let result;
    if(args.length===1&&args[0]==='--global')result=installGlobal();
    else if(args.length===2&&args[0]==='--repo')result=installRepository(args[1]);
    else throw new Error('Usage: install-evidence-guard.mjs --global | --repo ROOT');
    console.log(JSON.stringify(result));
  }catch(error){console.error(error.message);process.exitCode=1;}
}
