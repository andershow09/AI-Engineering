# Componentes, Theming e Estilização no Ionic

O Ionic fornece uma biblioteca abrangente de componentes que se adaptam automaticamente ao estilo visual de cada plataforma: **iOS** (Cupertino) e **Android** (Material Design).

---

## 1. Estrutura Padrão de Tela

Toda tela no Ionic deve seguir a hierarquia semântica:

```html
<ion-page>
  <ion-header [translucent]="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/home"></ion-back-button>
      </ion-buttons>
      <ion-title>Detalhes do Pedido</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content [fullscreen]="true">
    <!-- Header recolhível nativo para iOS -->
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Detalhes do Pedido</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Conteúdo principal da página com scroll -->
    <div class="page-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Status: Em Processamento</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Previsão de entrega: 2 horas.
        </ion-card-content>
      </ion-card>
    </div>
  </ion-content>
</ion-page>
```

---

## 2. Theming com CSS Variables e Shadow DOM

Os componentes do Ionic utilizam Shadow DOM para encapsulamento de estilos. Para alterar suas aparências, utilize as propriedades customizadas (CSS Custom Properties):

### Variáveis Globais de Cores (`theme/variables.css`)
```css
:root {
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #3171e0;
  --ion-color-primary-tint: #4c8dff;
}
```

### Customizando Componentes Específicos
```css
/* NÃO faça: ion-item { background: red; } */

/* FORMA CORRETA via CSS custom properties */
ion-item.custom-card {
  --background: #f4f5f8;
  --color: #1a1a1a;
  --border-radius: 8px;
  --padding-start: 16px;
}
```

---

## 3. Feedback Visual e Overlays

Prefira usar os controladores nativos do Ionic para diálogo e estados transitórios:
- **`ion-toast`:** Para mensagens breves de sucesso ou aviso na base da tela.
- **`ion-loading`:** Durante operações de rede demoradas para bloquear interação e prevenir cliques duplicados.
- **`ion-alert`:** Para confirmações destrutivas (ex: confirmar exclusão de conta).
- **`ion-modal`:** Para formulários auxiliares ou visualização detalhada em formato bottom sheet (`breakpoints: [0, 0.5, 0.8]`).
