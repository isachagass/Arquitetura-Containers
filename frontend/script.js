const API_URL = 'http://localhost:5000/api/users';

const userForm = document.getElementById('userForm');
const userTableBody = document.getElementById('userTableBody');
const feedbackMsg = document.getElementById('feedbackMsg');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const userIdInput = document.getElementById('userId');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');

let usuariosCache = []; // Guarda os usuários carregados para validação rápida

function showFeedback(message, type) {
  feedbackMsg.textContent = message;
  feedbackMsg.className = `feedback ${type}`;
  setTimeout(() => {
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback';
  }, 4000);
}

// 1. Buscar e renderizar usuários na tabela
async function fetchUsers() {
  try {
    const res = await fetch(API_URL);
    usuariosCache = await res.json();
    renderTable(usuariosCache);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    showFeedback('Erro ao conectar com o servidor.', 'error');
  }
}

function renderTable(users) {
  userTableBody.innerHTML = '';

  if (users.length === 0) {
    userTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#777;">Nenhum usuário cadastrado.</td></tr>';
    return;
  }

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.nome}</td>
      <td>${user.email}</td>
      <td class="col-actions">
        <div class="action-btns">
          <button class="btn-icon btn-edit" title="Editar" onclick="startEdit(${user.id})">✏️</button>
          <button class="btn-icon btn-delete" title="Excluir" onclick="deleteUser(${user.id})">🗑️</button>
        </div>
      </td>
    `;
    userTableBody.appendChild(tr);
  });
}

// 2. Cadastrar ou Atualizar Usuário
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = userIdInput.value;
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  // Verificação no JS: impede e-mail duplicado (ignorando o próprio usuário se estiver editando)
  const emailExiste = usuariosCache.some(
    u => u.email.toLowerCase() === email && String(u.id) !== String(id)
  );

  if (emailExiste) {
    showFeedback('Este e-mail já está cadastrado na lista!', 'error');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    });

    const data = await res.json();

    if (!res.ok) {
      showFeedback(data.detail || 'Erro ao salvar usuário.', 'error');
      return;
    }

    showFeedback(id ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!', 'success');
    resetForm();
    fetchUsers();
  } catch (err) {
    console.error('Erro ao salvar:', err);
    showFeedback('Falha na comunicação com a API.', 'error');
  }
});

// 3. Preparar formulário para edição
function startEdit(id) {
  const user = usuariosCache.find(u => u.id === id);
  if (!user) return;

  userIdInput.value = user.id;
  nomeInput.value = user.nome;
  emailInput.value = user.email;

  formTitle.textContent = 'Editar Usuário';
  submitBtn.textContent = 'Salvar Alterações';
  cancelBtn.style.display = 'inline-block';
  nomeInput.focus();
}

// Cancelar edição
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  userForm.reset();
  userIdInput.value = '';
  formTitle.textContent = 'Cadastrar Usuário';
  submitBtn.textContent = 'Cadastrar';
  cancelBtn.style.display = 'none';
}

// 4. Deletar usuário
async function deleteUser(id) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showFeedback('Usuário removido.', 'success');
      if (String(userIdInput.value) === String(id)) resetForm();
      fetchUsers();
    } else {
      showFeedback('Erro ao excluir usuário.', 'error');
    }
  } catch (err) {
    console.error('Erro ao deletar:', err);
  }
}

// Inicializa a tabela
fetchUsers();