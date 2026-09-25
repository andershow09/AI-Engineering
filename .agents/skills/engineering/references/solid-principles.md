# Princípios SOLID: Guia de Referência e Aplicação

O acrônimo SOLID representa cinco princípios de design de software orientado a objetos que promovem manutenibilidade, extensibilidade e testabilidade.

---

## 1. Single Responsibility Principle (SRP)
> *"Uma classe/módulo deve ter apenas uma, e somente uma, razão para mudar."*

### Objetivo
Evitar classes ou funções infladas ("God Objects") que misturam responsabilidades distintas (ex: persistência, lógica de negócio e formatação de saída).

### Sinais de Violação (Code Smells)
- Classe com mais de 200–300 linhas desempenhando múltiplas funções.
- Módulos que importam muitas bibliotecas não relacionadas (ex: banco de dados, renderização gráfica e HTTP).
- Mudanças frequentes no mesmo arquivo por motivos de negócio completamente diferentes.

### Exemplo Prático
- **Anti-padrão:** Uma classe `InvoiceService` que calcula impostos, formata o PDF da fatura e envia o e-mail para o cliente.
- **Solução Limpa:**
  - `InvoiceCalculator`: Responsável exclusivamente pelo cálculo dos valores e impostos.
  - `InvoicePdfGenerator`: Responsável por gerar a representação visual/PDF.
  - `InvoiceNotificationSender`: Responsável pelo despacho da mensagem via e-mail/notificação.

---

## 2. Open/Closed Principle (OCP)
> *"Entidades de software devem ser abertas para extensão, mas fechadas para modificação."*

### Objetivo
Permitir que novos comportamentos sejam adicionados sem alterar o código existente, reduzindo o risco de quebrar funcionalidades legadas e testadas.

### Sinais de Violação (Code Smells)
- Blocos extensos de `switch-case` ou cadeias de `if-else` checando tipos de objetos para aplicar regras diferentes.
- Cada nova regra de negócio exige alterar uma classe central estável.

### Exemplo Prático
- **Anti-padrão:** Um método `calculateDiscount(Order order)` com `if (order.type == "VIP") ... else if (order.type == "STUDENT") ...`.
- **Solução Limpa:** Padrão Strategy ou Polimorfismo:
  - Interface `DiscountStrategy` com método `apply(Order order)`.
  - Implementações específicas: `VipDiscountStrategy`, `StudentDiscountStrategy`.
  - Novas regras são adicionadas criando novas classes sem tocar nas existentes.

---

## 3. Liskov Substitution Principle (LSP)
> *"Subtipos devem ser substituíveis pelos seus tipos base sem que a corretude do programa seja comprometida."*

### Objetivo
Garantir que a herança seja usada de forma correta e sem surpresas em tempo de execução.

### Sinais de Violação (Code Smells)
- Sobrescrita de métodos onde a subclasse lança `NotImplementedException` ou `UnsupportedOperationException`.
- A subclasse enfraquece pós-condições ou fortalece pré-condições.
- Clientes precisando checar `instanceof` ou fazer casting para usar um subtipo.

### Exemplo Clássico
- **Anti-padrão:** Classe `Square` herdando de `Rectangle`. Alterar a largura de um `Square` altera também a sua altura, quebrando a expectativa de quem consome a interface `Rectangle`.
- **Solução Limpa:** Ambos implementam uma interface comum `Shape` com método `area()`, sem forçar relação de herança equivocada entre Quadrado e Retângulo.

---

## 4. Interface Segregation Principle (ISP)
> *"Clientes não devem ser forçados a depender de interfaces que não utilizam."*

### Objetivo
Promover desacoplamento através de interfaces pequenas, coesas e focadas no consumidor.

### Sinais de Violação (Code Smells)
- Classes implementando interfaces enormes deixando vários métodos vazios ou lançando exceção.
- Modificar uma interface afeta clientes que não tinham interesse nos métodos alterados.

### Exemplo Prático
- **Anti-padrão:** Uma interface `Worker` com `work()`, `eat()`, `sleep()`. Robôs implementando `Worker` precisam ignorar `eat()` e `sleep()`.
- **Solução Limpa:** Segregar em contratos menores: `Workable`, `Feedable`. Robôs implementam apenas `Workable`; humanos implementam ambos.

---

## 5. Dependency Inversion Principle (DIP)
> *"1. Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.*
> *2. Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações."*

### Objetivo
Desacoplar a lógica de domínio de serviços de infraestrutura (bancos de dados, APIs de terceiros, filas, mensageria).

### Sinais de Violação (Code Smells)
- Classes de serviço instanciando diretamente clientes de banco de dados (`new PostgresRepository()`) ou bibliotecas externas.
- Dificuldade para criar testes unitários sem levantar infraestrutura real.

### Exemplo Prático
- **Anti-padrão:**
  ```python
  class OrderService:
      def __init__(self):
          self.repository = PostgresOrderRepository() # Dependência direta de implementação
  ```
- **Solução Limpa:**
  ```python
  class OrderService:
      def __init__(self, repository: OrderRepositoryInterface):
          self.repository = repository # Injeção de dependência via abstração
  ```
