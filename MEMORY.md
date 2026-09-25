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
