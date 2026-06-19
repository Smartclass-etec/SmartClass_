// js/auth_local.js
// Sistema de autenticação local (substitui o Supabase)

// ===== FUNÇÕES DE USUÁRIO =====
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function findUser(email, senha) {
    const users = getUsers();
    return users.find(u => u.email === email && u.senha === senha);
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email);
}

// ===== LOGIN =====
function loginLocal(email, senha) {
    const user = findUser(email, senha);
    if (!user) {
        return { success: false, error: 'Email ou senha incorretos' };
    }

    // Salvar sessão
    const sessionUser = {
        id: user.email, // Usar email como ID
        email: user.email,
        name: user.nome,
        tipo: user.tipo,
        especialidade: user.especialidade || '',
        serie: user.serie || '',
        turma: user.turma || ''
    };

    localStorage.setItem('loggedUser', JSON.stringify(sessionUser));
    localStorage.setItem('tipoUsuario', user.tipo);

    return { success: true, user: sessionUser };
}

// ===== LOGOUT =====
function logoutLocal() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('tipoUsuario');
    window.location.href = 'index.html';
}

// ===== VERIFICAR SESSÃO =====
function getLoggedUser() {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return !!localStorage.getItem('loggedUser');
}

// ===== EXPORTAR =====
window.loginLocal = loginLocal;
window.logoutLocal = logoutLocal;
window.getLoggedUser = getLoggedUser;
window.isLoggedIn = isLoggedIn;
window.getUsers = getUsers;
window.findUserByEmail = findUserByEmail;