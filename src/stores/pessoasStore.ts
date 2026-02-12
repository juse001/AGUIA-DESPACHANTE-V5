import { create } from 'zustand';
import { Pessoa } from '../types';
import { db } from '../db/database';

interface PessoasStore {
  pessoas: Pessoa[];
  carregando: boolean;
  erro: string | null;
  
  // Ações
  carregarPessoas: () => Promise<void>;
  adicionarPessoa: (pessoa: Omit<Pessoa, 'id' | 'dataCadastro' | 'dataAtualizacao'>) => Promise<Pessoa>;
  atualizarPessoa: (id: string, atualizacoes: Partial<Pessoa>) => Promise<void>;
  deletarPessoa: (id: string) => Promise<void>;
  buscarPessoa: (id: string) => Promise<Pessoa | undefined>;
  buscarPorCPF: (cpf: string) => Promise<Pessoa | undefined>;
}

export const usePessoasStore = create<PessoasStore>((set, get) => ({
  pessoas: [],
  carregando: false,
  erro: null,

  carregarPessoas: async () => {
    set({ carregando: true, erro: null });
    try {
      const pessoas = await db.pessoas.toArray();
      set({ pessoas });
    } catch (error) {
      set({ erro: 'Erro ao carregar pessoas' });
      console.error(error);
    } finally {
      set({ carregando: false });
    }
  },

  adicionarPessoa: async (pessoaData) => {
    try {
      const novaPessoa: Pessoa = {
        ...pessoaData,
        id: `pessoa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dataCadastro: new Date(),
        dataAtualizacao: new Date(),
      };
      
      await db.pessoas.add(novaPessoa);
      set({ pessoas: [...get().pessoas, novaPessoa] });
      return novaPessoa;
    } catch (error) {
      set({ erro: 'Erro ao adicionar pessoa' });
      throw error;
    }
  },

  atualizarPessoa: async (id, atualizacoes) => {
    try {
      const dataAtualizacao = new Date();
      await db.pessoas.update(id, { ...atualizacoes, dataAtualizacao });
      set({
        pessoas: get().pessoas.map(p => 
          p.id === id ? { ...p, ...atualizacoes, dataAtualizacao } : p
        ),
      });
    } catch (error) {
      set({ erro: 'Erro ao atualizar pessoa' });
      throw error;
    }
  },

  deletarPessoa: async (id) => {
    try {
      await db.pessoas.delete(id);
      set({ pessoas: get().pessoas.filter(p => p.id !== id) });
    } catch (error) {
      set({ erro: 'Erro ao deletar pessoa' });
      throw error;
    }
  },

  buscarPessoa: async (id) => {
    try {
      return await db.pessoas.get(id);
    } catch (error) {
      set({ erro: 'Erro ao buscar pessoa' });
      throw error;
    }
  },

  buscarPorCPF: async (cpf) => {
    try {
      const resultado = await db.pessoas.where('cpf').equals(cpf).first();
      return resultado;
    } catch (error) {
      set({ erro: 'Erro ao buscar pessoa por CPF' });
      throw error;
    }
  },
}));
