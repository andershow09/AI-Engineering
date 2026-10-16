# Constituição e Governança Técnica

Em projetos orientados por especificação, a **Constituição (`.specify/memory/constitution.md`)** é a lei suprema do repositório. Ela prevalece sobre preferências de implementação individuais, hábitos de programadores e suposições de modelos de IA.

---

## 1. Por que Estabelecer uma Constituição?

Modelos de linguagem (LLMs) frequentemente tomam decisões por "senso comum" que violam diretrizes sutis de engenharia (ex: usar floats para dinheiro, retornar zero quando um dado é desconhecido, realizar updates destrutivos no banco de dados). 

A Constituição resolve esse problema estabelecendo **princípios inegociáveis** com penalidades imediatas de rejeição em revisão de código.

---

## 2. Exemplos de Princípios Constitucionais Fundamentais

Inspirado na constituição do projeto `valor-real`:

### I. Contratos Normativos Antes de Código
- Nenhuma implementação começa sem spec aprovada e contrato correspondente (OpenAPI, DDL) atualizado. Em caso de divergência, contratos normativos têm precedência absoluta sobre código.
- **Não negociável:** Código sem spec aprovada é rejeitado sumariamente.

### II. Aritmética e Precisão Determinística
- Para domínios financeiros ou de alta precisão: nunca utilizar ponto flutuante binário (`number`, `float`, `double`). Exigir escalas fixas (ex: 2 casas para moeda, 8 para cotações, 12 para quantidades).
- **Não negociável:** Backend é a autoridade sobre cálculos; frontend nunca recalcula regras de negócio para exibir.

### III. Ausência de Dado é `null` com Motivo
- Dado desconhecido nunca vira `0`, nem média, nem valor inferido. Campo indisponível deve retornar explicitamente `null` acompanhado de um motivo ou indicador de qualidade (`PARTIAL`, `RECALCULATING`).
- **Não negociável:** Preenchimento silencioso de lacunas é defeito bloqueante.

### IV. Persistência Append-Only e Reconstruível
- Fatos econômicos e auditoria são imutáveis. Correções ocorrem por cancelamento lógico e evento substituto (`revision + 1`), nunca por `UPDATE` ou `DELETE` destrutivo.
- **Não negociável:** O papel de banco da aplicação não possui privilégios de `UPDATE` em tabelas de fatos.

### V. Isolamento do Proprietário em Profundidade (Defense in Depth)
- O ID do usuário/tenant é derivado unicamente de token criptográfico validado no servidor, nunca aceito de parâmetros fornecidos pelo cliente.
- Defesas somadas: autorização no serviço, Row-Level Security (RLS) no banco de dados e chaves estrangeiras compostas por `tenant_id`.

---

## 3. Precedência Normativa em Caso de Conflito

A constituição define a hierarquia de fontes de verdade:

```text
1. Constituição (.specify/memory/constitution.md)
   │
   ▼
2. Documentos Normativos (Regras de Cálculo, Fórmulas de Negócio)
   │
   ▼
3. Contratos Formais de Interface (OpenAPI, JSON Schema, Protobuf, DDL)
   │
   ▼
4. Especificações de Etapa (specs/NNN/spec.md)
   │
   ▼
5. Planos Técnicos (specs/NNN/plan.md)
   │
   ▼
6. Código-fonte Implementado
```

---

## 4. Complexity Tracking (Rastreabilidade de Complexidade)

Nenhum desenvolvedor ou IA pode introduzir bibliotecas pesadas, padrões distribuídos desnecessários ou violar princípios constitucionais sem justificar expressamente no arquivo `plan.md`:

```markdown
## 6. Complexity Tracking

| Desvio | Por que é necessário | Alternativa mais simples descartada e motivo |
|---|---|---|
| Uso de Redis para caching de cotações | Volume de requisições de 10.000 req/s excede o pool do PostgreSQL | Cache em memória local do Node descartado por não ser compartilhado entre pods do Kubernetes |
```
