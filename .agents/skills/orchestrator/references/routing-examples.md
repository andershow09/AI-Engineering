# Exemplos de Roteamento em Ação

Casos práticos que demonstram o fluxo completo do orquestrador com classificação, roteamento e delegação de subtarefas.

---

## Exemplo 1: "Crie uma tela de Configurações com toggles de tema e notificações"

### Decomposição pelo Orquestrador (Claude Opus)

**Análise da Requisição:**
- Envolve decisão de design (onde colocar o state, qual padrão de navegação).
- Envolve geração de código (componente, serviço, template, testes).
- Pode ser dividida em subtarefas paralelas.

**Plano de Execução:**

```
[ANÁLISE | pro] #1: Definir a arquitetura do módulo Configurações
  → Decisão: Standalone component com Signals para estado local.
  → Integrar com ThemeService existente e FCMService para notificações.
  → Output: Contrato de interfaces e esboço de componentes.

[EXECUÇÃO | flash] #2: Gerar o componente ConfiguracoesPage e template Ionic
  → Input: Contrato da tarefa #1.
  → Gerar: configuracoes.page.ts, configuracoes.page.html, configuracoes.page.scss.

[EXECUÇÃO | flash] #3: Escrever testes unitários para ConfiguracoesPage
  → Input: Componente gerado na tarefa #2.
  → Gerar: configuracoes.page.spec.ts com mocks do ThemeService e FCMService.

[ANÁLISE | pro] #4: Revisão final do código gerado
  → Validar: Aderência a SOLID, Clean Code e padrões Ionic/Angular.
  → Output: Aprovação ou lista de ajustes.
```

### Tradução para API de Subagentes (Antigravity)

```
# O orquestrador (rodando como Claude Opus / pro) executa #1 e #4 diretamente.
# #2 e #3 são delegados a subagentes flash:

invoke_subagent(
  TypeName: "self",
  Role: "Ionic Page Generator",
  Model: "flash",
  Prompt: "Crie o componente ConfiguracoesPage seguindo este contrato: [...]"
)

invoke_subagent(
  TypeName: "self",
  Role: "Unit Test Writer",
  Model: "flash",
  Prompt: "Escreva testes unitários para ConfiguracoesPage seguindo AAA: [...]"
)
```

---

## Exemplo 2: "O login está quebrando quando o token expira durante a navegação"

### Decomposição pelo Orquestrador

```
[PESQUISA | flash_lite] #1: Mapear o fluxo de autenticação
  → Localizar: AuthService, auth.guard, interceptors de HTTP, token refresh.
  → Output: Lista de arquivos e fluxo de dados.

[ANÁLISE | pro] #2: Diagnosticar a causa raiz
  → Input: Mapa do fluxo da tarefa #1.
  → Raciocínio: O interceptor faz refresh do token? Há race condition?
  → Output: Causa raiz identificada e estratégia de correção.

[EXECUÇÃO | flash] #3: Implementar o fix
  → Input: Estratégia definida na tarefa #2.
  → Aplicar: Adicionar retry com refresh no interceptor HTTP.

[EXECUÇÃO | flash] #4: Criar teste de regressão
  → Input: Cenário de falha da tarefa #2.
  → Gerar: Teste que simula token expirado durante navegação.
```

---

## Exemplo 3: "Faça uma auditoria de qualidade completa do projeto GoSafra"

### Decomposição pelo Orquestrador

```
[PESQUISA | flash_lite] #1: Mapear a estrutura completa do projeto
  → Executar: repo-map.ps1.
  → Output: Topologia, stack, total de módulos.

[ANÁLISE | pro] #2: Avaliar aderência a SOLID e Clean Code
  → Paralelo com #3 e #4.
  → Foco: SRP em services, DIP em components, God Objects.

[ANÁLISE | pro] #3: Avaliar cobertura e estratégia de testes
  → Verificar: Thresholds configurados? Testes existentes cobrem branches?
  → Executar: verify-coverage-guardrail.ps1.

[ANÁLISE | pro] #4: Avaliar segurança e boas práticas
  → Foco: Exposição de secrets, sanitização de inputs, CORS.

[ANÁLISE | pro] #5: Gerar relatório consolidado
  → Input: Resultados de #2, #3, #4.
  → Output: Relatório com severidade (crítico/alto/médio/baixo) e ações recomendadas.

[EXECUÇÃO | flash] #6: Implementar correções críticas
  → Input: Itens críticos do relatório #5.
```

**Nota:** As subtarefas #2, #3 e #4 são **independentes** e podem ser despachadas como 3 subagentes `pro` em paralelo para máxima eficiência.
