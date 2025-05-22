# ⚙️ Backend Node.js com Express, Prisma e PostgreSQL

API backend construída com **Node.js** e **TypeScript**, usando **Express** para rotas, **Prisma** como ORM e **PostgreSQL** como banco de dados.

---

## 🛠️ Tecnologias Utilizadas

- 🔹 Node.js  
- 📝 TypeScript  
- 🚂 Express  
- 🗄️ Prisma ORM  
- 🐘 PostgreSQL  
- 🔐 JWT (JSON Web Tokens)  
- 🔒 bcrypt (hash de senhas)  
- 📦 Multer (upload de arquivos)  
- 🌿 dotenv (variáveis de ambiente)  

---

## 📋 Scripts Disponíveis

| Comando          | Descrição                                   |
|------------------|---------------------------------------------|
| `npm run dev`    | Inicia o servidor em modo desenvolvimento   |
| `npm run prisma` | Acessa a CLI do Prisma para migrations e mais |

---

## ⚡ Como Rodar Localmente

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO_BACKEND>
   cd <NOME_DO_PROJETO_BACKEND>

2. Instale as dependências:

    ```bash
    npm install

3. Configure suas variáveis de ambiente criando um arquivo .env na raiz do projeto com o conteúdo:

    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
    JWT_SECRET="sua_chave_secreta"
    PORT=4000

4. Rode as migrations para criar as tabelas no banco:

    ```bash
    npx prisma migrate dev

5. Inicie o servidor em modo desenvolvimento:

    ```bash
    npm run dev

A API estará disponível em:
👉 http://localhost:3000

---

## ⚙️ Prisma
- Modelos definidos no arquivo prisma/schema.prisma

- Para gerar o cliente Prisma:
    ```bash
    npx prisma generate
    
- Para aplicar migrations:
    ```bash
    npx prisma migrate dev
---