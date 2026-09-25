# GitHub Copilot Custom Instructions

As diretrizes abaixo se aplicam a todas as interações do GitHub Copilot (Chat, inline completions e Copilot Workspace) neste repositório.

---

## 1. Princípios Gerais de Código

- **SOLID & Clean Code:**
  - Aplique Single Responsibility (SRP) em classes e métodos (funções pequenas com 1 nível de abstração).
  - Evite acoplamento direto: utilize injeção de dependência e abstrações (DIP).
  - Evite comentários redundantes que apenas repetem o que o código faz. Escreva código autoexplicativo com nomenclatura expressiva.
  - Siga **DRY**, **KISS** e **YAGNI**.

- **Testes Automatizados:**
  - Todo código novo deve ser projetado para ser testável.
  - Siga a estrutura **Arrange-Act-Assert (AAA)** e os princípios **F.I.R.S.T.**.

---

## 2. Padrões por Stack Tecnológica

- **Angular (22+):**
  - Use sempre componentes **Standalone** (evite `NgModule`).
  - Adote reatividade baseada em **Signals** (`signal()`, `computed()`, `linkedSignal()`) e arquitetura Zoneless.
  - Use o novo Control Flow nativo (`@if`, `@for`, `@defer`).

- **Ionic & Capacitor:**
  - Mantenha a estrutura semântica `ion-page` e `ion-content`.
  - Respeite o Shadow DOM dos componentes usando CSS Custom Properties (`--background`, `--color`).
  - Isole a interação com APIs de hardware em serviços dedicados utilizando plugins oficiais do Capacitor.

- **Flutter & Dart:**
  - Siga a arquitetura **MVVM** com desacoplamento estrito entre View e lógica de negócio.
  - Priorize **Riverpod** (`AsyncNotifierProvider`) para gerenciamento de estado.
  - Aplique componentes e tokens de design do **Material 3**.

- **Micro-Frontends:**
  - Utilize **Native Federation** com esbuild.
  - Mantenha comunicação desacoplada via CustomEvents tipados ou Event Bus compartilhado.

---

## 3. Padrão de Commits

Sempre sugira mensagens de commit no formato **Conventional Commits**:
- `feat(escopo): descrição concisa`
- `fix(escopo): correção de bug`
- `refactor(escopo): melhoria interna sem alteração funcional`
