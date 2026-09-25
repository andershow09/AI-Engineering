# Navegação e Ciclo de Vida de Páginas no Ionic

No Ionic, a navegação funciona de forma diferente das aplicações web tradicionais baseadas em SPA: as páginas são empilhadas em uma **Stack de Navegação**.

---

## 1. O Conceito de Navegação em Stack

Quando o usuário navega da Página A para a Página B:
- A Página A **não é destruída**; ela é apenas ocultada e mantida no DOM.
- Quando o usuário clica no botão "Voltar", a Página B é destruída e a Página A volta a ficar visível imediatamente, preservando seu estado, posição do scroll e dados digitados.

---

## 2. Eventos do Ciclo de Vida (Ionic Lifecycle Events)

Devido ao empilhamento de telas, os hooks padrão dos frameworks (como `ngOnInit` no Angular ou `useEffect` no React) não disparam quando o usuário simplesmente retorna para uma tela anterior. Utilize os eventos específicos do Ionic:

| Evento | Momento do Disparo | Caso de Uso Típico |
| :--- | :--- | :--- |
| **`ionViewWillEnter`** | Imediatamente antes da tela se tornar visível e iniciar a animação. | Recarregar dados recentes, checar autenticação atualizada. |
| **`ionViewDidEnter`** | Quando a animação de entrada terminou e a tela está totalmente visível. | Iniciar animações pesadas, acionar mapas ou trackers de analíticos. |
| **`ionViewWillLeave`** | Imediatamente antes da tela iniciar a animação de saída. | Pausar reprodução de mídia ou timers. |
| **`ionViewDidLeave`** | Quando a animação de saída terminou e a tela foi completamente ocultada. | Cancelar listeners de sensores ou subscriptions de rede em tempo real. |

---

## 3. Melhores Práticas de Roteamento

1. **Utilize `ion-router-outlet`:**
   - Garante que as animações de transição de tela nativas sejam orquestradas corretamente.
2. **Evite Atualizações Excessivas de Estado no `ionViewWillEnter`:**
   - Operações pesadas e síncronas antes da entrada podem travar a animação de transição, causando sensação de engasgo (*jank*). Mantenha a renderização inicial instantânea e carregue dados de forma assíncrona.
3. **Navegação com Botão Voltar:**
   - Use sempre `<ion-back-button defaultHref="/rota-padrao">` para garantir um fallback seguro caso o usuário acesse a URL diretamente sem histórico anterior.
