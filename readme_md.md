# 🐳 Aplicação Multi-Container com Docker

> **Projeto Acadêmico / Estudo Dirigido**
>
> Este projeto foi desenvolvido com o objetivo prático de compreender o funcionamento de **Containers Docker**, conteinerização de serviços independentes e orquestração de ambiente utilizando o **Docker Compose**.

## 📌 Sobre o Projeto

Trata-se de uma aplicação **Full-Stack minimalista** para cadastro e listagem de usuários. O foco principal não é a complexidade das regras de negócio, mas sim a **arquitetura de microsserviços/containers**, demonstrando como isolar a camada de apresentação, a API backend e a camada de persistência de dados.

## 🏗️ Arquitetura dos Containers

A aplicação foi dividida em **3 containers independentes**, seguindo o princípio de responsabilidade única e boas práticas de DevOps:

```
                  ┌────────────────────────┐
                  │    Navegador Web       │
                  └───────────┬────────────┘
                              │ Port 8080
                              ▼
                  ┌────────────────────────┐
                  │   frontend (Nginx)     │
                  └───────────┬────────────┘
                              │ HTTP / API (Port 5000)
                              ▼
                  ┌────────────────────────┐
                  │   backend (Flask API)  │
                  └───────────┬────────────┘
                              │ PostgreSQL Protocol (Port 5432)
                              ▼
                  ┌────────────────────────┐
                  │   db (PostgreSQL 15)   │
                  └────────────────────────┘

```

### 🔍 Por que separar a aplicação dessa forma?

1. **Isolamento de Responsabilidades:** Cada container executa apenas o seu papel. Se a API falhar, o servidor web do front-end continuará funcionando independentemente.

2. **Escalabilidade Independente:** Em um cenário real, poderíamos subir múltiplos containers do `backend` para aguentar mais acessos sem precisar duplicar o banco de dados ou o front-end.

3. **Gerenciamento de Dependências:** O backend utiliza o ecossistema Python, enquanto o front-end precisa apenas de um servidor Nginx leve. O isolamento evita conflitos de pacotes e reduz a pegada de memória.

4. **Segurança e Portabilidade:** É possível definir regras de rede específicas onde apenas a API conversa com o Banco de Dados, impedindo acesso direto do mundo externo ao banco.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5, CSS3, JavaScript (Vanilla ES6), Nginx (imagem `alpine`)

* **Back-end:** Python 3.10, Flask, Flask-CORS, Psycopg2

* **Banco de Dados:** PostgreSQL 15 (`alpine`)

* **Orquestração:** Docker & Docker Compose

## 📁 Estrutura do Repositório

```
.
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── database/
│   ├── Dockerfile
│   └── init.sql
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── script.js
│   └── style.css
├── docker-compose.yml
└── README.md

```

## 🚀 Como Executar o Projeto

### Passo a Passo

1. **Construa e inicie os containers:**
   No diretório raiz do projeto, execute:

   ```
   docker compose up --build
   
   ```

   > *O parâmetro `--build` garante que os Dockerfiles sejam recompilados caso tenha feito alterações nos arquivos.*

2. **Acesse a aplicação:**
   Abra o navegador e acesse:
   <http://localhost:8080>

3. **Para parar a execução:**
   No terminal onde os containers estão rodando, pressione `Ctrl + C`, ou em outra janela de terminal execute:

   ```
   docker compose down
   
   ```

## 🧪 Como Testar

1. Acesse o endereço `http://localhost:8080`.

2. Digite um **Nome** e um **E-mail** nos campos do formulário.

3. Clique em **Enviar**.

4. A lista na parte inferior será atualizada automaticamente consultando o backend, que por sua vez busca os dados armazenados no banco de dados PostgreSQL.

## 🎓 Aprendizados

Através deste projeto, foi possível compreender na prática:

* Como compilar imagens customizadas utilizando `Dockerfile`.

* A diferença entre comandos de build (`RUN`) e execução de container (`CMD`).

* A orquestração de múltiplos serviços em rede usando `docker-compose.yml`.

* A comunicação entre containers usando nomes de serviço como host DNS interno (ex: `DB_HOST: db`).