# Etapa de construcción
FROM node:22.13.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --output-path=/app/dist/public

# Etapa de producción
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
