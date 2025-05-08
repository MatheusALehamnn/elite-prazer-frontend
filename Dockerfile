# Dockerfile para a aplicação Next.js (Frontend)

# 1. Estágio de Build
FROM node:20-alpine AS builder

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependência
COPY package.json pnpm-lock.yaml* ./

# Instale o pnpm
RUN npm install -g pnpm

# Instale as dependências do projeto
RUN pnpm install --frozen-lockfile

# Copie o restante dos arquivos da aplicação
COPY . .

# Defina as variáveis de ambiente de build (se necessário)
# ENV NEXT_PUBLIC_API_URL=https://api.example.com

# Build da aplicação Next.js
RUN pnpm build

# 2. Estágio de Produção
FROM node:20-alpine

WORKDIR /app

# Copie os artefatos de build do estágio anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules # Necessário para o Next.js em modo standalone ou com dependências de runtime

# Exponha a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar a aplicação Next.js em produção
CMD ["pnpm", "start"]

