# Ciclo de Vida e Artefatos da Spec (Spec-Driven Development)

Este guia detalha a estrutura de pastas, o fluxo de estados e a gestão dos artefatos do ciclo de vida em projetos governados por **Spec-Driven Development (SDD)**.

---

## 1. Estrutura de Diretórios Recomendada no Projeto

No repositório do produto, a governança por especificações adota a seguinte topologia padrão:

```text
meu-projeto/
├── .specify/
│   ├── memory/
│   │   └── constitution.md        # Constituição: princípios fundamentais inegociáveis
│   └── templates/                 # Modelos padronizados para novas features
│       ├── spec-template.md
│       ├── plan-template.md
│       └── tasks-template.md
│
├── docs/                          # Documentos normativos de autoridade primária
│   ├── regras-negocio.md
│   ├── contratos-api.md
│   └── contracts/
│       ├── openapi.json
│       └── schema.sql
│
└── specs/                         # Catálogo cronológico de especificações
    ├── README.md                  # Mapa geral de etapas, dependências e status
    ├── 001-setup-viabilidade/
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   └── research.md            # (Opcional) Registro de benchmarks e termos
    ├── 002-nucleo-dominio/
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   ├── data-model.md          # (Opcional) Modelagem de entidades e persistência
    │   └── contracts/             # (Opcional) DDLs e contratos específicos da etapa
    │       └── README.md
    └── 003-integracao/
        ├── spec.md
        ├── plan.md
        └── tasks.md
```

---

## 2. Mapa Geral de Specs (`specs/README.md`)

A raiz da pasta `specs/` contém um arquivo `README.md` que serve como o **painel de controle executivo do projeto**:

```markdown
# Specs — Nome do Projeto

Desenvolvimento orientado por especificação (SDD). Cada etapa possui uma spec com o que e por que, um plano com como, e tarefas ordenadas por dependência. Nenhuma implementação começa sem a spec aprovada e a etapa anterior aceita.

## Mapa das Etapas

| Spec | Etapa | Objetivo | Dependência | Estado |
|---|---|---|---|---|
| [001 — Viabilidade e Setup](001-setup-viabilidade/spec.md) | E0 | Validar stack, ambientes e custos | — | Aceita |
| [002 — Núcleo de Domínio](002-nucleo-dominio/spec.md) | E1 | Entidades, invariantes e regras puras | 001 | Aprovada para execução |
| [003 — Ingestão e Conciliação](003-integracao/spec.md) | E2 | Importação de arquivos e webhooks | 002 | Rascunho |

## Grafo de Dependências

\`\`\`text
001 ──► 002 ──► 003
\`\`\`
```

---

## 3. Estados do Ciclo de Vida de uma Spec

Cada especificação transita por estados bem definidos:

1. **Rascunho (`Draft`):** A spec está sendo escrita. Requisitos preliminares estão sendo levantados e dúvidas de produto são sinalizadas com `[NEEDS CLARIFICATION]`.
2. **Em Revisão (`In Review`):** A spec de negócio está completa; as dúvidas foram respondidas; a equipe técnica está elaborando o `plan.md` e avaliando a conformidade constitucional.
3. **Aprovada para Execução (`Approved`):** `spec.md`, `plan.md` e `tasks.md` foram validados pela liderança técnica e de produto. As dependências da etapa anterior foram comprovadas.
4. **Em Execução (`In Progress`):** Os desenvolvedores e agentes estão codificando seguindo estritamente as tarefas de `tasks.md`.
5. **Aceita / Concluída (`Accepted`):** O **Portão de Saída** foi aprovado com evidências executadas para todos os critérios de aceite (`AC-xxx`).
