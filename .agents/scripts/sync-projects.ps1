# Replica as regras AGENTS.md e pasta .agents para projetos irmaos no workspace local
[CmdletBinding()]
param(
    [string]$WorkspaceRoot = "C:\Users\ander\Documents\Work",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
$RepoRoot = (Resolve-Path (Join-Path $ScriptDir "..\..")).Path

Write-Host "Varrendo diretorios em: $WorkspaceRoot" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "[MODO SIMULACAO (DryRun)] Nenhuma alteracao sera feita no disco." -ForegroundColor Yellow
}

$Projects = Get-ChildItem -Path $WorkspaceRoot -Directory | Where-Object { 
    $_.FullName -ne $RepoRoot -and $_.Name -notmatch "^\."
}

foreach ($Proj in $Projects) {
    Write-Host "Projeto encontrado: $($Proj.Name)" -NoNewline

    if ($DryRun) {
        Write-Host " -> [Simulado]" -ForegroundColor DarkGray
        continue
    }

    try {
        # Copia AGENTS.md
        Copy-Item -Path (Join-Path $RepoRoot "AGENTS.md") -Destination $Proj.FullName -Force
        
        # Copia pasta .agents
        Copy-Item -Path (Join-Path $RepoRoot ".agents") -Destination $Proj.FullName -Recurse -Force
        
        Write-Host " -> [OK Sincronizado]" -ForegroundColor Green
    } catch {
        Write-Host " -> [ERRO: $($_.Exception.Message)]" -ForegroundColor Red
    }
}

Write-Host "`nOperacao concluida para $($Projects.Count) projetos." -ForegroundColor Cyan
