# 🧠 AI-Engineering Harness & Customizations

> **Harness Corporativo de Engenharia de IA, Padrões de Arquitetura e Skills Modulares para Google Antigravity e Agentes de IA.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-7%20Modular%20Packs-brightgreen.svg)](#-catálogo-de-skills)
[![Antigravity](https://img.shields.io/badge/Platform-Google%20Antigravity-orange.svg)](#)

---

## 🎯 Sobre o Projeto

O repositório **AI-Engineering** é um ecossistema completo que eleva o uso de agentes autônomos de IA de simples *prompting* para um **Harness de Engenharia de IA** (*Agent Harness*). 

Ele provê:
1. **Regras e Comportamentos Estritos (`AGENTS.md`):** Garante que o agente aja como Engenheiro de Software Sênior.
2. **Skills Especializadas sob Demanda (`.agents/skills/`):** Divulgação progressiva (*Progressive Disclosure*) que evita saturação de contexto.
3. **Automações e Quality Gates Determinísticos (`.agents/scripts/`):** Scripts para validação de integridade, mapeamento de projetos e sincronização.
4. **Lifecycle Hooks (`.agents/hooks.json`):** Interceptação de eventos do agente para verificações de segurança e qualidade.
5. **Memória Contínua (`MEMORY.md`):** Registro de armadilhas conhecidas (*gotchas*) e decisões de arquitetura.
6. **Blueprint Arquitetural (`ARCHITECTURE.md`):** Padrões de design consolidados para Web, Mobile e Sistemas Distribuídos.

---

## 📦 Catálogo de Skills

| Skill | Descrição | Principais Tópicos |
| :--- | :--- | :--- |
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
- **`sync-global.ps1`**: Sincroniza em um clique todas as skills e o `AGENTS.md` com a configuração global do Antigravity (`~/.gemini/config/`).
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/sync-global.ps1
  ```
- **`sync-projects.ps1`**: Replica as skills e regras para projetos irmãos na sua pasta de trabalho.
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/sync-projects.ps1 -WorkspaceRoot "C:\caminho\dos\projetos"
  ```
- **`repo-map.ps1`**: Gera um mapa arquitetural de qualquer projeto para injetar no contexto do agente.
  ```powershell
  powershell -ExecutionPolicy Bypass -File .agents/scripts/repo-map.ps1 -ProjectPath "C:\caminho\do\projeto"
  ```

---

## 🚀 Como Utilizar

### Opção 1: Uso Global (Recomendado para Máquina Local)
Para disponibilizar todas as 7 skills em qualquer projeto aberto no Antigravity:
```powershell
git clone https://github.com/andershow09/AI-Engineering.git
cd AI-Engineering
powershell -ExecutionPolicy Bypass -File .agents/scripts/sync-global.ps1
```

### Opção 2: Integração Direta no Repositório do seu Projeto
Para compartilhar as regras e skills com seu time via Git:
1. Copie o arquivo `AGENTS.md` e a pasta `.agents/` para a raiz do seu projeto.
2. Adicione ao versionamento:
   ```bash
   git add AGENTS.md .agents/
   git commit -m "chore: adiciona harness de engenharia de IA e skills"
   ```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais detalhes.
