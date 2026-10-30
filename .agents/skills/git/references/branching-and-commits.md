# Estratégias de Branching e Commits Semânticos

Este documento detalha as convenções para nomes de branches, estrutura de commits e melhores práticas de colaboração com Git.

---

## 1. Nomenclatura de Branches

Utilize o padrão `<tipo>/<escopo-ou-descricao-kebab-case>`:

| Prefixo | Finalidade | Exemplo |
| :--- | :--- | :--- |
| `feat/` | Nova funcionalidade ou recurso | `feat/auth-jwt-refresh` |
| `fix/` | Correção de bug | `fix/user-avatar-upload` |
| `refactor/` | Refatoração sem mudança comportamental | `refactor/order-service-solid` |
| `test/` | Adição ou ajuste de testes | `test/payment-gateway-unit` |
| `docs/` | Documentação | `docs/api-swagger-spec` |
| `chore/` | Configurações, dependências, build | `chore/upgrade-vite-5` |

---

## 2. Conventional Commits

Formato padrão da mensagem de commit:

```text
<tipo>(<escopo opcional>): <descrição curta no imperativo>

[corpo explicativo opcional: o que e por que mudou]

[rodapé opcional: referências a issues ou BREAKING CHANGE]
```

### Tipos Permitidos
- **`feat`**: Introdução de nova funcionalidade.
- **`fix`**: Correção de bug.
- **`refactor`**: Refatoração de código que não corrige bug nem adiciona funcionalidade.
- **`perf`**: Alteração focada em ganho de performance.
- **`test`**: Inclusão ou ajuste de suíte de testes.
- **`docs`**: Mudanças exclusivas em documentação/README.
- **`style`**: Ajustes de formatação, pontuação ou linting (sem mudança na lógica).
- **`chore`**: Tarefas de manutenção de build, scripts, dependências.

### Boas Práticas de Mensagem
- Mantenha a primeira linha com no máximo 72 caracteres.
- Use tom imperativo ("adiciona suporte a...", "corrige vazamento de memória...").
- Se houver quebra de compatibilidade, use o marcador `BREAKING CHANGE:` no rodapé ou `feat!:` / `fix!:`.

---

## 3. Fluxo de Pull Requests

1. **Sincronize com a branch principal:**
   ```bash
   git checkout main
   git pull origin main
   git checkout feat/minha-feature
   git rebase main
   ```
2. **Squash ou Limpeza de Histórico:**
   - Una commits de teste ou "wip" usando rebase interativo:
   ```bash
   git rebase -i HEAD~N
   ```
3. **Submissão:** Abra o PR com descrição clara das mudanças, checklist de testes e contexto da tarefa.

## Evidências geradas e commits

Execute o guard de evidências sobre o índice (--staged) antes de cada commit e instale-o nos novos projetos pelo instalador disponível. Capturas/screenshots e resultados gerados de execução/testes ficam em .artifacts/<tarefa>/ ignorado ou no armazenamento aprovado de artifacts de CI/release. Consulte [a política](../../../policies/generated-artifacts.md); não use git add -f para evidências nem --no-verify para contornar o gate.


Comandos disponíveis na raiz do AI-Engineering: `node .agents/scripts/evidence-guard.mjs --staged`, `--tracked` ou `--commits BASE HEAD`; instalar com `node .agents/scripts/install-evidence-guard.mjs --global` ou `--repo <raiz>`. O escopo e os requisitos estão na política vinculada acima.
