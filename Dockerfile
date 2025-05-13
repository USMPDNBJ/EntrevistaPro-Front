
# Etapa de producción
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
