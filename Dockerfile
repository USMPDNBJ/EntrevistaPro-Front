# Etapa 1: Construcción de la aplicación Angular
FROM node:22 AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build --prod

# Etapa 2: Nginx
FROM nginx:alpine

# Eliminar la configuración predeterminada de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar la aplicación construida desde la etapa anterior
COPY --from=builder /app/dist/entrevista-pro-front /usr/share/nginx/html
COPY dist/my-angular-app /usr/share/nginx/html
# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
