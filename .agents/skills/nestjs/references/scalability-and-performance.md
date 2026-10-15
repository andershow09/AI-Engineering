# Escalabilidade, Resiliência & Performance no NestJS

Aplicações backend em produção devem ser capazes de suportar picos de tráfego, falhas parciais de rede e processar cargas intensivas sem travar a thread única de execução do Node.js.

---

## 1. Engine HTTP: Fastify vs Express

Por padrão, o NestJS utiliza o Express. No entanto, para sistemas de alto throughput ou microsserviços com dezenas de milhares de requisições por segundo, o **Fastify** oferece até **2x a 3x mais requisições por segundo** graças ao seu schema-based serialization e menor overhead.

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false, // Desative o logger nativo do Fastify se usar Winston/Pino
      trustProxy: true,
    }),
  );

  // Configurações globais
  await app.listen({ port: 3000, host: '0.0.0.0' });
}
bootstrap();
```

---

## 2. Processamento Assíncrono com BullMQ & Redis

Operações demoradas (envio de e-mails, relatórios em PDF, notificações push, webhooks externos) **nunca** devem bloquear a resposta HTTP do usuário. Use filas baseadas em Redis com `@nestjs/bullmq`:

### 2.1. Configuração do Produtor (Producer)
```typescript
// src/modules/notifications/application/use-cases/send-email.use-case.ts
@Injectable()
export class SendEmailUseCase {
  constructor(@InjectQueue('email-queue') private readonly emailQueue: Queue) {}

  async execute(dto: SendEmailCommand): Promise<void> {
    await this.emailQueue.add('send-welcome-email', dto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000, // 5s, 10s, 20s
      },
      removeOnComplete: true,
      removeOnFail: 1000, // Mantém até 1000 falhas para auditoria
    });
  }
}
```

### 2.2. Configuração do Consumidor (Worker / Processor)
```typescript
// src/modules/notifications/infrastructure/workers/email.worker.ts
@Processor('email-queue', { concurrency: 5 })
export class EmailWorker extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<SendEmailCommand>): Promise<void> {
    const { to, subject, template, variables } = job.data;
    await this.mailerService.send({ to, subject, template, variables });
  }
}
```

---

## 3. Caching de Alta Performance (Cache-Aside Pattern)

Utilize `@nestjs/cache-manager` integrado com store do Redis para cache distribuído entre instâncias horizontais:

```typescript
// src/modules/catalog/application/use-cases/get-product.use-case.ts
@Injectable()
export class GetProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(productId: string): Promise<ProductOutput> {
    const cacheKey = `product:${productId}`;
    
    // 1. Tenta recuperar do cache
    const cached = await this.cacheManager.get<ProductOutput>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Busca na persistência
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }

    const output = ProductOutput.fromDomain(product);

    // 3. Salva no cache com TTL (ex: 15 minutos = 900.000 ms)
    await this.cacheManager.set(cacheKey, output, 900000);

    return output;
  }
}
```

---

## 4. Resiliência: Rate Limiting, Timeouts e Circuit Breakers

### 4.1. Rate Limiting com `@nestjs/throttler`
Protege contra ataques de força bruta e sobrecarga:

```typescript
// app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 10, // Max 10 requisições por segundo
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minuto
        limit: 100, // Max 100 requisições por minuto
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 4.2. Timeout Interceptor Global
Impede requisições presas que esgotam pools de conexão:

```typescript
// src/common/interceptors/timeout.interceptor.ts
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number = 8000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('A requisição excedeu o tempo limite seguro.'));
        }
        return throwError(() => err);
      }),
    );
  }
}
```

---

## 5. Observabilidade & Health Checks com `@nestjs/terminus`

Exponha endpoints para orquestradores (Kubernetes, AWS ECS) validarem prontidão e vitalidade:

```typescript
// src/modules/health/health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaCheck: PrismaHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get('liveness')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300 MB
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      () => this.prismaCheck.pingCheck('database'),
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
    ]);
  }
}
```
