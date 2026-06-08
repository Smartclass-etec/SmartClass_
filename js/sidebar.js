// sidebar.js - Sidebar moderna e animada (funciona para Aluno e Professor)

function criarSidebar() {
    const tipoUsuario = localStorage.getItem("tipoUsuario") || "aluno";
    const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
    const paginaAtual = window.location.pathname.split('/').pop();
    
    const userIdentifier = user.email || user.identifier;
    let fotoPerfil = localStorage.getItem(`foto_${userIdentifier}`);
    let temFoto = fotoPerfil && fotoPerfil !== "";
    
    const menus = {
        professor: [
            { icone: "fa-chart-line", nome: "Dashboard", link: "home_professor.html" },
            { icone: "fa-tasks", nome: "Atividades", link: "atividades_professor.html" },
            { icone: "fa-chalkboard-user", nome: "Minhas Disciplinas", link: "admin_disciplinas_professor.html" },
            { icone: "fa-users", nome: "Turmas", link: "turmas_professor.html" },
            { icone: "fa-user-circle", nome: "Perfil", link: "perfil_professor.html" },
            { icone: "fa-cog", nome: "Configurações", link: "configuracoes_professor.html" }
            { icone: "fa-user-graduate", nome: "Escolha sua Turma", link: "configuracoes_professor.html" }
        ],
        aluno: [
            { icone: "fa-home", nome: "Início", link: "home_aluno.html" },
            { icone: "fa-tasks", nome: "Atividades", link: "atividades_aluno.html" },
            { icone: "fa-chart-line", nome: "Progresso", link: "#" },
            { icone: "fa-user-circle", nome: "Perfil", link: "perfil_aluno.html" },
            { icone: "fa-cog", nome: "Configurações", link: "#" }
        ]
    };
    
    const menuAtual = menus[tipoUsuario] || menus.aluno;
    const nomeUsuario = user.name || user.nome || "Usuário";
    const primeiroNome = nomeUsuario.split(' ')[0];
    const inicial = primeiroNome.charAt(0).toUpperCase();
    
    let avatarHtml = '';
    if (temFoto) {
        avatarHtml = `<img src="${fotoPerfil}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
        avatarHtml = `<span style="font-size: 20px; font-weight: 600;">${inicial}</span>`;
    }
    
    return `
    <div id="novaSidebar" class="sidebar-moderna">
        <div class="sidebar-header">
            <div class="logo">
                <i class="fas fa-graduation-cap" style="font-size: 28px;"></i>
                <span style="font-weight: 700; font-size: 18px;">SmartClass</span>
            </div>
            <button id="toggleSidebar" class="toggle-btn">
                <i class="fas fa-chevron-left"></i>
            </button>
        </div>
        
        <div class="user-info-sidebar">
            <div class="user-avatar" id="sidebarAvatar">
                ${avatarHtml}
            </div>
            <div class="user-details">
                <span class="user-name">${primeiroNome}</span>
                <span class="user-role">${tipoUsuario === 'professor' ? 'Professor' : 'Aluno'}</span>
            </div>
        </div>
        
        <nav class="sidebar-nav">
            ${menuAtual.map(menu => `
                <a href="${menu.link}" class="nav-link ${paginaAtual === menu.link ? 'active' : ''}">
                    <i class="fas ${menu.icone}"></i>
                    <span>${menu.nome}</span>
                </a>
            `).join('')}
        </nav>
        
        <div class="sidebar-footer">
            <button id="darkModeBtn" class="footer-btn">
                <i class="fas fa-moon"></i>
                <span>Modo Escuro</span>
            </button>
            <button onclick="sairDoSistema()" class="footer-btn logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
            </button>
        </div>
    </div>
    `;
}

function aplicarEstilos() {
    const estilo = document.createElement('style');
    estilo.textContent = `
        .sidebar-moderna {
            position: fixed;
            left: 0;
            top: 0;
            width: 260px;
            height: 100vh;
            background: linear-gradient(180deg, #00796b 0%, #004d47 100%);
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 2px 0 15px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
        }
        
        .sidebar-moderna.minimizada { width: 70px; }
        
        .sidebar-header {
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.15);
        }
        
        .logo { display: flex; align-items: center; gap: 10px; color: white; }
        
        .toggle-btn {
            background: rgba(255,255,255,0.15);
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 8px;
            cursor: pointer;
            color: white;
            transition: all 0.3s;
        }
        
        .toggle-btn:hover { background: rgba(255,255,255,0.3); }
        .sidebar-moderna.minimizada .logo { display: none; }
        .sidebar-moderna.minimizada .toggle-btn { margin: 0 auto; }
        
        .user-info-sidebar {
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.15);
        }
        
        .user-avatar {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #fbbf24, #d97706);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        
        .user-details { display: flex; flex-direction: column; overflow: hidden; }
        .user-name { color: white; font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { color: rgba(255,255,255,0.7); font-size: 11px; }
        
        .sidebar-moderna.minimizada .user-details { display: none; }
        .sidebar-moderna.minimizada .user-info-sidebar { justify-content: center; }
        
        .sidebar-nav { flex: 1; padding: 20px 10px; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }
        
        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            color: rgba(255,255,255,0.85);
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s;
        }
        
        .nav-link:hover { background: rgba(255,255,255,0.12); color: white; }
        .nav-link.active { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border-left: 3px solid #fbbf24; }
        .nav-link i { width: 20px; font-size: 18px; }
        
        .sidebar-moderna.minimizada .nav-link span { display: none; }
        .sidebar-moderna.minimizada .nav-link { justify-content: center; }
        
        .sidebar-footer {
            padding: 20px;
            border-top: 1px solid rgba(255,255,255,0.15);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .footer-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.08);
            border: none;
            padding: 10px;
            color: rgba(255,255,255,0.85);
            cursor: pointer;
            border-radius: 10px;
            transition: all 0.3s;
            width: 100%;
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
        }
        
        .footer-btn:hover { background: rgba(255,255,255,0.18); color: white; }
        .footer-btn.logout:hover { background: rgba(220, 53, 69, 0.25); color: #ff8a8a; }
        
        .sidebar-moderna.minimizada .footer-btn span { display: none; }
        .sidebar-moderna.minimizada .footer-btn { justify-content: center; }
        
        .conteudo-ajustado { margin-left: 260px; transition: margin-left 0.3s ease; padding: 20px; min-height: 100vh; }
        .sidebar-moderna.minimizada ~ .conteudo-ajustado { margin-left: 70px; }
        
        /* Dark Mode */
        body.dark-mode .sidebar-moderna { background: linear-gradient(180deg, #0f172a 0%, #020617 100%); }
        body.dark-mode .sidebar-moderna .sidebar-header { border-bottom-color: rgba(255,255,255,0.08); }
        body.dark-mode .sidebar-moderna .user-info-sidebar { border-bottom-color: rgba(255,255,255,0.08); }
        body.dark-mode .nav-link { color: rgba(255,255,255,0.7); }
        body.dark-mode .nav-link:hover { background: rgba(255,255,255,0.08); }
        body.dark-mode .nav-link.active { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
        body.dark-mode .sidebar-footer { border-top-color: rgba(255,255,255,0.08); }
        body.dark-mode .footer-btn { background: rgba(255,255,255,0.05); }
        body.dark-mode .footer-btn:hover { background: rgba(255,255,255,0.12); }
        
        /* Responsivo */
        @media (max-width: 768px) {
            .sidebar-moderna { transform: translateX(-100%); }
            .sidebar-moderna.mobile-open { transform: translateX(0); }
            .conteudo-ajustado { margin-left: 0 !important; }
        }
        
        /* Scrollbar */
        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.5); border-radius: 10px; }
    `;
    document.head.appendChild(estilo);
}

function ajustarConteudo() {
    let conteudo = document.querySelector('.content');
    if (!conteudo) {
        const children = document.body.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].id !== 'novaSidebar' && children[i].tagName !== 'SCRIPT' && children[i].tagName !== 'STYLE') {
                conteudo = children[i];
                break;
            }
        }
    }
    if (conteudo && conteudo !== document.querySelector('#novaSidebar')) {
        conteudo.classList.add('conteudo-ajustado');
    }
}

function esconderSidebarAntiga() {
    const sidebarVelha = document.querySelector('.sidebar');
    if (sidebarVelha) sidebarVelha.style.display = 'none';
}

function atualizarFotoSidebar() {
    const tipoUsuario = localStorage.getItem("tipoUsuario") || "aluno";
    const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
    const userIdentifier = user.email || user.identifier;
    const fotoPerfil = localStorage.getItem(`foto_${userIdentifier}`);
    const avatarDiv = document.querySelector('#sidebarAvatar');
    
    if (avatarDiv) {
        if (fotoPerfil && fotoPerfil !== "") {
            avatarDiv.innerHTML = `<img src="${fotoPerfil}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            const nomeUsuario = user.name || user.nome || "Usuário";
            const inicial = nomeUsuario.charAt(0).toUpperCase();
            avatarDiv.innerHTML = `<span style="font-size: 20px; font-weight: 600;">${inicial}</span>`;
        }
    }
}

function inicializarSidebar() {
    if (document.getElementById('novaSidebar')) return;
    
    const sidebarHTML = criarSidebar();
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    ajustarConteudo();
    esconderSidebarAntiga();
    
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('novaSidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.onclick = function(e) {
            e.preventDefault();
            sidebar.classList.toggle('minimizada');
            localStorage.setItem('sidebarMinimizada', sidebar.classList.contains('minimizada'));
        };
        if (localStorage.getItem('sidebarMinimizada') === 'true') {
            sidebar.classList.add('minimizada');
        }
    }
    
    const darkBtn = document.getElementById('darkModeBtn');
    if (darkBtn) {
        darkBtn.onclick = function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
            const icon = darkBtn.querySelector('i');
            if (icon) {
                if (isDark) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        };
        
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        const icon = darkBtn.querySelector('i');
        if (icon) {
            if (isDarkMode) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
        
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Evento para mobile
    const style = document.createElement('style');
    style.textContent = `
        .menu-mobile-btn {
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 1001;
            background: #00796b;
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 12px;
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
            .menu-mobile-btn { display: flex; align-items: center; justify-content: center; }
            .conteudo-ajustado { margin-left: 0 !important; padding-top: 70px !important; }
        }
    `;
    document.head.appendChild(style);
    
    if (!document.querySelector('.menu-mobile-btn') && window.innerWidth <= 768) {
        const btn = document.createElement('button');
        btn.className = 'menu-mobile-btn';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        btn.onclick = () => {
            const sidebar = document.getElementById('novaSidebar');
            if (sidebar) sidebar.classList.toggle('mobile-open');
        };
        document.body.insertAdjacentElement('afterbegin', btn);
    }
}

window.sairDoSistema = function() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('tipoUsuario');
    window.location.href = 'selecao.html';
};

window.atualizarFotoSidebar = atualizarFotoSidebar;

// Inicialização
aplicarEstilos();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSidebar);
} else {
    inicializarSidebar();
}