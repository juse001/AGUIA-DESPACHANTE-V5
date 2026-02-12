import { create } from 'zustand';
import { db } from '../db/database';
export const useConfiguracoesStore = create((set, get) => ({
    configuracoes: [],
    carregando: false,
    erro: null,
    carregarConfiguracoes: async () => {
        set({ carregando: true, erro: null });
        try {
            const configuracoes = await db.configuracoes.toArray();
            set({ configuracoes });
        }
        catch (error) {
            set({ erro: 'Erro ao carregar configurações' });
            console.error(error);
        }
        finally {
            set({ carregando: false });
        }
    },
    obterConfiguracao: async (chave) => {
        try {
            const config = await db.configuracoes.where('chave').equals(chave).first();
            return config ? config.valor : null;
        }
        catch (error) {
            set({ erro: 'Erro ao obter configuração' });
            throw error;
        }
    },
    salvarConfiguracao: async (chave, valor) => {
        try {
            const dataAtualizacao = new Date();
            const configExistente = await db.configuracoes.where('chave').equals(chave).first();
            if (configExistente) {
                await db.configuracoes.update(configExistente.id, { valor, dataAtualizacao });
            }
            else {
                const novaConfig = {
                    id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    chave,
                    valor,
                    dataCadastro: new Date(),
                    dataAtualizacao,
                };
                await db.configuracoes.add(novaConfig);
            }
            set({ configuracoes: [...get().configuracoes.filter(c => c.chave !== chave), {
                        id: configExistente?.id || `config_${Date.now()}`,
                        chave,
                        valor,
                        dataCadastro: configExistente?.dataCadastro || new Date(),
                        dataAtualizacao
                    }] });
        }
        catch (error) {
            set({ erro: 'Erro ao salvar configuração' });
            throw error;
        }
    },
    deletarConfiguracao: async (chave) => {
        try {
            const config = await db.configuracoes.where('chave').equals(chave).first();
            if (config) {
                await db.configuracoes.delete(config.id);
                set({ configuracoes: get().configuracoes.filter(c => c.chave !== chave) });
            }
        }
        catch (error) {
            set({ erro: 'Erro ao deletar configuração' });
            throw error;
        }
    },
}));
