// global.js - Funções utilitárias globais
// Versão com funções auxiliares para datas, validações, formatação, etc.

// ===== FORMATAÇÃO DE DATAS =====
function formatarData(dataStr) {
    if (!dataStr) return "Sem data";
    try {
        const data = new Date(dataStr);
        if (isNaN(data.getTime())) return dataStr;
        return data.toLocaleDateString('pt-BR');
    } catch(e) {
        return dataStr;
    }
}

function formatarDataHora(dataStr) {
    if (!dataStr) return "Sem data";
    try {
        const data = new Date(dataStr);
        if (isNaN(data.getTime())) return dataStr;
        return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
    } catch(e) {
        return dataStr;
    }
}

function hojeStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function hojeBR() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function diferencaDias(data1, data2) {
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ===== VALIDAÇÕES =====
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function validarEmailInstitucional(email) {
    const dominios = ['@cps.sp.gov.br', '@aluno.cps.sp.gov.br', '@professor.cps.sp.gov.br'];
    return dominios.some(d => email.toLowerCase().endsWith(d));
}

function validarSenha(senha) {
    return senha && senha.length >= 6;
}

function validarNome(nome) {
    return nome && nome.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(nome.trim());
}

// ===== GERADORES =====
function gerarId() {
    return Date.now().toString() + '_' + Math.random().toString(36).substr(2, 6);
}

function gerarSlug(texto) {
    return texto.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// ===== MANIPULAÇÃO DE LOCALSTORAGE =====
function getStorageItem(key, fallback = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch(e) {
        return fallback;
    }
}

function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch(e) {
        console.error('Erro ao salvar no localStorage:', e);
        return false;
    }
}

function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch(e) {
        console.error('Erro ao remover do localStorage:', e);
        return false;
    }
}

// ===== FUNÇÕES DE USUÁRIO =====
function getUsuarioLogado() {
    return getStorageItem('loggedUser', null);
}

function getTipoUsuario() {
    return localStorage.getItem('tipoUsuario') || null;
}

function isAluno() {
    return getTipoUsuario() === 'aluno';
}

function isProfessor() {
    return getTipoUsuario() === 'professor';
}

// ===== FUNÇÕES DE MODAL =====
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function fecharTodosModais() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.style.display = 'none';
    });
    document.body.style.overflow = '';
}

// ===== FUNÇÕES DE SCROLL =====
function scrollParaElemento(seletor, offset = 0) {
    const elemento = document.querySelector(seletor);
    if (elemento) {
        const top = elemento.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

// ===== FUNÇÕES DE CLIPE =====
function copiarTexto(texto) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(texto).then(() => {
            if (window.notificationSystem) {
                window.notificationSystem.show('✅ Texto copiado!', 'success');
            }
        }).catch(() => {
            fallbackCopiarTexto(texto);
        });
    } else {
        fallbackCopiarTexto(texto);
    }
}

function fallbackCopiarTexto(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        if (window.notificationSystem) {
            window.notificationSystem.show('✅ Texto copiado!', 'success');
        }
    } catch(e) {
        console.error('Erro ao copiar:', e);
    }
    document.body.removeChild(textarea);
}

// ===== TRUNCAR TEXTO =====
function truncarTexto(texto, maxLength = 100, sufixo = '...') {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + sufixo;
}

// ===== ESCAPAR HTML =====
function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ===== EXPOR FUNÇÕES GLOBAIS =====
window.formatarData = formatarData;
window.formatarDataHora = formatarDataHora;
window.hojeStr = hojeStr;
window.hojeBR = hojeBR;
window.diferencaDias = diferencaDias;
window.validarEmail = validarEmail;
window.validarEmailInstitucional = validarEmailInstitucional;
window.validarSenha = validarSenha;
window.validarNome = validarNome;
window.gerarId = gerarId;
window.gerarSlug = gerarSlug;
window.getStorageItem = getStorageItem;
window.setStorageItem = setStorageItem;
window.removeStorageItem = removeStorageItem;
window.getUsuarioLogado = getUsuarioLogado;
window.getTipoUsuario = getTipoUsuario;
window.isAluno = isAluno;
window.isProfessor = isProfessor;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.fecharTodosModais = fecharTodosModais;
window.scrollParaElemento = scrollParaElemento;
window.copiarTexto = copiarTexto;
window.truncarTexto = truncarTexto;
window.escapeHtml = escapeHtml;