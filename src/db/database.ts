import Dexie, { Table } from 'dexie';
import { Pessoa, Processo, DocumentoRequerido, DocumentoProcesso, Configuracao } from '../types';

export class AppDatabase extends Dexie {
  pessoas!: Table<Pessoa>;
  processos!: Table<Processo>;
  documentosRequeridos!: Table<DocumentoRequerido>;
  documentosProcesso!: Table<DocumentoProcesso>;
  configuracoes!: Table<Configuracao>;

  constructor() {
    super('AguiaDespachante');
    this.version(1).stores({
      pessoas: 'id, cpf, dataCadastro',
      processos: 'id, pessoaId, tipo, status, dataPrazo',
      // Multi-entry para array de tiposProcesso (Dexie usa '*' para indexar arrays)
      documentosRequeridos: 'id, *tiposProcesso',
      documentosProcesso: 'id, processoId, status, dataEntrega',
      configuracoes: 'id, chave',
    });
  }
}

export const db = new AppDatabase();
