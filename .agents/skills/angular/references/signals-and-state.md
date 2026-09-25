# Signals e Gestão de Estado no Angular 22+

Este guia detalha os padrões e boas práticas para gerenciamento de estado reativo utilizando a API nativa de **Signals** do Angular e o **NgRx SignalStore**.

---

## 1. Fundamentos de Angular Signals

### 1.1. Primitivas de Sinais

* **`signal(initialValue)`**: Cria um sinal gravável (*WritableSignal*).
* **`computed(fn)`**: Deriva um valor calculado a partir de um ou mais sinais. É puramente reativo, preguiçoso (*lazy*) e memorizado (*memoized*).
* **`effect(fn)`**: Executa efeitos colaterais quando os sinais observados sofrem mutação.

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Valor: {{ count() }}</p>
      <p>Dobro: {{ doubleCount() }}</p>
      <button (click)="increment()">Incrementar</button>
      <button (click)="reset()">Resetar</button>
    </div>
  `,
})
export class CounterComponent {
  readonly count = signal<number>(0);
  readonly doubleCount = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log(`[Telemetry] Contador atualizado: ${this.count()}`);
    });
  }

  increment(): void {
    this.count.update(val => val + 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
```

### 1.2. Regras de Ouro com Signals
1. **Evite mutação dentro de `effect()`**: O `effect` existe para efeitos externos (DOM, localStorage, telemetria). Modificar outro sinal dentro de um effect cria loops cíclicos e degrada a previsibilidade.
2. **Prefira `computed` a variáveis sincronizadas**: Nunca crie dois sinais se um puder ser calculado puramente a partir do outro.
3. **Imutabilidade em objetos e listas**: Ao atualizar sinais contendo objetos ou arrays, sempre utilize spreads ou métodos imutáveis:
   ```typescript
   this.todos.update(list => [...list, newTodo]);
   ```

---

## 2. Signal-based Component API (Inputs, Outputs & Models)

A partir das versões modernas do Angular, abandonamos os decorators legados (`@Input()`, `@Output()`, `@Model()`) em favor das funções utilitárias baseadas em Signals:

```typescript
import { Component, input, output, model } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-item',
  standalone: true,
  template: `
    <div class="task-row" [class.done]="isSelected()">
      <input type="checkbox" [checked]="isSelected()" (change)="toggleSelection()" />
      <span>{{ task().title }} (Prioridade: {{ priority() }})</span>
      <button (click)="onDelete()">Excluir</button>
    </div>
  `,
})
export class TaskItemComponent {
  // Input obrigatório
  readonly task = input.required<Task>();

  // Input opcional com valor padrão
  readonly priority = input<'low' | 'medium' | 'high'>('medium');

  // Two-way binding reativo (substitui @Input() + @Output() combo)
  readonly isSelected = model<boolean>(false);

  // Output tipado
  readonly deleted = output<string>();

  toggleSelection(): void {
    this.isSelected.update(v => !v);
  }

  onDelete(): void {
    this.deleted.emit(this.task().id);
  }
}
```

---

## 3. Arquitetura com NgRx SignalStore

Para aplicações enterprise com múltiplos domínios e necessidade de persistência, paginação e chamadas assíncronas:

### 3.1. Estrutura do Store
```typescript
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { OrderService, Order } from './order.service';

interface OrderState {
  orders: Order[];
  selectedOrderId: string | null;
  loading: boolean;
  error: string | null;
}

const initialOrderState: OrderState = {
  orders: [],
  selectedOrderId: null,
  loading: false,
  error: null,
};

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState(initialOrderState),
  withComputed(({ orders, selectedOrderId }) => ({
    selectedOrder: computed(() => orders().find(o => o.id === selectedOrderId()) ?? null),
    totalRevenue: computed(() => orders().reduce((acc, curr) => acc + curr.total, 0)),
  })),
  withMethods((store, orderService = inject(OrderService)) => ({
    selectOrder(id: string) {
      patchState(store, { selectedOrderId: id });
    },
    loadOrders: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          orderService.fetchOrders().pipe(
            tap(orders => patchState(store, { orders, loading: false })),
            catchError(err => {
              patchState(store, { error: err.message, loading: false });
              return of([]);
            })
          )
        )
      )
    ),
  }))
);
```
