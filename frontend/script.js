// URL onde o backend rodará no browser
const API_URL = 'http://localhost:5000/api/users';

const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');

// Buscar e listar usuários
async function fetchUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    userList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.nome} (${user.email})`;
      userList.appendChild(li);
    });
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
  }
}

// Cadastrar novo usuário
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    });
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    fetchUsers();
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
  }
});

// Carrega os usuários ao abrir a página
fetchUsers();