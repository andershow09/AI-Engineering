# Padrões de Decomposição de Tarefas

Este documento fornece templates práticos para decompor cenários recorrentes de engenharia em subtarefas classificadas e roteáveis.

---

## 1. Nova Feature (Greenfield)

Quando o usuário pede para implementar uma funcionalidade completamente nova.

| # | Subtarefa | Classe | Modelo | Dependência |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Analisar requisitos e definir contratos (interfaces, DTOs, rotas) | Análise | `pro` | — |
| 2 | Projetar a arquitetura do módulo (camadas, serviços, componentes) | Análise | `pro` | #1 |
| 3 | Gerar o scaffold de código (arquivos, classes, estrutura de pastas) | Execução | `flash` | #2 |
| 4 | Implementar a lógica de negócio nos serviços | Execução | `flash` | #2 |
| 5 | Implementar a camada de apresentação (componentes/páginas) | Execução | `flash` | #2 |
| 6 | Escrever testes unitários para serviços e lógica | Execução | `flash` | #4 |
| 7 | Escrever testes de componente/integração | Execução | `flash` | #5 |
| 8 | Revisar o código gerado e validar aderência aos princípios | Análise | `pro` | #3–#7 |

**Paralelismo possível:** Subtarefas #4 e #5 podem rodar em paralelo. #6 e #7 também.

---

## 2. Refatoração de Módulo Existente

Quando o código existente precisa ser reestruturado para melhorar qualidade, performance ou manutenibilidade.

| # | Subtarefa | Classe | Modelo | Dependência |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Pesquisar e mapear o módulo atual (dependências, acoplamentos, testes existentes) | Pesquisa | `flash_lite` | — |
| 2 | Diagnosticar code smells e violações de SOLID | Análise | `pro` | #1 |
| 3 | Elaborar o plano de refatoração (passos, ordem, riscos) | Análise | `pro` | #2 |
| 4 | Executar refatorações mecânicas (extrair método, renomear, mover) | Execução | `flash` | #3 |
| 5 | Atualizar/criar testes para cobrir o código refatorado | Execução | `flash` | #4 |
| 6 | Validar que os testes passam e a cobertura atinge os thresholds | Execução | `flash` | #5 |

---

## 3. Auditoria de Codebase e Code Review

Quando o objetivo é avaliar a qualidade geral de um projeto ou um PR extenso.

| # | Subtarefa | Classe | Modelo | Dependência |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Varrer a estrutura do projeto e identificar módulos principais | Pesquisa | `flash_lite` | — |
| 2 | Analisar aderência aos princípios SOLID e Clean Code | Análise | `pro` | #1 |
| 3 | Avaliar estratégia de testes e gaps de cobertura | Análise | `pro` | #1 |
| 4 | Identificar vulnerabilidades de segurança e más práticas | Análise | `pro` | #1 |
| 5 | Gerar relatório consolidado com severidade e recomendações | Análise | `pro` | #2–#4 |
| 6 | Implementar correções de alta prioridade | Execução | `flash` | #5 |

**Paralelismo possível:** Subtarefas #2, #3 e #4 são independentes e podem rodar em paralelo.

---

## 4. Migração de Tecnologia

Exemplo: migrar de NgModules para Standalone, de Zone.js para Zoneless, de RxJS para Signals.

| # | Subtarefa | Classe | Modelo | Dependência |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Mapear todas as ocorrências do padrão legado no codebase | Pesquisa | `flash_lite` | — |
| 2 | Avaliar impacto e definir estratégia de migração incremental | Análise | `pro` | #1 |
| 3 | Definir a ordem de migração (módulos folha primeiro) | Análise | `pro` | #2 |
| 4 | Executar migração módulo a módulo | Execução | `flash` | #3 |
| 5 | Atualizar testes afetados pela migração | Execução | `flash` | #4 |
| 6 | Validação final: build, testes e smoke test | Execução | `flash` | #5 |

---

## 5. Correção de Bug Complexo

Quando a causa raiz não é óbvia e requer investigação.

| # | Subtarefa | Classe | Modelo | Dependência |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Reproduzir e isolar o cenário de falha | Pesquisa | `flash_lite` | — |
| 2 | Rastrear o fluxo de dados e identificar a causa raiz | Análise | `pro` | #1 |
| 3 | Projetar a correção com mínimo de efeitos colaterais | Análise | `pro` | #2 |
| 4 | Implementar o fix | Execução | `flash` | #3 |
| 5 | Escrever teste de regressão que falhe sem o fix | Execução | `flash` | #3 |
| 6 | Validar que o fix resolve o problema e os testes passam | Execução | `flash` | #4, #5 |
