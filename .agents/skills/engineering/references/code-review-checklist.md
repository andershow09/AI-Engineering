# Checklist de Code Review: SOLID & Clean Code

Utilize este checklist como guia de verificação antes de submeter, aprovar ou finalizar qualquer alteração de código.

---

## 1. Verificação de SOLID

- [ ] **SRP:** Cada classe/função tem uma responsabilidade única e clara?
- [ ] **SRP:** A lógica de persistência/infraestrutura está separada das regras de negócio?
- [ ] **OCP:** A adição de novos casos de uso exigirá alterar esta classe ou é possível estendê-la?
- [ ] **OCP:** Condicionais extensas sobre tipos de objetos foram substituídas por polimorfismo ou estratégias?
- [ ] **LSP:** As subclasses cumprem integralmente o contrato de suas superclasses/interfaces sem lançar exceções inesperadas?
- [ ] **ISP:** As interfaces são coesas e contêm apenas métodos necessários aos seus consumidores?
- [ ] **DIP:** Módulos de alto nível dependem de abstrações (interfaces/protocolos) e não de instâncias concretas?
- [ ] **DIP:** As dependências são injetadas (construtor/fábrica) em vez de instanciadas internamente?

---

## 2. Verificação de Clean Code

- [ ] **Legibilidade:** Os nomes de variáveis, métodos e classes revelam intenção imediata?
- [ ] **Tamanho de Funções:** As funções são pequenas e contêm apenas um nível de abstração?
- [ ] **Efeitos Colaterais:** As funções realizam apenas o que seu nome promete sem efeitos ocultos?
- [ ] **Parâmetros:** Funções evitam listas longas de argumentos (máximo 3, ou agrupados em DTO)?
- [ ] **Tratamento de Erros:** Exceções fornecem mensagem contextual clara e tratam falhas graciosamente?
- [ ] **Nulidade:** O código evita retornos `null`/`undefined` soltos e lida com ausência de valores de forma segura?
- [ ] **Comentários:** Não há código comentado ou comentários redundantes; apenas justificativas arquiteturais essenciais?
- [ ] **Simplicidade:** O código evita superengenharia (YAGNI/KISS)?

---

## 3. Qualidade & Testabilidade

- [ ] Existem testes unitários ou de integração cobrindo os cenários principais e casos de borda?
- [ ] O código introduzido segue o padrão de formatação e linting do projeto?
- [ ] Não há números ou strings mágicas soltas sem constantes descritivas?
- [ ] A alteração deixou a base de código mais limpa do que estava antes (Boy Scout Rule)?
