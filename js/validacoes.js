// validacoes.js - Funções para validação de campos de texto
// Versão 2.0 - Com resize: none, limites de caracteres e contadores

// ===== CONFIGURAÇÕES GLOBAIS =====
const LIMITE_INPUT = 50;      // para inputs de texto simples
const LIMITE_TEXTAREA = 350;  // para textareas (descrições, mensagens)
const LIMITE_TITULO = 40;     // para títulos de atividades

// ===== APLICAR VALIDAÇÕES EM TODOS OS ELEMENTOS =====
function aplicarValidacoesTexto() {
    // 1. Aplicar resize: none em todos os textareas (impede arrastar)
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.style.resize = 'none';
        textarea.style.overflow = 'hidden';
        // Se não tiver maxlength definido, aplicar o limite padrão
        if (!textarea.hasAttribute('maxlength')) {
            textarea.setAttribute('maxlength', LIMITE_TEXTAREA);
        }
        // Adicionar contador de caracteres
        adicionarContador(textarea);
    });

    // 2. Aplicar limite de 40 caracteres em títulos de atividades
    document.querySelectorAll('input[id*="titulo"], input[id*="Titulo"]').forEach(input => {
        if (!input.hasAttribute('maxlength') && input.type === 'text') {
            input.setAttribute('maxlength', LIMITE_TITULO);
        }
    });

    // 3. Aplicar limite de 50 caracteres em inputs de texto simples
    document.querySelectorAll('input[type="text"]:not([id*="titulo"]):not([id*="Titulo"])').forEach(input => {
        if (!input.hasAttribute('maxlength')) {
            input.setAttribute('maxlength', LIMITE_INPUT);
        }
    });

    // 4. Impedir quebra de linha excessiva em textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.value = this.value.replace(/\n{3,}/g, '\n\n');
        });
    });

    // 5. Aplicar máscara de data (se houver campos date)
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) {
            input.value = new Date().toISOString().split('T')[0];
        }
    });
}

// ===== ADICIONAR CONTADOR DE CARACTERES =====
function adicionarContador(textarea) {
    // Se já tiver contador, não adicionar novamente
    if (textarea.nextElementSibling && textarea.nextElementSibling.classList.contains('char-counter')) {
        return;
    }

    const maxLength = parseInt(textarea.getAttribute('maxlength')) || LIMITE_TEXTAREA;
    const counter = document.createElement('small');
    counter.className = 'char-counter';
    counter.style.cssText = `
        display: block;
        text-align: right;
        font-size: 11px;
        color: #888;
        margin-top: 4px;
        font-family: 'Poppins', sans-serif;
        transition: color 0.3s;
    `;
    const currentLength = textarea.value.length;
    counter.textContent = `${currentLength}/${maxLength}`;

    // Inserir após o textarea
    textarea.insertAdjacentElement('afterend', counter);

    // Atualizar contador em tempo real
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        const max = parseInt(this.getAttribute('maxlength')) || LIMITE_TEXTAREA;
        counter.textContent = `${length}/${max}`;

        if (length > max) {
            this.value = this.value.substring(0, max);
            counter.textContent = `${max}/${max}`;
            counter.style.color = '#f44336';
        } else {
            counter.style.color = '#888';
            if (length > max * 0.85) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#888';
            }
        }
    });

    // Disparar uma vez para inicializar
    textarea.dispatchEvent(new Event('input'));
}

// ===== VALIDAR CAMPOS OBRIGATÓRIOS =====
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

// ===== LIMPAR ERROS =====
function limparErros(form) {
    const campos = form.querySelectorAll('[required]');
    campos.forEach(campo => {
        campo.style.borderColor = '';
        campo.style.backgroundColor = '';
    });
}

// ===== VALIDAÇÃO EM TEMPO REAL =====
function adicionarValidacaoTempoReal(input) {
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        }
    });
}

// ===== VALIDAR TÍTULO (limite 40 caracteres) =====
function validarTitulo(titulo) {
    if (!titulo || titulo.trim().length === 0) {
        return { valido: false, mensagem: 'O título é obrigatório!' };
    }
    if (titulo.length > 40) {
        return { valido: false, mensagem: 'O título deve ter no máximo 40 caracteres!' };
    }
    return { valido: true, mensagem: '' };
}

// ===== VALIDAR DATA DE ENTREGA =====
function validarDataEntrega(data) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataEntrega = new Date(data);
    const dataMaxima = new Date();
    dataMaxima.setMonth(dataMaxima.getMonth() + 3);
    
    if (isNaN(dataEntrega.getTime())) {
        return { valido: false, mensagem: 'Data inválida!' };
    }
    if (dataEntrega < hoje) {
        return { valido: false, mensagem: 'A data de entrega não pode ser anterior à data atual!' };
    }
    if (dataEntrega > dataMaxima) {
        return { valido: false, mensagem: 'A data de entrega não pode ser superior a 3 meses a partir de hoje!' };
    }
    return { valido: true, mensagem: '' };
}

// ===== OBSERVAR MUDANÇAS NO DOM (para novos elementos) =====
function observarNovosElementos() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                // Se for um textarea adicionado dinamicamente
                if (node.nodeName === 'TEXTAREA') {
                    node.style.resize = 'none';
                    node.style.overflow = 'hidden';
                    if (!node.hasAttribute('maxlength')) {
                        node.setAttribute('maxlength', LIMITE_TEXTAREA);
                    }
                    adicionarContador(node);
                    node.addEventListener('input', function() {
                        this.value = this.value.replace(/\n{3,}/g, '\n\n');
                    });
                }
                // Se for um input de texto adicionado dinamicamente
                if (node.nodeName === 'INPUT' && node.type === 'text') {
                    const isTitulo = node.id && (node.id.includes('titulo') || node.id.includes('Titulo'));
                    if (!node.hasAttribute('maxlength')) {
                        node.setAttribute('maxlength', isTitulo ? LIMITE_TITULO : LIMITE_INPUT);
                    }
                }
                // Se for um modal que abriu, aplicar validações nos campos internos
                if (node.classList && node.classList.contains('modal-overlay')) {
                    setTimeout(() => {
                        const textareas = node.querySelectorAll('textarea');
                        textareas.forEach(ta => {
                            ta.style.resize = 'none';
                            ta.style.overflow = 'hidden';
                            if (!ta.hasAttribute('maxlength')) {
                                ta.setAttribute('maxlength', LIMITE_TEXTAREA);
                            }
                            adicionarContador(ta);
                        });
                        const inputs = node.querySelectorAll('input[type="text"]');
                        inputs.forEach(inp => {
                            const isTitulo = inp.id && (inp.id.includes('titulo') || inp.id.includes('Titulo'));
                            if (!inp.hasAttribute('maxlength')) {
                                inp.setAttribute('maxlength', isTitulo ? LIMITE_TITULO : LIMITE_INPUT);
                            }
                        });
                    }, 50);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    aplicarValidacoesTexto();

    // Adicionar validação em tempo real para campos obrigatórios
    document.querySelectorAll('[required]').forEach(adicionarValidacaoTempoReal);

    // Observar novos elementos
    observarNovosElementos();

    console.log('✅ Sistema de validações inicializado com sucesso!');
});

// ===== EXPOR FUNÇÕES GLOBAIS =====
window.aplicarValidacoesTexto = aplicarValidacoesTexto;
window.validarCamposObrigatorios = validarCamposObrigatorios;
window.limparErros = limparErros;
window.validarTitulo = validarTitulo;
window.validarDataEntrega = validarDataEntrega;
window.adicionarContador = adicionarContador;