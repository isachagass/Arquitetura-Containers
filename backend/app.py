from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import psycopg2
import os

app = FastAPI(title="API de Usuários - Projeto Docker")

# Libera o acesso do Front-end (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de validação de entrada com Pydantic
class UserSchema(BaseModel):
    nome: str
    email: EmailStr

def get_db_connection():
    return psycopg2.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        database=os.environ.get('DB_NAME', 'meubanco'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', '123456')
    )

# 1. LISTAR USUÁRIOS (GET)
@app.get("/api/users")
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nome, email FROM usuarios ORDER BY id ASC;')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    return [{'id': r[0], 'nome': r[1], 'email': r[2]} for r in rows]

# 2. CADASTRAR USUÁRIO (POST)
@app.post("/api/users", status_code=201)
def create_user(user: UserSchema):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            'INSERT INTO usuarios (nome, email) VALUES (%s, %s) RETURNING id;',
            (user.nome, user.email)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado.")
    finally:
        cur.close()
        conn.close()

    return {'id': new_id, 'message': 'Usuário criado com sucesso!'}

# 3. EDITAR USUÁRIO (PUT)
@app.put("/api/users/{user_id}")
def update_user(user_id: int, user: UserSchema):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            'UPDATE usuarios SET nome = %s, email = %s WHERE id = %s;',
            (user.nome, user.email, user_id)
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuário não encontrado.")
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Este e-mail já pertence a outro usuário.")
    finally:
        cur.close()
        conn.close()

    return {'message': 'Usuário atualizado com sucesso!'}

# 4. DELETAR USUÁRIO (DELETE)
@app.delete("/api/users/{user_id}")
def delete_user(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM usuarios WHERE id = %s;', (user_id,))
    if cur.rowcount == 0:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    conn.commit()
    cur.close()
    conn.close()

    return {'message': 'Usuário removido com sucesso!'}