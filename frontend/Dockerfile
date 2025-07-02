# ---------- Stage 1: React‑Build ----------
FROM node:18-alpine AS build
WORKDIR /app

# --- Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm ci

# --- Quellcode kopieren & Build ausführen
COPY . .
ARG VITE_API_URL=http://todo-backend:8080    # Build‑Arg, falls benötigt
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build                # erzeugt  /app/dist

# ---------- Stage 2: Nginx Runtime ----------
FROM nginx:stable-alpine

# 1. Statisches Build-Ergebnis einspielen
COPY --from=build /app/dist /usr/share/nginx/html

# 2. Eigene Nginx‑Config mit API‑Proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
