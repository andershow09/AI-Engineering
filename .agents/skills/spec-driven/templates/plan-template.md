# Plano de Implementação: [NOME DA FEATURE]

**Spec:** `./spec.md` · **Etapa:** `[E0–EN]` · **Status:** Rascunho | Aprovado

---

## 1. Contexto Técnico

| Item | Decisão Técnica |
|---|---|
| **Linguagem / Runtime** | ... (ex: Node.js 22 LTS, TypeScript 5.x) |
| **Frameworks Principais** | ... (ex: NestJS, Fastify, Angular 22+) |
| **Persistência / Banco** | ... (ex: PostgreSQL 16+, Prisma ORM) |
| **Framework de Testes** | ... (ex: Vitest / Playwright com cobertura >= 80%) |
| **Plataformas Alvo** | ... (ex: Web Desktop, PWA iOS, Android Capacitor) |
| **Restrições Operacionais** | ... (ex: Teto de memória de 300MB, rate limit de 10 req/s) |

---

## 2. Verificação Constitucional

| Princípio Constitucional | Aplicação nesta Feature | Situação |
|---|---|---|
| I — Contratos normativos antes de código | Contrato OpenAPI/DDL versionado antes da implementação | OK |
| II — Aritmética e precisão determinística | Uso de tipos decimais de precisão fixa | OK |
| III — Ausência de dado é null com motivo | Null explícito com enum de motivo | OK |
| IV — Append-only e replay | Eventos registrados sem UPDATE destrutivo | OK |
| V — Evidência ≠ Fato econômico | Validação e reconciliação antes de escrever no razão | OK |
| VI — Isolamento do proprietário em profundidade | Token validado + RLS no PostgreSQL | OK |
| VII — Idempotência e concorrência | Uso de Idempotency-Key em rotas de mutação | OK |
| VIII — Limites externos verificados | Validação de quotas antes de chamadas externas | OK |
| IX — Interface honesta e acessível | Declaração de origem de dados e contraste 4,5:1 | OK |
| X — Aceite por evidência | Testes automatizados reproduzíveis para cada AC | OK |

---

## 3. Estrutura de Artefatos

```text
specs/NNN-nome/
├── spec.md
├── plan.md
├── tasks.md
└── (opcionais) data-model.md, contracts/, research.md
```

---

## 4. Abordagem por Fases

### Fase 0 — Pesquisa, Spike & Decisões
- Validação de premissas técnicas, testes de viabilidade e escolha de dependências.

### Fase 1 — Contratos Normativos e Modelos
- Criação de contratos OpenAPI/Swagger, DDL de banco de dados e testes de aceite.

### Fase 2 — Implementação e Verificação
- Implementação dos Use Cases, serviços, controllers e componentes de interface.

---

## 5. Riscos e Mitigações

| Risco | Impacto | Mitigação Proposta | Gatilho de Revisão |
|---|---|---|---|
| Latência na API externa | Alto | Caching distribuído com Redis e circuit breaker | Tempo de resposta > 1s |

---

## 6. Complexity Tracking (Rastreabilidade de Complexidade)

> Qualquer desvio de princípio constitucional aceito deve ser justificado formalmente aqui. Sem justificativa aprovada, o desvio constitui bloqueio de entrega.

| Desvio Aceito | Por que é estritamente necessário | Alternativa mais simples descartada e motivo |
|---|---|---|
| Ex: Uso de tabela intermediária | Volume de dados exige processamento assíncrono em lotes | Processamento síncrono causa timeout de HTTP |

---

## 7. Definição de Pronto (Definition of Done - DoD)

- [ ] Todos os critérios de aceite (`AC-xxx`) cobertos por testes automatizados.
- [ ] Cobertura de código comprovada >= 80% (Statements, Branches, Functions, Lines).
- [ ] Nenhuma string literal arbitrária (Zero Hardwords) ou cor mágica (Zero Magic Colors).
- [ ] Documentação de contratos (OpenAPI/DDL) atualizada.
