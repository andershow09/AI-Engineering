# Sincroniza as skills e regras locais com a configuracao global do Antigravity (~/.gemini/config/)
[CmdletBinding()]
param(
    [string]$TargetDir = "$HOME\.gemini\config"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
$RepoRoot = (Resolve-Path (Join-Path $ScriptDir "..\..")).Path

Write-Host "Sincronizando ecossistema AI-Engineering com destino global: $TargetDir" -ForegroundColor Cyan

# 1. Garantir que a pasta de skills exista
$GlobalSkillsDir = Join-Path $TargetDir "skills"
if (-not (Test-Path $GlobalSkillsDir)) {
    New-Item -ItemType Directory -Force -Path $GlobalSkillsDir | Out-Null
}

# 2. Copiar todas as skills
$LocalSkills = Join-Path $RepoRoot ".agents\skills\*"
Write-Host "Copiando skills para $GlobalSkillsDir..." -ForegroundColor Yellow
Copy-Item -Path $LocalSkills -Destination $GlobalSkillsDir -Recurse -Force

# 3. Copiar regras globais AGENTS.md
$LocalAgentsMd = Join-Path $RepoRoot "AGENTS.md"
if (Test-Path $LocalAgentsMd) {
    Write-Host "Copiando AGENTS.md global para $TargetDir..." -ForegroundColor Yellow
    Copy-Item -Path $LocalAgentsMd -Destination (Join-Path $TargetDir "AGENTS.md") -Force
}

Write-Host "`n[SUCESSO] Sincronizacao global concluida com sucesso!" -ForegroundColor Green
Write-Host "As 7 skills e as diretrizes de AGENTS.md agora estao disponiveis em qualquer projeto do Antigravity." -ForegroundColor White
