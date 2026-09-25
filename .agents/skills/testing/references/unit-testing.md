# Testes Unitários e Boas Práticas de Mocking

Testes unitários verificam o comportamento da menor unidade testável de código (função, classe ou método) de maneira rápida e isolada.

---

## 1. Padrão Arrange-Act-Assert (AAA)

Organize cada teste em três fases visivelmente separadas:

```typescript
test('deve calcular o desconto de 10% para clientes VIP', () => {
  // 1. Arrange (Preparação de dados e mocks)
  const discountService = new DiscountService();
  const customer = new Customer({ type: CustomerType.VIP });
  const originalAmount = 100.0;

  // 2. Act (Execução da ação a ser testada)
  const finalAmount = discountService.calculate(customer, originalAmount);

  // 3. Assert (Verificação do resultado)
  expect(finalAmount).toBe(90.0);
});
```

---

## 2. Test Doubles: Mocks, Stubs, Spies e Fakes

Evite usar mocks indiscriminadamente para tudo. Conheça as diferenças:

- **Dummy:** Objetos passados apenas para preencher listas de parâmetros, nunca usados de fato.
- **Stub:** Fornece respostas predeterminadas para chamadas feitas durante o teste (ex: `paymentGateway.isAuthorized() -> true`).
- **Spy:** Registra informações sobre como foi chamado (número de chamadas, parâmetros recebidos).
- **Mock:** Objeto pré-programado com expectativas sobre as chamadas que deve receber. A verificação falha se o fluxo não ocorrer exatamente como previsto.
- **Fake:** Implementação simplificada que funciona de verdade, mas não adequada para produção (ex: `InMemoryUserRepository`).

> **Regra de Ouro:** Não mocke o que você não possui (APIs externas). Crie uma camada de abstração (porta/adaptador) e mocke sua própria interface.

---

## 3. Diretrizes de Qualidade para Testes Unitários

1. **Uma Asserção Lógica por Teste:**
   - O teste deve falhar por apenas um motivo claro. Múltiplos asserts são permitidos apenas se validarem propriedades do mesmo resultado conceitual.
2. **Nomes Descritivos:**
   - O nome do teste deve documentar o comportamento:
     - *Ruim:* `test('teste 1', () => {})`
     - *Bom:* `test('deve lançar InvalidEmailException quando o email informado não contiver @', () => {})`
3. **Não Teste Detalhes de Implementação:**
   - Teste o **comportamento observável** (entradas e saídas), não métodos privados ou a ordem interna de variáveis. Testes acoplados a detalhes quebram a cada refatoração.
4. **Determinismo Absoluto:**
   - Elimine dependências de hora do sistema (`Date.now()`), números aleatórios ou conexões de rede. Utilize injeção de provedores de data/tempo controláveis.
