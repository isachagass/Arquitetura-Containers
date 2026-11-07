# 1. Usa uma imagem oficial do Python em versão leve (slim)
FROM python:3.10-slim

# 2. Define a pasta '/app' dentro do container como o diretório principal de trabalho
WORKDIR /app

# 3. Copia o arquivo de dependências para dentro do container
COPY requirements.txt .

# 4. Instala as bibliotecas Python (Flask, psycopg2, etc.)
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copia o código da sua aplicação (app.py) para dentro do container
COPY app.py .

# 6. Informa que a aplicação roda na porta 5000
EXPOSE 5000

# 7. O comando que o container vai executar ao iniciar
CMD ["python", "app.py"]