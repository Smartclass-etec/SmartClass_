// js/supabase-client.js
// CONFIGURAÇÃO DO SUPABASE - SUBSTITUA PELOS SEUS DADOS!

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ===== COLE AQUI SUAS CREDENCIAIS DO SUPABASE =====
// Você encontra em: Project Settings → API
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co'
const SUPABASE_ANON_KEY = 'sua-chave-anon-publica-aqui'

// Criar cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

// Login com email e senha (via Supabase Auth)
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    
    if (error) {
        console.error('Erro no login:', error)
        return { success: false, error: error.message }
    }
    
    return { success: true, user: data.user }
}

// Login sem cadastro (cria usuário automaticamente)
export async function loginOrCreateUser(email, password, nome, tipo, curso = null, modulo = null) {
    try {
        // Tentar fazer login primeiro
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        
        if (!signInError) {
            // Usuário existe, fazer login
            return { success: true, user: signInData.user, isNew: false }
        }
        
        // Usuário não existe, criar novo
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nome: nome,
                    tipo: tipo,
                    curso: curso,
                    modulo: modulo
                }
            }
        })
        
        if (signUpError) {
            return { success: false, error: signUpError.message }
        }
        
        // Inserir dados na tabela usuarios
        const { error: insertError } = await supabase
            .from('usuarios')
            .insert({
                email: email,
                cpf: email.split('@')[0], // ou gerar CPF fictício
                nome: nome,
                tipo: tipo,
                curso: curso,
                modulo: modulo,
                senha_hash: password, // Em produção, usar hash!
                data_cadastro: new Date().toISOString()
            })
        
        if (insertError) {
            console.error('Erro ao inserir usuário:', insertError)
        }
        
        return { success: true, user: signUpData.user, isNew: true }
        
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Logout
export async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error('Erro no logout:', error)
        return false
    }
    return true
}

// Verificar sessão atual
export async function getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

// ===== FUNÇÕES DE USUÁRIOS =====

// Buscar dados do usuário logado
export async function getUserData(userId) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()
    
    if (error) {
        console.error('Erro ao buscar usuário:', error)
        return null
    }
    return data
}

// Buscar perfil completo (com professor ou aluno)
export async function getUserProfile(userId, tipo) {
    let query = supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()
    
    const { data: user, error } = await query
    
    if (error) return null
    
    if (tipo === 'professor') {
        const { data: professor } = await supabase
            .from('professores')
            .select('*')
            .eq('usuario_id', userId)
            .single()
        return { ...user, perfil: professor }
    } else if (tipo === 'aluno') {
        const { data: aluno } = await supabase
            .from('alunos')
            .select('*, turmas(*)')
            .eq('usuario_id', userId)
            .single()
        return { ...user, perfil: aluno }
    }
    
    return user
}

// Atualizar foto de perfil
export async function updateFotoPerfil(userId, fotoUrl) {
    const { error } = await supabase
        .from('usuarios')
        .update({ foto_perfil: fotoUrl, updated_at: new Date() })
        .eq('id', userId)
    
    return { success: !error, error }
}

// ===== FUNÇÕES DE ATIVIDADES =====

// Buscar atividades por turma
export async function getAtividadesByTurma(turmaId) {
    const { data, error } = await supabase
        .from('atividades')
        .select(`
            *,
            disciplinas(sigla, nome),
            professores:professor_id(usuario_id),
            entregas(*)
        `)
        .eq('turma_id', turmaId)
        .eq('status', 'aberta')
        .order('data_entrega', { ascending: true })
    
    if (error) {
        console.error('Erro ao buscar atividades:', error)
        return []
    }
    return data
}

// Buscar atividades do aluno
export async function getAtividadesByAluno(alunoId) {
    const { data, error } = await supabase
        .from('entregas')
        .select(`
            *,
            atividades(
                *,
                disciplinas(sigla, nome)
            )
        `)
        .eq('aluno_id', alunoId)
        .order('data_entrega', { ascending: false })
    
    if (error) {
        console.error('Erro ao buscar atividades do aluno:', error)
        return []
    }
    return data
}

// Entregar atividade
export async function entregarAtividade(atividadeId, alunoId, resposta) {
    // Verificar se já entregou
    const { data: existing } = await supabase
        .from('entregas')
        .select('id')
        .eq('atividade_id', atividadeId)
        .eq('aluno_id', alunoId)
        .single()
    
    if (existing) {
        // Atualizar entrega existente
        const { error } = await supabase
            .from('entregas')
            .update({
                resposta: resposta,
                status: 'entregue',
                data_entrega: new Date(),
                updated_at: new Date()
            })
            .eq('atividade_id', atividadeId)
            .eq('aluno_id', alunoId)
        
        return { success: !error, error }
    } else {
        // Criar nova entrega
        const { error } = await supabase
            .from('entregas')
            .insert({
                atividade_id: atividadeId,
                aluno_id: alunoId,
                resposta: resposta,
                status: 'entregue',
                data_entrega: new Date()
            })
        
        return { success: !error, error }
    }
}

// ===== FUNÇÕES DE PET =====

// Buscar pet do aluno
export async function getPetByAluno(alunoId) {
    const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('aluno_id', alunoId)
        .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
        console.error('Erro ao buscar pet:', error)
        return null
    }
    
    if (!data) {
        // Criar pet padrão
        const { data: newPet, error: createError } = await supabase
            .from('pets')
            .insert({
                aluno_id: alunoId,
                nome: 'Spark',
                skin: 'dog',
                pontos: 0,
                nivel: 0,
                streak: 0
            })
            .select()
            .single()
        
        if (createError) return null
        return newPet
    }
    
    return data
}

// Atualizar pet (pontos, alimentar, brincar)
export async function updatePet(alunoId, updates) {
    const { data, error } = await supabase
        .from('pets')
        .update({ ...updates, updated_at: new Date() })
        .eq('aluno_id', alunoId)
        .select()
        .single()
    
    return { success: !error, data, error }
}

// Adicionar pontos ao pet
export async function adicionarPontosPet(alunoId, pontos) {
    const pet = await getPetByAluno(alunoId)
    if (!pet) return false
    
    const novosPontos = (pet.pontos || 0) + pontos
    const novoNivel = Math.floor(novosPontos / 100)
    
    return await updatePet(alunoId, {
        pontos: novosPontos,
        nivel: novoNivel
    })
}

// ===== FUNÇÕES DE PRESENÇA =====

// Registrar presença
export async function registrarPresenca(alunoId, disciplinaId, data, status, justificativa = null) {
    const { error } = await supabase
        .from('presencas')
        .upsert({
            aluno_id: alunoId,
            disciplina_id: disciplinaId,
            data: data,
            status: status,
            justificativa: justificativa
        }, {
            onConflict: 'aluno_id,disciplina_id,data'
        })
    
    return { success: !error, error }
}

// Buscar presenças do aluno
export async function getPresencasByAluno(alunoId, disciplinaId = null) {
    let query = supabase
        .from('presencas')
        .select('*')
        .eq('aluno_id', alunoId)
    
    if (disciplinaId) {
        query = query.eq('disciplina_id', disciplinaId)
    }
    
    const { data, error } = await query.order('data', { ascending: false })
    
    if (error) return []
    return data
}

// ===== FUNÇÕES DE TURMAS =====

// Buscar alunos da turma
export async function getAlunosByTurma(turmaId) {
    const { data, error } = await supabase
        .from('alunos')
        .select('*, usuarios(*)')
        .eq('turma_id', turmaId)
    
    if (error) return []
    return data
}

// Buscar turmas do professor
export async function getTurmasByProfessor(professorId) {
    const { data, error } = await supabase
        .from('horarios')
        .select('turmas(*)')
        .eq('professor_id', professorId)
    
    if (error) return []
    
    // Remover duplicatas
    const turmasMap = new Map()
    data.forEach(item => {
        if (item.turmas && !turmasMap.has(item.turmas.id)) {
            turmasMap.set(item.turmas.id, item.turmas)
        }
    })
    
    return Array.from(turmasMap.values())
}

// ===== FUNÇÕES DE NOTIFICAÇÕES =====

// Buscar notificações do usuário
export async function getNotificacoes(usuarioId, apenasNaoLidas = false) {
    let query = supabase
        .from('notificacoes')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('data_envio', { ascending: false })
        .limit(20)
    
    if (apenasNaoLidas) {
        query = query.eq('lida', false)
    }
    
    const { data, error } = await query
    if (error) return []
    return data
}

// Marcar notificação como lida
export async function marcarNotificacaoLida(notificacaoId) {
    const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', notificacaoId)
    
    return { success: !error }
}

// Criar notificação
export async function criarNotificacao(usuarioId, titulo, mensagem, tipo = 'info') {
    const { error } = await supabase
        .from('notificacoes')
        .insert({
            usuario_id: usuarioId,
            titulo: titulo,
            mensagem: mensagem,
            tipo: tipo,
            data_envio: new Date()
        })
    
    return { success: !error }
}

// ===== FUNÇÕES DE DISCIPLINAS =====

// Buscar todas as disciplinas por curso e módulo
export async function getDisciplinasByCursoModulo(cursoId, moduloId) {
    const { data, error } = await supabase
        .from('disciplinas')
        .select('*')
        .eq('curso_id', cursoId)
        .eq('modulo_id', moduloId)
        .order('sigla', { ascending: true })
    
    if (error) return []
    return data
}

// Buscar horários das disciplinas
export async function getHorariosByTurma(turmaId) {
    const { data, error } = await supabase
        .from('horarios')
        .select('*, disciplinas(*), professores(usuario_id)')
        .eq('turma_id', turmaId)
        .order('dia_semana', { ascending: true })
        .order('hora_inicio', { ascending: true })
    
    if (error) return []
    return data
}