# Etapa de construcción
FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration EntrevistaPro-Front

# Etapa de producción
FROM nginx:1.27-alpine
COPY --from=build /app/dist/entrevista-pro-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
