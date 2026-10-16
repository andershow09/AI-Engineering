# Constituição — [NOME DO PROJETO]

**Versão:** 1.0.0 · **Ratificada em:** AAAA-MM-DD · **Última alteração:** AAAA-MM-DD

Esta constituição governa todas as specs em [`specs/`](../../specs/README.md) e prevalece sobre preferências de implementação. Documentos normativos citados continuam sendo a fonte detalhada; a constituição define o que nenhuma spec pode contradizer.

---

## Princípios Inegociáveis

### I. Contratos Normativos Antes de Código
Nenhuma implementação começa sem spec aprovada e contrato correspondente (OpenAPI, DDL) atualizado. Em divergência, contratos normativos têm precedência sobre código.
**Não negociável:** Código sem spec aprovada é rejeitado em code review.

### II. Determinismo e Precisão de Dados
Dados numéricos, cálculos e estados críticos possuem escala e precisão estritas declaradas. Nunca usar tipos binários imprecisos para grandezas monetárias. O backend é a autoridade sobre cálculos de negócio.
**Não negociável:** O frontend nunca recalcula regras de negócio para exibir.

### III. Ausência de Dado é `null` com Motivo
Dado desconhecido nunca vira `0`, nem média, nem valor inferido de suposições. Campo indisponível retorna `null` acompanhado de motivo e qualidade (`PARTIAL`, `RECALCULATING`).
**Não negociável:** Preencher lacunas com estimativas silenciosas é defeito bloqueante.

### IV. Persistência Append-Only e Auditoria Reconstruível
Fatos de negócio são imutáveis e append-only. Correção ocorre por cancelamento lógico mais evento substituto (`revision+1`); nunca por `UPDATE` ou `DELETE` destrutivo. Qualquer estado atual deve ser reconstruível por replay.
**Não negociável:** Operações destrutivas não são concedidas ao papel de runtime da aplicação.

### V. Evidência ≠ Fato de Negócio
Payloads de arquivos externos ou webhooks de terceiros são apenas evidências. Nenhuma fonte externa escreve diretamente em entidades do núcleo sem normalização, conciliação e prévia.
**Não negociável:** Payload de terceiro jamais determina autorização ou propriedades internas do sistema.

### VI. Isolamento do Proprietário em Profundidade (Defense in Depth)
O identificador do usuário/tenant é derivado exclusivamente de credenciais criptográficas validadas no servidor. Defesas somadas: autorização no serviço, Row-Level Security (RLS) no banco de dados e foreign keys compostas por tenant.
**Não negociável:** Recurso de terceiro responde 404 sem revelar existência.

### VII. Idempotência e Concorrência Explícita
Toda escrita de mutação utiliza `Idempotency-Key`. Conflitos de concorrência retornam HTTP 409 com a versão atual para reconciliação explícita.
**Não negociável:** Operações críticas devem ser seguras contra repetição de rede.

### VIII. Aceite por Evidência Executável
Spec sem critério de aceite verificável não é aprovada. Cada etapa fecha com evidências comprovadas por testes automatizados executáveis.
**Não negociável:** Documentar não equivale a implementar.

---

## Restrições de Escopo e Stack

- **Stack Alvo:** ...
- **Proibido no MVP:** ...
- **Políticas de Retenção de Dados:** ...

---

## Fluxo de Desenvolvimento

1. `spec.md` descreve o **o quê** e o **por quê** em linguagem de negócio. Ambiguidade vira `[NEEDS CLARIFICATION]` explícito.
2. `plan.md` descreve o **como**, com verificação contra esta constituição e *Complexity Tracking*.
3. `tasks.md` deriva tarefas ordenadas por dependência com paralelismo `[P]` e Test-First.
4. Implementação só avança com spec aprovada e etapa anterior aceita.
