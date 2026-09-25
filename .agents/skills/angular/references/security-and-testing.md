# Segurança, CSP e Testes no Angular 22+

Este guia reúne as práticas mandatórias de segurança web enterprise e os padrões modernos de testes automatizados para aplicações Angular.

---

## 1. Segurança Web no Angular

### 1.1. Contextual Escaping e DomSanitizer
O Angular trata todas as variáveis inseridas no template como não confiáveis por padrão e aplica sanitização contextual:
- HTML (corpo de elementos, `innerHTML`)
- Style (`style="..."`, `[style.color]`)
- URL (`href`, `src`)
- Resource URL (scripts dinâmicos, iframes)

**Boas Práticas:**
1. Nunca use `bypassSecurityTrust*` para exibir dados fornecidos pelo usuário.
2. Se for estritamente necessário renderizar HTML rico (ex: editor de texto ou Markdown), higienize antes com **DOMPurify**:
   ```typescript
   import { Component, computed, inject, input } from '@angular/core';
   import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
   import DOMPurify from 'dompurify';

   @Component({
     selector: 'app-safe-markdown',
     standalone: true,
     template: `<div [innerHTML]="sanitizedContent()"></div>`,
   })
   export class SafeMarkdownComponent {
     private readonly sanitizer = inject(DomSanitizer);
     readonly rawHtml = input.required<string>();

     readonly sanitizedContent = computed<SafeHtml>(() => {
       const clean = DOMPurify.sanitize(this.rawHtml());
       return this.sanitizer.bypassSecurityTrustHtml(clean);
     });
   }
   ```

### 1.2. Content Security Policy (CSP) Recomendado
Para ambientes de produção corporativos, forneça estes cabeçalhos HTTP via Nginx/Cloudflare:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{RANDOM}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.apdev.io; frame-ancestors 'none'; object-src 'none'; base-uri 'self';
```

---

## 2. Testes Automatizados no Angular

### 2.1. Testes Unitários de Componentes Reativos (Vitest)
Com a remoção do `zone.js` e uso de Signals, os testes são síncronos e muito mais rápidos:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve inicializar com valor zero', () => {
    expect(component.count()).toBe(0);
    expect(component.doubleCount()).toBe(0);
  });

  it('deve atualizar sinais e valores computados ao incrementar', () => {
    component.increment();
    fixture.detectChanges();

    expect(component.count()).toBe(1);
    expect(component.doubleCount()).toBe(2);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Valor: 1');
  });
});
```

### 2.2. Testes E2E com Playwright
Validação de fluxos ponta a ponta sem acoplamento ao framework:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Autenticação e Navegação', () => {
  test('deve realizar login e carregar dashboard deferido', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'anderson@apdev.io');
    await page.fill('input[type="password"]', 'Secret123!');
    await page.click('button[type="submit"]');

    // Aguarda transição para a rota autenticada
    await expect(page).toHaveURL('/dashboard');
    
    // Rola para disparar o @defer on viewport
    await page.locator('app-heavy-chart').scrollIntoViewIfNeeded();
    await expect(page.locator('canvas.chart')).toBeVisible();
  });
});
```
