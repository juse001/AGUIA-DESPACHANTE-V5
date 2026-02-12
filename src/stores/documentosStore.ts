import { create } from 'zustand';
import { DocumentoProcesso, StatusDocumento } from '../types';
import { db } from '../db/database';

interface DocumentosStore {
  documentosProcesso: DocumentoProcesso[];
  carregando: boolean;
  erro: string | null;
  
  // Ações
  carregarDocumentosPorProcesso: (processoId: string) => Promise<void>;
  adicionarDocumentoProcesso: (documento: Omit<DocumentoProcesso, 'id'>) => Promise<DocumentoProcesso>;
  atualizarDocumentoProcesso: (id: string, atualizacoes: Partial<DocumentoProcesso>) => Promise<void>;
  atualizarStatusDocumento: (id: string, novoStatus: StatusDocumento) => Promise<void>;
  deletarDocumentoProcesso: (id: string) => Promise<void>;
  buscarDocumentoProcesso: (id: string) => Promise<DocumentoProcesso | undefined>;
}

export const useDocumentosStore = create<DocumentosStore>((set, get) => ({
  documentosProcesso: [],
  carregando: false,
  erro: null,

  carregarDocumentosPorProcesso: async (processoId) => {
    set({ carregando: true, erro: null });
    try {
      const documentos = await db.documentosProcesso
        .where('processoId')
        .equals(processoId)
        .toArray();
      set({ documentosProcesso: documentos });
    } catch (error) {
      set({ erro: 'Erro ao carregar documentos' });
      console.error(error);
    } finally {
      set({ carregando: false });
    }
  },

  adicionarDocumentoProcesso: async (documentoData) => {
    try {
      const novoDocumento: DocumentoProcesso = {
        ...documentoData,
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      
      await db.documentosProcesso.add(novoDocumento);
      set({ documentosProcesso: [...get().documentosProcesso, novoDocumento] });
      return novoDocumento;
    } catch (error) {
      set({ erro: 'Erro ao adicionar documento' });
      throw error;
    }
  },

  atualizarDocumentoProcesso: async (id, atualizacoes) => {
    try {
      await db.documentosProcesso.update(id, atualizacoes);
      set({
        documentosProcesso: get().documentosProcesso.map(d => 
          d.id === id ? { ...d, ...atualizacoes } : d
        ),
      });
    } catch (error) {
      set({ erro: 'Erro ao atualizar documento' });
      throw error;
    }
  },

  atualizarStatusDocumento: async (id, novoStatus) => {
    await get().atualizarDocumentoProcesso(id, { 
      status: novoStatus,
      dataEntrega: novoStatus === StatusDocumento.ENTREGUE ? new Date() : undefined,
    });
  },

  deletarDocumentoProcesso: async (id) => {
    try {
      await db.documentosProcesso.delete(id);
      set({ 
        documentosProcesso: get().documentosProcesso.filter(d => d.id !== id),
      });
    } catch (error) {
      set({ erro: 'Erro ao deletar documento' });
      throw error;
    }
  },

  buscarDocumentoProcesso: async (id) => {
    try {
      return await db.documentosProcesso.get(id);
    } catch (error) {
      set({ erro: 'Erro ao buscar documento' });
      throw error;
    }
  },
}));
