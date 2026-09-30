# MEMORY.md - Memória do Agente e Registro de Aprendizado Contínuo

Este arquivo armazena lições aprendidas, decisões arquiteturais (ADRs leves), armadilhas (*gotchas*) resolvidas e especificidades descobertas durante o ciclo de vida dos projetos.

---

## 1. Diretrizes de Uso da Memória

- **Quando Adicionar:** Após resolver um bug complexo, uma incompatibilidade de versão ou tomar uma decisão de design que deve ser mantida no futuro.
- **Formato de Registro:**
  - `Data / Contexto`: O que estava sendo feito.
  - `Problema / Gotcha`: O que quebrou ou gerou fricção.
  - `Solução / Padrão Estabelecido`: Como foi contornado e qual a regra obrigatória daqui em diante.

---

## 2. Registro de Lições e Armadilhas Conhecidas

### [2026-09] Padrão de Execução PowerShell e Codificação
- **Gotcha:** Scripts PowerShell em ambientes Windows com strings UTF-8 sem BOM podem apresentar falhas de parsing ao lidar com acentuação ou em caracteres de terminação.
- **Solução:** Em `.agents/scripts/`, utilize caracteres padrão e trate caminhos com `Join-Path` e `Split-Path` explicitamente para garantir compatibilidade com qualquer versão do PowerShell (5.1 a 7+).

### [2026-09] Estratégia de Sincronização Multi-Projeto
- **Padrão:** Para evitar duplicação manual de arquivos em dezenas de repositórios, mantenha o repositório central `AI-Engineering` e sincronize com `~/.gemini/config/skills` via script `.agents/scripts/sync-global.ps1`.
- **Benefício:** Atualizações feitas em uma skill refletem instantaneamente em todos os projetos abertos no Antigravity.

### [2026-09] Validação Determinística de Skills
- **Padrão:** Toda skill deve passar pelo script `validate-skills.ps1` antes de commits. O frontmatter YAML (`name` e `description`) é obrigatório para que a engine de Progressive Disclosure do Antigravity indexe a ferramenta corretamente.

### [2026-09] Guardrail de Cobertura de Testes e Armadilha de Sintaxe no Vitest (Gosafra-v2)
- **Gotcha:** No projeto Gosafra-v2, a suíte de testes rodava com cobertura baixa (~8%) sem que o runner bloqueasse a execução. O motivo foi duplo:
  1. A sintaxe de thresholds utilizada no `vitest.config.ts` foi copiada do formato Jest (`thresholds: { global: { lines: 80, ... } }`). No Vitest, a chave `global` é interpretada como um glob pattern de arquivos que não casa com nada, ignorando silenciosamente a checagem global de limites!
  2. A skill `/testing` não possuía um guardrail formal bloqueante para auditar a configuração e exigir thresholds.
- **Solução & Regra Obrigatória:**
  1. **Sintaxe no Vitest:** Thresholds globais no Vitest devem ser declarados com propriedades diretas: `test.coverage.thresholds = { lines: 80, statements: 80, branches: 80, functions: 80 }`.
  2. **Guardrail Determinístico:** Criado `.agents/scripts/verify-coverage-guardrail.ps1` que detecta thresholds ausentes, alerta sobre a armadilha de `global:` no Vitest e valida o relatório de cobertura.
  3. **Quality Gate Bloqueante:** A ausência de thresholds ou cobertura abaixo do mínimo (80% padrão ou ratcheting legado) agora é um **hard blocker** registrado em `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` e na skill `testing`.
