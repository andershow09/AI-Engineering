# Standalone, Control Flow e Performance no Angular 22+

Este guia detalha a migração de conceitos legados para as novas primitivas de template e renderização de alta velocidade do Angular moderno.

---

## 1. Control Flow Declarativo

O compilador do Angular substitui diretivas por sintaxe de bloco nativa, trazendo checagem estrita de tipos no template e melhor tempo de build.

### 1.1. `@if`, `@else if`, `@else` e `@let`
```html
@if (authService.currentUser(); as user) {
  <header>
    @let isPremium = user.plan === 'enterprise';
    <h2>Bem-vindo, {{ user.name }}</h2>
    @if (isPremium) {
      <span class="gold-badge">Membro Enterprise</span>
    }
  </header>
} @else if (authService.isLoading()) {
  <app-skeleton-header />
} @else {
  <button (click)="login()">Entrar na Plataforma</button>
}
```

### 1.2. `@for` com Rastreamento Obrigatório e `@empty`
A cláusula `track` é obrigatória no Angular moderno, evitando re-renderizações desnecessárias do DOM virtual:

```html
<ul class="notification-list">
  @for (notification of notifications(); track notification.id) {
    <li [class.unread]="!notification.read">
      {{ notification.message }}
      <small>{{ notification.timestamp | date:'shortTime' }}</small>
    </li>
  } @empty {
    <li class="empty-state">Nenhuma notificação recente.</li>
  }
</ul>
```

### 1.3. `@switch` e `@case`
Sem necessidade de `break` explícito:

```html
@switch (orderStatus()) {
  @case ('pending') {
    <span class="status-warning">Aguardando Pagamento</span>
  }
  @case ('processing') {
    <span class="status-info">Em Separação</span>
  }
  @case ('delivered') {
    <span class="status-success">Entregue com Sucesso</span>
  }
  @default {
    <span class="status-neutral">Status Desconhecido</span>
  }
}
```

---

## 2. Deferrable Views (`@defer`) para Otimização de Web Vitals

As *Deferrable Views* permitem carregar componentes pesados sob demanda de forma declarativa, sem a complexidade manual de `import()` dinâmico.

### 2.1. Gatilhos de Ativação (*Triggers*)

| Gatilho | Quando Carrega | Exemplo de Uso |
| :--- | :--- | :--- |
| `on viewport` | Quando o placeholder entra na área visível da tela (Intersection Observer). | Gráficos, comentários no rodapé, tabelas longas. |
| `on interaction` | Quando o usuário clica ou foca no elemento. | Modais pesados, dropdowns com autocomplete. |
| `on hover` | Quando o ponteiro passa sobre o placeholder. | Menus suspensos, previews de mídia. |
| `on timer(time)` | Após transcorrido um tempo determinado. | Banners promocionais, assistentes virtuais secundários. |
| `when condition` | Baseado em um booleano reativo (Signal ou booleano). | Componentes condicionados a ações de negócio. |

### 2.2. Exemplo Completo com Prefetch
```html
<section class="analytics-section">
  <!-- O componente só é renderizado quando entra na tela, mas o JS é pré-carregado no tempo ocioso da CPU -->
  @defer (on viewport; prefetch on idle) {
    <app-analytics-dashboard [metrics]="liveMetrics()" />
  } @placeholder (minimum 400ms) {
    <!-- Evita flickering exigindo tempo mínimo do skeleton -->
    <div class="skeleton-chart-box">
      <p>Carregando painel de métricas...</p>
    </div>
  } @loading (after 100ms; minimum 200ms) {
    <div class="loader-overlay">
      <app-spinner />
    </div>
  } @error {
    <div class="error-banner">
      <p>Não foi possível carregar o painel analítico.</p>
      <button (click)="retryLoad()">Tentar Novamente</button>
    </div>
  }
</section>
```

---

## 3. Configuração de Aplicação Zoneless

No arquivo `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions() // Animações nativas de transição de rota da View Transitions API
    ),
    provideHttpClient(
      withFetch(), // Utiliza a Fetch API nativa em vez de XMLHttpRequest
      withInterceptors([authInterceptor])
    ),
  ],
};
```
