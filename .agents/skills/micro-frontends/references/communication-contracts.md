# Contratos de Comunicação e Event Broker em Micro Frontends

Este guia estabelece os padrões para troca de mensagens entre Shell e Remotes sem criar acoplamento de código ou dependências circulares.

---

## 1. Princípios de Desacoplamento

1. **Nunca compartilhe instâncias de estado em memória:**
   - ❌ Errado: Exportar um service do Shell contendo `BehaviorSubject` ou `Signal` e injetar diretamente no Remote. Se o remote for compilado separadamente ou a versão do Angular divergir sutilmente, o singleton quebra.
   - ✅ Correto: Disparar e escutar eventos com payloads serializáveis (JSON puro).
2. **Contratos Tipados em Pacote Leve (`@apdev/mfe-contracts`):**
   - Mantenha apenas interfaces TypeScript (sem lógica nem código executável) em um pacote compartilhado.

---

## 2. Event Broker baseado em `CustomEvent` ou `BroadcastChannel`

O próprio ecossistema do navegador já fornece primitivas robustas e de alto desempenho:

### 2.1. Tipos de Eventos Globais
```typescript
// @apdev/mfe-contracts/events.ts
export type MfeEventType = 
  | 'apdev:auth:session-expired'
  | 'apdev:theme:changed'
  | 'apdev:navigation:requested'
  | 'apdev:notification:dispatched';

export interface MfeEventPayload<T = unknown> {
  source: string; // Ex: 'mfe-billing'
  timestamp: number;
  data: T;
}
```

### 2.2. Service de Event Broker Reutilizável
```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MfeEventBrokerService {
  /**
   * Dispara um evento para qualquer MFE na mesma janela
   */
  dispatch<T>(eventType: string, data: T, source: string = 'app'): void {
    const detail = {
      source,
      timestamp: Date.now(),
      data,
    };
    window.dispatchEvent(new CustomEvent(eventType, { detail }));
  }

  /**
   * Registra um listener desacoplado
   */
  listen<T>(eventType: string, handler: (payload: { source: string; timestamp: number; data: T }) => void): () => void {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent;
      handler(customEvent.detail);
    };

    window.addEventListener(eventType, listener);

    // Retorna função de desinscrição para evitar memory leaks
    return () => window.removeEventListener(eventType, listener);
  }
}
```

### 2.3. Exemplo de Uso em um Remote (Disparo de Notificação)
```typescript
export class BillingPaymentComponent {
  private readonly broker = inject(MfeEventBrokerService);

  onPaymentSuccess(invoiceId: string): void {
    this.broker.dispatch('apdev:notification:dispatched', {
      type: 'success',
      title: 'Pagamento Concluído',
      message: `Fatura #${invoiceId} paga com sucesso!`,
    }, 'mfe-billing');
  }
}
```
