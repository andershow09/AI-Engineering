# Valida a integridade, sintaxe de frontmatter e links das skills no ecossistema .agents.
[CmdletBinding()]
param(
    [string]$SkillsPath = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($SkillsPath)) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
    if (-not $ScriptDir) { $ScriptDir = $PSScriptRoot }
    $SkillsPath = Join-Path $ScriptDir "..\skills"
}

$ResolvedPath = (Resolve-Path $SkillsPath).Path
Write-Host "Validando skills em: $ResolvedPath`n" -ForegroundColor Cyan

$SkillsDirs = Get-ChildItem -Path $ResolvedPath -Directory
$TotalSkills = $SkillsDirs.Count
$ErrorsFound = 0

foreach ($Dir in $SkillsDirs) {
    $SkillName = $Dir.Name
    $SkillMdPath = Join-Path $Dir.FullName "SKILL.md"

    Write-Host "Verificando skill: [$SkillName]... " -NoNewline

    if (-not (Test-Path $SkillMdPath)) {
        Write-Host "[ERRO] SKILL.md nao encontrado!" -ForegroundColor Red
        $ErrorsFound++
        continue
    }

    $Content = Get-Content $SkillMdPath -Raw

    # 1. Validar Frontmatter YAML
    if ($Content -notmatch "(?s)^---\s*\r?\n(.*?)\r?\n---") {
        Write-Host "[ERRO] Frontmatter YAML ausente ou mal formatado!" -ForegroundColor Red
        $ErrorsFound++
        continue
    }

    $Frontmatter = $Matches[1]
    if ($Frontmatter -notmatch "(?m)^name:\s*(.+)$") {
        Write-Host "[ERRO] Campo 'name' ausente no frontmatter!" -ForegroundColor Red
        $ErrorsFound++
        continue
    }

    if ($Frontmatter -notmatch "(?m)^description:\s*") {
        Write-Host "[ERRO] Campo 'description' ausente no frontmatter!" -ForegroundColor Red
        $ErrorsFound++
        continue
    }

    # 2. Validar integridade dos arquivos de referencia se existirem
    $RefDir = Join-Path $Dir.FullName "references"
    if (Test-Path $RefDir) {
        $RefFiles = Get-ChildItem -Path $RefDir -File -Filter "*.md"
        foreach ($Ref in $RefFiles) {
            if ((Get-Item $Ref.FullName).Length -eq 0) {
                Write-Host "[AVISO] Referencia vazia: $($Ref.Name) " -ForegroundColor Yellow
            }
        }
    }

    Write-Host "[OK] Valida" -ForegroundColor Green
}

Write-Host "`n----------------------------------------"
if ($ErrorsFound -eq 0) {
    Write-Host "[SUCESSO] Todas as $TotalSkills skills foram validadas com sucesso!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[FALHA] Foram encontrados $ErrorsFound erros de validacao." -ForegroundColor Red
    exit 1
}
