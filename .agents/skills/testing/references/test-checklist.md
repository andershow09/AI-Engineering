# Checklist de Revisão de Testes Automatizados

Utilize este checklist para avaliar a qualidade e a robustez dos testes antes de considerá-los prontos.

---

## 1. Estrutura e Legibilidade

- [ ] Os testes seguem a estrutura clara **AAA (Arrange, Act, Assert)**?
- [ ] O nome de cada teste expressa claramente o cenário e o resultado esperado?
- [ ] O teste foca em comportamento de negócio e não em detalhes internos de implementação privada?
- [ ] O código do teste é limpo, livre de condicionais complexas (`if-else` ou loops desnecessários dentro do teste)?

---

## 2. Isolamento e Confiabilidade

- [ ] Os testes rodam de forma independente em qualquer ordem?
- [ ] Não há dependência de recursos externos instáveis (rede externa, APIs de terceiros não mockadas)?
- [ ] Não há timers arbitrários (`sleep`, `setTimeout` fixos); apenas espera ativa baseada em eventos/estados?
- [ ] O estado de banco de dados ou memória é limpo entre execuções?

---

## 3. Cobertura e Casos de Borda

- [ ] Os fluxos felizes (*Happy Paths*) foram validados?
- [ ] Os fluxos de erro previstos (dados inválidos, falta de permissão, recursos inexistentes) foram testados com as exceções adequadas?
- [ ] Cenários limites/fronteira (listas vazias, valores nulos, limites máximos/mínimos) foram exercitados?

---

## 4. Desempenho da Suíte

- [ ] Testes unitários executam rapidamente (na ordem de milissegundos)?
- [ ] Testes mais lentos de integração ou E2E estão devidamente categorizados e não atrasam desnecessariamente o loop local de desenvolvimento?

---

## 5. Guardrail de Cobertura e Thresholds Mínimos (Bloqueante)

- [ ] Os thresholds mínimos de cobertura estão formalmente configurados no test runner (`vitest.config`, `jest.config`, etc.)?
- [ ] A sintaxe dos thresholds está correta para o runner específico (ex.: no Vitest os thresholds são diretos em `coverage.thresholds`, sem encapsular em `global`)?
- [ ] A execução dos testes rodou com `--coverage` sem disparar falhas de limite?
- [ ] A cobertura atinge ou supera a meta estabelecida (mínimo global de 80% ou meta incremental de ratcheting)?
- [ ] Em projetos legados com baixa cobertura, o threshold foi travado no patamar atual para impedir regressões silenciosas?
- [ ] Módulos novos ou refatorados possuem cobertura rigorosa (90%+)?
