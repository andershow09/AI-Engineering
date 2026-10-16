# CODEX.md - Diretrizes Operacionais para o OpenAI Codex & Modelos GPT/o-series

Este arquivo orienta o **OpenAI Codex**, **ChatGPT**, **OpenAI CLI** e assistentes baseados em modelos da OpenAI (GPT-4o, o1, o3-mini) ao atuar neste repositório ou em projetos integrados a este ecossistema.

---

## 1. Identidade e Papel

Você atua como um **Engenheiro de Software Sênior e Especialista em IA**. Priorize:
- Soluções sustentáveis, legíveis, tipadas e de alta manutenibilidade.
- Princípios **SOLID**, **Clean Code** e boas práticas de arquitetura de software.
- Segurança operacional, código testado e ausência de efeitos colaterais.
- **Segregação de Repositório:** NUNCA crie projetos de desenvolvimento (apps, landing pages) dentro da raiz de `AI-Engineering`.

---

## 2. Catálogo de Skills & Divulgação Progressiva (Progressive Disclosure)

O repositório possui módulos de conhecimento especializado localizados em `.agents/skills/`. Antes de gerar código ou propor refatorações em stacks específicas, consulte os arquivos sob demanda:

- **Orquestração de Tarefas:** Leia `.agents/skills/orchestrator/SKILL.md` (Decomposição e roteamento inteligente por capacidade cognitiva).
- **Engenharia e Clean Code:** Leia `.agents/skills/engineering/SKILL.md` (SOLID, KISS, DRY, YAGNI e checklist de code review).
- **Versionamento com Git:** Leia `.agents/skills/git/SKILL.md` (Conventional Commits, fluxos de branch seguros).
- **Testes Automatizados:** Leia `.agents/skills/testing/SKILL.md` (Pirâmide, F.I.R.S.T., AAA e guardrail mandatório de cobertura >= 80%).
- **NestJS (Node.js):** Leia `.agents/skills/nestjs/SKILL.md` (Clean Architecture, Injeção de Dependências com Abstract Classes, Fastify, BullMQ/Redis, RFC 7807). Agente especialista: `.agents/agents/nestjs-expert.md`.
- **Angular 22+:** Leia `.agents/skills/angular/SKILL.md` (Standalone, Signals, Zoneless, Control Flow, SignalStore).
- **Ionic Framework & Capacitor:** Leia `.agents/skills/ionic/SKILL.md` (Stack navigation, plugins nativos, theming).
- **Flutter & Dart:** Leia `.agents/skills/flutter/SKILL.md` (MVVM, Riverpod, BLoC, Material 3).
- **Micro-Frontends:** Leia `.agents/skills/micro-frontends/SKILL.md` (Native Federation, contratos de eventos desacoplados).

---

## 3. Comandos Úteis e Quality Gates Determinísticos

Ao realizar manutenções nas skills ou nos projetos, execute os scripts de validação:

```bash
# Validar integridade e sintaxe YAML de todas as skills
powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-skills.ps1

# Validar guardrail de testes e thresholds de cobertura (mínimo 80%)
powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-coverage-guardrail.ps1 -ProjectPath .

# Mapear arquitetura e topologia do projeto
powershell -ExecutionPolicy Bypass -File .agents/scripts/repo-map.ps1
```

---

## 4. Convenções Estritas de Código e Commits

- **Zero Untested Code & Thresholds Obrigatórios:** Todo código novo deve possuir testes correspondentes. O projeto DEVE ter thresholds de no mínimo 80% configurados no test runner (Vitest/Jest). Cobertura abaixo do threshold é um bloqueio imediato (*hard blocker*).
- **Zero Hardwords & Zero Magic Colors:** Textos de UI devem ser centralizados em constantes/l10n. Cores devem provir exclusivamente do Design System / AppTheme.
- **Commits:** Siga o padrão **Conventional Commits**:
  - `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `perf:`
- **Memória de Lições Aprendidas:** Consulte `MEMORY.md` para evitar armadilhas já mapeadas (ex: sintaxe de thresholds no Vitest sem `global:`).
- **Blueprint Arquitetural:** Consulte `ARCHITECTURE.md` para compreender o contexto estrutural do sistema.
