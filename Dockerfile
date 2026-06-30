# Servidor Node de AquaNube: sirve el sitio y hace de proxy seguro hacia la IA.
FROM node:20-alpine

WORKDIR /app

# Instala dependencias del servidor (capa cacheable)
COPY server/package.json ./server/package.json
RUN cd server && npm install --omit=dev

# Copia el resto del proyecto (index.html, assets/, etc.)
COPY . /app

EXPOSE 8080
CMD ["node", "server/server.js"]
