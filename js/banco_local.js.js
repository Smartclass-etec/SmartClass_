// js/banco_local.js
// Banco de dados local - uma turma por módulo

// =============================================
// LISTA DE TURMAS (UMA POR MÓDULO)
// =============================================
const TURMAS = {
    "TI1": "1TI",
    "TI2": "2TI",
    "TI3": "3TI"
};

// =============================================
// GERADOR DE NOMES ALEATÓRIOS
// =============================================
const NOMES = [
    'João', 'Maria', 'José', 'Ana', 'Pedro', 'Paula', 'Carlos', 'Mariana',
    'Lucas', 'Julia', 'Rafael', 'Beatriz', 'Felipe', 'Camila', 'Gabriel', 'Amanda',
    'Bruno', 'Larissa', 'Daniel', 'Isabela', 'Matheus', 'Gabriela', 'Leonardo', 'Carolina',
    'Rodrigo', 'Tatiane', 'Thiago', 'Letícia', 'Gustavo', 'Vanessa', 'Eduardo', 'Aline',
    'Henrique', 'Lívia', 'Fábio', 'Michele', 'Diego', 'Renata', 'Alex', 'Sabrina',
    'Anderson', 'Raquel', 'Marcelo', 'Patrícia', 'Ricardo', 'Juliana', 'Vinicius', 'Gisele',
    'Nicolas', 'Bruna', 'Jorge', 'Ariane', 'Igor', 'Flávia', 'César', 'Elaine',
    'Rafaela', 'Paulo', 'Evelyn', 'Fernando', 'Yasmin', 'Cristiano', 'Lais', 'Wesley',
    'Augusto', 'Manuela', 'Murilo', 'Natália', 'Cauã', 'Sofia', 'Arthur', 'Malu',
    'Davi', 'Helena', 'Bernardo', 'Alice', 'Heitor', 'Laura', 'Enzo', 'Valentina',
    'Miguel', 'Olivia', 'Theo', 'Clara', 'Francisco', 'Antônia', 'Bento', 'Cecília',
    'Luiz', 'Eduarda', 'Otávio', 'Vitória', 'Noah', 'Giovanna', 'Isaac', 'Maya',
    'Bryan', 'Luna', 'Pedro Henrique', 'Isis'
];

const SOBRENOMES = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Costa',
    'Pereira', 'Martins', 'Carvalho', 'Lima', 'Gomes', 'Araújo', 'Barbosa', 'Rocha',
    'Castro', 'Nunes', 'Mendes', 'Vieira', 'Monteiro', 'Cardoso', 'Correia', 'Teixeira',
    'Reis', 'Melo', 'Dias', 'Nascimento', 'Ramos', 'Santana', 'Sousa', 'Nogueira'
];

function gerarNomeAleatorio() {
    const nome = NOMES[Math.floor(Math.random() * NOMES.length)];
    const sobrenome = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
    return `${nome} ${sobrenome}`;
}

function gerarEmail(nomeCompleto, tipo) {
    const partes = nomeCompleto.toLowerCase().split(' ');
    const primeiro = partes[0];
    const ultimo = partes[partes.length - 1];
    const base = `${primeiro}.${ultimo}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const sufixo = Math.floor(Math.random() * 1000);
    return `${base}${sufixo}@${tipo}.cps.sp.gov.br`;
}

function gerarApelido(nome) {
    const apelidos = ['zinho', 'zinha', 'ão', 'ona', 'ito', 'ita', 'eco', 'eca'];
    const apelido = apelidos[Math.floor(Math.random() * apelidos.length)];
    return nome.split(' ')[0] + apelido;
}

// =============================================
// GERAR USUÁRIOS
// =============================================
function gerarUsuarios() {
    const usuarios = [];

    // --- Professores (20) ---
    const especialidades = [
        'Programação', 'Banco de Dados', 'Redes', 'Sistemas Operacionais',
        'Segurança Digital', 'Matemática', 'Inglês', 'Física', 'Química',
        'Ética e Cidadania', 'Desenvolvimento Web', 'Mobile', 'Cloud Computing',
        'Inteligência Artificial', 'Gestão de Projetos', 'Empreendedorismo',
        'Design Thinking', 'Robótica', 'Arquitetura de Software', 'UX/UI'
    ];
    for (let i = 0; i < 20; i++) {
        const nome = gerarNomeAleatorio();
        const email = gerarEmail(nome, 'professor');
        usuarios.push({
            email: email,
            senha: '123456',
            nome: nome,
            tipo: 'professor',
            especialidade: especialidades[i % especialidades.length]
        });
    }

    // --- Alunos (100) ---
    const modulos = ['TI1', 'TI2', 'TI3'];
    for (let i = 0; i < 100; i++) {
        const nome = gerarNomeAleatorio();
        const email = gerarEmail(nome, 'aluno');
        const modulo = modulos[i % modulos.length];
        usuarios.push({
            email: email,
            senha: '123456',
            nome: nome,
            tipo: 'aluno',
            serie: modulo,
            turma: TURMAS[modulo],
            apelido: gerarApelido(nome)
        });
    }

    // --- Admin ---
    usuarios.push({
        email: 'admin@cps.sp.gov.br',
        senha: '123456',
        nome: 'Administrador',
        tipo: 'admin',
        especialidade: 'Gestão'
    });

    return usuarios;
}

// =============================================
// POPULAR BANCO DE DADOS LOCAL
// =============================================
function popularBancoLocal() {
    if (localStorage.getItem('banco_populado') === 'true') {
        console.log('📌 Banco local já populado.');
        return;
    }

    console.log('🚀 Populando banco local...');

    const USUARIOS = gerarUsuarios();
    localStorage.setItem('usuarios_pre', JSON.stringify(USUARIOS));
    USUARIOS.forEach(u => {
        localStorage.setItem(`usuario_${u.email}`, JSON.stringify(u));
    });

    // Popular turmas (uma por módulo)
    for (const modulo in TURMAS) {
        const turma = TURMAS[modulo];
        const alunos = USUARIOS.filter(u => u.tipo === 'aluno' && u.serie === modulo);
        localStorage.setItem(`alunos_turma_${modulo}_${turma}`, JSON.stringify(alunos));
        const profs = USUARIOS.filter(u => u.tipo === 'professor');
        localStorage.setItem(`professores_turma_${modulo}_${turma}`, JSON.stringify(profs.map(p => ({ nome: p.nome, email: p.email }))));
    }

    // Inicializar outras estruturas
    if (!localStorage.getItem('atividades_professor')) localStorage.setItem('atividades_professor', '[]');
    if (!localStorage.getItem('alocacoes_professores')) localStorage.setItem('alocacoes_professores', '[]');
    if (!localStorage.getItem('fila_espera_disciplinas')) localStorage.setItem('fila_espera_disciplinas', '[]');

    // Atividades de exemplo
    const atividadesExemplo = [
        {
            id: 'atv1',
            titulo: 'Lista de Exercícios 1 - JavaScript',
            descricao: 'Resolva os 10 exercícios sobre variáveis e funções.',
            materia: 'PC1',
            materiaNome: 'Programação de Computadores I',
            dataEntrega: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            pontuacao: 10,
            status: 'aberta',
            turmaDestino: '1TI',
            entregas: []
        },
        {
            id: 'atv2',
            titulo: 'Trabalho Prático - Banco de Dados',
            descricao: 'Crie um modelo de banco de dados para uma biblioteca.',
            materia: 'MBD',
            materiaNome: 'Modelagem de Banco de Dados',
            dataEntrega: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            pontuacao: 20,
            status: 'aberta',
            turmaDestino: '2TI',
            entregas: []
        }
    ];
    localStorage.setItem('atividades_professor', JSON.stringify(atividadesExemplo));

    // Registros de presença aleatórios
    const alunos = USUARIOS.filter(u => u.tipo === 'aluno');
    alunos.forEach(aluno => {
        const key = `absences_${aluno.email}`;
        if (!localStorage.getItem(key)) {
            const faltas = {};
            const hoje = new Date();
            for (let i = 1; i <= 10; i++) {
                const data = new Date(hoje);
                data.setDate(data.getDate() - i * 2);
                const dataStr = data.toISOString().split('T')[0];
                if (Math.random() > 0.6) {
                    faltas[dataStr] = { date: dataStr, note: 'Falta registrada', registeredAt: new Date().toISOString() };
                }
            }
            localStorage.setItem(key, JSON.stringify(faltas));
        }
    });

    // Pets
    alunos.forEach(aluno => {
        const petKey = `pet_${aluno.email}`;
        if (!localStorage.getItem(petKey)) {
            localStorage.setItem(petKey, JSON.stringify({
                streak: Math.floor(Math.random() * 15),
                totalPoints: Math.floor(Math.random() * 300),
                lastAttendanceDate: new Date().toISOString().split('T')[0],
                level: Math.floor(Math.random() * 5),
                currentSkin: ['dog','cat','fox','dragon','fish','bird','owl','horse','panda','penguin','rabbit','monkey','bear','unicorn','dino'][Math.floor(Math.random() * 15)],
                ownedItems: ['dog'],
                petName: aluno.nome.split(' ')[0] + (Math.random() > 0.5 ? 'zinho' : ''),
                lastAlimentou: new Date().toISOString().split('T')[0],
                lastBrincou: new Date().toISOString().split('T')[0]
            }));
        }
    });

    localStorage.setItem('banco_populado', 'true');
    console.log(`✅ Banco local populado com ${USUARIOS.length} usuários.`);
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================
function buscarUsuario(email) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_pre') || '[]');
    return usuarios.find(u => u.email === email) || null;
}

function fazerLoginLocal(email, senha) {
    const usuario = buscarUsuario(email);
    if (!usuario) return { success: false, error: 'Usuário não encontrado' };
    if (usuario.senha !== senha) return { success: false, error: 'Senha incorreta' };
    const { senha: _, ...usuarioLogado } = usuario;
    localStorage.setItem('loggedUser', JSON.stringify(usuarioLogado));
    localStorage.setItem('tipoUsuario', usuario.tipo);
    return { success: true, user: usuarioLogado };
}

function getAlunosPorTurma(serie, turma) {
    const chave = `alunos_turma_${serie}_${turma}`;
    return JSON.parse(localStorage.getItem(chave) || '[]');
}

function getProfessoresPorTurma(serie, turma) {
    const chave = `professores_turma_${serie}_${turma}`;
    return JSON.parse(localStorage.getItem(chave) || '[]');
}

function getProfessores() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_pre') || '[]');
    return usuarios.filter(u => u.tipo === 'professor' || u.tipo === 'admin');
}

// ===== EXPORTAÇÃO =====
window.TURMAS = TURMAS;
window.buscarUsuario = buscarUsuario;
window.fazerLoginLocal = fazerLoginLocal;
window.getAlunosPorTurma = getAlunosPorTurma;
window.getProfessoresPorTurma = getProfessoresPorTurma;
window.getProfessores = getProfessores;
window.popularBancoLocal = popularBancoLocal;

popularBancoLocal();
console.log('✅ banco_local.js carregado.');