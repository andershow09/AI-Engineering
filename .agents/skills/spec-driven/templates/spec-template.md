# Spec: [NOME DA FEATURE]

**Branch/pasta:** `NNN-nome-da-feature` · **Etapa do plano:** `[E0–EN]` · **Status:** Rascunho | Em revisão | Aprovada
**Criada em:** `AAAA-MM-DD` · **Entrada:** [link ou descrição da necessidade de negócio]

> Escreva para quem decide o produto. Descreva **o quê** e **por quê**, nunca a implementação ou tecnologia. Toda ambiguidade vira `[NEEDS CLARIFICATION: pergunta]` — suposição silenciosa é defeito de spec.

---

## 1. Resumo

Um parágrafo conciso: problema a resolver, quem é afetado e qual resultado observável a entrega produz.

---

## 2. Cenários de Usuário

### Fluxo Principal
1. O usuário...
2. O sistema valida...
3. O resultado é apresentado...

### Fluxos Alternativos e de Recuperação
- Se o usuário cancelar a operação no meio: ...
- Se a conexão falhar durante o envio: ...

### Casos-Limite (Edge Cases)
- Volume massivo de dados (ex: arquivo com 50.000 registros): ...
- Valores limítrofes (zero, valores negativos, strings muito longas): ...

---

## 3. Requisitos Funcionais

| ID | Requisito | Verificação |
|---|---|---|
| FR-001 | O sistema DEVE ... | Como se comprova o atendimento |
| FR-002 | O sistema DEVE ... | Como se comprova o atendimento |

---

## 4. Requisitos Não Funcionais

| ID | Requisito | Verificação |
|---|---|---|
| NFR-001 | Tempo de resposta inferior a 2 segundos para 95% das requisições | Teste de carga ou benchmark |
| NFR-002 | Isolamento estrito de dados por conta de usuário | Teste automatizado de autorização |

---

## 5. Entidades e Conceitos do Domínio

Apenas conceitos de negócio relevantes, sem esquema físico ou tabelas:
- **Conceito A:** Significado e regras associadas.
- **Conceito B:** Significado e relacionamento de negócio.

---

## 6. Fora de Escopo

- O que explicitamente NÃO será entregue nesta etapa:
  - Não inclui suporte a formato XML.
  - Não inclui painel administrativo.

---

## 7. Dependências e Premissas

- Specs prévias necessárias aprovadas e entregues.
- Premissas de negócio assumidas.

---

## 8. Critérios de Aceite

| ID | Cenário | Resultado Esperado |
|---|---|---|
| AC-001 | Executar ação válida com dados corretos | Sucesso com feedback claro e persistência confirmada |
| AC-002 | Tentar submissão com dados inválidos | Mensagem de erro explicativa sem efeitos colaterais |

---

## 9. Pontos em Aberto

| ID | Pergunta | Bloqueia | Responsável |
|---|---|---|---|
| Q-001 | `[NEEDS CLARIFICATION: Pergunta específica sobre regra de negócio]` | Sim / Não | Nome do responsável |

---

## 10. Conformidade com a Constituição

Liste os princípios da constituição do projeto aplicáveis e como esta spec os cumpre.
