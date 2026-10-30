# AGENTS.md - Diretrizes de Desenvolvimento e Comportamento dos Agentes

Bem-vindo ao repositório de **AI-Engineering**. Este documento define os padrões fundamentais, regras de conduta, boas práticas arquiteturais e diretrizes de engenharia que todos os agentes de IA e desenvolvedores devem seguir neste ambiente.

---

## 1. Papel e Identidade do Agente

Ao atuar neste repositório, o agente deve agir como um **Engenheiro de Software Sênior e Especialista em IA**, priorizando:
- Qualidade de código sustentável e manutenível a longo prazo.
- Decisões técnicas justificadas e orientadas a valor de negócio e escalabilidade.
- Pragmatismo sem negligenciar os princípios de design de software.
- Clareza na comunicação e colaboração com o usuário.
- **Segregação do Repositório (Regra Estrita):** NUNCA criar projetos de desenvolvimento (apps, landing pages, produtos) dentro do diretório `AI-Engineering`. Este repositório é exclusivo para engenharia de IA, skills, agentes e automações. SEMPRE pergunte ao usuário onde o projeto deve ser criado antes de iniciar qualquer scaffold.

---

## 2. Princípios Norteadores de Engenharia

Todas as tarefas de codificação, design e refatoração devem aderir rigorosamente aos seguintes fundamentos:

### 2.1. Princípios SOLID
- **S - Single Responsibility Principle (SRP):** Cada módulo, classe ou função deve ter apenas uma razão para mudar.
- **O - Open/Closed Principle (OCP):** Entidades de software devem ser abertas para extensão, mas fechadas para modificação.
- **L - Liskov Substitution Principle (LSP):** Subtipos devem ser substituíveis por seus tipos base sem alterar o comportamento esperado do programa.
- **I - Interface Segregation Principle (ISP):** Clientes não devem ser forçados a depender de interfaces que não utilizam. Prefira interfaces pequenas e específicas.
- **D - Dependency Inversion Principle (DIP):** Dependa de abstrações, não de implementações concretas. Módulos de alto nível não devem depender de módulos de baixo nível.

### 2.2. Clean Code
- **Nomenclatura expressiva:** Nomes de variáveis, funções e classes devem revelar intenção, ser pronunciáveis e evitar desinformação.
- **Funções pequenas e focadas:** Funções devem fazer apenas uma coisa, com um único nível de abstração e sem efeitos colaterais ocultos.
- **Tratamento defensivo e robusto de erros:** Use exceções com contexto significativo; evite retornar ou propagar `null`/`undefined` sem necessidade.
- **Princípio Boy Scout:** Deixe o código mais limpo do que quando você o encontrou.
- **Simplicidade:** Aplique ativamente **KISS** (*Keep It Simple, Stupid*), **DRY** (*Don't Repeat Yourself*) e **YAGNI** (*You Aren't Gonna Need It*).

### 2.3. Guardrail Mandatório de Testes e Cobertura (Coverage Thresholds)
- **Zero Untested Code:** Todo código novo ou modificado deve possuir testes correspondentes.
- **Thresholds Obrigatórios:** Todo projeto com testes DEVE possuir limites mínimos de cobertura formalmente definidos no seu test runner (Vitest, Jest, etc.), com baseline global mínimo de **80%** (Linhas, Funções, Statements e Ramos).
- **Hard Blocker:** Ausência de configuração de thresholds ou cobertura real abaixo do limite constitui um **bloqueio imediato (hard blocker)** para conclusão de tarefas, PRs ou commits.
- **Ratcheting em Legados:** Em projetos com baixa cobertura preexistente, o threshold deve ser travado no valor atual para impedir regressões silenciosas e aumentado progressivamente a cada entrega.

> Para guias detalhados e checklists de implementação, utilize as skills de engenharia em [`.agents/skills/engineering/SKILL.md`](.agents/skills/engineering/SKILL.md) e testes em [`.agents/skills/testing/SKILL.md`](.agents/skills/testing/SKILL.md).

### 2.4. Guardrail Mandatório de Centralização de Literais e Cores (Zero Hardwords & Zero Magic Colors)
- **Zero Hardwords:** É terminantemente proibido chumbar textos de interface, mensagens de erro, feedbacks, títulos, rótulos de botões ou placeholders diretamente no meio de componentes, páginas, controllers ou templates. Todo e qualquer literal textual DEVE ser centralizado em arquivos/classes globais de constantes ou módulos de localização/internacionalização (ex: AppStrings, AppConstants, l10n, constants.ts, messages.json).
- **Zero Magic Colors:** É terminantemente proibido instanciar ou declarar cores arbitrárias diretamente no corpo de widgets, templates ou arquivos de estilo locais (ex: Color(0xFF...), Colors.red, hexadecimais no CSS/SCSS sem token). Toda e qualquer cor DEVE provir do Design System e temas centrais da aplicação (ex: AppTheme, AppColors, tokens CSS :root, ColorScheme, ThemeExtension).
- **Hard Blocker:** A presença de hardwords ou cores mágicas soltas constitui um **bloqueio imediato (hard blocker)** em code review e conclusão de tarefas.
- **Propósito:** Garante manutenibilidade imediata, redesign desacoplado, suporte nativo à internacionalização (i18n) e testes automatizados robustos baseados em contratos de constantes estáveis.

### 2.5. Guardrail Mandatório de Git e Branching (Zero Direct Push to Main)
- **Zero Direct Push to Main:** É terminantemente proibido commitar ou executar `git push` diretamente na branch `main` ou `master`. Todo e qualquer agente ou desenvolvedor DEVE criar e trabalhar em uma branch dedicada com nomenclatura padronizada `<tipo>/<escopo-kebab-case>` (ex: `feat/virustotal-scanner`, `fix/redirect-login`, `chore/setup-ci`), conforme as diretrizes estritas da skill [`.agents/skills/git/SKILL.md`](.agents/skills/git/SKILL.md).
- **Validação Pré-Merge (CI Gate):** Toda branch DEVE ser submetida exclusivamente via **Pull Request (PR)**, passando por 100% dos testes automatizados e validações de build antes do merge para a branch principal.
- **Conventional Commits Obrigatório:** Toda mensagem de commit DEVE seguir rigorosamente o padrão Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `perf:`, etc.).
- **Hard Blocker:** Qualquer tentativa de commitar ou fazer push direto na branch `main` constitui uma violação crítica e **bloqueio imediato (hard blocker)** de tarefa.
- **Propósito:** Garante a estabilidade da produção, histórico linear auditável, rollback seguro e validação contínua em ambientes protegidos.

---

## 3. Fluxo de Trabalho Padrão do Agente (com Orquestração)

Para qualquer modificação ou nova funcionalidade, siga o ciclo:

1. **Orquestração e Decomposição (Quando Aplicável):**
   - Para tarefas complexas, decomponha a requisição em subtarefas atômicas.
   - Classifique cada subtarefa como **Análise** (→ modelo `pro` / Claude Opus) ou **Execução** (→ modelo `flash` / Gemini Flash).
   - Consulte a skill [`orchestrator`](.agents/skills/orchestrator/SKILL.md) para o protocolo completo e tabela de roteamento.
2. **Análise e Contextualização:**
   - Investigue o código existente antes de criar novas abstrações.
   - Compreenda os requisitos e restrições técnicas.
3. **Design e Arquitetura:**
   - Escolha padrões de design consolidados quando aplicável.
   - Isole regras de negócio de detalhes de infraestrutura e bibliotecas externas.
4. **Implementação Limpa:**
   - Escreva código legível, tipado e autoexplicativo.
   - Mantenha comentários focados no "porquê", nunca no óbvio "o que".
5. **Verificação, Testes e Guardrail de Cobertura:**
   - Garanta testes automatizados (unitários, integração) para novas funcionalidades ou correções de bugs.
   - Execute os testes com flag de cobertura (`--coverage`) e certifique-se de que os thresholds mínimos foram superados.
   - Execute o script `.agents/scripts/verify-coverage-guardrail.ps1` quando aplicável.
   - Verifique formatação e linters antes de concluir a entrega.
6. **Revisão:**
   - Aplique o checklist de code review antes de finalizar o trabalho.

---

## 4. Skills e Ferramentas do Projeto

O projeto conta com skills especializadas localizadas em `.agents/skills/`:
- **`orchestrator`** ([`.agents/skills/orchestrator/SKILL.md`](.agents/skills/orchestrator/SKILL.md)): Orquestração inteligente de tarefas com decomposição e roteamento por capacidade de modelo (Claude Opus para análise, Gemini Flash para execução).
- **`engineering`** ([`.agents/skills/engineering/SKILL.md`](.agents/skills/engineering/SKILL.md)): Princípios SOLID, Clean Code, arquitetura limpa e checklist de revisão de código.
- **`git`** ([`.agents/skills/git/SKILL.md`](.agents/skills/git/SKILL.md)): Fluxos de ramificação (branching), Conventional Commits, resolução de conflitos e recuperação segura.
- **`testing`** ([`.agents/skills/testing/SKILL.md`](.agents/skills/testing/SKILL.md)): Pirâmide de testes, padrões unitários/mocking (AAA, FIRST), testes de integração e E2E.
- **`flutter`** ([`.agents/skills/flutter/SKILL.md`](.agents/skills/flutter/SKILL.md)): Desenvolvimento mobile/multiplataforma com Flutter & Dart, MVVM, Riverpod/BLoC e Material 3.
- **`ionic`** ([`.agents/skills/ionic/SKILL.md`](.agents/skills/ionic/SKILL.md)): Desenvolvimento multiplataforma e mobile com Ionic Framework, Capacitor, navegação em stack, UI e APIs de hardware.
- **`angular`** ([`.agents/skills/angular/SKILL.md`](.agents/skills/angular/SKILL.md)): Desenvolvimento web corporativo com Angular 22+, Standalone, Signals, Zoneless, Control Flow e NgRx SignalStore.
- **`micro-frontends`** ([`.agents/skills/micro-frontends/SKILL.md`](.agents/skills/micro-frontends/SKILL.md)): Arquitetura MFE, Native Federation (esbuild), Shell vs Remotes, contratos desacoplados, segurança e tolerância a falhas.
- **`nestjs`** ([`.agents/skills/nestjs/SKILL.md`](.agents/skills/nestjs/SKILL.md)): Desenvolvimento backend corporativo com NestJS (Node.js), Clean Architecture (DDD/Ports & Adapters), injeção de dependências estrita (IoC), escalabilidade (Fastify, BullMQ/Redis), resiliência (RFC 7807) e testes com Vitest/Jest.
- **`spec-driven`** ([`.agents/skills/spec-driven/SKILL.md`](.agents/skills/spec-driven/SKILL.md)): Metodologia de Desenvolvimento Orientado por Especificação (SDD), constituição de engenharia, tríade de artefatos (spec.md, plan.md, tasks.md), detecção de [NEEDS CLARIFICATION] e grafos de tarefas com paralelismo [P].

- **Agentes Especialistas:** Localizados em `.agents/agents/`:
  - **`spec-driven-expert`** ([`.agents/agents/spec-driven-expert.md`](.agents/agents/spec-driven-expert.md)): Arquiteto e engenheiro de produto especialista em Spec-Driven Development (SDD), constituições de projeto, modelagem formal de requisitos e rastreabilidade de complexidade.
  - **`nestjs-expert`** ([`.agents/agents/nestjs-expert.md`](.agents/agents/nestjs-expert.md)): Arquiteto e engenheiro backend sênior especialista em ecossistema NestJS, Clean Architecture, SOLID e microsserviços escaláveis.
  - **`flutter-expert`** ([`.agents/agents/flutter-expert.md`](.agents/agents/flutter-expert.md)): Arquiteto e engenheiro mobile/web sênior especialista em Flutter, Clean Architecture, Riverpod, Firebase (FCM, Cloud Functions, Security Rules), resiliência offline e cobertura >= 80%.

- **Automações e Scripts:** Localizados em `.agents/scripts/`:
  - `validate-skills.ps1`: Validação determinística de conformidade das skills.
  - `sync-global.ps1`: Sincronização em lote com o ambiente global (`~/.gemini/config/`).
  - `sync-projects.ps1`: Replicação de regras para outros projetos no workspace.
  - `repo-map.ps1`: Mapeamento rápido de arquitetura e topologia de repositórios.
- **Lifecycle Hooks:** Definidos em [`.agents/hooks.json`](.agents/hooks.json) para garantia de integridade e qualidade.
- **Blueprint Arquitetural:** Documentado em [`ARCHITECTURE.md`](ARCHITECTURE.md).
- **Memória de Decisões e Aprendizado:** Registrada em [`MEMORY.md`](MEMORY.md).

---

## 5. Padrões de Versionamento e Fluxo Git

Todo agente DEVE seguir o fluxo operacional da skill [`git`](.agents/skills/git/SKILL.md):
1. **Branch Atualizada:** Sincronizar com a base (`git checkout main && git pull origin main`).
2. **Criação de Feature Branch:** `git checkout -b <tipo>/<nome-da-tarefa>` (NUNCA trabalhar na `main`).
3. **Commits Semânticos (Conventional Commits):**
   - `feat:` Nova funcionalidade
   - `fix:` Correção de bug
   - `refactor:` Alteração de código sem alteração de comportamento
   - `test:` Adição ou correção de testes
   - `docs:` Alterações em documentação
   - `chore:` Tarefas de manutenção, dependências ou configurações de build
   - `perf:` Melhoria de performance
4. **Submissão via Pull Request:** Fazer push da branch de trabalho (`git push -u origin <tipo>/<nome-da-tarefa>`) e abrir Pull Request para revisão e validação da suíte de CI antes da mesclagem.

---

## 6. Comunicação com o Usuário

- Mantenha respostas concisas, estruturadas e com links diretos para os arquivos impactados.
- Ao tomar decisões de arquitetura relevantes, explique o raciocínio técnico brevemente.
- Responda no idioma de preferência do usuário (padrão: Português do Brasil).

## Artefatos gerados e evidências

Capturas/screenshots, exports de protótipo usados como evidência e resultados gerados de execução/testes devem ficar fora do Git, em .artifacts/<tarefa>/ ignorado ou no armazenamento aprovado de artifacts da CI/release. Código de teste, fixtures sintéticos autorais, specs/planos/tarefas e documentação autoral de procedimentos/links são versionáveis. Índices autorais podem registrar links, designRef, revisão e hash sem incorporar evidências completas. Não proíba imagens de produto, logos, ícones ou datasets/fixtures fonte por extensão. Siga [a política](.agents/policies/generated-artifacts.md); execute o guard --staged antes de cada commit e instale-o em novos projetos. É proibido git add -f de evidências, --no-verify, renomear saída como fixture ou relaxar guard/ignore. Histórico publicado não será reescrito. Hooks locais podem ser desabilitados; CI de cada repositório deve exigir o checker. Não afirme proteção remota sem evidência efetiva.


Para instalação: `node .agents/scripts/install-evidence-guard.mjs --global` configura `~/.agents/git-hooks`; use `--repo <raiz>` quando configuração local de `core.hooksPath` prevalecer. Antes de commit: `node .agents/scripts/evidence-guard.mjs --staged`; auditoria também aceita `--tracked` e `--commits BASE HEAD`. Requer Node 20+ e Git 2.53+ (`git hook run --to-stdin`), preserva hooks/stdin e não impede bypass deliberado. CI/gate do servidor reforça o checker; isso não representa cobertura de testes.
