import Dexie from 'dexie';
export class AppDatabase extends Dexie {
    constructor() {
        super('AguiaDespachante');
        Object.defineProperty(this, "pessoas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "processos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentosRequeridos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentosProcesso", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "configuracoes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
