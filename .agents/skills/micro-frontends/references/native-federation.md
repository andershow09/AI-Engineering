# Configuração de Native Federation com Angular

Este guia detalha a configuração do `@angular-architects/native-federation` para Shell e Remotes utilizando o novo builder com `esbuild`.

---

## 1. Instalação e Inicialização

Tanto no projeto do **Shell** quanto em cada **Remote**:

```bash
# Adiciona o Native Federation ao projeto Angular
ng add @angular-architects/native-federation --project shell --port 4200 --type dynamic-host
ng add @angular-architects/native-federation --project mfe-dashboard --port 4201 --type remote
```

---

## 2. Configuração do Remote (`federation.config.js`)

No micro frontend remoto, você define o que será exposto e quais dependências devem ser tratadas como singleton compartilhado:

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfeDashboard',

  // Arquivos ou rotas expostas para o Shell
  exposes: {
    './Routes': './src/app/dashboard.routes.ts',
    './WidgetComponent': './src/app/components/widget.component.ts',
  },

  // Dependências compartilhadas para evitar download duplicado no browser
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],
});
```

---

## 3. Configuração do Shell Host (`federation.config.js` & `main.ts`)

### 3.1. `federation.config.js` no Shell
```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
});
```

### 3.2. Manifest de Remotes (`federation.manifest.json`)
O Shell descobre onde os remotes residem por meio de um manifesto externo (ideal para trocar URLs entre ambientes de Dev, Staging e Produção sem recompilar):

```json
{
  "mfeDashboard": "http://localhost:4201/remoteEntry.json",
  "mfeBilling": "http://localhost:4202/remoteEntry.json"
}
```

### 3.3. Inicialização no `main.ts` do Shell
```typescript
import { initFederation } from '@angular-architects/native-federation';

// Carrega o manifest antes de instanciar a aplicação Angular
initFederation('/assets/federation.manifest.json')
  .catch(err => console.error('[MFE Shell] Falha ao carregar manifesto de federação:', err))
  .then(() => import('./bootstrap'))
  .catch(err => console.error('[MFE Shell] Falha ao inicializar bootstrap:', err));
```
