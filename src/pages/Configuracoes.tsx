import React, { useState, useEffect } from 'react';
import { useConfiguracoesStore } from '../stores/configuracoesStore';
import { Button, Alert, Input } from '../components';
import { Settings, Database, Download, Upload } from 'lucide-react';
import { db } from '../db/database';

export const Configuracoes: React.FC = () => {
  const { carregarConfiguracoes, salvarConfiguracao, erro } = useConfiguracoesStore();
  const [caminhoBD, setCaminhoBD] = useState('IndexedDB (Navegador)');
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [nomeBD, setNomeBD] = useState('AguiaDespachante');
  const [versaoBD, setVersaoBD] = useState('1');

  useEffect(() => {
    carregarConfiguracoes();
    carregarConfiguracoesArmazenadas();
  }, []);

  const carregarConfiguracoesArmazenadas = async () => {
    try {
      const stored = localStorage.getItem('configBD');
      if (stored) {
        const config = JSON.parse(stored);
        setCaminhoBD(config.caminho || 'IndexedDB (Navegador)');
        setNomeBD(config.nome || 'AguiaDespachante');
        setVersaoBD(config.versao || '1');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSalvarConfiguracoes = async () => {
    try {
      const config = {
        caminho: caminhoBD,
        nome: nomeBD,
        versao: versaoBD,
      };
      localStorage.setItem('configBD', JSON.stringify(config));
      await salvarConfiguracao('bdConfig', config);
      setMensagem({ tipo: 'success', texto: 'Configurações de banco de dados salvas!' });
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao salvar configurações' });
    }
  };

  const handleExportarDados = async () => {
    try {
      const pessoas = await db.pessoas.toArray();
      const processos = await db.processos.toArray();
      const documentos = await db.documentosProcesso.toArray();
      const configuracoes = await db.configuracoes.toArray();

      const dados = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        data: {
          pessoas,
          processos,
          documentos,
          configuracoes,
        },
      };

      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aguia-despachante-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setMensagem({ tipo: 'success', texto: 'Dados exportados com sucesso!' });
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao exportar dados' });
    }
  };

  const handleImportarDados = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const conteudo = await file.text();
      const dados = JSON.parse(conteudo);

      if (dados.data?.pessoas) {
        await db.pessoas.bulkAdd(dados.data.pessoas);
      }
      if (dados.data?.processos) {
        await db.processos.bulkAdd(dados.data.processos);
      }
      if (dados.data?.documentos) {
        await db.documentosProcesso.bulkAdd(dados.data.documentos);
      }

      setMensagem({ tipo: 'success', texto: 'Dados importados com sucesso!' });
      
      // Limpar o input para permitir importar o mesmo arquivo novamente
      e.target.value = '';
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao importar dados' });
      e.target.value = '';
    }
  };

  const handleClickImportar = () => {
    document.getElementById('import-file-input')?.click();
  };

  const handleLimparDados = () => {
    if (window.confirm('⚠️ ATENÇÃO: Isso vai deletar TODOS os dados! Tem certeza?')) {
      db.delete().then(() => {
        location.reload();
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerenciar configurações do sistema e armazenamento de dados</p>
      </div>

      {/* Mensagens */}
      {mensagem && (
        <Alert
          type={mensagem.tipo}
          message={mensagem.texto}
          onClose={() => setMensagem(null)}
        />
      )}
      {erro && (
        <Alert type="error" message={erro} onClose={() => {}} />
      )}

      {/* Configurações de Banco de Dados */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Armazenamento de Dados</h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Local de Armazenamento"
            value={caminhoBD}
            onChange={(e) => setCaminhoBD(e.target.value)}
            helperText="Onde os dados serão salvos (padrão: IndexedDB do navegador)"
          />

          <Input
            label="Nome do Banco de Dados"
            value={nomeBD}
            onChange={(e) => setNomeBD(e.target.value)}
            helperText="Nome identificador do banco de dados"
          />

          <Input
            label="Versão do Banco"
            type="number"
            value={versaoBD}
            onChange={(e) => setVersaoBD(e.target.value)}
            helperText="Versão do schema do banco de dados"
          />

          <Button
            variant="primary"
            onClick={handleSalvarConfiguracoes}
            className="w-full"
          >
            <Settings className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      {/* Backup e Restauração */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Backup e Restauração</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Exportar todos os dados para arquivo</p>
            <Button
              variant="success"
              onClick={handleExportarDados}
              className="w-full"
            >
              <Download className="w-4 h-4" />
              Exportar Dados
            </Button>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Importar dados de um arquivo anterior</p>
            <Button
              variant="primary"
              onClick={handleClickImportar}
              className="w-full"
            >
              <Upload className="w-4 h-4" />
              Importar Dados
            </Button>
            <input
              id="import-file-input"
              type="file"
              accept=".json"
              onChange={handleImportarDados}
              className="hidden"
            />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p className="font-semibold mb-1">💡 Dica de Segurança:</p>
          <p>Faça backups regulares dos seus dados. Os dados são armazenados localmente no seu navegador e não podem ser recuperados se você limpar o cache.</p>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informações do Sistema</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-medium">Versão da App</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">1.0.0</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-medium">Modo de Operação</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">Offline</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-medium">Banco de Dados</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">IndexedDB</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-medium">Estado</p>
            <p className="text-lg font-semibold text-green-600 mt-1">Online</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-medium">Navegador</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">Suportado</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-medium">Storage Local</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">Disponível</p>
          </div>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-900 mb-4">⚠️ Zona de Perigo</h2>

        <p className="text-red-800">
          As ações abaixo são irreversíveis. Use com cuidado!
        </p>

        <Button
          variant="danger"
          onClick={handleLimparDados}
          className="w-full"
        >
          Limpar Todos os Dados
        </Button>
      </div>
    </div>
  );
};
