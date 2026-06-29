FROM nginx:alpine

# Copiamos los archivos de la carpeta actual al directorio de nginx
COPY . /usr/share/nginx/html

# Config de nginx: sirve index.html para cualquier ruta (página única)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
