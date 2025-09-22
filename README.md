# 🎓 Monitoring Reports API

API para gerar relatórios de **professores** e **salas de aula** da escola do Chavito.
Permite consultar a carga horária comprometida de cada professor e listar salas com horários ocupados e livres.

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Swagger](https://swagger.io/) para documentação
- [Docker](https://www.docker.com/) para containerização
- `class-validator` + `class-transformer` para validação
- Autenticação simples via **API Key**
- Testes unitários e de integração (e2e)

---

## 🔑 Autenticação

Todos os endpoints requerem um header de autenticação:

```http
x-api-key: <SECRET_KEY_HERE>
```

A chave deve ser definida na variável de ambiente **API_KEY**.

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/monitoring
API_KEY=changeme123
```

---

## 🐳 Execução com Docker

### 1. Build da imagem

```bash
docker compose build --no-cache
```

### 2. Executar o container

```bash
docker compose up
```

A API ficará disponível em:
👉 [http://localhost:3000](http://localhost:3000)

---

> ⚠️ O banco de dados é sempre limpo e recriado ao executar a aplicação.
> Um arquivo de **seed** popula os dados automaticamente.

---

## 📖 Documentação da API (Swagger)

Após iniciar a API, acesse no navegador:
👉 [http://localhost:3000/api](http://localhost:3000/api)

---

## 🔗 Endpoints principais

### **GET** `/reports/professors-hours`

Retorna a quantidade total de horas de aula comprometidas por professor.

#### Exemplo de Response

```json
[
  {
    "professorId": 1,
    "name": "Girafales",
    "hours": 12
  },
  {
    "professorId": 2,
    "name": "Godinez",
    "hours": 6
  }
]
```

---

### **GET** `/reports/rooms?dayOfWeek=1`

Lista as salas com horários **ocupados** e **livres** em um dia da semana (0 = domingo, 1 = segunda, ...).

#### Exemplo de Response

```json
[
  {
    "roomId": 1,
    "roomName": "Sala 101",
    "buildingName": "Bloco A",
    "occupied": [{ "start": "08:00:00", "end": "10:00:00" }],
    "free": [{ "start": "08:00:00", "end": "10:00:00" }]
  }
]
```

---

## 🧪 Testes

### Testes unitários

⚠️ **Aviso importante**:  
Para rodar os testes unitários (e2e são rodados usando docker), é necessário ter o **Node.js 18** instalado e instalar as dependências localmente com o seguinte comando:

```bash
npm install --legacy-peer-deps
```

```bash
npm run test
```

### Testes e2e (com Docker)

```bash
npm run test:docker
```

---

## 📌 Requisitos atendidos

- Microserviço em Node/NestJS
- API documentada com Swagger
- Execução via Docker
- Autenticação simples via API Key
- Testes unitários e e2e
- Seed automático para dados de teste
