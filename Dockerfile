FROM nginx:alpine
COPY index.html script.js styles.css /usr/share/nginx/html/
EXPOSE 80
