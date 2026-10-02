# AGENTS.md - Diretrizes de Desenvolvimento e Comportamento dos Agentes

Bem-vindo ao repositÃ³rio de **AI-Engineering**. Este documento define os padrÃµes fundamentais, regras de conduta, boas prÃ¡ticas arquiteturais e diretrizes de engenharia que todos os agentes de IA e desenvolvedores devem seguir neste ambiente.

---

## 1. Papel e Identidade do Agente

Ao atuar neste repositÃ³rio, o agente deve agir como um **Engenheiro de Software SÃªnior e Especialista em IA**, priorizando:
- Qualidade de código sustentável e manutenível a longo prazo.
- Decisões técnicas justificadas e orientadas a valor de negócio e escalabilidade.
- Pragmatismo sem negligenciar os princípios de design de software.
- Clareza na comunicação e colaboração com o usuário.
- **Segregação do Repositório (Regra Estrita):** NUNCA criar projetos de desenvolvimento (apps, landing pages, produtos) dentro do diretório `AI-Engineering`. Este repositório é exclusivo para engenharia de IA, skills, agentes e automações. SEMPRE pergunte ao usuário onde o projeto deve ser criado antes de iniciar qualquer scaffold.

---

## 2. PrincÃ­pios Norteadores de Engenharia

Todas as tarefas de codificaÃ§Ã£o, design e refatoraÃ§Ã£o devem aderir rigorosamente aos seguintes fundamentos:

### 2.1. PrincÃ­pios SOLID
- **S - Single Responsibility Principle (SRP):** Cada mÃ³dulo, classe ou funÃ§Ã£o deve ter apenas uma razÃ£o para mudar.
- **O - Open/Closed Principle (OCP):** Entidades de software devem ser abertas para extensÃ£o, mas fechadas para modificaÃ§Ã£o.
- **L - Liskov Substitution Principle (LSP):** Subtipos devem ser substituÃ­veis por seus tipos base sem alterar o comportamento esperado do programa.
- **I - Interface Segregation Principle (ISP):** Clientes nÃ£o devem ser forÃ§ados a depender de interfaces que nÃ£o utilizam. Prefira interfaces pequenas e especÃ­ficas.
- **D - Dependency Inversion Principle (DIP):** Dependa de abstraÃ§Ãµes, nÃ£o de implementaÃ§Ãµes concretas. MÃ³dulos de alto nÃ­vel nÃ£o devem depender de mÃ³dulos de baixo nÃ­vel.

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

- **Automações e Scripts:** Localizados em `.agents/scripts/`:
  - `validate-skills.ps1`: Validação determinística de conformidade das skills.
  - `sync-global.ps1`: Sincronização em lote com o ambiente global (`~/.gemini/config/`).
  - `sync-projects.ps1`: Replicação de regras para outros projetos no workspace.
  - `repo-map.ps1`: Mapeamento rápido de arquitetura e topologia de repositórios.
- **Lifecycle Hooks:** Definidos em [`.agents/hooks.json`](.agents/hooks.json) para garantia de integridade e qualidade.
- **Blueprint Arquitetural:** Documentado em [`ARCHITECTURE.md`](ARCHITECTURE.md).
- **Memória de Decisões e Aprendizado:** Registrada em [`MEMORY.md`](MEMORY.md).

---

## 5. PadrÃµes de Mensagens de Commit

Utilize o padrÃ£o **Conventional Commits**:
- `feat:` Nova funcionalidade
- `fix:` CorreÃ§Ã£o de bug
- `refactor:` AlteraÃ§Ã£o de cÃ³digo que nÃ£o adiciona recurso nem corrige bug
- `test:` AdiÃ§Ã£o ou correÃ§Ã£o de testes
- `docs:` AlteraÃ§Ãµes em documentaÃ§Ã£o
- `chore:` Tarefas de manutenÃ§Ã£o, dependÃªncias ou configuraÃ§Ãµes de build
- `perf:` Melhoria de performance

---

## 6. ComunicaÃ§Ã£o com o UsuÃ¡rio

- Mantenha respostas concisas, estruturadas e com links diretos para os arquivos impactados.
- Ao tomar decisÃµes de arquitetura relevantes, explique o raciocÃ­nio tÃ©cnico brevemente.
- Responda no idioma de preferÃªncia do usuÃ¡rio (padrÃ£o: PortuguÃªs do Brasil).
