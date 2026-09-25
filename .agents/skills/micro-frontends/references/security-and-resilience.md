# Segurança, Resiliência e Testes E2E em Micro Frontends

Este guia estabelece os requisitos mandatórios para tolerância a falhas, contenção de riscos e validação ponta a ponta de ecossistemas federados.

---

## 1. Tolerância a Falhas e Circuit Breakers

Em arquiteturas distribuídas, a falha de um serviço parcial não pode derrubar a experiência global do usuário.

### 1.1. Componente de Fallback do Shell
Quando o módulo remoto não responde:

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-mfe-fallback',
  standalone: true,
  template: `
    <div class="mfe-fallback-container">
      <div class="fallback-icon">⚠️</div>
      <h3>Módulo Temporariamente Indisponível</h3>
      <p>Não foi possível carregar o módulo <strong>{{ mfeName() }}</strong>.</p>
      <div class="actions">
        <button (click)="retry.emit()">Tentar Novamente</button>
        <button class="secondary" (click)="goHome()">Voltar ao Início</button>
      </div>
    </div>
  `,
  styles: [`
    .mfe-fallback-container {
      padding: 48px;
      text-align: center;
      background: #121417;
      border: 1px solid #22262E;
      border-radius: 12px;
      margin: 24px;
      color: #F7F8F8;
    }
    .fallback-icon { font-size: 32px; margin-bottom: 12px; }
    button {
      background: #5E6AD2;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin: 0 4px;
    }
    button.secondary { background: transparent; border: 1px solid #22262E; }
  `]
})
export class MfeFallbackComponent {
  readonly mfeName = input<string>('Serviço');
  readonly retry = output<void>();

  goHome(): void {
    window.location.href = '/';
  }
}
```

---

## 2. Segurança e Isolamento Web

### 2.1. Isolamento de CSS (Evitando Vazamento de Estilos)
- **Nunca inclua CSS reset global dentro de um Remote** (ex: `* { box-sizing: border-box; margin: 0; }`). O reset deve existir apenas no Shell Host.
- Utilize prefixos padronizados de classes por equipe (ex: `.mfe-bill-card`, `.mfe-dash-widget`).
- Prefira `ViewEncapsulation.Emulated` nativo do Angular para garantir que os seletores recebam sufixos de escopo `_ngcontent-*`.

### 2.2. Autenticação Segura via BFF
- Nunca faça login dentro de um iframe ou remote com armazenamento de JWT no `localStorage`.
- Utilize o padrão BFF:
  1. O usuário se autentica no Shell.
  2. O backend responde com um cookie `Set-Cookie: session_id=...; HttpOnly; Secure; SameSite=Strict; Path=/`.
  3. Quando os Remotes fazem chamadas HTTP para o mesmo domínio da API (`withCredentials: true`), o browser envia o cookie automaticamente sem que nenhum script do frontend tenha acesso aos dados brutos do token.

---

## 3. Testes E2E com Playwright

A validação de Micro Frontends exige testes que sobem o Shell e os Remotes simultaneamente:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Navegação Federada entre Shell e MFE Remotos', () => {
  test('deve carregar o Shell e navegar para o MFE Dashboard via Native Federation', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Valida carregamento do Shell
    await expect(page.locator('header.shell-navbar')).toBeVisible();

    // Clica no link do MFE
    await page.click('nav a[href="/dashboard"]');

    // Valida que a rota federada carregou o componente do remote
    await expect(page.locator('app-dashboard-root')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Visão Geral do Painel');
  });

  test('deve exibir o Fallback amigável se o remote estiver desligado', async ({ page }) => {
    // Simula bloqueio de rede para a porta do MFE Billing (4202)
    await page.route('http://localhost:4202/**', route => route.abort());

    await page.goto('http://localhost:4200/billing');

    // Deve exibir o componente de resiliência e não tela em branco
    await expect(page.locator('.mfe-fallback-container')).toBeVisible();
    await expect(page.locator('text=Módulo Temporariamente Indisponível')).toBeVisible();
  });
});
```
