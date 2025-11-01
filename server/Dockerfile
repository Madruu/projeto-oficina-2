# Usar imagem oficial do Node.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
# Usa npm install (já que package-lock.json pode não estar presente em workspaces)
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor porta do servidor
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]

