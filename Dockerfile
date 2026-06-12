FROM nginx:alpine
COPY index.html script.js styles.css politica-de-privacidade.html /usr/share/nginx/html/
EXPOSE 80
