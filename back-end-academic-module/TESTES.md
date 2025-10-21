# 🧪 Guia de Testes

Este projeto inclui testes unitários, de integração. **Nenhuma configuração de banco de dados é necessária!**

## Tecnologias de Teste

- **Jest** - Framework de testes

## Como Executar os Testes

### Pré-requisitos

```bash
npm install
```

### Executar Todos os Testes

```bash
npm run test
```

### Executar por Tipo

```bash
# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Apenas testes E2E
npm run test:e2e

# Modo watch (re-executa ao salvar)
npm run test:watch

# Com cobertura de código
npm run test:coverage
```

## Estrutura dos Testes

```
tests/
└── setup.ts                    # Configuração global dos testes
├── unit/
│   ├── student/
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── create-student.use-case.spec.ts
│   │   │       ├── update-student.use-case.spec.ts
│   │   │       ├── delete-student.use-case.spec.ts
│   │   │       └── list-students.use-case.spec.ts
│   ├── employee/
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── create-employee.use-case.spec.ts
│   │   │       └── get-employee.use-case.spec.ts
├── integration/
│   ├── student/
│   │   └── student.controller.integration.spec.ts
│   ├── employee/
│   │   └── employee.controller.integration.spec.ts
```

## O Que é Testado

### Testes Unitários (unit)
- Lógica das use cases isoladamente
- Validações de entrada
- Tratamento de erros

### Testes de Integração (integration)
- Controller + Use Case + Repository
- Validação com Zod
- Manipulação de banco de dados


## Exemplo de Saída

```
 PASS  tests/integration/student/student.controller.spec.ts
 PASS  tests/integration/employee/employee.controller.integration.spec.ts
 PASS  tests/unit/student/use-cases/update-student.use-case.spec.ts
 PASS  tests/unit/employee/use-cases/get-employee.use-case.spec.ts
 PASS  tests/unit/student/use-cases/create-student.use-case.spec.ts
 PASS  tests/unit/student/use-cases/list-students.use-case.spec.ts
 PASS  tests/unit/student/use-cases/delete-student.use-case.spec.ts
 PASS  tests/unit/employee/use-cases/create-employee.use-case.spec.ts

Test Suites: 8 passed, 8 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        4.134 s, estimated 7 s
```

## Cobertura de Código

Para visualizar a cobertura de código:

```bash
npm run test:coverage
```

Será gerado um relatório em `coverage/` com visualização HTML.