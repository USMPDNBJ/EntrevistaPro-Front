# Etapa 1: Construcción de la aplicación Angular
FROM node:16 AS builder

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración y package.json al contenedor
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Ejecuta el build para producción
RUN npm run build --prod

# Etapa 2: Servir la aplicación Angular usando Nginx
FROM nginx:alpine

# Elimina la configuración predeterminada de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos generados en dist/ por Angular al directorio de Nginx
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
