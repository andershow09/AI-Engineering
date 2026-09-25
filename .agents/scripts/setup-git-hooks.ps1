# Configura o Git deste repositorio para utilizar os hooks em .githooks/
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "Configurando Git Hooks em .githooks/..." -ForegroundColor Cyan
git config core.hooksPath .githooks

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCESSO] core.hooksPath configurado para '.githooks'. Os commits agora executarao o pre-commit hook automaticamente!" -ForegroundColor Green
} else {
    Write-Host "[FALHA] Nao foi possivel configurar o Git hooks." -ForegroundColor Red
}
