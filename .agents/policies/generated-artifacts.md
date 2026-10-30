# Política de artefatos gerados e evidências

Esta política vale para todos os agentes, skills, IDEs e LLMs que trabalham nos repositórios atendidos pelo harness.

## Versionáveis

- Código de testes, fixtures sintéticos autorais, specs, planos, tarefas e documentação autoral de procedimentos e links.
- Índices ou manifestos autorais de rastreabilidade que registrem links, `designRef`, revisão e hash do artefato, sem incorporar capturas, logs ou resultados completos.
- Imagens de produto, logos, ícones e datasets/fixtures fonte não são proibidos por extensão; avalie o conteúdo e a finalidade.

## Gerados: manter fora do Git

Capturas de tela, screenshots, exports de protótipo usados como evidência, logs, dumps de execução, relatórios de cobertura/JUnit, HTML de comparação, recibos JSON e `evidence.md` de execução são artefatos gerados. Mantenha-os em `.artifacts/<tarefa>/`, que deve ser ignorado pelo Git, ou no armazenamento de artifacts de CI/release aprovado. Não os versione.

Essa regra convive com requisitos de evidência: documentação pode descrever o procedimento, critérios, links e identificação do artefato; resultados completos e evidências geradas ficam no armazenamento de artifacts indicado. Não embuta evidências em manifestos autorais.

## Controles obrigatórios

- Antes de cada commit, execute o guard de evidências sobre o índice staged (`--staged`) e corrija qualquer bloqueio.
- Instale o guard nos novos projetos pelo instalador disponível; hooks existentes devem ser preservados.
- Não use `git add -f` para adicionar evidências, `--no-verify` para contornar gates, renomeação de saídas como fixtures, nem relaxe guard/ignore para aprovar uma entrega.
- Histórico já publicado não será reescrito. Remover um arquivo do rastreamento não apaga sua cópia local.

Com o instalador e checker do harness, execute na raiz do AI-Engineering:

```sh
node .agents/scripts/install-evidence-guard.mjs --global
node .agents/scripts/install-evidence-guard.mjs --repo <raiz-do-repositorio>
node .agents/scripts/evidence-guard.mjs --staged
node .agents/scripts/evidence-guard.mjs --tracked
node .agents/scripts/evidence-guard.mjs --commits BASE HEAD
```

O instalador global configura hooks em `~/.agents/git-hooks` por meio de `core.hooksPath`. Configurações `core.hooksPath` locais prevalecem; nesses repositórios, instale explicitamente com `--repo <raiz-do-repositorio>`. O instalador preserva hooks existentes e encaminha stdin. Requer Node.js 20+ e Git com `git hook run --to-stdin` (Git 2.53+).

Hooks não impedem bypass deliberado. A CI e o gate do servidor de cada repositório devem reforçar o checker; isso é um controle de versionamento, separado de cobertura de testes. Não declare proteção remota configurada sem evidência de sua configuração efetiva.
