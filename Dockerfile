FROM node:22

# Cria diretório da app
WORKDIR /app

# Copia arquivos
COPY package*.json ./
RUN npm install
RUN npm install cookie-parser

# Copia o restante
COPY . .

# Porta exposta (ajuste se necessário)
EXPOSE 3000

# Comando padrão
CMD ["npm", "run", "dev"]
