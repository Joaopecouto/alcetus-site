FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html script.js styles.css politica-de-privacidade.html /usr/share/nginx/html/
COPY flowreports/ /usr/share/nginx/html/flowreports/
EXPOSE 80
