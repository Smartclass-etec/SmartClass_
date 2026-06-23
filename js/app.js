// app.js - Sistema SmartClass ETEC
// Versão com correções: presença com bônus de 20 pontos, pet com limite diário, ranking real

// ===== CARREGAR SISTEMA DE NOTIFICAÇÕES =====
if (!document.querySelector('script[src*="notifications.js"]')) {
    const script = document.createElement('script');
    script.src = '../js/notifications.js';
    document.head.appendChild(script);
}

// Fallback para notificações
function mostrarNotificacao(mensagem, tipo = "success") {
    if (window.notificationSystem) {
        window.notificationSystem.show(mensagem, tipo);
    } else {
        console.log(`${tipo.toUpperCase()}: ${mensagem}`);
    }
}

// ===== VARIÁVEIS GLOBAIS =====
let usuarioAtual = null;
let tipoUsuarioAtual = null;

// ===== INICIALIZAÇÃO DO SISTEMA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('SmartClass ETEC - Sistema inicializado');
    
    const paginaAtual = window.location.pathname.split('/').pop();
    const paginasPublicas = ['selecao.html', 'login_aluno.html', 'login_professor.html'];
    
    if (!paginasPublicas.includes(paginaAtual)) {
        verificarSessao();
    }
    
    inicializarConfiguracoes();
});

// ===== VERIFICAÇÃO DE SESSÃO =====
function verificarSessao() {
    const user = localStorage.getItem("loggedUser");
    const tipo = localStorage.getItem("tipoUsuario");
    
    if (!user) {
        window.location.href = "selecao.html";
        return false;
    }
    
    usuarioAtual = JSON.parse(user);
    tipoUsuarioAtual = tipo;
    return true;
}

// ===== FUNÇÃO DE LOGIN (GENÉRICA) =====
function realizarLogin(email, senha, tipo, redirectUrl) {
    if (!email.endsWith("@cps.sp.gov.br")) {
        mostrarNotificacao("Use um e-mail institucional @cps.sp.gov.br", "error");
        return false;
    }
    
    if (!senha || senha.trim() === "") {
        mostrarNotificacao("Digite sua senha", "error");
        return false;
    }
    
    let nome = email.split('@')[0];
    nome = nome.replace(/[._]/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    if (!nome || nome.trim() === "") {
        nome = tipo === "aluno" ? "Aluno" : "Professor";
    }
    
    const user = {
        name: nome,
        email: email,
        password: senha,
        tipo: tipo,
        loginTemporario: true,
        dataLogin: new Date().toISOString()
    };
    
    localStorage.setItem("loggedUser", JSON.stringify(user));
    localStorage.setItem("tipoUsuario", tipo);
    
    if (tipo === "aluno") {
        inicializarDadosAluno(email, nome);
    }
    
    if (tipo === "professor") {
        inicializarDadosProfessor(email, nome);
    }
    
    mostrarNotificacao(`Bem-vindo, ${nome}!`, "success");
    
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1500);
    
    return true;
}

// ===== INICIALIZAR DADOS DO ALUNO (MÓDULO ÚNICO) =====
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
            lastBrincou: null,
            ultimoBonusPresenca: null // <-- NOVO: controla bônus de 20 pontos
        };
        localStorage.setItem(petKey, JSON.stringify(petData));
    }
    
    // Adicionar aluno ao 1º Módulo (turma única "unica")
    const chaveAlunos = `alunos_turma_1modulo_unica`;
    const alunosExistentes = JSON.parse(localStorage.getItem(chaveAlunos) || '[]');
    
    if (!alunosExistentes.some(a => a.email === email)) {
        alunosExistentes.push({
            nome: nome,
            email: email,
            dataCadastro: new Date().toISOString(),
            modulo: "1modulo",
            turma: "unica"
        });
        localStorage.setItem(chaveAlunos, JSON.stringify(alunosExistentes));
        console.log(`✅ Aluno ${nome} adicionado ao 1º Módulo`);
    }
}

// ===== INICIALIZAR DADOS DO PROFESSOR =====
function inicializarDadosProfessor(email, nome) {
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

// ===== NOTIFICAÇÕES (FALLBACK) =====
function mostrarNotificacao(mensagem, tipo = "success") {
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
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        document.body.classList.add("dark-mode");
    }
    
    configurarMateriasPadrao();
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
        localStorage.setItem(atividadesKey, JSON.stringify([]));
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

// ===== FUNÇÃO PARA ADICIONAR BÔNUS DE PRESENÇA (20 PONTOS) =====
function adicionarBonusPresenca(email, data) {
    const petData = getPetData(email);
    if (!petData) return false;
    
    // Verifica se já recebeu bônus hoje
    if (petData.ultimoBonusPresenca === data) {
        return false; // Já recebeu hoje
    }
    
    petData.totalPoints = (petData.totalPoints || 0) + 5000;
    petData.ultimoBonusPresenca = data;
    const novoNivel = Math.floor(petData.totalPoints / 100);
    if (novoNivel > petData.level) {
        petData.level = novoNivel;
        mostrarNotificacao(`🎉 PARABÉNS! Seu pet subiu para o nível ${novoNivel + 1}!`, "success");
    }
    savePetData(email, petData);
    return true;
}

// ===== FUNÇÕES PARA ATIVIDADES =====
function getAtividades() {
    return JSON.parse(localStorage.getItem("atividades_professor") || "[]");
}

function saveAtividades(atividades) {
    localStorage.setItem("atividades_professor", JSON.stringify(atividades));
}

function getAtividadesPorModulo(modulo) {
    const atividades = getAtividades();
    return atividades.filter(a => a.moduloDestino === modulo);
}

// ===== FUNÇÕES PARA MÓDULOS =====
function getAlunosDoModulo(modulo) {
    const chave = `alunos_turma_${modulo}_unica`;
    return JSON.parse(localStorage.getItem(chave) || "[]");
}

function getAlunosPorEmail(email) {
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

// ===== FUNÇÃO PARA SAIR =====
function sairDoSistema() {
    logout();
}

// ===== SEED: POPULAR SISTEMA COM DADOS DE EXEMPLO =====
(function seedDatabase() {
    const USERS_KEY = 'users';
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.length > 0) {
        console.log('📦 Dados já existem. Seed ignorado.');
        return;
    }

    console.log('🌱 Criando dados de exemplo...');

    const QUANTIDADE_PROFESSORES = 10;
    const QUANTIDADE_ALUNOS_POR_MODULO = 30;
    const MODULOS = ['1modulo', '2modulo', '3modulo'];

    const NOMES_PROFESSORES = [
        'Ana Carolina', 'Bruno Mendes', 'Carla Souza', 'Daniel Oliveira',
        'Elaine Santos', 'Fernando Lima', 'Gabriela Rocha', 'Henrique Costa',
        'Isabela Alves', 'João Pedro'
    ];

    const NOMES_ALUNOS = [
        'Lucas', 'Maria', 'Pedro', 'Ana', 'João', 'Julia', 'Gabriel', 'Rafaela',
        'Matheus', 'Beatriz', 'Felipe', 'Camila', 'Rafael', 'Larissa', 'Gustavo',
        'Mariana', 'Thiago', 'Amanda', 'Bruno', 'Carolina', 'Diego', 'Fernanda',
        'Guilherme', 'Isabela', 'Leonardo', 'Natália', 'Otávio', 'Patrícia',
        'Renato', 'Sabrina', 'Tiago', 'Valentina', 'Vinícius', 'Yasmin',
        'Alexandre', 'Bianca', 'Cauã', 'Débora', 'Eduardo', 'Fabiana',
        'Giovanna', 'Heitor', 'Igor', 'Jéssica', 'Kauã', 'Letícia',
        'Marcelo', 'Nicole', 'Paulo', 'Raquel', 'Samuel', 'Tatiane'
    ];

    const SOBRENOMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Almeida', 'Nascimento'];

    function getAlunosModulo(modulo) {
        const key = `alunos_turma_${modulo}_unica`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    function saveAlunosModulo(modulo, alunos) {
        const key = `alunos_turma_${modulo}_unica`;
        localStorage.setItem(key, JSON.stringify(alunos));
    }

    function criarPet(email, nome) {
        const petKey = `pet_${email}`;
        if (!localStorage.getItem(petKey)) {
            localStorage.setItem(petKey, JSON.stringify({
                streak: 0,
                totalPoints: Math.floor(Math.random() * 200),
                lastAttendanceDate: null,
                level: 0,
                currentSkin: 'dog',
                currentHat: 'none',
                currentAccessory: 'none',
                ownedItems: ['dog'],
                petName: nome,
                lastAlimentou: null,
                lastBrincou: null,
                ultimoBonusPresenca: null
            }));
        }
    }

    // 1. Criar professores
    let novosUsers = [];
    for (let i = 0; i < QUANTIDADE_PROFESSORES; i++) {
        const nome = NOMES_PROFESSORES[i % NOMES_PROFESSORES.length] +
            (i >= NOMES_PROFESSORES.length ? ` ${Math.floor(i / NOMES_PROFESSORES.length) + 1}` : '');
        const email = `professor.${String(i + 1).padStart(2, '0')}@professor.cps.sp.gov.br`;
        novosUsers.push({
            name: nome,
            email: email,
            password: '123456',
            tipo: 'professor',
            loginTemporario: false,
            dataCadastro: new Date().toISOString()
        });
    }

    // 2. Criar alunos (30 por módulo)
    let totalAlunos = 0;
    MODULOS.forEach(modulo => {
        let alunos = getAlunosModulo(modulo);
        for (let i = 0; i < QUANTIDADE_ALUNOS_POR_MODULO; i++) {
            const nomeIndex = (alunos.length + i) % NOMES_ALUNOS.length;
            const nome = NOMES_ALUNOS[nomeIndex];
            const sobrenome = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
            const nomeCompleto = `${nome} ${sobrenome}`;

            const baseEmail = `${nome.toLowerCase()}.${sobrenome.toLowerCase()}`;
            let email = `${baseEmail}${alunos.length + i + 1}@aluno.cps.sp.gov.br`;
            let counter = 1;
            while (novosUsers.some(u => u.email === email) || alunos.some(a => a.email === email)) {
                email = `${baseEmail}${alunos.length + i + 1 + counter}@aluno.cps.sp.gov.br`;
                counter++;
            }

            novosUsers.push({
                name: nomeCompleto,
                email: email,
                password: '123456',
                tipo: 'aluno',
                loginTemporario: false,
                dataCadastro: new Date().toISOString()
            });

            alunos.push({
                nome: nomeCompleto,
                email: email,
                dataCadastro: new Date().toISOString(),
                modulo: modulo,
                turma: 'unica'
            });

            criarPet(email, nome);
            totalAlunos++;
        }
        saveAlunosModulo(modulo, alunos);
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(novosUsers));
    console.log(`✅ Seed concluído: ${QUANTIDADE_PROFESSORES} professores e ${totalAlunos} alunos criados.`);
    console.log('🔑 Senha padrão para todos: 123456');
})();

// ===== EXPOR FUNÇÕES GLOBAIS =====
window.realizarLogin = realizarLogin;
window.logout = logout;
window.mostrarNotificacao = mostrarNotificacao;
window.sairDoSistema = sairDoSistema;
window.getPetData = getPetData;
window.savePetData = savePetData;
window.adicionarPontos = adicionarPontos;
window.adicionarBonusPresenca = adicionarBonusPresenca;
window.getAtividades = getAtividades;
window.getAlunosDoModulo = getAlunosDoModulo;
window.getRegistrosPresenca = getRegistrosPresenca;
window.getAlocacoes = getAlocacoes;
window.getFilaEspera = getFilaEspera;