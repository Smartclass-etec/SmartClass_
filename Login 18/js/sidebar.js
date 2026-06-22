// sidebar.js - Sistema de Sidebar Universal com Design Fixo
// Versão com imagem de perfil no menu compacto

(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }

    function initSidebar() {
        if (document.getElementById('sidebarUniversal')) {
            restaurarEstadoSidebar();
            return;
        }
        
        criarSidebar();
        aplicarEventos();
        ajustarConteudo();
        gerarAvatarColorido();
        restaurarEstadoSidebar();
        injetarMenuCompacto();
    }

    function restaurarEstadoSidebar() {
        const sidebar = document.getElementById('sidebarUniversal');
        if (!sidebar) return;
        
        const savedState = localStorage.getItem('sidebarMinimizada');
        if (savedState === 'true') {
            sidebar.classList.add('minimizada');
        } else {
            sidebar.classList.remove('minimizada');
        }
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
        }
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

    // ===== INJETAR MENU COMPACTO COM FOTO DE PERFIL =====
    function injetarMenuCompacto() {
        if (document.getElementById('menuCompactoUniversal')) return;
        
        const tipoUsuario = localStorage.getItem("tipoUsuario") || "professor";
        const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
        const primeiroNome = user.name?.split(' ')[0] || "Usuário";
        const userIdentifier = user.email || user.identifier;
        
        // Buscar foto de perfil
        let fotoPerfil = localStorage.getItem(`foto_${userIdentifier}`);
        let temFoto = fotoPerfil && fotoPerfil !== "";
        
        // Gerar avatar HTML
        let avatarHtml = '';
        if (temFoto) {
            avatarHtml = `<img src="${fotoPerfil}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            // Usar iniciais com cor de fundo
            const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
            let hash = 0;
            for (let i = 0; i < primeiroNome.length; i++) {
                hash = primeiroNome.charCodeAt(i) + ((hash << 5) - hash);
            }
            const corIndex = Math.abs(hash % cores.length);
            const corFundo = cores[corIndex];
            avatarHtml = `<span style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: ${corFundo}; color: white; font-size: 16px; font-weight: 600; border-radius: 50%; text-transform: uppercase;">${primeiroNome.charAt(0)}</span>`;
        }
        
        const menuHTML = `
            <div id="menuCompactoUniversal" style="
                position: fixed;
                top: 15px;
                right: 20px;
                z-index: 999;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <button id="menuToggleUniversal" style="
                    background: white;
                    border: none;
                    border-radius: 30px;
                    padding: 6px 14px 6px 8px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
                    cursor: pointer;
                    font-size: 14px;
                    color: #00796b;
                    transition: 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'Poppins', sans-serif;
                ">
                    <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #e8f5e9; display: flex; align-items: center; justify-content: center;">
                        ${avatarHtml}
                    </div>
                    <span id="menuNomeUsuario" style="font-size: 13px; font-weight: 500;">${primeiroNome}</span>
                    <i class="fas fa-chevron-down" style="font-size: 11px; margin-left: 4px;"></i>
                </button>
                <div id="menuDropdownUniversal" style="
                    display: none;
                    position: absolute;
                    top: 48px;
                    right: 0;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    padding: 8px 0;
                    width: 190px;
                    overflow: hidden;
                    border: 1px solid #eef2f6;
                ">
                    <a href="${tipoUsuario === 'professor' ? 'perfil_professor.html' : 'perfil_aluno.html'}" style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 18px;
                        color: #2d3436;
                        text-decoration: none;
                        font-size: 13px;
                        transition: 0.2s;
                        font-family: 'Poppins', sans-serif;
                    "><i class="fas fa-user" style="width: 18px; color: #00796b;"></i> Perfil</a>
                    <a href="configuracoes_professor.html" style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 18px;
                        color: #2d3436;
                        text-decoration: none;
                        font-size: 13px;
                        transition: 0.2s;
                        font-family: 'Poppins', sans-serif;
                    "><i class="fas fa-cog" style="width: 18px; color: #00796b;"></i> Configurações</a>
                    <div style="height: 1px; background: #eef2f6; margin: 4px 0;"></div>
                    <a href="#" onclick="toggleTemaUniversal()" style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 18px;
                        color: #2d3436;
                        text-decoration: none;
                        font-size: 13px;
                        transition: 0.2s;
                        font-family: 'Poppins', sans-serif;
                    "><i class="fas fa-moon" id="iconeTemaUniversal" style="width: 18px; color: #00796b;"></i> <span id="labelTemaUniversal">Tema escuro</span></a>
                    <div style="height: 1px; background: #eef2f6; margin: 4px 0;"></div>
                    <a href="#" onclick="sairDoSistemaUniversal()" style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 18px;
                        color: #c62828;
                        text-decoration: none;
                        font-size: 13px;
                        transition: 0.2s;
                        font-family: 'Poppins', sans-serif;
                    "><i class="fas fa-sign-out-alt" style="width: 18px;"></i> Sair</a>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', menuHTML);
        
        const toggleBtn = document.getElementById('menuToggleUniversal');
        const dropdown = document.getElementById('menuDropdownUniversal');
        
        if (toggleBtn && dropdown) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            document.addEventListener('click', function(e) {
                const menu = document.getElementById('menuCompactoUniversal');
                if (menu && !menu.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        }
        
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.getElementById('iconeTemaUniversal')?.classList.replace('fa-moon', 'fa-sun');
            document.getElementById('labelTemaUniversal').textContent = 'Tema claro';
        }
        
        aplicarDarkModeMenu();
    }

    window.toggleTemaUniversal = function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        
        const icone = document.getElementById('iconeTemaUniversal');
        const label = document.getElementById('labelTemaUniversal');
        if (icone && label) {
            if (isDark) {
                icone.classList.replace('fa-moon', 'fa-sun');
                label.textContent = 'Tema claro';
            } else {
                icone.classList.replace('fa-sun', 'fa-moon');
                label.textContent = 'Tema escuro';
            }
        }
        
        aplicarDarkModeMenu();
        
        if (window.notificationSystem) {
            window.notificationSystem.show(isDark ? '🌙 Modo escuro ativado!' : '☀️ Modo claro ativado!', 'success');
        }
        
        document.getElementById('menuDropdownUniversal').style.display = 'none';
    };

    function aplicarDarkModeMenu() {
        const isDark = document.body.classList.contains('dark-mode');
        const menu = document.getElementById('menuCompactoUniversal');
        if (!menu) return;
        
        const toggleBtn = document.getElementById('menuToggleUniversal');
        const dropdown = document.getElementById('menuDropdownUniversal');
        
        if (isDark) {
            if (toggleBtn) {
                toggleBtn.style.background = '#1e293b';
                toggleBtn.style.color = '#fbbf24';
                toggleBtn.style.borderColor = '#334155';
            }
            if (dropdown) {
                dropdown.style.background = '#1e293b';
                dropdown.style.borderColor = '#334155';
                dropdown.querySelectorAll('a').forEach(a => {
                    a.style.color = '#f1f5f9';
                    a.addEventListener('mouseenter', function() {
                        this.style.background = '#334155';
                    });
                    a.addEventListener('mouseleave', function() {
                        this.style.background = 'transparent';
                    });
                });
                dropdown.querySelectorAll('div').forEach(d => {
                    if (d.style.height === '1px') d.style.background = '#334155';
                });
            }
        } else {
            if (toggleBtn) {
                toggleBtn.style.background = 'white';
                toggleBtn.style.color = '#00796b';
                toggleBtn.style.borderColor = '#eef2f6';
            }
            if (dropdown) {
                dropdown.style.background = 'white';
                dropdown.style.borderColor = '#eef2f6';
                dropdown.querySelectorAll('a').forEach(a => {
                    a.style.color = '#2d3436';
                    a.addEventListener('mouseenter', function() {
                        this.style.background = '#f0f7f5';
                    });
                    a.addEventListener('mouseleave', function() {
                        this.style.background = 'transparent';
                    });
                });
            }
        }
    }

    // ===== CRIAR SIDEBAR =====
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
                { icone: "fa-bullhorn", nome: "Mural", link: "mural_professor.html" },
                { icone: "fa-video", nome: "Gravações", link: "videoaulas_professor.html" },
                { icone: "fa-cube", nome: "Modelo 3D", link: "modelo3d.html" },
                { icone: "fa-user-circle", nome: "Perfil", link: "perfil_professor.html" }
            ],
            aluno: [
                { icone: "fa-home", nome: "Início", link: "home_aluno.html" },
                { icone: "fa-tasks", nome: "Atividades", link: "atividades_aluno.html" },
                { icone: "fa-bullhorn", nome: "Mural", link: "mural_aluno.html" },
                { icone: "fa-video", nome: "Videoaulas", link: "videoaulas_aluno.html" },
                { icone: "fa-cube", nome: "Modelo 3D", link: "modelo3d.html" },
                { icone: "fa-user-circle", nome: "Perfil", link: "perfil_aluno.html" }
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
        
        const logoSrc = 'png/logo.branca.png';
        
        const sidebarHTML = `
        <div id="sidebarUniversal" class="sidebar-universal">
            <div class="sidebar-header-universal">
                <div class="logo-wrapper-universal">
                    <img src="${logoSrc}" alt="SmartClass Logo" class="logo-img-universal" onerror="this.src='https://placehold.co/40x40/ffffff/00796b?text=SC'">
                    <div class="logo-texto-universal">
                        <span class="logo-nome-universal">SmartClass</span>
                        <span class="logo-subtitle-universal">Plataforma Educacional</span>
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
    }

    // ===== EVENTOS DA SIDEBAR =====
    function aplicarEventos() {
        const toggleBtn = document.getElementById('toggleSidebarUniversal');
        const sidebar = document.getElementById('sidebarUniversal');
        
        if (toggleBtn && sidebar) {
            const newToggle = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);
            
            newToggle.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.toggle('minimizada');
                localStorage.setItem('sidebarMinimizada', sidebar.classList.contains('minimizada'));
            };
        }
        
        const darkBtn = document.getElementById('darkModeBtnUniversal');
        if (darkBtn) {
            const newDarkBtn = darkBtn.cloneNode(true);
            darkBtn.parentNode.replaceChild(newDarkBtn, darkBtn);
            
            newDarkBtn.onclick = function() {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
                const icon = newDarkBtn.querySelector('i');
                if (icon) {
                    if (isDark) {
                        icon.classList.remove('fa-moon');
                        icon.classList.add('fa-sun');
                    } else {
                        icon.classList.remove('fa-sun');
                        icon.classList.add('fa-moon');
                    }
                }
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
                aplicarDarkModeMenu();
            };
            
            if (localStorage.getItem('darkMode') === 'enabled') {
                document.body.classList.add('dark-mode');
                const icon = newDarkBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        }
        
        const mobileBtn = document.getElementById('mobileMenuBtnUniversal');
        if (mobileBtn && sidebar) {
            const newMobileBtn = mobileBtn.cloneNode(true);
            mobileBtn.parentNode.replaceChild(newMobileBtn, mobileBtn);
            
            newMobileBtn.onclick = function() {
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

// ===== FUNÇÕES GLOBAIS =====
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
    
    // Também atualizar o menu compacto
    atualizarAvatarMenuCompacto();
};

// Função para atualizar o avatar no menu compacto
window.atualizarAvatarMenuCompacto = function() {
    const menuAvatarContainer = document.querySelector('#menuToggleUniversal > div:first-child');
    if (!menuAvatarContainer) return;
    
    const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
    const userIdentifier = user.email || user.identifier;
    const primeiroNome = user.name?.split(' ')[0] || "Usuário";
    const fotoPerfil = localStorage.getItem(`foto_${userIdentifier}`);
    let temFoto = fotoPerfil && fotoPerfil !== "";
    
    let avatarHtml = '';
    if (temFoto) {
        avatarHtml = `<img src="${fotoPerfil}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
        const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
        let hash = 0;
        for (let i = 0; i < primeiroNome.length; i++) {
            hash = primeiroNome.charCodeAt(i) + ((hash << 5) - hash);
        }
        const corIndex = Math.abs(hash % cores.length);
        const corFundo = cores[corIndex];
        avatarHtml = `<span style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: ${corFundo}; color: white; font-size: 16px; font-weight: 600; border-radius: 50%; text-transform: uppercase;">${primeiroNome.charAt(0)}</span>`;
    }
    
    menuAvatarContainer.innerHTML = avatarHtml;
};