# Clean Architecture & Princípios SOLID no NestJS

Este guia aprofunda o design de software orientado a domínio (DDD) e a aplicação estrita dos princípios SOLID dentro do ecossistema NestJS (Node.js/TypeScript).

---

## 1. Segregação de Camadas (Clean / Hexagonal Architecture)

A regra de dependência fundamental afirma que **o código de camadas internas nunca pode depender de detalhes de camadas externas**.

```
[Presentation / API (Controllers, DTOs)]
           │
           ▼
[Application / Use Cases (Orquestração, Ports)]
           │
           ▼
[Domain (Entities, Value Objects, Domain Exceptions)]
           ▲
           │ (implementa portas via DIP)
[Infrastructure (Prisma, TypeORM, Redis, HTTP Clients)]
```

### 1.1. Camada de Domínio (Domain Layer)
- O núcleo da aplicação. Não possui decoradores do NestJS (`@Injectable()`), anotações de ORM (`@Entity()`, `@Column()`) ou bibliotecas de terceiros.
- **Entidades de Domínio:** Encapsulam regras e invariantes de negócio.
  ```typescript
  // src/modules/orders/domain/entities/order.entity.ts
  export interface OrderProps {
    id: string;
    customerId: string;
    items: OrderItem[];
    status: OrderStatus;
    totalAmount: Money;
    createdAt: Date;
  }

  export class Order {
    private constructor(private readonly props: OrderProps) {}

    static create(customerId: string, items: OrderItem[]): Order {
      if (!items || items.length === 0) {
        throw new DomainException('Um pedido deve conter ao menos um item.');
      }
      const total = items.reduce((acc, item) => acc.add(item.total), Money.zero());
      return new Order({
        id: crypto.randomUUID(),
        customerId,
        items,
        status: OrderStatus.PENDING,
        totalAmount: total,
        createdAt: new Date(),
      });
    }

    cancel(): void {
      if (this.props.status === OrderStatus.DELIVERED) {
        throw new DomainException('Pedidos entregues não podem ser cancelados.');
      }
      this.props.status = OrderStatus.CANCELLED;
    }

    get id(): string { return this.props.id; }
    get status(): OrderStatus { return this.props.status; }
    get totalAmount(): Money { return this.props.totalAmount; }
  }
  ```

- **Value Objects:** Objetos imutáveis que representam conceitos atômicos de negócio validados na criação (ex: `Money`, `Email`, `CPF`, `Address`).

---

### 1.2. Camada de Aplicação (Application Layer)
- Orquestra os fluxos de casos de uso sem acoplamento a protocolos de entrega (HTTP, CLI, Cron).
- **Portas de Saída (Output Ports / Driven Ports):** Definidas como classes abstratas no TypeScript para servirem simultaneamente como contrato e token de injeção no NestJS:
  ```typescript
  // src/modules/orders/application/ports/order.repository.ts
  export abstract class OrderRepository {
    abstract save(order: Order): Promise<void>;
    abstract findById(id: string): Promise<Order | null>;
    abstract countByCustomer(customerId: string): Promise<number>;
  }

  export abstract class PaymentGateway {
    abstract process(amount: Money, cardToken: string): Promise<{ transactionId: string }>;
  }
  ```

- **Casos de Uso (Use Cases):**
  ```typescript
  // src/modules/orders/application/use-cases/create-order.use-case.ts
  @Injectable()
  export class CreateOrderUseCase {
    constructor(
      private readonly orderRepository: OrderRepository,
      private readonly paymentGateway: PaymentGateway,
    ) {}

    async execute(command: CreateOrderCommand): Promise<CreateOrderResult> {
      const order = Order.create(command.customerId, command.items);
      
      const payment = await this.paymentGateway.process(order.totalAmount, command.paymentToken);
      await this.orderRepository.save(order);

      return {
        orderId: order.id,
        status: order.status,
        transactionId: payment.transactionId,
      };
    }
  }
  ```

---

### 1.3. Camada de Infraestrutura (Infrastructure Layer)
- Implementa as portas definidas pela camada de aplicação.
- Contém classes que manipulam banco de dados (Prisma, TypeORM, Mongoose), clientes HTTP externos (Axios), brokers de mensageria (Kafka, RabbitMQ) e drivers do sistema operacional.
- Realiza o mapeamento entre o modelo relacional/documento e as entidades de domínio ricas via **Mappers**:
  ```typescript
  // src/modules/orders/infrastructure/persistence/prisma-order.repository.ts
  @Injectable()
  export class PrismaOrderRepository implements OrderRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(order: Order): Promise<void> {
      const raw = OrderMapper.toPersistence(order);
      await this.prisma.orderModel.upsert({
        where: { id: raw.id },
        update: raw,
        create: raw,
      });
    }

    async findById(id: string): Promise<Order | null> {
      const record = await this.prisma.orderModel.findUnique({
        where: { id },
        include: { items: true },
      });
      return record ? OrderMapper.toDomain(record) : null;
    }

    async countByCustomer(customerId: string): Promise<number> {
      return this.prisma.orderModel.count({ where: { customerId } });
    }
  }
  ```

---

### 1.4. Camada de Apresentação (Presentation Layer)
- Controllers REST, Resolvers GraphQL ou Handlers gRPC.
- Recebem payloads brutos, validam limites com DTOs, convertem para comandos de aplicação e despacham:
  ```typescript
  // src/modules/orders/presentation/controllers/orders.controller.ts
  @ApiTags('Orders')
  @Controller('v1/orders')
  export class OrdersController {
    constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Cria e processa um novo pedido' })
    async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
      const result = await this.createOrderUseCase.execute(dto.toCommand());
      return OrderResponseDto.fromResult(result);
    }
  }
  ```

---

## 2. Princípios SOLID em Detalhes no NestJS

### SRP (Single Responsibility Principle)
- **Anti-padrão:** Um serviço chamado `OrderService` com 2.500 linhas contendo criação de pedidos, cancelamento, emissão de nota fiscal, envio de e-mail e consulta de relatórios.
- **Padrão Correto:** Decomponha em casos de uso dedicados (`CreateOrderUseCase`, `CancelOrderUseCase`, `GetOrderDetailsQuery`).

### OCP (Open/Closed Principle)
- Utilize a injeção com **Strategy Pattern** para permitir novos comportamentos sem alterar classes existentes:
  ```typescript
  export abstract class DiscountStrategy {
    abstract appliesTo(customer: Customer): boolean;
    abstract calculate(amount: Money): Money;
  }
  ```

### LSP (Liskov Substitution Principle)
- Toda implementação de um `OrderRepository` pode ser substituída sem que nenhum `UseCase` sofra falhas ou comportamentos imprevistos (ex: retornar `null` em vez de array vazio, ou disparar exceções de banco de dados diretamente para camadas superiores).

### ISP (Interface Segregation Principle)
- Não obrigue um caso de uso que só precisa ler dados a depender de métodos de escrita ou remoção. Segregue interfaces de leitura (`Query`) e escrita (`Command`).

### DIP (Dependency Inversion Principle)
- Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.
- No NestJS, utilize sempre `abstract class` para portas. No TypeScript, classes abstratas sobrevivem à compilação JavaScript (diferente de interfaces puras), permitindo que sejam usadas diretamente como tokens no container IoC sem necessidade de `@Inject('STRING_TOKEN')`.
