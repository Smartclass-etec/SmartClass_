// app.js - Sistema SmartClass ETEC

// Carregar sistema de notificações
if (!document.querySelector('script[src*="notifications.js"]')) {
    const script = document.createElement('script');
    script.src = '../js/notifications.js';
    document.head.appendChild(script);
}

// Substituir mostrarNotificacao pela nova versão
function mostrarNotificacao(mensagem, tipo = "success") {
    if (window.notificationSystem) {
        window.notificationSystem.show(mensagem, tipo);
    } else {
        // Fallback para quando o sistema não carregou
        console.log(`${tipo.toUpperCase()}: ${mensagem}`);
    }
}

// app.js - Sistema SmartClass ETEC
// Permite login sem cadastro prévio, apenas com email @cps.sp.gov.br

// ===== VARIÁVEIS GLOBAIS =====
let usuarioAtual = null;
let tipoUsuarioAtual = null;

// ===== INICIALIZAÇÃO DO SISTEMA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('SmartClass ETEC - Sistema inicializado');
    
    // Verificar se o usuário está logado (exceto nas páginas de login e selecao)
    const paginaAtual = window.location.pathname.split('/').pop();
    const paginasPublicas = ['selecao.html', 'login_aluno.html', 'login_professor.html'];
    
    if (!paginasPublicas.includes(paginaAtual)) {
        verificarSessao();
    }
    
    // Inicializar configurações
    inicializarConfiguracoes();
});

// ===== VERIFICAÇÃO DE SESSÃO =====
function verificarSessao() {
    const user = localStorage.getItem("loggedUser");
    const tipo = localStorage.getItem("tipoUsuario");
    
    if (!user) {
        // Redirecionar para a página de seleção
        window.location.href = "selecao.html";
        return false;
    }
    
    usuarioAtual = JSON.parse(user);
    tipoUsuarioAtual = tipo;
    return true;
}

// ===== FUNÇÃO DE LOGIN (GENÉRICA) =====
function realizarLogin(email, senha, tipo, redirectUrl) {
    // Validar email institucional @cps.sp.gov.br
    if (!email.endsWith("@cps.sp.gov.br")) {
        mostrarNotificacao("Use um e-mail institucional @cps.sp.gov.br", "error");
        return false;
    }
    
    if (!senha || senha.trim() === "") {
        mostrarNotificacao("Digite sua senha", "error");
        return false;
    }
    
    // Extrair nome do email (parte antes do @)
    let nome = email.split('@')[0];
    // Formatar nome (primeira letra maiúscula, substituir pontos e underline por espaço)
    nome = nome.replace(/[._]/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    if (!nome || nome.trim() === "") {
        nome = tipo === "aluno" ? "Aluno" : "Professor";
    }
    
    // Criar objeto do usuário
    const user = {
        name: nome,
        email: email,
        password: senha,
        tipo: tipo,
        loginTemporario: true,
        dataLogin: new Date().toISOString()
    };
    
    // Salvar na sessão
    localStorage.setItem("loggedUser", JSON.stringify(user));
    localStorage.setItem("tipoUsuario", tipo);
    
    // Se for aluno, criar dados do pet e adicionar à turma
    if (tipo === "aluno") {
        inicializarDadosAluno(email, nome);
    }
    
    // Se for professor, inicializar dados
    if (tipo === "professor") {
        inicializarDadosProfessor(email, nome);
    }
    
    mostrarNotificacao(`Bem-vindo, ${nome}!`, "success");
    
    // Redirecionar
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1500);
    
    return true;
}

// ===== INICIALIZAR DADOS DO ALUNO =====
function inicializarDadosAluno(email, nome) {
    // Criar dados do pet
    const petKey = `pet_${email}`;
    if (!localStorage.getItem(petKey)) {
        const petData = {
            streak: 0,
            totalPoints: 0,
            lastAttendanceDate: null,
            level: 0,
            currentSkin: "dog",
            currentHat: "none",
            currentAccessory: "none",
            ownedItems: ["dog"],
            petName: "Spark",
            lastAlimentou: null,
            lastBrincou: null
        };
        localStorage.setItem(petKey, JSON.stringify(petData));
    }
    
    // Adicionar aluno à turma (1º Ano EM - Turma A como padrão)
    const chaveAlunos = `alunos_turma_1anoEM_1A`;
    const alunosExistentes = JSON.parse(localStorage.getItem(chaveAlunos) || '[]');
    
    if (!alunosExistentes.some(a => a.email === email)) {
        alunosExistentes.push({
            nome: nome,
            email: email,
            dataCadastro: new Date().toISOString(),
            serie: "1anoEM",
            turma: "1A"
        });
        localStorage.setItem(chaveAlunos, JSON.stringify(alunosExistentes));
        console.log(`✅ Aluno ${nome} adicionado à turma 1º Ano EM - A`);
    }
}

// ===== INICIALIZAR DADOS DO PROFESSOR =====
function inicializarDadosProfessor(email, nome) {
    // Para professor, apenas registrar no log
    console.log(`✅ Professor ${nome} logado com sucesso`);
}

// ===== FUNÇÃO DE LOGOUT =====
function logout() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("tipoUsuario");
    mostrarNotificacao("Logout realizado com sucesso!", "success");
    setTimeout(() => {
        window.location.href = "selecao.html";
    }, 1000);
}

// ===== NOTIFICAÇÕES =====
function mostrarNotificacao(mensagem, tipo = "success") {
    // Verificar se já existe uma notificação
    const notificacaoExistente = document.querySelector('.custom-notification');
    if (notificacaoExistente) {
        notificacaoExistente.remove();
    }
    
    const notif = document.createElement('div');
    notif.className = `custom-notification ${tipo}`;
    
    let icone = "fa-check-circle";
    if (tipo === "error") icone = "fa-exclamation-circle";
    if (tipo === "warning") icone = "fa-exclamation-triangle";
    if (tipo === "info") icone = "fa-info-circle";
    
    notif.innerHTML = `<i class="fas ${icone}"></i><span>${mensagem}</span>`;
    
    // Estilos da notificação
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: -300px;
        padding: 14px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transition: right 0.3s ease;
        font-size: 13px;
        font-weight: 500;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        background: ${tipo === 'success' ? '#00796b' : tipo === 'error' ? '#f44336' : '#f39c12'};
        color: white;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.right = '20px';
    }, 10);
    
    setTimeout(() => {
        notif.style.right = '-300px';
        setTimeout(() => {
            if (notif.parentNode) notif.remove();
        }, 300);
    }, 3000);
}

// ===== INICIALIZAR CONFIGURAÇÕES DO SISTEMA =====
function inicializarConfiguracoes() {
    // Verificar e aplicar modo escuro
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        document.body.classList.add("dark-mode");
    }
    
    // Configurar matérias padrão se não existirem
    configurarMateriasPadrao();
    
    // Configurar atividades padrão se não existirem
    configurarAtividadesPadrao();
}

// ===== CONFIGURAR MATÉRIAS PADRÃO =====
function configurarMateriasPadrao() {
    const materiasKey = "materias_sistema";
    if (!localStorage.getItem(materiasKey)) {
        const materias = {
            DS: {
                nome: "Desenvolvimento de Sistemas",
                modulos: [
                    { nome: "1º Módulo", codigo: "DS1", materias: ["PW1", "PA", "BD1", "ECO", "IPSS"] },
                    { nome: "2º Módulo", codigo: "DS2", materias: ["PW2", "BD2", "PAM1", "QTS", "SI"] },
                    { nome: "3º Módulo", codigo: "DS3", materias: ["PW3", "PAM2", "PTCC", "DSE"] }
                ]
            },
            TI: {
                nome: "Técnico em Informática",
                modulos: [
                    { nome: "1º Módulo", codigo: "TI1", materias: ["OCA1", "LTT", "IMC", "PC1", "GSO1"] },
                    { nome: "2º Módulo", codigo: "TI2", materias: ["MBD", "SU", "STIC", "SBD", "RCD1"] },
                    { nome: "3º Módulo", codigo: "TI3", materias: ["PC2", "SD", "DTCC", "CNM"] },
                    { nome: "4º Módulo", codigo: "TI4", materias: ["ECO", "IoT", "RCD2", "GSO2"] },
                    { nome: "5º Módulo", codigo: "TI5", materias: ["GSO3", "PTCC"] }
                ]
            }
        };
        localStorage.setItem(materiasKey, JSON.stringify(materias));
    }
}

// ===== CONFIGURAR ATIVIDADES PADRÃO =====
function configurarAtividadesPadrao() {
    const atividadesKey = "atividades_professor";
    if (!localStorage.getItem(atividadesKey)) {
        const atividades = [];
        localStorage.setItem(atividadesKey, JSON.stringify(atividades));
    }
}

// ===== FUNÇÕES PARA O PET (ALUNO) =====
function getPetData(email) {
    const petKey = `pet_${email}`;
    const petData = localStorage.getItem(petKey);
    return petData ? JSON.parse(petData) : null;
}

function savePetData(email, petData) {
    const petKey = `pet_${email}`;
    localStorage.setItem(petKey, JSON.stringify(petData));
}

function adicionarPontos(email, pontos, motivo) {
    const petData = getPetData(email);
    if (petData) {
        petData.totalPoints = (petData.totalPoints || 0) + pontos;
        
        // Calcular nível baseado nos pontos
        const novoNivel = Math.floor(petData.totalPoints / 100);
        if (novoNivel > petData.level) {
            petData.level = novoNivel;
            mostrarNotificacao(`🎉 PARABÉNS! Seu pet subiu para o nível ${novoNivel + 1}!`, "success");
        }
        
        savePetData(email, petData);
        return true;
    }
    return false;
}

// ===== FUNÇÕES PARA ATIVIDADES =====
function getAtividades() {
    return JSON.parse(localStorage.getItem("atividades_professor") || "[]");
}

function saveAtividades(atividades) {
    localStorage.setItem("atividades_professor", JSON.stringify(atividades));
}

function getAtividadesPorTurma(turma) {
    const atividades = getAtividades();
    return atividades.filter(a => a.turmaDestino === turma);
}

// ===== FUNÇÕES PARA TURMAS =====
function getAlunosDaTurma(serie, turma) {
    const chave = `alunos_turma_${serie}_${turma}`;
    return JSON.parse(localStorage.getItem(chave) || "[]");
}

function getAlunosPorEmail(email) {
    // Buscar em todas as turmas
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('alunos_turma_')) {
            const alunos = JSON.parse(localStorage.getItem(key) || "[]");
            const aluno = alunos.find(a => a.email === email);
            if (aluno) return aluno;
        }
    }
    return null;
}

// ===== FUNÇÕES PARA REGISTRO DE PRESENÇA =====
function getRegistrosPresenca(email) {
    const key = `absences_${email}`;
    return JSON.parse(localStorage.getItem(key) || "{}");
}

function saveRegistroPresenca(email, data, status, observacao = "") {
    const registros = getRegistrosPresenca(email);
    
    if (status === "presente") {
        delete registros[data];
    } else if (status === "falta") {
        registros[data] = { date: data, note: observacao || "Falta registrada", registeredAt: new Date().toISOString() };
    }
    
    localStorage.setItem(`absences_${email}`, JSON.stringify(registros));
}

// ===== FUNÇÕES PARA ALOCAÇÃO DE DISCIPLINAS =====
function getAlocacoes() {
    return JSON.parse(localStorage.getItem("alocacoes_professores") || "[]");
}

function saveAlocacoes(alocacoes) {
    localStorage.setItem("alocacoes_professores", JSON.stringify(alocacoes));
}

function getFilaEspera() {
    return JSON.parse(localStorage.getItem("fila_espera_disciplinas") || "[]");
}

function saveFilaEspera(fila) {
    localStorage.setItem("fila_espera_disciplinas", JSON.stringify(fila));
}

// ===== FUNÇÃO PARA SAIR (usada pelos botões) =====
function sairDoSistema() {
    logout();
}

// ===== EXPOR FUNÇÕES GLOBAIS =====
window.realizarLogin = realizarLogin;
window.logout = logout;
window.mostrarNotificacao = mostrarNotificacao;
window.sairDoSistema = sairDoSistema;
window.getPetData = getPetData;
window.savePetData = savePetData;
window.adicionarPontos = adicionarPontos;
window.getAtividades = getAtividades;
window.getAlunosDaTurma = getAlunosDaTurma;
window.getRegistrosPresenca = getRegistrosPresenca;
window.getAlocacoes = getAlocacoes;
window.getFilaEspera = getFilaEspera;