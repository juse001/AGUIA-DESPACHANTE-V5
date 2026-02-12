import React, { useEffect } from 'react';
import { Users, FileText, BarChart3, Settings } from 'lucide-react';
import { Button } from '../components';
import { usePessoasStore } from '../stores/pessoasStore';
import { useProcessosStore } from '../stores/processosStore';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { pessoas, carregarPessoas } = usePessoasStore();
  const { processos, carregarProcessos } = useProcessosStore();

  useEffect(() => {
    carregarPessoas();
    carregarProcessos();
  }, []);

  const processosAbertos = processos.filter((p) => p.status === 'ABERTO').length;
  const processosCompletos = processos.filter((p) => p.status === 'DOCUMENTACAO_COMPLETA').length;
  const percentualPessoas = processos.length > 0 ? (processosCompletos / processos.length * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao sistema de gestão de processos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Pessoas</p>
              <p className="text-3xl font-bold text-gray-900">{pessoas.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Processos</p>
              <p className="text-3xl font-bold text-gray-900">{processos.length}</p>
            </div>
            <FileText className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Processos Abertos</p>
              <p className="text-3xl font-bold text-gray-900">{processosAbertos}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Documentação Completa</p>
              <p className="text-3xl font-bold text-gray-900">{processosCompletos}</p>
            </div>
            <FileText className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Button
              variant="primary"
              className="w-full justify-start"
              onClick={() => onNavigate('pessoas')}
            >
              <Users className="w-4 h-4" />
              Gerenciar Pessoas
            </Button>
            <Button
              variant="primary"
              className="w-full justify-start"
              onClick={() => onNavigate('processos')}
            >
              <FileText className="w-4 h-4" />
              Gerenciar Processos
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => onNavigate('configuracoes')}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Conclusão</span>
              <span className="font-semibold text-gray-900">{percentualPessoas}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentualPessoas}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {processosCompletos} de {processos.length} processos com documentação completa
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações do Sistema</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Versão</p>
            <p className="font-semibold text-gray-900">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-600">Modo</p>
            <p className="font-semibold text-gray-900">Offline</p>
          </div>
          <div>
            <p className="text-gray-600">Armazenamento</p>
            <p className="font-semibold text-gray-900">IndexedDB</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-semibold text-green-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};
