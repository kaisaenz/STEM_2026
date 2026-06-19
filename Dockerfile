FROM nginx:alpine

# Copiamos los archivos de la carpeta actual al directorio de nginx
COPY . /usr/share/nginx/html

EXPOSE 80
