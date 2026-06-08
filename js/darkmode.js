// darkmode.js - Controle global do modo escuro

function aplicarModoEscuro() {
    const darkMode = localStorage.getItem("darkMode") === "enabled";
    
    if (darkMode) {
        document.body.classList.add("dark-mode");
        if (document.getElementById("darkModeToggle")) {
            document.getElementById("darkModeToggle").checked = true;
        }
    } else {
        document.body.classList.remove("dark-mode");
        if (document.getElementById("darkModeToggle")) {
            document.getElementById("darkModeToggle").checked = false;
        }
    }
}

function toggleDarkModeGlobal() {
    const isDark = document.getElementById("darkModeToggle").checked;
    
    if (isDark) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
        mostrarNotificacaoDark("Modo escuro ativado!", "success");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
        mostrarNotificacaoDark("Modo claro ativado!", "success");
    }
}

function mostrarNotificacaoDark(mensagem, tipo) {
    const notif = document.createElement('div');
    notif.className = `custom-notification-dark ${tipo}`;
    notif.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${mensagem}`;
    notif.style.cssText = `
        position: fixed; bottom: 20px; right: -300px; 
        padding: 12px 20px; border-radius: 10px; 
        color: white; font-size: 13px; font-family: 'Poppins', sans-serif;
        transition: right 0.3s; z-index: 10000;
        background: ${tipo === 'success' ? '#00796b' : '#2196f3'};
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.style.right = '20px', 10);
    setTimeout(() => { 
        notif.style.right = '-300px'; 
        setTimeout(() => notif.remove(), 300); 
    }, 2500);
}

function adicionarCSSDarkMode() {
    const style = document.createElement('style');
    style.textContent = `
        body.dark-mode { background: #0f172a !important; }
        body.dark-mode .content { background: #0f172a !important; }
        body.dark-mode .sidebar { background: #0f172a !important; border-right: 1px solid #1e293b !important; }
        body.dark-mode .sidebar a:hover { background: #1e293b !important; }
        body.dark-mode .sidebar a.active { background: #1e293b !important; border-left-color: #fbbf24 !important; }
        body.dark-mode .welcome-card { background: linear-gradient(135deg, #0d4a47, #083a38) !important; }
        body.dark-mode .welcome-card h2, body.dark-mode .welcome-card p { color: white !important; }
        body.dark-mode .card-white, body.dark-mode .turma-card, body.dark-mode .stat-card,
        body.dark-mode .chart-card, body.dark-mode .tabela-card, body.dark-mode .config-card,
        body.dark-mode .perfil-card { background: #1e293b !important; border-color: #334155 !important; }
        body.dark-mode .card-white h3, body.dark-mode .card-white h4, body.dark-mode .turma-header h3,
        body.dark-mode .stat-card .stat-info h3, body.dark-mode .chart-card h3, body.dark-mode .tabela-card h3,
        body.dark-mode .config-card h3, body.dark-mode .page-header h1 { color: #fbbf24 !important; }
        body.dark-mode .aluno-item, body.dark-mode .turma-item, body.dark-mode .meta-item,
        body.dark-mode .atividade-card { background: #334155 !important; border-color: #475569 !important; }
        body.dark-mode .aluno-nome, body.dark-mode .aluno-item .aluno-info, body.dark-mode .turma-item,
        body.dark-mode .meta-titulo span, body.dark-mode .atividade-card h3 { color: #f1f5f9 !important; }
        body.dark-mode .selected-info { background: #334155 !important; color: #fbbf24 !important; border-left-color: #fbbf24 !important; }
        body.dark-mode .stat-info p, body.dark-mode .page-header p, body.dark-mode .preferencia-info p,
        body.dark-mode .stat-label { color: #94a3b8 !important; }
        
        /* Campos de texto */
        body.dark-mode input, body.dark-mode textarea, body.dark-mode select {
            background-color: #334155 !important; border-color: #475569 !important; color: #f1f5f9 !important;
        }
        body.dark-mode input::placeholder, body.dark-mode textarea::placeholder { color: #94a3b8 !important; }
        body.dark-mode input:focus, body.dark-mode textarea:focus, body.dark-mode select:focus {
            border-color: #fbbf24 !important; outline: none !important; box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2) !important;
        }
        body.dark-mode label, body.dark-mode .form-group label { color: #fbbf24 !important; }
        body.dark-mode select option { background-color: #1e293b !important; color: #f1f5f9 !important; }
        body.dark-mode .select-group select { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
        body.dark-mode .search-wrapper input { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
        body.dark-mode .search-wrapper i { color: #fbbf24 !important; }
        
        /* Detalhes da Atividade - MODAL */
        body.dark-mode .detalhes-container { background: transparent !important; }
        body.dark-mode .detalhes-header { border-bottom-color: #334155 !important; }
        body.dark-mode .detalhes-header h2 { color: #fbbf24 !important; }
        body.dark-mode .meta-badge { background: #334155 !important; color: #cbd5e1 !important; }
        body.dark-mode .meta-badge i { color: #fbbf24 !important; }
        body.dark-mode .descricao-full { background: #334155 !important; color: #f1f5f9 !important; border-radius: 12px !important; }
        body.dark-mode .descricao-full strong { color: #fbbf24 !important; }
        body.dark-mode .resposta-area label { color: #fbbf24 !important; }
        body.dark-mode .resposta-area textarea { background: #334155 !important; border-color: #475569 !important; color: #f1f5f9 !important; }
        body.dark-mode .btn-entregar { background: linear-gradient(135deg, #0d4a47, #083a38) !important; color: white !important; }
        body.dark-mode .feedback-card { background: #334155 !important; border-left: 4px solid #fbbf24 !important; }
        body.dark-mode .feedback-card h4 { color: #fbbf24 !important; }
        body.dark-mode .feedback-card p { color: #cbd5e1 !important; }
        body.dark-mode .btn-corrigir { background: linear-gradient(135deg, #0d4a47, #083a38) !important; color: #fbbf24 !important; }
        body.dark-mode .btn-corrigir:hover { background: #fbbf24 !important; color: #0f172a !important; }
        body.dark-mode .btn-encerrar { background: #7f1a1a !important; color: #fecaca !important; }
        
        /* Modal e Chat */
        body.dark-mode .modal-overlay { background: rgba(0, 0, 0, 0.85) !important; }
        body.dark-mode .modal-container, body.dark-mode .modal-header, body.dark-mode .modal-body { background: #1e293b !important; }
        body.dark-mode .modal-header { border-bottom-color: #334155 !important; }
        body.dark-mode .modal-header h3 { color: #fbbf24 !important; }
        body.dark-mode .modal-close { color: #94a3b8 !important; }
        body.dark-mode .modal-close:hover { color: #f87171 !important; }
        
        body.dark-mode .chat-container { background: #1e293b !important; }
        body.dark-mode .chat-messages { background: #0f172a !important; }
        body.dark-mode .message.received { background: #334155 !important; color: #f1f5f9 !important; }
        body.dark-mode .chat-input-area { background: #1e293b !important; border-top-color: #334155 !important; }
        body.dark-mode .chat-input-area input { background-color: #334155 !important; color: #f1f5f9 !important; }
        
        /* Turmas */
        body.dark-mode .selectors { background: #1e293b !important; border-color: #334155 !important; }
        body.dark-mode .turma-header { background: linear-gradient(135deg, #0d4a47, #083a38) !important; }
        body.dark-mode .professor-item, body.dark-mode .aluno-item-card { background: #334155 !important; }
        body.dark-mode .professor-name, body.dark-mode .aluno-name-card { color: #f1f5f9 !important; }
        body.dark-mode .btn-chat, body.dark-mode .btn-add { background: #0d4a47 !important; color: #fbbf24 !important; }
        
        /* Perfil */
        body.dark-mode .perfil-card { background: #1e293b !important; }
        body.dark-mode .info-item { color: #94a3b8 !important; }
        body.dark-mode .info-item i { color: #fbbf24 !important; }
        body.dark-mode .stat-mini { background: #334155 !important; }
        body.dark-mode .stat-mini-value { color: #fbbf24 !important; }
        body.dark-mode .descricao-texto { color: #cbd5e1 !important; }
        body.dark-mode .materia-item, body.dark-mode .meta-item { background: #334155 !important; }
        
        /* Atividades */
        body.dark-mode .atividade-card { background: #1e293b !important; }
        body.dark-mode .card-content h3 { color: #f1f5f9 !important; }
        body.dark-mode .card-footer { background: #0f172a !important; border-top-color: #334155 !important; }
        body.dark-mode .points-info, body.dark-mode .entregas-count { background: #0d4a47 !important; color: #fbbf24 !important; }
        body.dark-mode .toolbar { background: #1e293b !important; border-color: #334155 !important; }
        body.dark-mode .filter-btn { background: #334155 !important; color: #94a3b8 !important; }
        body.dark-mode .filter-btn.active { background: #fbbf24 !important; color: #0f172a !important; }
    `;
    document.head.appendChild(style);
}

function initDarkMode() {
    const paginasSemDarkMode = ['login_aluno.html', 'login_professor.html', 'selecao.html'];
    const paginaAtual = window.location.pathname.split('/').pop();
    
    if (!paginasSemDarkMode.includes(paginaAtual)) {
        adicionarCSSDarkMode();
        aplicarModoEscuro();
        
        const toggle = document.getElementById("darkModeToggle");
        if (toggle) {
            toggle.addEventListener('change', toggleDarkModeGlobal);
        }
    }
}

document.addEventListener('DOMContentLoaded', initDarkMode);