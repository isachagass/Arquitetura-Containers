# 1. Usa a imagem oficial do PostgreSQL
FROM postgres:15-alpine

# 2. Copia o script SQL para uma pasta especial do Postgres no container.
# Qualquer arquivo .sql colocado nessa pasta é executado automaticamente assim que o banco sobe pela 1ª vez!
COPY init.sql /docker-entrypoint-initdb.d/