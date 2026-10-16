# Tarefas: [NOME DA FEATURE]

**Spec:** [`./spec.md`](./spec.md) · **Plano:** [`./plan.md`](./plan.md) · **Etapa:** `[E0–EN]`

> **Convenções Obrigatórias:**
> - `[P]` indica tarefas paralelizáveis (arquivos e recursos estritamente disjuntos, sem dependência mútua).
> - Tarefas de teste de aceite antecedem a implementação da regra correspondente (**Test-First**).
> - Cada tarefa cita o requisito (`FR-xxx`, `NFR-xxx`, `AC-xxx`) que atende.

---

## Fase A — Contratos Normativos e Testes de Aceite

| ID | Tarefa | Atende | Depende de |
|---|---|---|---|
| T001 `[P]` | Definir contrato OpenAPI do endpoint /exemplo | FR-001 | — |
| T002 `[P]` | Criar migration de banco de dados com schema DDL | FR-002 | — |
| T003 | Escrever teste de aceite para cenário principal | AC-001 | T001 |
| T004 | Escrever teste de aceite para cenário de erro | AC-002 | T001 |

---

## Fase B — Implementação do Núcleo de Domínio e Use Cases

| ID | Tarefa | Atende | Depende de |
|---|---|---|---|
| T005 | Implementar entidade de domínio com invariantes e regras | FR-001 | T002 |
| T006 | Implementar repositório e portas de persistência | FR-002 | T002, T005 |
| T007 | Implementar Use Case do fluxo principal | FR-001, AC-001 | T003, T005, T006 |

---

## Fase C — Integração, API e Interface

| ID | Tarefa | Atende | Depende de |
|---|---|---|---|
| T008 | Implementar Controller / Handler HTTP com DTOs validados | FR-001 | T007 |
| T009 `[P]` | Implementar tela/componente de UI consumindo API | FR-001, AC-001 | T001 |

---

## Grafo de Dependências

```text
T001, T002 ──► T003, T004 ──► T005 ──► T006 ──► T007 ──► T008, T009
```

---

## Portão de Saída da Etapa

- [ ] Todos os critérios de aceite (`AC-xxx`) executados com evidência registrada.
- [ ] Contratos normativos (OpenAPI/DDL) sincronizados na mesma entrega.
- [ ] Verificação constitucional sem desvio não registrado no *Complexity Tracking*.
- [ ] Suíte de testes rodando sem falhas com cobertura mínima de 80%.
