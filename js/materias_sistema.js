// js/materias_sistema.js - Banco de dados completo de matérias por curso e módulo

const CURSOS = {
    DS: {
        nome: "Desenvolvimento de Sistemas",
        modulos: [
            { nome: "1º Módulo", codigo: "DS1", materias: [
                { sigla: "PW1", nome: "Programação Web I", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "PA", nome: "Projeto de Aprendizagem", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "BD1", nome: "Banco de Dados I", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "ECO", nome: "Ética e Cidadania Organizacional", cargaHoraria: 40, tipo: "Base Comum" },
                { sigla: "IPSS", nome: "Internet, Protocolos e Segurança de Sistemas", cargaHoraria: 40, tipo: "Técnica" }
            ]},
            { nome: "2º Módulo", codigo: "DS2", materias: [
                { sigla: "PW2", nome: "Programação Web II", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "BD2", nome: "Banco de Dados II", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "PAM1", nome: "Programação de Aplicativos Mobile I", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "QTS", nome: "Qualidade e Testes de Software", cargaHoraria: 40, tipo: "Técnica" },
                { sigla: "SI", nome: "Sistemas de Informação", cargaHoraria: 40, tipo: "Base Comum" }
            ]},
            { nome: "3º Módulo", codigo: "DS3", materias: [
                { sigla: "PW3", nome: "Programação Web III", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "PAM2", nome: "Programação de Aplicativos Mobile II", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "PTCC", nome: "Planejamento do Trabalho de Conclusão de Curso", cargaHoraria: 40, tipo: "Técnica" },
                { sigla: "DSE", nome: "Desenvolvimento de Sistemas Empresariais", cargaHoraria: 80, tipo: "Técnica" }
            ]}
        ]
    },
    TI: {
        nome: "Técnico em Informática",
        modulos: [
            { nome: "1º Módulo", codigo: "TI1", materias: [
                { sigla: "OCA1", nome: "Operação de Computadores e Aplicativos I", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "LTT", nome: "Linguagem, Trabalho e Tecnologia", cargaHoraria: 40, tipo: "Base Comum" },
                { sigla: "IMC", nome: "Instalação e Manutenção de Computadores", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "PC1", nome: "Programação de Computadores I", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "GSO1", nome: "Gestão de Sistemas Operacionais I", cargaHoraria: 80, tipo: "Técnica" }
            ]},
            { nome: "2º Módulo", codigo: "TI2", materias: [
                { sigla: "MBD", nome: "Modelagem de Banco de Dados", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "SU", nome: "Segurança da Informação", cargaHoraria: 40, tipo: "Técnica" },
                { sigla: "STIC", nome: "Sistemas de Tecnologia da Informação e Comunicação", cargaHoraria: 40, tipo: "Base Comum" },
                { sigla: "SBD", nome: "Sistemas de Banco de Dados", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "RCD1", nome: "Redes de Comunicação de Dados I", cargaHoraria: 80, tipo: "Técnica" }
            ]},
            { nome: "3º Módulo", codigo: "TI3", materias: [
                { sigla: "PC2", nome: "Programação de Computadores II", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "SD", nome: "Sistemas Distribuídos", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "DTCC", nome: "Desenvolvimento do Trabalho de Conclusão de Curso", cargaHoraria: 40, tipo: "Técnica" },
                { sigla: "CNM", nome: "Computação em Nuvem", cargaHoraria: 40, tipo: "Técnica" }
            ]},
            { nome: "4º Módulo", codigo: "TI4", materias: [
                { sigla: "ECO", nome: "Ética e Cidadania Organizacional", cargaHoraria: 40, tipo: "Base Comum" },
                { sigla: "IoT", nome: "Internet das Coisas", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "RCD2", nome: "Redes de Comunicação de Dados II", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "GSO2", nome: "Gestão de Sistemas Operacionais II", cargaHoraria: 80, tipo: "Técnica" }
            ]},
            { nome: "5º Módulo", codigo: "TI5", materias: [
                { sigla: "GSO3", nome: "Gestão de Sistemas Operacionais III", cargaHoraria: 80, tipo: "Técnica" },
                { sigla: "PTCC", nome: "Planejamento do Trabalho de Conclusão de Curso", cargaHoraria: 40, tipo: "Técnica" }
            ]}
        ]
    }
};

// Horários disponíveis
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

// Funções auxiliares
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