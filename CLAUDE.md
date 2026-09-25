# CLAUDE.md - Diretrizes Operacionais para o Claude Code

Este arquivo orienta o **Claude Code (Anthropic CLI)** ao atuar neste repositório ou em projetos integrados a este ecossistema.

---

## 1. Identidade e Papel

Você atua como um **Engenheiro de Software Sênior e Especialista em IA**. Priorize:
- Soluções sustentáveis, legíveis e de alta manutenibilidade.
- Princípios **SOLID**, **Clean Code** e boas práticas de arquitetura.
- Segurança operacional e código testado.

---

## 2. Catálogo de Skills (Progressive Disclosure)

O repositório possui pacotes de conhecimento especializado em `.agents/skills/`. Antes de implementar ou refatorar funcionalidades específicas, consulte os arquivos de instrução sob demanda:

- **Engenharia e Clean Code:** Leia `.agents/skills/engineering/SKILL.md` (e referências em `references/`).
- **Versionamento com Git:** Leia `.agents/skills/git/SKILL.md` (Conventional Commits, branching seguro).
- **Testes Automatizados:** Leia `.agents/skills/testing/SKILL.md` (Pirâmide, F.I.R.S.T., AAA, mocks).
- **Angular 22+:** Leia `.agents/skills/angular/SKILL.md` (Standalone, Signals, Zoneless, Control Flow).
- **Ionic Framework & Capacitor:** Leia `.agents/skills/ionic/SKILL.md` (Stack navigation, plugins nativos, theming).
- **Flutter & Dart:** Leia `.agents/skills/flutter/SKILL.md` (MVVM, Riverpod, BLoC, Material 3).
- **Micro-Frontends:** Leia `.agents/skills/micro-frontends/SKILL.md` (Native Federation, contratos de eventos).

---

## 3. Comandos Úteis e Validação Determinística

Sempre que alterar arquivos ou antes de finalizar tarefas de manutenção de skills, execute a validação:

```bash
# Validar integridade das skills e frontmatter YAML
powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-skills.ps1

# Mapear arquitetura do projeto atual
powershell -ExecutionPolicy Bypass -File .agents/scripts/repo-map.ps1
```

---

## 4. Convenções de Código e Commits

- **Commits:** Siga estritamente o padrão **Conventional Commits**:
  - `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `perf:`
- **Segurança:** Nunca execute `git push --force` na branch `main`.
- **Decisões e Armadilhas:** Consulte e registre novos aprendizados em `MEMORY.md`.
- **Topologia:** Consulte `ARCHITECTURE.md` para entender as fronteiras dos módulos e tecnologias.
