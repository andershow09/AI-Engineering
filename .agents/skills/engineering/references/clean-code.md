# Clean Code: Guia de Práticas e Padrões de Código Limpo

O código limpo é simples, direto, legível como uma prosa bem escrita e fácil de manter. Deve expressar a intenção do desenvolvedor sem ambiguidades.

---

## 1. Nomenclatura Expressiva

- **Revele a intenção:** O nome deve dizer por que existe, o que faz e como é usado.
  - *Ruim:* `int d;` ou `const list = [];`
  - *Bom:* `int elapsedTimeInDays;` ou `const activeUserAccounts = [];`
- **Evite desinformação e abreviações crípticas:**
  - *Ruim:* `hp` (para hypotenuse ou health points?), `modUsr()`
  - *Bom:* `modifyUserRole()` ou `calculateHypotenuse()`
- **Faça distinções significativas:**
  - Evite adicionar sufixos genéricos como `Data`, `Info`, `Object` em todo lugar (`UserData` vs `UserInfo` vs `User`).
- **Nomes pronunciáveis e pesquisáveis:**
  - Evite constantes mágicas soltas no código. Substitua números e strings por constantes com nomes expressivos:
  - *Ruim:* `if (status === 4)`
  - *Bom:* `const STATUS_PAYMENT_CONFIRMED = 4; if (status === STATUS_PAYMENT_CONFIRMED)`

---

## 2. Funções e Métodos

- **Pequenas e focadas:** Funções raramente devem ultrapassar 20 a 30 linhas. Se estão maiores, geralmente estão fazendo mais de uma coisa.
- **Faça apenas uma coisa (Single Level of Abstraction):**
  - Todas as instruções dentro de uma função devem pertencer ao mesmo nível conceitual de abstração.
  - Isole operações de baixo nível (ex: manipulação de strings, parsing regex) em funções utilitárias menores.
- **Poucos argumentos:**
  - O ideal é 0 (niládico), 1 (monádico) ou 2 (diádico).
  - Mais de 3 argumentos: agrupe em um objeto de configuração ou DTO (`CreateUserCommand`).
- **Sem efeitos colaterais ocultos:**
  - Uma função chamada `checkPassword` não deve secretamente resetar a sessão do usuário ou gravar logs de auditoria se isso não estiver explícito no contrato.
- **Separação Comando-Consulta (Command Query Separation - CQS):**
  - Uma função deve executar uma ação (mudar estado) OU responder a uma pergunta (retornar dados), mas nunca ambos.

---

## 3. Tratamento de Erros e Exceções

- **Prefira lançar exceções a retornar códigos de erro:**
  - Códigos de erro poluem o fluxo principal com condicionais de verificação infinitas.
- **Não capture exceções genéricas sem tratamento:**
  - Evite `catch (Exception e) {}` silencioso. Sempre registre a causa raiz com contexto ou re-lance com uma exceção de domínio.
- **Não retorne nem passe `null` indiscriminadamente:**
  - Prefira o padrão *Null Object*, coleções vazias (`[]`), ou tipos `Optional`/`Result` onde a ausência de valor é um fluxo previsto.

---

## 4. Comentários

- **O código deve se autoexplicar:**
  - Comentários não compensam código ruim. Refatore o código em vez de explicar o que ele faz.
- **Bons comentários:**
  - Explicação de decisões de negócio obscuras ou limitações de bibliotecas externas ("por quê", não "o quê").
  - Avisos sobre consequências de alteração de estado ou concorrência.
  - TODOs rastreáveis com contexto.
- **Maus comentários:**
  - Comentários redundantes que apenas repetem o nome da função.
  - Código comentado (utilize o controle de versão Git).

---

## 5. Princípios Complementares de Engenharia

- **DRY (Don't Repeat Yourself):** Cada pedaço de conhecimento ou lógica de negócio deve ter uma representação única e inequívoca no sistema.
- **KISS (Keep It Simple, Stupid):** A simplicidade sempre deve ser o objetivo principal. Evite superengenharia e abstrações desnecessárias.
- **YAGNI (You Aren't Gonna Need It):** Implemente o que é necessário agora, não o que você imagina que poderá precisar no futuro distante.
- **Boy Scout Rule:** "Deixe a área do acampamento mais limpa do que você a encontrou." A cada toque em um arquivo, melhore pequenos detalhes de formatação, nomenclatura ou organização.
