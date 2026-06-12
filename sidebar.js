// sidebar.js - Sistema de Sidebar Universal com Logo Única

(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }

    function initSidebar() {
        if (document.getElementById('sidebarUniversal')) return;
        
        criarSidebar();
        aplicarEventos();
        ajustarConteudo();
        gerarAvatarColorido();
    }

    function gerarAvatarColorido() {
        const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
        const nome = user.name || user.nome || "Usuário";
        const primeiroNome = nome.split(' ')[0];
        
        const cores = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ];
        
        let hash = 0;
        for (let i = 0; i < primeiroNome.length; i++) {
            hash = primeiroNome.charCodeAt(i) + ((hash << 5) - hash);
        }
        const corIndex = Math.abs(hash % cores.length);
        const corFundo = cores[corIndex];
        
        localStorage.setItem(`avatarCor_${user.email || user.identifier}`, corFundo);
        
        const avatarDiv = document.querySelector('#sidebarAvatarUniversal');
        if (avatarDiv && !avatarDiv.querySelector('img')) {
            avatarDiv.style.backgroundColor = corFundo;
        }
    }

    function criarSidebar() {
        const tipoUsuario = localStorage.getItem("tipoUsuario") || "professor";
        const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
        const paginaAtual = window.location.pathname.split('/').pop();
        
        const nomeUsuario = user.name || user.nome || "Usuário";
        const primeiroNome = nomeUsuario.split(' ')[0];
        const inicial = primeiroNome.charAt(0).toUpperCase();
        
        const menus = {
            professor: [
                { icone: "fa-chart-line", nome: "Dashboard", link: "home_professor.html" },
                { icone: "fa-tasks", nome: "Atividades", link: "atividades_professor.html" },
                { icone: "fa-chalkboard-user", nome: "Minhas Disciplinas", link: "admin_disciplinas_professor.html" },
                { icone: "fa-users", nome: "Turmas", link: "turmas_professor.html" },
                { icone: "fa-user-circle", nome: "Perfil", link: "perfil_professor.html" },
                { icone: "fa-cog", nome: "Configurações", link: "configuracoes_professor.html" }
            ],
            aluno: [
                { icone: "fa-home", nome: "Início", link: "home_aluno.html" },
                { icone: "fa-tasks", nome: "Atividades", link: "atividades_aluno.html" },
                { icone: "fa-chart-line", nome: "Progresso", link: "#" },
                { icone: "fa-user-circle", nome: "Perfil", link: "perfil_aluno.html" },
                { icone: "fa-cog", nome: "Configurações", link: "#" }
            ]
        };
        
        const menuAtual = menus[tipoUsuario] || menus.professor;
        
        const userIdentifier = user.email || user.identifier;
        let fotoPerfil = localStorage.getItem(`foto_${userIdentifier}`);
        let temFoto = fotoPerfil && fotoPerfil !== "";
        
        let avatarHtml = '';
        if (temFoto) {
            avatarHtml = `<img src="${fotoPerfil}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            avatarHtml = `<span style="font-size: 20px; font-weight: 600; color: #004d47;">${inicial}</span>`;
        }
        
        // LOGO ÚNICA (sem duplicação)
        const logoSrc = 'png/logo.branca.png';
        
        const sidebarHTML = `
        <div id="sidebarUniversal" class="sidebar-universal">
            <div class="sidebar-header-universal">
                <div class="logo-container-universal">
                    <div class="logo-wrapper-universal">
                        <img src="${logoSrc}" alt="SmartClass Logo" class="logo-img-universal">
                        <div class="logo-texto-universal">
                            <span class="logo-nome-universal">SmartClass</span>
                            <span class="logo-subtitle-universal">Plataforma Educacional</span>
                        </div>
                    </div>
                </div>
                <button id="toggleSidebarUniversal" class="toggle-sidebar-universal">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
            
            <div class="user-info-universal">
                <div class="user-avatar-universal" id="sidebarAvatarUniversal" style="${!temFoto ? 'background: #FFD966;' : ''}">
                    ${avatarHtml}
                </div>
                <div class="user-details-universal">
                    <span class="user-name-universal">${primeiroNome}</span>
                    <span class="user-role-universal">${tipoUsuario === 'professor' ? 'Professor' : 'Aluno'}</span>
                </div>
            </div>
            
            <nav class="sidebar-nav-universal">
                ${menuAtual.map(menu => `
                    <a href="${menu.link}" class="nav-link-universal ${paginaAtual === menu.link ? 'active' : ''}">
                        <i class="fas ${menu.icone}"></i>
                        <span>${menu.nome}</span>
                    </a>
                `).join('')}
            </nav>
            
            <div class="sidebar-footer-universal">
                <button id="darkModeBtnUniversal" class="footer-btn-universal">
                    <i class="fas fa-moon"></i>
                    <span>Modo Escuro</span>
                </button>
                <button onclick="sairDoSistemaUniversal()" class="footer-btn-universal logout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Sair</span>
                </button>
            </div>
        </div>
        <div id="mobileMenuBtnUniversal" class="mobile-menu-btn-universal">
            <i class="fas fa-bars"></i>
        </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        adicionarEstilos();
    }

    function adicionarEstilos() {
        if (document.getElementById('estilosSidebar')) return;
        
        const estilo = document.createElement('style');
        estilo.id = 'estilosSidebar';
        estilo.textContent = `
            /* SIDEBAR UNIVERSAL */
            .sidebar-universal {
                position: fixed;
                left: 0;
                top: 0;
                width: 280px;
                height: 100vh;
                background: linear-gradient(180deg, #00796b 0%, #004d47 100%);
                z-index: 1000;
                transition: all 0.3s ease;
                box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
            }
            
            .sidebar-universal.minimizada {
                width: 80px;
            }
            
            .sidebar-header-universal {
                padding: 20px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.15);
            }
            
            /* CONTAINER DA LOGO */
            .logo-container-universal {
                flex: 1;
            }
            
            .logo-wrapper-universal {
                display: flex;
                align-items: center;
                gap: 12px;
                transition: all 0.3s ease;
            }
            
            .logo-img-universal {
                width: 40px;
                height: 40px;
                object-fit: contain;
                flex-shrink: 0;
            }
            
            .logo-texto-universal {
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
            }
            
            .logo-nome-universal {
                font-size: 18px;
                font-weight: 700;
                color: white;
                line-height: 1.2;
            }
            
            .logo-subtitle-universal {
                font-size: 9px;
                color: rgba(255,255,255,0.7);
                letter-spacing: 0.5px;
            }
            
            /* MODO MINIMIZADO - ESCONDE O TEXTO DA LOGO */
            .sidebar-universal.minimizada .logo-texto-universal {
                display: none;
            }
            
            .sidebar-universal.minimizada .logo-wrapper-universal {
                justify-content: center;
                gap: 0;
            }
            
            .sidebar-universal.minimizada .logo-img-universal {
                margin: 0 auto;
            }
            
            /* BOTÃO TOGGLE */
            .toggle-sidebar-universal {
                background: rgba(255,255,255,0.15);
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                flex-shrink: 0;
            }
            
            .toggle-sidebar-universal:hover {
                background: rgba(255,255,255,0.25);
            }
            
            /* ROTAÇÃO DO BOTÃO QUANDO MINIMIZADO */
            .sidebar-universal.minimizada .toggle-sidebar-universal i {
                transform: rotate(180deg);
            }
            
            /* ESCONDER ELEMENTOS NO MODO MINIMIZADO */
            .sidebar-universal.minimizada .user-details-universal,
            .sidebar-universal.minimizada .nav-link-universal span,
            .sidebar-universal.minimizada .footer-btn-universal span {
                display: none;
            }
            
            .sidebar-universal.minimizada .nav-link-universal {
                justify-content: center;
                padding: 12px;
            }
            
            .sidebar-universal.minimizada .footer-btn-universal {
                justify-content: center;
                padding: 10px;
            }
            
            /* USER INFO */
            .user-info-universal {
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.15);
            }
            
            .user-avatar-universal {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                overflow: hidden;
                background: #FFD966;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            .user-avatar-universal img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .user-avatar-universal span {
                font-size: 20px;
                font-weight: 600;
                color: #004d47;
            }
            
            .user-details-universal {
                flex: 1;
                overflow: hidden;
            }
            
            .user-name-universal {
                font-size: 14px;
                font-weight: 600;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: white;
            }
            
            .user-role-universal {
                font-size: 11px;
                opacity: 0.7;
                display: block;
                color: rgba(255,255,255,0.8);
            }
            
            /* NAVEGAÇÃO */
            .sidebar-nav-universal {
                flex: 1;
                padding: 20px 15px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                overflow-y: auto;
            }
            
            .nav-link-universal {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 15px;
                color: white;
                text-decoration: none;
                border-radius: 12px;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
            }
            
            .nav-link-universal:hover {
                background: rgba(255,255,255,0.12);
                color: white;
            }
            
            .nav-link-universal.active {
                background: rgba(255,217,102,0.2);
                color: #FFD966;
                border-left: 3px solid #FFD966;
            }
            
            .nav-link-universal i {
                width: 20px;
                font-size: 18px;
                color: white;
            }
            
            .nav-link-universal.active i {
                color: #FFD966;
            }
            
            /* FOOTER */
            .sidebar-footer-universal {
                padding: 20px;
                border-top: 1px solid rgba(255,255,255,0.15);
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .footer-btn-universal {
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(255,255,255,0.08);
                border: none;
                padding: 10px 15px;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13px;
                font-family: inherit;
                width: 100%;
            }
            
            .footer-btn-universal:hover {
                background: rgba(255,255,255,0.18);
                color: white;
            }
            
            .footer-btn-universal.logout:hover {
                background: rgba(220, 53, 69, 0.25);
                color: #ff8a8a;
            }
            
            .footer-btn-universal i {
                width: 20px;
                font-size: 16px;
                color: white;
            }
            
            .footer-btn-universal.logout:hover i {
                color: #ff8a8a;
            }
            
            /* SCROLLBAR */
            .sidebar-nav-universal::-webkit-scrollbar {
                width: 4px;
            }
            
            .sidebar-nav-universal::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
            }
            
            .sidebar-nav-universal::-webkit-scrollbar-thumb {
                background: rgba(255,217,102,0.5);
                border-radius: 10px;
            }
            
            /* CONTEÚDO PRINCIPAL */
            .conteudo-ajustado {
                margin-left: 280px;
                transition: margin-left 0.3s ease;
                min-height: 100vh;
            }
            
            .sidebar-universal.minimizada ~ .conteudo-ajustado {
                margin-left: 80px;
            }
            
            /* BOTÃO MOBILE */
            .mobile-menu-btn-universal {
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
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            
            /* DARK MODE */
            body.dark-mode .sidebar-universal {
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
            }
            
            body.dark-mode .nav-link-universal.active {
                background: rgba(251,191,36,0.15);
            }
            
            body.dark-mode .user-avatar-universal {
                background: #fbbf24;
            }
            
            body.dark-mode .user-avatar-universal span {
                color: #0f172a;
            }
            
            /* RESPONSIVIDADE */
            @media (max-width: 768px) {
                .sidebar-universal {
                    transform: translateX(-100%);
                }
                .sidebar-universal.mobile-open {
                    transform: translateX(0);
                }
                .conteudo-ajustado {
                    margin-left: 0 !important;
                }
                .mobile-menu-btn-universal {
                    display: flex;
                }
            }
        `;
        document.head.appendChild(estilo);
    }

    function aplicarEventos() {
        const toggleBtn = document.getElementById('toggleSidebarUniversal');
        const sidebar = document.getElementById('sidebarUniversal');
        
        if (toggleBtn && sidebar) {
            toggleBtn.onclick = function(e) {
                e.preventDefault();
                sidebar.classList.toggle('minimizada');
                localStorage.setItem('sidebarMinimizada', sidebar.classList.contains('minimizada'));
            };
            
            const savedState = localStorage.getItem('sidebarMinimizada');
            if (savedState === 'true') {
                sidebar.classList.add('minimizada');
            }
        }
        
        const darkBtn = document.getElementById('darkModeBtnUniversal');
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
            
            if (localStorage.getItem('darkMode') === 'enabled') {
                document.body.classList.add('dark-mode');
                const icon = darkBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        }
        
        const mobileBtn = document.getElementById('mobileMenuBtnUniversal');
        if (mobileBtn && sidebar) {
            mobileBtn.onclick = function() {
                sidebar.classList.toggle('mobile-open');
            };
        }
    }

    function ajustarConteudo() {
        let conteudo = document.querySelector('.content') || 
                       document.querySelector('main') || 
                       document.body.children[0];
        
        if (conteudo && conteudo.id !== 'sidebarUniversal') {
            conteudo.classList.add('conteudo-ajustado');
        }
        
        const sidebarAntiga = document.querySelector('.sidebar:not(#sidebarUniversal)');
        if (sidebarAntiga) {
            sidebarAntiga.style.display = 'none';
        }
    }
})();

window.sairDoSistemaUniversal = function() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('tipoUsuario');
    window.location.href = 'index.html';
};

window.atualizarFotoSidebar = function() {
    const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
    const userIdentifier = user.email || user.identifier;
    const fotoPerfil = localStorage.getItem(`foto_${userIdentifier}`);
    const avatarDiv = document.querySelector('#sidebarAvatarUniversal');
    
    if (avatarDiv) {
        if (fotoPerfil && fotoPerfil !== "") {
            avatarDiv.innerHTML = `<img src="${fotoPerfil}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover;">`;
            avatarDiv.style.backgroundColor = 'transparent';
        } else {
            const nomeUsuario = user.name || user.nome || "Usuário";
            const inicial = nomeUsuario.charAt(0).toUpperCase();
            avatarDiv.innerHTML = `<span style="font-size: 20px; font-weight: 600; color: #004d47;">${inicial}</span>`;
            
            const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
            let hash = 0;
            for (let i = 0; i < nomeUsuario.length; i++) {
                hash = nomeUsuario.charCodeAt(i) + ((hash << 5) - hash);
            }
            const corIndex = Math.abs(hash % cores.length);
            avatarDiv.style.backgroundColor = cores[corIndex];
        }
    }
};