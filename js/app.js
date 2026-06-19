// app.js - Sistema SmartClass ETEC

// Carregar sistema de notificações
if (!document.querySelector('script[src*="notifications.js"]')) {
    const script = document.createElement('script');
    script.src = '../js/notifications.js';
    document.head.appendChild(script);
}

function mostrarNotificacao(mensagem, tipo = "success") {
    if (window.notificationSystem) {
        window.notificationSystem.show(mensagem, tipo);
    } else {
        console.log(`${tipo.toUpperCase()}: ${mensagem}`);
    }
}

// ===== VARIÁVEIS GLOBAIS =====
let usuarioAtual = null;
let tipoUsuarioAtual = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('SmartClass ETEC - Sistema inicializado');
    const paginaAtual = window.location.pathname.split('/').pop();
    const paginasPublicas = ['selecao.html', 'login_aluno.html', 'login_professor.html'];
    if (!paginasPublicas.includes(paginaAtual)) {
        verificarSessao();
    }
    inicializarConfiguracoes();
});

function verificarSessao() {
    const user = localStorage.getItem("loggedUser");
    const tipo = localStorage.getItem("tipoUsuario");
    if (!user) {
        window.location.href = "selecao.html";
        return false;
    }
    usuarioAtual = JSON.parse(user);
    tipoUsuarioAtual = tipo;
    return true;
}

function logout() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("tipoUsuario");
    mostrarNotificacao("Logout realizado com sucesso!", "success");
    setTimeout(() => { window.location.href = "selecao.html"; }, 1000);
}

function sairDoSistema() {
    logout();
}

// ===== EXPORTAÇÕES GLOBAIS =====
window.logout = logout;
window.mostrarNotificacao = mostrarNotificacao;
window.sairDoSistema = sairDoSistema;