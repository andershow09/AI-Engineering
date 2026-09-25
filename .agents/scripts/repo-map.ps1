# Gera um resumo e mapa arquitetural de alto nivel de um projeto para o contexto do agente
[CmdletBinding()]
param(
    [string]$ProjectPath = "."
)

$ErrorActionPreference = "Stop"
$Resolved = (Resolve-Path $ProjectPath).Path
Write-Host "Mapeando arquitetura em: $Resolved" -ForegroundColor Cyan

# 1. Identificar stack e arquivos de manifesto
$Manifests = @(
    "package.json", "angular.json", "capacitor.config.ts", "capacitor.config.json",
    "pubspec.yaml", "pom.xml", "build.gradle", "requirements.txt", "pyproject.toml",
    "Cargo.toml", "go.mod", "Dockerfile", "docker-compose.yml"
)

Write-Host "`n--- [1. Manifestos e Stack Detectada] ---" -ForegroundColor Yellow
$DetectedManifests = @()
foreach ($M in $Manifests) {
    $FilePath = Join-Path $Resolved $M
    if (Test-Path $FilePath) {
        $DetectedManifests += $M
        Write-Host " [X] $M encontrado" -ForegroundColor Green
    }
}
if ($DetectedManifests.Count -eq 0) {
    Write-Host " (Nenhum manifesto comum detectado na raiz)" -ForegroundColor DarkGray
}

# 2. Estrutura de Diretorios Principais
Write-Host "`n--- [2. Diretorios Principais (Profundidade 2)] ---" -ForegroundColor Yellow
$IgnoredDirs = @("node_modules", ".git", ".angular", ".dart_tool", "dist", "build", ".gradle", "ios", "android")
$SubDirs = Get-ChildItem -Path $Resolved -Directory | Where-Object { $_.Name -notin $IgnoredDirs }

foreach ($D in $SubDirs) {
    $FilesCount = (Get-ChildItem -Path $D.FullName -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "node_modules|\.git|dist|build" }).Count
    Write-Host " |- $($D.Name)/ ($FilesCount arquivos)" -ForegroundColor White
    
    $Children = Get-ChildItem -Path $D.FullName -Directory | Where-Object { $_.Name -notin $IgnoredDirs }
    foreach ($C in $Children) {
        Write-Host "    |-- $($C.Name)/" -ForegroundColor DarkGray
    }
}

# 3. Estatisticas Basicas
$CodeExtensions = @("*.ts", "*.js", "*.dart", "*.html", "*.scss", "*.css", "*.py", "*.java")
$AllCodeFiles = Get-ChildItem -Path $Resolved -Recurse -Include $CodeExtensions -ErrorAction SilentlyContinue | Where-Object { 
    $_.FullName -notmatch "node_modules|\.git|\.angular|\.dart_tool|dist|build" 
}

Write-Host "`n--- [3. Estatisticas de Codigo] ---" -ForegroundColor Yellow
Write-Host "Total de arquivos de codigo fonte: $($AllCodeFiles.Count)" -ForegroundColor Cyan

Write-Host "`n[Mapeamento Concluido]" -ForegroundColor Green
