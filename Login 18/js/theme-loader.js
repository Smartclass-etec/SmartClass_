// theme-loader.js - Carrega o tema antes do DOM para evitar flash branco
// Deve ser carregado no <head> antes de qualquer CSS

(function() {
    try {
        const darkMode = localStorage.getItem('darkMode') === 'enabled';
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            // Se o body já existir, adiciona também
            if (document.body) {
                document.body.classList.add('dark-mode');
            }
        }
    } catch(e) {
        // Ignora erros (ex: localStorage indisponível)
    }

    // Adicionar classe para transição suave após carregamento
    document.addEventListener('DOMContentLoaded', function() {
        document.documentElement.classList.add('theme-loaded');
    });
})();

// Expor função para ser usada em outros scripts
window.getTemaAtual = function() {
    return document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
};

window.setTema = function(modo) {
    if (modo === 'dark') {
        document.documentElement.classList.add('dark-mode');
        if (document.body) document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.documentElement.classList.remove('dark-mode');
        if (document.body) document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
    // Atualizar ícones se necessário
    if (typeof atualizarIconesMenu === 'function') {
        atualizarIconesMenu(modo === 'dark');
    }
};