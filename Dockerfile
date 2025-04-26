# Etapa 1: construir la app Angular
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: usar Nginx para servir los archivos
FROM nginx:stable-alpine

# Copiar el build Angular al directorio que Nginx sirve
COPY --from=builder /app/dist/entrevista-pro-front /usr/share/nginx/html

# Opcional: agregar archivo de configuración Nginx personalizado
# COPY nginx.conf /etc/nginx/nginx.conf
