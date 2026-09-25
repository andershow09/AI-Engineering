# Testes de Integração e End-to-End (E2E)

Testes de integração e E2E asseguram que múltiplos componentes, serviços e integrações externas operam harmoniosamente sob condições realistas.

---

## 1. Testes de Integração

### Escopo
- Validação da camada de persistência com banco de dados real (usando SQLite em memória, Testcontainers ou instâncias efêmeras).
- Comunicação de endpoints HTTP com middlewares de autenticação, validação de payload e serialização de resposta.
- Mensageria e filas de background jobs.

### Melhores Práticas
- **Isolamento de Estado:** Limpe o banco de dados antes ou depois de cada teste (`TRUNCATE` / transações com rollback automático).
- **Fixtures e Factories:** Crie fábricas de dados reutilizáveis para gerar entidades válidas sem duplicar código de setup.
- **Isolamento de Serviços Externos:** Utilize ferramentas como MSW (Mock Service Worker), WireMock ou Nock para interceptar chamadas HTTP externas sem depender da disponibilidade de APIs de terceiros.

---

## 2. Testes End-to-End (E2E)

### Escopo
- Simulação do comportamento de ponta a ponta do usuário no navegador ou dispositivo móvel (ex: Playwright, Cypress, WebdriverIO).
- Teste dos fluxos críticos de negócio ("Happy Paths" e principais cenários de erro):
  - Cadastro, Login e Recuperação de Senha.
  - Adição de item ao carrinho e Checkout.
  - Ações essenciais do painel do usuário.

### Diretrizes para Prevenção de Flakiness (Instabilidade)
1. **Evite `sleep()` ou esperas fixas:**
   - Utilize esperas explícitas por eventos/elementos (`waitForSelector`, `toBeVisible()`).
2. **Seletores Resilientes:**
   - Evite seletores baseados em estrutura CSS profunda (ex: `div > div:nth-child(2) > span`).
   - Prefira atributos semânticos ou acessíveis: `getByRole('button', { name: 'Confirmar' })` ou atributos específicos de teste (`data-testid`).
3. **Mantenha os Testes E2E Independentes:**
   - Não crie testes E2E em cadeia onde a falha do teste de login quebra todos os 20 testes subsequentes. Cada teste deve preparar seu próprio estado ou reutilizar sessões autenticadas de forma limpa.
