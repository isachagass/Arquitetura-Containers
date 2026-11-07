# 1. Baixa a imagem oficial do Nginx em versão alpine (uma versão super leve do Linux)
FROM nginx:alpine

# 2. Copia os seus arquivos locais para a pasta padrão onde o Nginx serve sites estáticos
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js

# 3. Informa que o container vai escutar na porta 80 (porta padrão do Nginx para HTTP)
EXPOSE 80