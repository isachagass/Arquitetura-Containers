from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)  # Permite requisições vindas do front-end

# Conexão com o banco usando variáveis de ambiente
def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        database=os.environ.get('DB_NAME', 'meubanco'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', '123456')
    )
    return conn

# Endpoint GET: Listar usuários
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT nome, email FROM usuarios;')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    users = [{'nome': r[0], 'email': r[1]} for r in rows]
    return jsonify(users), 200

# Endpoint POST: Criar usuário
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    nome = data.get('nome')
    email = data.get('email')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO usuarios (nome, email) VALUES (%s, %s);', (nome, email))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Usuário criado com sucesso!'}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)