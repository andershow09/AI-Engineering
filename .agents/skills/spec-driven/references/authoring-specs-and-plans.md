# Guia Prático de Redação de Specs e Planos

Este guia orienta engenheiros e agentes de IA sobre como redigir especificações de alto impacto, precisas e livres de ambiguidades.

---

## 1. Regra Fundamental: "O Quê" vs "Como"

A separação entre `spec.md` e `plan.md` é estrita:

| No `spec.md` (Negócio) | No `plan.md` (Engenharia) |
| :--- | :--- |
| ✅ O usuário pode exportar transações em formato CSV e XLSX. | ❌ O usuário clica no botão com id `#btn-export` que chama `ExportService`. |
| ✅ Se o saldo for insuficiente, a transação é rejeitada com aviso. | ❌ Retornar erro HTTP 422 com payload `{ error: "insufficient_funds" }`. |
| ✅ Transações devem ser registradas em ordem cronológica estrita. | ❌ Criar tabela `transactions` com coluna `created_at TIMESTAMP WITH TIME ZONE`. |
| ❌ Implementar o controller NestJS com rota `@Post('/orders')`. | ✅ Criar `OrdersController` no módulo `orders` usando NestJS e Fastify. |

---

## 2. Eliminação de Ambiguidade com `[NEEDS CLARIFICATION]`

Modelos de IA tendem a alucinar detalhes ausentes. O processo SDD proíbe suposições silenciosas:

```markdown
## 9. Pontos em aberto

| ID | Pergunta | Bloqueia | Responsável |
|---|---|---|---|
| Q-001 | `[NEEDS CLARIFICATION: Qual deve ser o comportamento se o arquivo importado contiver datas futuras?]` | Sim (E2) | Produto |
| Q-002 | `[NEEDS CLARIFICATION: O login por Apple ID é obrigatório no MVP iOS?]` | Não | Liderança Técnica |
```

Antes de promover o status da spec de `Rascunho` para `Aprovada`, todas as perguntas bloqueantes devem estar respondidas e incorporadas aos requisitos funcionais (`FR-xxx`).

---

## 3. Redação de Critérios de Aceite Verificáveis (`AC-xxx`)

Critérios de aceite não podem ser vagos como "o sistema deve ser rápido" ou "o upload deve funcionar". Eles devem descrever condições executáveis:

```markdown
## 8. Critérios de aceite

| ID | Cenário | Resultado esperado |
|---|---|---|
| AC-001 | Importação de arquivo com 10.000 linhas válido | Todas as 10.000 linhas são inseridas no banco e o resumo de sucesso é exibido em menos de 5 segundos. |
| AC-002 | Importação de arquivo duplicado com mesmo hash | A operação falha imediatamente com status "Arquivo já importado" e nenhuma linha adicional é inserida. |
| AC-003 | Falha no meio do processamento de um lote | Nenhuma alteração parcial permanece no banco (Rollback atômico comprovado). |
```

---

## 4. Decomposição de Tarefas com Dependências e Paralelismo `[P]`

No `tasks.md`, as tarefas são estruturadas em fases lógicas:

```markdown
## Fase A — Contratos e Testes de Aceite (Test-First)
| ID | Tarefa | Atende | Depende de |
|---|---|---|---|
| T001 `[P]` | Criar contrato OpenAPI do endpoint de conciliação | FR-001 | — |
| T002 `[P]` | Criar DDL da tabela temporária de importação | FR-002 | — |
| T003 | Escrever teste de aceite para rejeição de arquivo duplicado | AC-002 | T001 |

## Fase B — Implementação
| ID | Tarefa | Atende | Depende de |
|---|---|---|---|
| T004 | Implementar serviço de deduplicação por hash de arquivo | FR-002, AC-002 | T003 |
| T005 | Implementar endpoint HTTP que consome o serviço | FR-001 | T004 |
```

- **Grafo de Dependência:**
  `T001, T002 → T003 → T004 → T005`
