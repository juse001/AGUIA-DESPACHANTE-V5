import { create } from 'zustand';
import { db } from '../db/database';
export const useProcessosStore = create((set, get) => ({
    processos: [],
    processosFiltroDados: {},
    carregando: false,
    erro: null,
    carregarProcessos: async () => {
        set({ carregando: true, erro: null });
        try {
            const processos = await db.processos.toArray();
            set({ processos });
        }
        catch (error) {
            set({ erro: 'Erro ao carregar processos' });
            console.error(error);
        }
        finally {
            set({ carregando: false });
        }
    },
    carregarProcessosPorPessoa: async (pessoaId) => {
        set({ carregando: true, erro: null });
        try {
            const processos = await db.processos.where('pessoaId').equals(pessoaId).toArray();
            set({ processos });
        }
        catch (error) {
            set({ erro: 'Erro ao carregar processos da pessoa' });
            console.error(error);
        }
        finally {
            set({ carregando: false });
        }
    },
    adicionarProcesso: async (processoData) => {
        try {
            const novoProcesso = {
                ...processoData,
                id: `processo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                documentos: [],
                dataCadastro: new Date(),
                dataAtualizacao: new Date(),
            };
            await db.processos.add(novoProcesso);
            set({ processos: [...get().processos, novoProcesso] });
            return novoProcesso;
        }
        catch (error) {
            set({ erro: 'Erro ao adicionar processo' });
            throw error;
        }
    },
    atualizarProcesso: async (id, atualizacoes) => {
        try {
            const dataAtualizacao = new Date();
            await db.processos.update(id, { ...atualizacoes, dataAtualizacao });
            set({
                processos: get().processos.map(p => p.id === id ? { ...p, ...atualizacoes, dataAtualizacao } : p),
            });
        }
        catch (error) {
            set({ erro: 'Erro ao atualizar processo' });
            throw error;
        }
    },
    atualizarStatusProcesso: async (id, novoStatus) => {
        await get().atualizarProcesso(id, { status: novoStatus });
    },
    deletarProcesso: async (id) => {
        try {
            await db.processos.delete(id);
            set({ processos: get().processos.filter(p => p.id !== id) });
        }
        catch (error) {
            set({ erro: 'Erro ao deletar processo' });
            throw error;
        }
    },
    buscarProcesso: async (id) => {
        try {
            return await db.processos.get(id);
        }
        catch (error) {
            set({ erro: 'Erro ao buscar processo' });
            throw error;
        }
    },
    filtrarProcessos: (filtro) => {
        set({ processosFiltroDados: filtro });
    },
    limparFiltros: () => {
        set({ processosFiltroDados: {} });
    },
}));
