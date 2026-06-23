// js/materias_sistema.js - Banco de dados completo de matérias por curso e módulo

const CURSOS = {
    DS: {
        nome: "Desenvolvimento de Sistemas",
        modulos: [
            { 
                nome: "1º Módulo", 
                codigo: "DS1", 
                materias: [
                    { sigla: "PW1", nome: "Programação Web I", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "PA", nome: "Projeto de Aprendizagem", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "BD1", nome: "Banco de Dados I", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "ECO", nome: "Ética e Cidadania Organizacional", cargaHoraria: 40, tipo: "Base Comum" },
                    { sigla: "IPSS", nome: "Internet, Protocolos e Segurança de Sistemas", cargaHoraria: 40, tipo: "Técnica" }
                ]
            },
            { 
                nome: "2º Módulo", 
                codigo: "DS2", 
                materias: [
                    { sigla: "PW2", nome: "Programação Web II", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "BD2", nome: "Banco de Dados II", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "PAM1", nome: "Programação de Aplicativos Mobile I", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "QTS", nome: "Qualidade e Testes de Software", cargaHoraria: 40, tipo: "Técnica" },
                    { sigla: "SI", nome: "Sistemas de Informação", cargaHoraria: 40, tipo: "Base Comum" }
                ]
            },
            { 
                nome: "3º Módulo", 
                codigo: "DS3", 
                materias: [
                    { sigla: "PW3", nome: "Programação Web III", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "PAM2", nome: "Programação de Aplicativos Mobile II", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "PTCC", nome: "Planejamento do Trabalho de Conclusão de Curso", cargaHoraria: 40, tipo: "Técnica" },
                    { sigla: "DSE", nome: "Desenvolvimento de Sistemas Empresariais", cargaHoraria: 80, tipo: "Técnica" }
                ]
            }
        ]
    },
    TI: {
        nome: "Técnico em Informática",
        modulos: [
            { 
                nome: "1º Módulo", 
                codigo: "TI1", 
                materias: [
                    { sigla: "OCA1", nome: "Operação de Computadores e Aplicativos I", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "LTT", nome: "Linguagem, Trabalho e Tecnologia", cargaHoraria: 40, tipo: "Base Comum" },
                    { sigla: "IMC", nome: "Instalação e Manutenção de Computadores", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "PC1", nome: "Programação de Computadores I", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "GSO1", nome: "Gestão de Sistemas Operacionais I", cargaHoraria: 80, tipo: "Técnica" }
                ]
            },
            { 
                nome: "2º Módulo", 
                codigo: "TI2", 
                materias: [
                    { sigla: "MBD", nome: "Modelagem de Banco de Dados", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "SU", nome: "Segurança da Informação", cargaHoraria: 40, tipo: "Técnica" },
                    { sigla: "STIC", nome: "Sistemas de Tecnologia da Informação e Comunicação", cargaHoraria: 40, tipo: "Base Comum" },
                    { sigla: "SBD", nome: "Sistemas de Banco de Dados", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "RCD1", nome: "Redes de Comunicação de Dados I", cargaHoraria: 80, tipo: "Técnica" }
                ]
            },
            { 
                nome: "3º Módulo", 
                codigo: "TI3", 
                materias: [
                    { sigla: "PC2", nome: "Programação de Computadores II", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "SD", nome: "Sistemas Distribuídos", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "DTCC", nome: "Desenvolvimento do Trabalho de Conclusão de Curso", cargaHoraria: 40, tipo: "Técnica" },
                    { sigla: "CNM", nome: "Computação em Nuvem", cargaHoraria: 40, tipo: "Técnica" }
                ]
            },
            { 
                nome: "4º Módulo", 
                codigo: "TI4", 
                materias: [
                    { sigla: "ECO", nome: "Ética e Cidadania Organizacional", cargaHoraria: 40, tipo: "Base Comum" },
                    { sigla: "IoT", nome: "Internet das Coisas", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "RCD2", nome: "Redes de Comunicação de Dados II", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "GSO2", nome: "Gestão de Sistemas Operacionais II", cargaHoraria: 80, tipo: "Técnica" }
                ]
            },
            { 
                nome: "5º Módulo", 
                codigo: "TI5", 
                materias: [
                    { sigla: "GSO3", nome: "Gestão de Sistemas Operacionais III", cargaHoraria: 80, tipo: "Técnica" },
                    { sigla: "PTCC", nome: "Planejamento do Trabalho de Conclusão de Curso", cargaHoraria: 40, tipo: "Técnica" }
                ]
            }
        ]
    }
};

// ===== MAPA DE NOMES DE MATÉRIAS (para exibição) =====
const NOMES_MATERIAS = {};
Object.values(CURSOS).forEach(curso => {
    curso.modulos.forEach(modulo => {
        modulo.materias.forEach(materia => {
            NOMES_MATERIAS[materia.sigla] = materia.nome;
        });
    });
});

// ===== MAPA DE CORES POR MATÉRIA =====
const CORES_MATERIAS = {
    'PW1': '#e3f2fd', 'PW2': '#e3f2fd', 'PW3': '#e3f2fd',
    'PA': '#fce4ec', 'BD1': '#e8f5e9', 'BD2': '#e8f5e9',
    'PAM1': '#fff3e0', 'PAM2': '#fff3e0',
    'ECO': '#f3e5f5', 'IPSS': '#e0f2f1', 'QTS': '#ffebee',
    'SI': '#fce4ec', 'DSE': '#e8f5e9',
    'OCA1': '#e3f2fd', 'LTT': '#fce4ec', 'IMC': '#e8f5e9',
    'PC1': '#fff3e0', 'GSO1': '#e0f2f1', 'MBD': '#f3e5f5',
    'SU': '#e8f5e9', 'STIC': '#ffebee', 'SBD': '#e8f5e9',
    'RCD1': '#e0f2f1', 'PC2': '#fff3e0', 'SD': '#e8f5e9',
    'DTCC': '#f3e5f5', 'CNM': '#e0f2f1', 'IoT': '#e8f5e9',
    'RCD2': '#e0f2f1', 'GSO2': '#e0f2f1', 'GSO3': '#e0f2f1',
    'PTCC': '#f3e5f5', 'INGLES': '#fce4ec'
};

const CORES_TEXTOS_MATERIAS = {
    'PW1': '#1565c0', 'PW2': '#1565c0', 'PW3': '#1565c0',
    'PA': '#c62828', 'BD1': '#2e7d32', 'BD2': '#2e7d32',
    'PAM1': '#e65100', 'PAM2': '#e65100',
    'ECO': '#6a1b9a', 'IPSS': '#00695c', 'QTS': '#c62828',
    'SI': '#c62828', 'DSE': '#2e7d32',
    'OCA1': '#1565c0', 'LTT': '#c62828', 'IMC': '#2e7d32',
    'PC1': '#e65100', 'GSO1': '#00695c', 'MBD': '#6a1b9a',
    'SU': '#2e7d32', 'STIC': '#c62828', 'SBD': '#2e7d32',
    'RCD1': '#00695c', 'PC2': '#e65100', 'SD': '#2e7d32',
    'DTCC': '#6a1b9a', 'CNM': '#00695c', 'IoT': '#2e7d32',
    'RCD2': '#00695c', 'GSO2': '#00695c', 'GSO3': '#00695c',
    'PTCC': '#6a1b9a', 'INGLES': '#c62828'
};

// ===== HORÁRIOS DISPONÍVEIS =====
const HORARIOS = [
    { id: "SEG_MANHA", descricao: "Segunda-feira 08:00-10:00", dia: "Segunda", periodo: "Manhã", horaInicio: "08:00", horaFim: "10:00" },
    { id: "SEG_MANHA2", descricao: "Segunda-feira 10:00-12:00", dia: "Segunda", periodo: "Manhã", horaInicio: "10:00", horaFim: "12:00" },
    { id: "SEG_TARDE", descricao: "Segunda-feira 13:00-15:00", dia: "Segunda", periodo: "Tarde", horaInicio: "13:00", horaFim: "15:00" },
    { id: "SEG_TARDE2", descricao: "Segunda-feira 15:00-17:00", dia: "Segunda", periodo: "Tarde", horaInicio: "15:00", horaFim: "17:00" },
    { id: "SEG_NOITE", descricao: "Segunda-feira 19:00-21:00", dia: "Segunda", periodo: "Noite", horaInicio: "19:00", horaFim: "21:00" },
    { id: "TER_MANHA", descricao: "Terça-feira 08:00-10:00", dia: "Terça", periodo: "Manhã", horaInicio: "08:00", horaFim: "10:00" },
    { id: "TER_MANHA2", descricao: "Terça-feira 10:00-12:00", dia: "Terça", periodo: "Manhã", horaInicio: "10:00", horaFim: "12:00" },
    { id: "TER_TARDE", descricao: "Terça-feira 13:00-15:00", dia: "Terça", periodo: "Tarde", horaInicio: "13:00", horaFim: "15:00" },
    { id: "TER_TARDE2", descricao: "Terça-feira 15:00-17:00", dia: "Terça", periodo: "Tarde", horaInicio: "15:00", horaFim: "17:00" },
    { id: "TER_NOITE", descricao: "Terça-feira 19:00-21:00", dia: "Terça", periodo: "Noite", horaInicio: "19:00", horaFim: "21:00" },
    { id: "QUA_MANHA", descricao: "Quarta-feira 08:00-10:00", dia: "Quarta", periodo: "Manhã", horaInicio: "08:00", horaFim: "10:00" },
    { id: "QUA_MANHA2", descricao: "Quarta-feira 10:00-12:00", dia: "Quarta", periodo: "Manhã", horaInicio: "10:00", horaFim: "12:00" },
    { id: "QUA_TARDE", descricao: "Quarta-feira 13:00-15:00", dia: "Quarta", periodo: "Tarde", horaInicio: "13:00", horaFim: "15:00" },
    { id: "QUA_TARDE2", descricao: "Quarta-feira 15:00-17:00", dia: "Quarta", periodo: "Tarde", horaInicio: "15:00", horaFim: "17:00" },
    { id: "QUA_NOITE", descricao: "Quarta-feira 19:00-21:00", dia: "Quarta", periodo: "Noite", horaInicio: "19:00", horaFim: "21:00" },
    { id: "QUI_MANHA", descricao: "Quinta-feira 08:00-10:00", dia: "Quinta", periodo: "Manhã", horaInicio: "08:00", horaFim: "10:00" },
    { id: "QUI_MANHA2", descricao: "Quinta-feira 10:00-12:00", dia: "Quinta", periodo: "Manhã", horaInicio: "10:00", horaFim: "12:00" },
    { id: "QUI_TARDE", descricao: "Quinta-feira 13:00-15:00", dia: "Quinta", periodo: "Tarde", horaInicio: "13:00", horaFim: "15:00" },
    { id: "QUI_TARDE2", descricao: "Quinta-feira 15:00-17:00", dia: "Quinta", periodo: "Tarde", horaInicio: "15:00", horaFim: "17:00" },
    { id: "QUI_NOITE", descricao: "Quinta-feira 19:00-21:00", dia: "Quinta", periodo: "Noite", horaInicio: "19:00", horaFim: "21:00" },
    { id: "SEX_MANHA", descricao: "Sexta-feira 08:00-10:00", dia: "Sexta", periodo: "Manhã", horaInicio: "08:00", horaFim: "10:00" },
    { id: "SEX_MANHA2", descricao: "Sexta-feira 10:00-12:00", dia: "Sexta", periodo: "Manhã", horaInicio: "10:00", horaFim: "12:00" },
    { id: "SEX_TARDE", descricao: "Sexta-feira 13:00-15:00", dia: "Sexta", periodo: "Tarde", horaInicio: "13:00", horaFim: "15:00" },
    { id: "SEX_TARDE2", descricao: "Sexta-feira 15:00-17:00", dia: "Sexta", periodo: "Tarde", horaInicio: "15:00", horaFim: "17:00" },
    { id: "SEX_NOITE", descricao: "Sexta-feira 19:00-21:00", dia: "Sexta", periodo: "Noite", horaInicio: "19:00", horaFim: "21:00" }
];

// ===== FUNÇÕES AUXILIARES =====
function getMateriasPorCursoModulo(curso, modulo) {
    const cursoData = CURSOS[curso];
    if (!cursoData) return [];
    const moduloData = cursoData.modulos.find(m => m.codigo === modulo);
    return moduloData ? moduloData.materias : [];
}

function getMateriaBySigla(curso, modulo, sigla) {
    const materias = getMateriasPorCursoModulo(curso, modulo);
    return materias.find(m => m.sigla === sigla);
}

function getMateriaNome(sigla) {
    return NOMES_MATERIAS[sigla] || sigla;
}

function getMateriaCor(sigla) {
    return CORES_MATERIAS[sigla] || '#f5f5f5';
}

function getMateriaCorTexto(sigla) {
    return CORES_TEXTOS_MATERIAS[sigla] || '#616161';
}

function getModulosPorCurso(curso) {
    const cursoData = CURSOS[curso];
    return cursoData ? cursoData.modulos : [];
}

function getTodosProfessores() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.filter(u => u.tipo === "professor" || u.tipo === "admin");
}

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

function getAlocacoesPorProfessor(email) {
    const alocacoes = getAlocacoes();
    return alocacoes.filter(a => a.professorEmail === email);
}

function getAlocacoesPorDisciplina(sigla) {
    const alocacoes = getAlocacoes();
    return alocacoes.filter(a => a.materiaSigla === sigla);
}

// ===== EXPOR FUNÇÕES =====
window.CURSOS = CURSOS;
window.NOMES_MATERIAS = NOMES_MATERIAS;
window.CORES_MATERIAS = CORES_MATERIAS;
window.CORES_TEXTOS_MATERIAS = CORES_TEXTOS_MATERIAS;
window.HORARIOS = HORARIOS;
window.getMateriasPorCursoModulo = getMateriasPorCursoModulo;
window.getMateriaBySigla = getMateriaBySigla;
window.getMateriaNome = getMateriaNome;
window.getMateriaCor = getMateriaCor;
window.getMateriaCorTexto = getMateriaCorTexto;
window.getModulosPorCurso = getModulosPorCurso;
window.getTodosProfessores = getTodosProfessores;
window.getAlocacoes = getAlocacoes;
window.saveAlocacoes = saveAlocacoes;
window.getFilaEspera = getFilaEspera;
window.saveFilaEspera = saveFilaEspera;
window.getAlocacoesPorProfessor = getAlocacoesPorProfessor;
window.getAlocacoesPorDisciplina = getAlocacoesPorDisciplina;