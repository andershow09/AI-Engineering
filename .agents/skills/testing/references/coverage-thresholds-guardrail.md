# Guardrail de Cobertura de Testes e Thresholds Mínimos

Este documento define a política mandatória de **Thresholds de Cobertura de Testes** para todos os projetos suportados por este ecossistema de engenharia.

---

## 1. Princípio Fundamental: "Zero Untested Code" & Guardrail Bloqueante

> [!CAUTION]
> **A ausência de thresholds de cobertura configurados ou uma cobertura de testes abaixo do limite aceitável constitui uma FALHA BLOQUEANTE (HARD BLOCKER).**
> O agente NUNCA deve considerar uma tarefa de funcionalidade ou teste como "concluída" se:
> 1. O projeto não possuir thresholds de cobertura formalmente definidos no arquivo de configuração do test runner.
> 2. A suíte de testes estiver rodando com cobertura inferior ao threshold estabelecido.

---

## 2. Padrões Mínimos de Threshold (Baseline Global)

Para qualquer projeto que utilize suíte de testes unitários ou de integração, os limites mínimos globais são:

| Métrica | Limite Mínimo Recomendado | Código Crítico / Core Business |
| :--- | :--- | :--- |
| **Lines (Linhas)** | **80%** | **90%+** |
| **Statements (Declarações)** | **80%** | **90%+** |
| **Functions (Funções/Métodos)** | **80%** | **90%+** |
| **Branches (Ramos/Condicionais)** | **80%** | **85%+** |

---

## 3. Como Configurar Thresholds por Framework

### 3.1. Vitest (`vitest.config.ts` ou `vite.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      thresholds: {
        global: {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
      },
      include: ['src/app/**/*.ts'],
      exclude: ['src/app/**/*.spec.ts', 'src/main.ts'],
    },
  },
});
```

### 3.2. Jest (`jest.config.js` ou `package.json`)
```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 3.3. Angular / Karma (`karma.conf.js`)
```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage'),
  subdir: '.',
  reporters: [{ type: 'html' }, { type: 'text-summary' }],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

### 3.4. Flutter / Dart
Execute via scripts de CI ou ferramentas como `very_good_cli`:
```bash
very_good test --coverage --min-coverage 80
```
Ou valide via `lcov` no pipeline de build.

### 3.5. Python (Pytest + pytest-cov)
No `pyproject.toml` ou `setup.cfg`:
```toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-fail-under=80 --cov-report=term-missing"
```

---

## 4. Estratégia para Projetos Legados com Baixa Cobertura (Ratcheting)

Se um projeto legado (*brownfield*) estiver com cobertura muito baixa (ex.: 25%):
1. **Nunca permita thresholds zerados ou ausentes.**
2. **Aplique Ratcheting (Catraca):**
   - Fixe o threshold no patamar atual (ex.: 25%) para garantir que **nenhuma nova alteração piore a cobertura**.
   - A cada nova funcionalidade ou refatoração, aumente o threshold gradualmente (+5% a +10%) até atingir a meta dos 80%.
   - Configure thresholds mais rigorosos (ex.: 90%) especificamente para pastas ou módulos novos:
     ```typescript
     thresholds: {
       global: { lines: 30 }, // baseline legado
       'src/app/core/services/**': { lines: 90 }, // módulos novos/críticos
     }
     ```

---

## 5. Protocolo de Ação do Agente ao Executar a Skill `/testing`

Ao ser acionado em qualquer projeto:
1. **Passo 1 (Auditoria de Configuração):** Inspecione se há arquivo de configuração de testes (`vitest.config.*`, `jest.config.*`, etc.) e verifique se `thresholds` está definido.
2. **Passo 2 (Bloqueio ou Remediação):**
   - Se os thresholds **não existirem**: Configure imediatamente o bloco de thresholds na ferramenta de teste antes de prosseguir.
3. **Passo 3 (Execução com Cobertura):** Execute a suíte de testes com a flag de cobertura (`--coverage`).
4. **Passo 4 (Validação do Resultado):**
   - Se a cobertura falhar ou estiver abaixo do threshold: **NÃO finalize a tarefa**. Escreva os testes unitários necessários para cobrir os fluxos e branches pendentes até o comando passar com sucesso.
