// darkmode.js - Controle global do modo escuro
// Versão com suporte ao menu compacto e sidebar

(function() {
    // Aplica dark mode imediatamente para evitar flash branco
    try {
        const darkMode = localStorage.getItem('darkMode') === 'enabled';
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            if (document.body) document.body.classList.add('dark-mode');
        }
    } catch(e) {}
})();

// ===== CARREGAR CSS GLOBAL DO DARK MODE =====
function carregarCSSDarkMode() {
    // Verifica se o CSS já foi carregado
    if (!document.querySelector('link[href="css/darkmode-padrao.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/darkmode-padrao.css';
        const head = document.head;
        const firstStyle = head.querySelector('style, link[rel="stylesheet"]');
        if (firstStyle) {
            head.insertBefore(link, firstStyle);
        } else {
            head.appendChild(link);
        }
    }
}

// ===== FUNÇÕES PRINCIPAIS =====
function aplicarModoEscuro() {
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) toggle.checked = true;
        // Atualizar ícones do menu compacto
        atualizarIconesMenu(true);
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) toggle.checked = false;
        atualizarIconesMenu(false);
    }
}

function toggleDarkModeGlobal() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) toggle.checked = isDark;
    atualizarIconesMenu(isDark);
    mostrarNotificacaoDark(isDark ? '🌙 Modo escuro ativado!' : '☀️ Modo claro ativado!', 'success');
}

function atualizarIconesMenu(isDark) {
    // Atualizar ícone da sidebar
    const sidebarBtn = document.querySelector('#darkModeBtnUniversal i');
    if (sidebarBtn) {
        if (isDark) {
            sidebarBtn.classList.remove('fa-moon');
            sidebarBtn.classList.add('fa-sun');
        } else {
            sidebarBtn.classList.remove('fa-sun');
            sidebarBtn.classList.add('fa-moon');
        }
    }
    // Atualizar ícone do menu compacto
    const iconeMenu = document.getElementById('iconeTemaUniversal');
    const labelMenu = document.getElementById('labelTemaUniversal');
    if (iconeMenu && labelMenu) {
        if (isDark) {
            iconeMenu.classList.replace('fa-moon', 'fa-sun');
            labelMenu.textContent = 'Tema claro';
        } else {
            iconeMenu.classList.replace('fa-sun', 'fa-moon');
            labelMenu.textContent = 'Tema escuro';
        }
    }
    // Aplicar estilo ao menu compacto (se função existir)
    if (typeof aplicarDarkModeMenu === 'function') {
        aplicarDarkModeMenu();
    }
}

function mostrarNotificacaoDark(mensagem, tipo) {
    const notif = document.createElement('div');
    notif.className = 'custom-notification-dark';
    notif.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${mensagem}`;
    notif.style.cssText = `
        position: fixed; bottom: 20px; right: -300px; 
        padding: 12px 20px; border-radius: 10px; 
        color: white; font-size: 13px; font-family: 'Poppins', sans-serif;
        transition: right 0.3s; z-index: 10000;
        background: ${tipo === 'success' ? '#0d9488' : '#3b82f6'};
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.style.right = '20px', 10);
    setTimeout(() => {
        notif.style.right = '-300px';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}

// ===== OBSERVAR MUDANÇAS NO LOCALSTORAGE (sync entre abas) =====
function observarMudancasDarkMode() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'darkMode') {
            const isDark = e.newValue === 'enabled';
            if (isDark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            atualizarIconesMenu(isDark);
            const toggle = document.getElementById('darkModeToggle');
            if (toggle) toggle.checked = isDark;
        }
    });
}

// ===== INICIALIZAÇÃO =====
function initDarkMode() {
    carregarCSSDarkMode();
    aplicarModoEscuro();
    
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.removeEventListener('change', toggleDarkModeGlobal);
        toggle.addEventListener('change', toggleDarkModeGlobal);
    }
    
    observarMudancasDarkMode();
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}

// Expor funções globalmente
window.aplicarModoEscuro = aplicarModoEscuro;
window.toggleDarkModeGlobal = toggleDarkModeGlobal;
window.mostrarNotificacaoDark = mostrarNotificacaoDark;
window.atualizarIconesMenu = atualizarIconesMenu;