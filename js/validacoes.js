// validacoes.js - Funções para validação de campos de texto

// Aplicar limites e quebra de linha em todos os textareas
function aplicarValidacoesTexto() {
    // Todos os textareas terão limite de caracteres
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('data-max') || 500;
        
        // Adicionar contador de caracteres
        if (!textarea.nextElementSibling || !textarea.nextElementSibling.classList.contains('char-counter')) {
            const counter = document.createElement('small');
            counter.className = 'char-counter';
            counter.style.cssText = 'display: block; text-align: right; font-size: 11px; color: #888; margin-top: 5px;';
            counter.textContent = `0/${maxLength} caracteres`;
            textarea.insertAdjacentElement('afterend', counter);
            
            // Atualizar contador
            textarea.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = `${length}/${maxLength} caracteres`;
                if (length > maxLength) {
                    this.value = this.value.substring(0, maxLength);
                    counter.textContent = `${maxLength}/${maxLength} caracteres`;
                    counter.style.color = '#f44336';
                } else {
                    counter.style.color = '#888';
                }
            });
        }
        
        // Impedir quebra de linha excessiva (máximo 2 quebras seguidas)
        textarea.addEventListener('input', function() {
            this.value = this.value.replace(/\n{3,}/g, '\n\n');
        });
    });
    
    // Inputs com limite
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        const maxLength = input.getAttribute('maxlength') || 100;
        if (!input.hasAttribute('maxlength')) {
            input.setAttribute('maxlength', maxLength);
        }
    });
}

// Validar campos obrigatórios
function validarCamposObrigatorios(form) {
    const campos = form.querySelectorAll('[required]');
    let valido = true;
    
    campos.forEach(campo => {
        if (!campo.value.trim()) {
            campo.style.borderColor = '#f44336';
            campo.style.backgroundColor = '#ffebee';
            valido = false;
        } else {
            campo.style.borderColor = '';
            campo.style.backgroundColor = '';
        }
    });
    
    return valido;
}

// Limpar estilos de erro
function limparErros(form) {
    const campos = form.querySelectorAll('[required]');
    campos.forEach(campo => {
        campo.style.borderColor = '';
        campo.style.backgroundColor = '';
    });
}

// Adicionar validação em tempo real
function adicionarValidacaoTempoReal(input) {
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        }
    });
}

// Executar quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    aplicarValidacoesTexto();
    
    // Adicionar validação em tempo real para campos obrigatórios
    const inputsObrigatorios = document.querySelectorAll('[required]');
    inputsObrigatorios.forEach(adicionarValidacaoTempoReal);
});

// Função para adicionar validações em modais que abrem dinamicamente
function observarModais() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const modal = mutation.target;
                if (modal.style.display === 'flex') {
                    // Quando um modal abrir, aplicar validações nos campos dentro dele
                    const textareas = modal.querySelectorAll('textarea');
                    textareas.forEach(textarea => {
                        if (!textarea.hasAttribute('data-max')) {
                            textarea.setAttribute('data-max', '500');
                            textarea.setAttribute('maxlength', '500');
                        }
                    });
                    
                    const inputs = modal.querySelectorAll('input[type="text"]');
                    inputs.forEach(input => {
                        if (!input.hasAttribute('maxlength')) {
                            input.setAttribute('maxlength', '100');
                        }
                    });
                }
            }
        });
    });
    
    // Observar mudanças em todos os modais
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        observer.observe(modal, { attributes: true });
    });
}

// Executar após DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    aplicarValidacoesTexto();
    observarModais();
    
    const inputsObrigatorios = document.querySelectorAll('[required]');
    inputsObrigatorios.forEach(adicionarValidacaoTempoReal);
});