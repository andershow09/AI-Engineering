# 🧠 AI-Engineering Harness & Customizations

> **Harness Universal de Engenharia de IA, Padrões de Arquitetura e Skills Modulares para Google Antigravity, Claude Code, GitHub Copilot, Cursor e Agentes Autônomos.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-8%20Modular%20Packs-brightgreen.svg)](#-catálogo-de-skills)
[![Antigravity](https://img.shields.io/badge/AI-Antigravity-orange.svg)](#)
[![Claude Code](https://img.shields.io/badge/AI-Claude%20Code-d97706.svg)](#)
[![GitHub Copilot](https://img.shields.io/badge/AI-GitHub%20Copilot-blueviolet.svg)](#)
[![Cursor](https://img.shields.io/badge/AI-Cursor-black.svg)](#)

---

## 🎯 Sobre o Projeto

O repositório **AI-Engineering** é um ecossistema completo que eleva o uso de agentes autônomos de IA de simples *prompting* para um **Harness de Engenharia de IA** (*Agent Harness*). 

Projetado para operar de forma **Multi-LLM e agnóstica**, ele provê:
1. **Regras e Comportamentos Estritos (`AGENTS.md` / `CLAUDE.md` / Copilot):** Garante que o modelo aja como Engenheiro de Software Sênior.
2. **Skills Especializadas sob Demanda (`.agents/skills/`):** Divulgação progressiva (*Progressive Disclosure*) que poupa contexto e tokens.
3. **Automações e Quality Gates Determinísticos (`.agents/scripts/`):** Scripts para validação de integridade, mapeamento e sincronização.
4. **Lifecycle Hooks e Git Pre-Commit (`.githooks/` e `hooks.json`):** Interceptação para validação antes que alterações sejam commitadas por qualquer IA ou humano.
5. **Memória Contínua (`MEMORY.md`):** Registro de armadilhas conhecidas (*gotchas*) e decisões de arquitetura.
6. **Blueprint Arquitetural (`ARCHITECTURE.md`):** Padrões consolidados para Web (Angular 22+), Mobile Híbrido (Ionic/Capacitor), Nativo (Flutter) e Distribuído (Micro-frontends).

---

## 🌐 Compatibilidade Multi-LLM

O repositório inclui pontes nativas (*bridges*) para as principais ferramentas de IA do mercado:

| Ferramenta de IA | Arquivo de Descoberta | Como Opera |
| :--- | :--- | :--- |
| **Google Antigravity** | [`AGENTS.md`](AGENTS.md) & `.agents/skills/` | Leitura hierárquica e ativação progressiva de skills |
| **Claude Code** (Anthropic CLI) | [`CLAUDE.md`](CLAUDE.md) | Carregamento na inicialização e navegação sob demanda |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Injeção de contexto no Chat e inline completions |
| **Cursor** | [`AGENTS.md`](AGENTS.md) | Suporte nativo ao padrão AGENTS.md na raiz do workspace |
| **Windsurf / Aider** | [`AGENTS.md`](AGENTS.md) | Referência direta de convenções de projeto |

---

## 📦 Catálogo de Skills

| Skill | Descrição | Principais Tópicos |
| :--- | :--- | :--- |
| [**`orchestrator`**](.agents/skills/orchestrator/SKILL.md) | Orquestração e Roteamento Inteligente | Decomposição de tarefas, Model Routing (Claude Opus para análise, Gemini Flash para execução), paralelismo de subagentes |
| [**`engineering`**](.agents/skills/engineering/SKILL.md) | Princípios de Engenharia de Software | SOLID (SRP, OCP, LSP, ISP, DIP), Clean Code, DRY, KISS, YAGNI, Code Review Checklist |
| [**`git`**](.agents/skills/git/SKILL.md) | Versionamento e Operações Seguras | Conventional Commits, Estratégias de Branching, Resolução de Conflitos, Reflog, Stash |
| [**`testing`**](.agents/skills/testing/SKILL.md) | Estratégia de Testes Automatizados | Pirâmide de Testes, Princípios F.I.R.S.T., AAA (Arrange-Act-Assert), Mocking, E2E |
| [**`angular`**](.agents/skills/angular/SKILL.md) | Web Corporativo Moderno | Angular 22+, Standalone Components, Signals, Zoneless, Control Flow, SignalStore |
| [**`ionic`**](.agents/skills/ionic/SKILL.md) | Mobile Multiplataforma Híbrido | Ionic Framework, Capacitor, Shadow DOM, Theming, Stack Navigation, Lifecycle Events |
| [**`flutter`**](.agents/skills/flutter/SKILL.md) | Mobile Multiplataforma Nativo | Dart, MVVM, Gerenciamento com Riverpod (AsyncNotifier) e BLoC/Cubit, Material 3 |
| [**`micro-frontends`**](.agents/skills/micro-frontends/SKILL.md) | Arquiteturas Frontend Distribuídas | Native Federation (esbuild), Shell vs Remotes, Contratos de Eventos, Error Boundaries |

---

## 🛠️ Scripts e Automações (`.agents/scripts/`)

O repositório inclui scripts utilitários em PowerShell para automação do ciclo de vida:

- **`validate-skills.ps1`**: Validador determinístico que checa a integridade, sintaxe YAML e referências de todas as skills.
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-skills.ps1
  ```
- **`verify-coverage-guardrail.ps1`**: Validador do guardrail de testes e thresholds de cobertura (detecta ausência de thresholds, valida sintaxes e bloqueia baixa cobertura).
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-coverage-guardrail.ps1 -ProjectPath "C:\caminho\do\projeto"
  ```
- **`setup-git-hooks.ps1`**: Configura o pre-commit hook do repositório para impedir commits se alguma skill ou guardrail estiver violado.
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/setup-git-hooks.ps1
  ```
- **`sync-global.ps1`**: Sincroniza em um clique todas as skills e o `AGENTS.md` com a configuração global do Antigravity (`~/.gemini/config/`).
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/sync-global.ps1
  ```
- **`sync-projects.ps1`**: Replica as skills e regras para projetos irmãos na sua pasta de trabalho.
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/sync-projects.ps1 -WorkspaceRoot "C:\caminho\dos\projetos"
  ```
- **`repo-map.ps1`**: Gera um mapa arquitetural de qualquer projeto para injetar no contexto da IA.
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/repo-map.ps1 -ProjectPath "C:\caminho\do\projeto"
  ```

---

## 🚀 Como Utilizar

### Opção 1: Uso Global (Recomendado para Máquina Local)
Para disponibilizar todas as 8 skills em qualquer projeto aberto no Antigravity:
```powershell
git clone https://github.com/andershow09/AI-Engineering.git
cd AI-Engineering
powershell -ExecutionPolicy Bypass -File .agents/scripts/sync-global.ps1
```

### Opção 2: Integração Direta no Repositório do seu Projeto
Para compartilhar as regras e skills com seu time via Git:
1. Copie o arquivo `AGENTS.md` (ou `CLAUDE.md` / `.github/`) e a pasta `.agents/` para a raiz do seu projeto.
2. Adicione ao versionamento:
   ```bash
   git add AGENTS.md CLAUDE.md .github/ .agents/
   git commit -m "chore: adiciona harness de engenharia de IA multi-LLM e skills"
   ```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais detalhes.
