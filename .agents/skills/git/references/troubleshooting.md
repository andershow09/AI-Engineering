# Resolução de Problemas, Conflitos e Recuperação no Git

Guia prático para resolução de impasses e recuperação de código no Git com máxima segurança.

---

## 1. Resolução de Conflitos de Merge/Rebase

Ao se deparar com conflitos:

1. **Identificar os arquivos em conflito:**
   ```bash
   git status
   ```
2. **Examinar os marcadores de conflito:**
   ```text
   <<<<<<< HEAD (sua versão atual)
   código atual
   =======
   código recebido da branch alvo
   >>>>>>> branch-ou-commit
   ```
3. **Resolver conscientemente:**
   - Converse ou avalie a intenção de ambas as partes.
   - Remova os marcadores e mantenha a solução correta.
4. **Finalizar o processo:**
   - No caso de merge:
     ```bash
     git add <arquivos-resolvidos>
     git commit -m "merge: resolve conflitos com branch main"
     ```
   - No caso de rebase:
     ```bash
     git add <arquivos-resolvidos>
     git rebase --continue
     ```
   - Para abortar sem alterar nada:
     ```bash
     git rebase --abort  # ou git merge --abort
     ```

---

## 2. Desfazendo Alterações com Segurança

### Desfazer Modificações Não Commitadas
- Descartar mudanças em um arquivo específico no diretório de trabalho:
  ```bash
  git restore <caminho-do-arquivo>
  ```
- Remover arquivo da staging area (sem perder as alterações no disco):
  ```bash
  git restore --staged <caminho-do-arquivo>
  ```

### Desfazer Commits Já Realizados
- **`git revert <commit-hash>` (Recomendado para commits já publicados):**
  Cria um novo commit que inverte cirurgicamente as alterações do commit alvo, preservando o histórico público.
- **`git reset --soft HEAD~1` (Para commits locais não enviados):**
  Desfaz o último commit mantendo todas as mudanças na staging area para ajuste de mensagem ou arquivos.
- **`git reset --hard` (CUIDADO):**
  Descarta commits e alterações do disco. Use apenas se tiver certeza absoluta do descarte.

---

## 3. Salvar Trabalho Temporário (`git stash`)

- Guardar alterações não finalizadas para trocar de branch:
  ```bash
  git stash push -m "wip: implementação parcial do filtro"
  ```
- Listar stashes:
  ```bash
  git stash list
  ```
- Restaurar o último stash:
  ```bash
  git stash pop
  ```

---

## 4. Recuperação com `git reflog`

O `reflog` registra todas as movimentações do ponteiro `HEAD`, permitindo recuperar commits perdidos após resets ou deleção acidental de branches.

1. Visualize o histórico de ações:
   ```bash
   git reflog
   ```
2. Encontre o hash do estado desejado (ex: `HEAD@{3}`).
3. Recupere em uma nova branch segura:
   ```bash
   git checkout -b branch-recuperada HEAD@{3}
   ```
