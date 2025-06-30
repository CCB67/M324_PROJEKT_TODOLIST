FROM node:18-alpine
WORKDIR /srv

# Nur Produktions-Dependencies installieren
COPY package.json package-lock.json ./
RUN npm install --production

# Quellcode in das Image kopieren
COPY . .

# Port, auf dem die App lauscht
EXPOSE 4000

# Standardbefehl zum Starten der API
CMD ["node", "server.js"]
