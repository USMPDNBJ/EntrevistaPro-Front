# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente de la aplicación Angular
COPY . .

# Construir la aplicación para producción
RUN npm run build --prod

# Etapa 2: Configuración de Nginx
FROM nginx:latest

# Copiar los archivos de la aplicación construida desde la etapa anterior
COPY --from=builder /app/dist/entrevista-pro-front /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
