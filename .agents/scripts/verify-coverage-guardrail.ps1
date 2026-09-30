# Valida se o projeto possui thresholds de cobertura de testes configurados e se a cobertura respeita os limites minimos.
[CmdletBinding()]
param(
    [string]$ProjectPath = ".",
    [double]$MinCoverage = 80.0,
    [switch]$CheckActualCoverage
)

$ErrorActionPreference = "Stop"

$ResolvedPath = (Resolve-Path $ProjectPath).Path
Write-Host "Inspecionando guardrail de testes e cobertura em: $ResolvedPath`n" -ForegroundColor Cyan

$TestConfigFiles = @(
    "vitest.config.ts", "vitest.config.js", "vitest.config.mjs",
    "vite.config.ts", "vite.config.js",
    "jest.config.js", "jest.config.ts", "jest.config.json",
    "karma.conf.js",
    "pyproject.toml",
    "pubspec.yaml"
)

$FoundConfigs = @()
foreach ($Cfg in $TestConfigFiles) {
    $FilePath = Join-Path $ResolvedPath $Cfg
    if (Test-Path $FilePath) {
        $FoundConfigs += [PSCustomObject]@{
            FileName = $Cfg
            FullPath = $FilePath
        }
    }
}

# Verificar tambem se package.json define jest/vitest com thresholds
$PackageJsonPath = Join-Path $ResolvedPath "package.json"
$HasPackageJson = Test-Path $PackageJsonPath

if ($FoundConfigs.Count -eq 0 -and -not $HasPackageJson) {
    Write-Host "[AVISO] Nenhum arquivo de configuracao de testes reconhecido encontrado." -ForegroundColor Yellow
    exit 0
}

$ThresholdFound = $false
$MatchedFile = ""

foreach ($Cfg in $FoundConfigs) {
    $Content = Get-Content $Cfg.FullPath -Raw -ErrorAction SilentlyContinue
    if (-not $Content) { continue }

    # Detectar armadilha especifica do Vitest: usar 'global: {' dentro de thresholds
    if ($Cfg.FileName -match "vitest|vite") {
        if ($Content -match "thresholds\s*:\s*\{\s*global\s*:") {
            Write-Host "==========================================================================" -ForegroundColor Red
            Write-Host "❌ [GUARDRAIL BLOQUEADO] SINTAXE DE THRESHOLD INVALIDA NO VITEST!" -ForegroundColor Red
            Write-Host "==========================================================================" -ForegroundColor Red
            Write-Host "Arquivo '$($Cfg.FileName)' define 'thresholds: { global: { ... } }'." -ForegroundColor Yellow
            Write-Host "No Vitest, a chave 'global' NAO existe e faz com que os limites sejam silenciosamente IGNORADOS!" -ForegroundColor White
            Write-Host "Correcao obrigatoria: Use propriedades diretas, ex.:" -ForegroundColor Cyan
            Write-Host "  thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 }`n" -ForegroundColor Cyan
            exit 1
        }
    }

    if ($Content -match "thresholds|coverageThreshold|cov-fail-under|min-coverage|check:\s*\{\s*global") {
        $ThresholdFound = $true
        $MatchedFile = $Cfg.FileName
        break
    }
}

if (-not $ThresholdFound -and $HasPackageJson) {
    $PkgContent = Get-Content $PackageJsonPath -Raw -ErrorAction SilentlyContinue
    if ($PkgContent -match "coverageThreshold|thresholds") {
        $ThresholdFound = $true
        $MatchedFile = "package.json"
    }
}

if (-not $ThresholdFound) {
    Write-Host "==========================================================================" -ForegroundColor Red
    Write-Host "❌ [GUARDRAIL BLOQUEADO] THRESHOLDS DE COBERTURA NAO DEFINIDOS!" -ForegroundColor Red
    Write-Host "==========================================================================" -ForegroundColor Red
    Write-Host "O projeto em '$ResolvedPath' possui arquivos de teste, mas NAO define limites minimos (thresholds) de cobertura." -ForegroundColor Yellow
    Write-Host "Regra: Todo projeto DEVE possuir thresholds formais (ex.: minimo de 80% de linhas, funcoes, branches e statements)." -ForegroundColor White
    Write-Host "Consulte: .agents/skills/testing/references/coverage-thresholds-guardrail.md`n" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ [OK] Thresholds de cobertura formalmente identificados em: $MatchedFile" -ForegroundColor Green

# Inspecionar se ha relatorio de cobertura gerado em coverage/
$CoverageSummaryPath = Join-Path $ResolvedPath "coverage\coverage-summary.json"
if (Test-Path $CoverageSummaryPath) {
    try {
        $Summary = Get-Content $CoverageSummaryPath -Raw | ConvertFrom-Json
        if ($Summary.total) {
            $LinesPct = [double]$Summary.total.lines.pct
            $BranchesPct = [double]$Summary.total.branches.pct
            $FunctionsPct = [double]$Summary.total.functions.pct
            $StatementsPct = [double]$Summary.total.statements.pct

            Write-Host "`nEstatisticas de Cobertura Detectadas:" -ForegroundColor Cyan
            Write-Host "  - Linhas:       $LinesPct%" -ForegroundColor $(if ($LinesPct -ge $MinCoverage) { "Green" } else { "Yellow" })
            Write-Host "  - Statements:   $StatementsPct%" -ForegroundColor $(if ($StatementsPct -ge $MinCoverage) { "Green" } else { "Yellow" })
            Write-Host "  - Funcoes:      $FunctionsPct%" -ForegroundColor $(if ($FunctionsPct -ge $MinCoverage) { "Green" } else { "Yellow" })
            Write-Host "  - Branches:     $BranchesPct%" -ForegroundColor $(if ($BranchesPct -ge $MinCoverage) { "Green" } else { "Yellow" })

            if ($CheckActualCoverage -and ($LinesPct -lt $MinCoverage -or $StatementsPct -lt $MinCoverage)) {
                Write-Host "`n==========================================================================" -ForegroundColor Red
                Write-Host "❌ [GUARDRAIL BLOQUEADO] COBERTURA REAL ABAIXO DO LIMITE ($MinCoverage%)!" -ForegroundColor Red
                Write-Host "==========================================================================" -ForegroundColor Red
                Write-Host "Linhas: $LinesPct% | Statements: $StatementsPct% (Minimo exigido: $MinCoverage%)" -ForegroundColor Yellow
                Write-Host "Adicione testes para os modulos descobertos antes de considerar a tarefa pronta." -ForegroundColor White
                exit 1
            }
        }
    } catch {
        # Ignora erro de parsing
    }
}

Write-Host "`n[SUCESSO] O guardrail de cobertura foi satisfeito." -ForegroundColor Green
exit 0
