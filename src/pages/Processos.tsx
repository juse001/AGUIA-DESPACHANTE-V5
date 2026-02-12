import React, { useState, useEffect } from 'react';
import { TipoProcesso, StatusProcesso } from '../types';
import { useProcessosStore } from '../stores/processosStore';
import { usePessoasStore } from '../stores/pessoasStore';
import { DetalheProcesso } from './DetalheProcesso';
import { Input, Button, Select, Alert } from '../components';
import { nomesTipoProcesso, nomesStatusProcesso, coresStatusProcesso, formatarData } from '../utils/constants';
import { Plus, Trash2, X, Eye, KeyRound, Copy } from 'lucide-react';

interface ProcessosProps {
  onNavigate?: (page: string) => void;
  novoProcessoPessoaId?: string | null;
  onConsumirNovoProcesso?: () => void;
}

export const Processos: React.FC<ProcessosProps> = ({
  novoProcessoPessoaId,
  onConsumirNovoProcesso,
}) => {
  const { processos, carregarProcessos, adicionarProcesso, atualizarProcesso, deletarProcesso, erro } = useProcessosStore();
  const { pessoas, carregarPessoas } = usePessoasStore();
  const [mostraModal, setMostraModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoProcesso | ''>('');
  const [filtroStatus, setFiltroStatus] = useState<StatusProcesso | ''>('');
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [mostraCredenciais, setMostraCredenciais] = useState(false);
  const [pessoaCredenciaisId, setPessoaCredenciaisId] = useState<string | null>(null);
  const [processoCredenciaisId, setProcessoCredenciaisId] = useState<string | null>(null);
  const [ultimoProcessoCredenciaisId, setUltimoProcessoCredenciaisId] = useState<string | null>(null);

  const [mostraDetalhesProcesso, setMostraDetalhesProcesso] = useState(false);
  const [processoDetalhesId, setProcessoDetalhesId] = useState<string | null>(null);
  const [ultimoProcessoDetalhesId, setUltimoProcessoDetalhesId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    pessoaId: '',
    tipo: '' as TipoProcesso | '',
    numero: '',
    status: StatusProcesso.ABERTO,
    dataAbertura: new Date().toISOString().split('T')[0],
    dataPrazo: '',
  });

  useEffect(() => {
    carregarPessoas();
    carregarProcessos();
  }, []);

  useEffect(() => {
    if (!novoProcessoPessoaId) return;
    // Abre o modal já com a pessoa selecionada
    resetForm();
    setFormData((prev) => ({
      ...prev,
      pessoaId: novoProcessoPessoaId,
    }));
    setMostraModal(true);
    onConsumirNovoProcesso?.();
  }, [novoProcessoPessoaId]);

  // Sincronizar descrição quando popup de credenciais é aberto
  useEffect(() => {
    if (mostraCredenciais && processoCredenciaisId) {
      // Recarregar processos para garantir dados atualizados
      carregarProcessos();
    }
  }, [mostraCredenciais, processoCredenciaisId]);

  // Sincronizar descrição quando modal de detalhes é aberto
  useEffect(() => {
    if (mostraDetalhesProcesso && processoDetalhesId) {
      // Recarregar processos para garantir dados atualizados
      carregarProcessos();
    }
  }, [mostraDetalhesProcesso, processoDetalhesId]);

  const pessoaCredenciais = pessoas.find((p) => p.id === pessoaCredenciaisId) || null;
  const processoCredenciais = processos.find((p) => p.id === processoCredenciaisId) || null;

  const copiarTexto = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setMensagem({ tipo: 'success', texto: 'Copiado!' });
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setMensagem({ tipo: 'success', texto: 'Copiado!' });
    }
  };

  const processosFiltrados = processos.filter(p => {
    const pessoaNome = pessoas.find(x => x.id === p.pessoaId)?.nome || '';
    const matchBusca = p.numero.toLowerCase().includes(busca.toLowerCase()) || 
                       pessoaNome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = !filtroTipo || p.tipo === filtroTipo;
    const matchStatus = !filtroStatus || p.status === filtroStatus;
    
    return matchBusca && matchTipo && matchStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.pessoaId || !formData.tipo) {
        setMensagem({ tipo: 'error', texto: 'Preencha todos os campos obrigatórios' });
        return;
      }

      const dados = {
        ...formData,
        tipo: formData.tipo as TipoProcesso,
        dataAbertura: new Date(formData.dataAbertura),
        dataPrazo: formData.dataPrazo ? new Date(formData.dataPrazo) : undefined,
      };

      let processoId: string;
      if (editandoId) {
        await atualizarProcesso(editandoId, dados);
        processoId = editandoId;
        setMensagem({ tipo: 'success', texto: 'Processo atualizado com sucesso!' });
      } else {
        const novoProcesso = await adicionarProcesso(dados);
        processoId = novoProcesso.id;
        setMensagem({ tipo: 'success', texto: 'Processo cadastrado com sucesso!' });
      }
      
      resetForm();
      setMostraModal(false);
      
      // Abrir DetalheProcesso do processo criado/atualizado
      setProcessoDetalhesId(processoId);
      setUltimoProcessoDetalhesId(processoId);
      setMostraDetalhesProcesso(true);
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao salvar processo' });
    }
  };

  const resetForm = () => {
    setFormData({
      pessoaId: '',
      tipo: '' as TipoProcesso | '',
      numero: '',
      status: StatusProcesso.ABERTO,
      dataAbertura: new Date().toISOString().split('T')[0],
      dataPrazo: '',
    });
    setEditandoId(null);
  };



  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este processo?')) {
      try {
        await deletarProcesso(id);
        setMensagem({ tipo: 'success', texto: 'Processo deletado com sucesso!' });
      } catch (error) {
        setMensagem({ tipo: 'error', texto: 'Erro ao deletar processo' });
      }
    }
  };

  const tiposProcessoOptions = Object.entries(nomesTipoProcesso).map(([value, label]) => ({
    value,
    label,
  }));

  const statusProcessoOptions = Object.entries(nomesStatusProcesso).map(([value, label]) => ({
    value,
    label,
  }));

  const pessoasOptions = pessoas.map(p => ({
    value: p.id,
    label: `${p.nome} (${p.cpf})`,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Processos</h1>
          <p className="text-gray-600 mt-1">Gerenciar processos administrativos</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setMostraModal(true); }}>
          <Plus className="w-4 h-4" />
          Novo Processo
        </Button>
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

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por número ou pessoa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as TipoProcesso | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Todos os tipos</option>
            {tiposProcessoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as StatusProcesso | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Todos os status</option>
            {statusProcessoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {processosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pessoa</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Data Abertura</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processosFiltrados.map((processo) => {
                  const pessoa = pessoas.find(p => p.id === processo.pessoaId);
                  const statusColor = coresStatusProcesso[processo.status];
                  const destaqueAtivo = ultimoProcessoCredenciaisId === processo.id || ultimoProcessoDetalhesId === processo.id;
                  
                  return (
                    <tr key={processo.id} className={`hover:bg-gray-50 transition-colors ${destaqueAtivo ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pessoa?.nome || 'Desconhecido'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{nomesTipoProcesso[processo.tipo]}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          {nomesStatusProcesso[processo.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatarData(processo.dataAbertura)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                        {pessoa?.cpf && (
                          <button
                            onClick={() => {
                              setPessoaCredenciaisId(processo.pessoaId);
                              setProcessoCredenciaisId(processo.id);
                              setUltimoProcessoCredenciaisId(processo.id);
                              setMostraCredenciais(true);
                            }}
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                            title="Ver CPF e Senha Gov"
                          >
                            <KeyRound className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setProcessoDetalhesId(processo.id);
                            setUltimoProcessoDetalhesId(processo.id);
                            setMostraDetalhesProcesso(true);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Ver Detalhes do Processo"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletar(processo.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            Nenhum processo encontrado. Clique em "Novo Processo" para adicionar um.
          </div>
        )}
      </div>

      {/* Modal */}
      {mostraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">
                {editandoId ? 'Editar Processo' : 'Novo Processo'}
              </h2>
              <button
                onClick={() => { setMostraModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Select
                label="Pessoa *"
                options={pessoasOptions}
                value={formData.pessoaId}
                onChange={(e) => setFormData({ ...formData, pessoaId: e.target.value })}
              />
              
              <Select
                label="Tipo de Processo *"
                options={tiposProcessoOptions}
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoProcesso })}
              />
              
              <Input
                label="Número do Processo"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                placeholder="Ex: PROC-2025-001"
              />

              <Select
                label="Status"
                options={statusProcessoOptions}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusProcesso })}
              />
              
              <Input
                label="Data de Abertura"
                type="date"
                value={formData.dataAbertura}
                onChange={(e) => setFormData({ ...formData, dataAbertura: e.target.value })}
              />
              
              <Input
                label="Data de Prazo"
                type="date"
                value={formData.dataPrazo}
                onChange={(e) => setFormData({ ...formData, dataPrazo: e.target.value })}
              />
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => { setMostraModal(false); resetForm(); }}
                >
                  Cancelar
                </Button>
                <Button variant="primary" className="flex-1" type="submit">
                  {editandoId ? 'Atualizar' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Credenciais */}
      {mostraCredenciais && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">CPF e Senha Gov</h2>
              <button
                onClick={() => {
                  setMostraCredenciais(false);
                  setPessoaCredenciaisId(null);
                  setProcessoCredenciaisId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Informações da Pessoa */}
              {pessoaCredenciais && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Pessoa</p>
                  <p className="text-sm text-gray-900 mt-1">{pessoaCredenciais.nome}</p>
                </div>
              )}

              {/* Data de Abertura do Processo */}
              {processoCredenciais && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Data de Abertura</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(processoCredenciais.dataAbertura).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}

              {/* Tipo de Processo */}
              {processoCredenciais && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Tipo de Processo</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {nomesTipoProcesso[processoCredenciais.tipo]}
                  </p>
                </div>
              )}

              {/* Status do Processo */}
              {processoCredenciais && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <select
                    value={processoCredenciais.status}
                    onChange={async (e) => {
                      const novoStatus = e.target.value as StatusProcesso;
                      try {
                        await atualizarProcesso(processoCredenciais.id, { status: novoStatus });
                        setMensagem({ tipo: 'success', texto: 'Status atualizado!' });
                      } catch (error) {
                        setMensagem({ tipo: 'error', texto: 'Erro ao atualizar status' });
                      }
                    }}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  >
                    {Object.values(StatusProcesso).map(status => (
                      <option key={status} value={status}>
                        {nomesStatusProcesso[status]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">CPF</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                    {pessoaCredenciais?.cpf || '-'}
                  </div>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => copiarTexto(pessoaCredenciais?.cpf || '')}
                    disabled={!pessoaCredenciais?.cpf}
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Senha Gov</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                    {pessoaCredenciais?.senhaGov ? '••••••••' : '-'}
                  </div>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => copiarTexto(pessoaCredenciais?.senhaGov || '')}
                    disabled={!pessoaCredenciais?.senhaGov}
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                </div>
                <p className="text-xs text-gray-500">A senha é copiada, mas não é exibida na tela.</p>
              </div>

              {/* Descrição do Processo */}
              {processoCredenciais && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Descrição</p>
                  <textarea
                    value={processoCredenciais.observacoes || ''}
                    onChange={async (e) => {
                      const novasObserv = e.target.value;
                      try {
                        await atualizarProcesso(processoCredenciais.id, { observacoes: novasObserv });
                        setMensagem({ tipo: 'success', texto: 'Descrição atualizada!' });
                      } catch (error) {
                        setMensagem({ tipo: 'error', texto: 'Erro ao atualizar descrição' });
                      }
                    }}
                    placeholder="Adicione uma descrição para este processo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
              )}

              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  type="button"
                  onClick={() => {
                    setMostraCredenciais(false);
                    setPessoaCredenciaisId(null);
                    setProcessoCredenciaisId(null);
                  }}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Processo */}
      {mostraDetalhesProcesso && processoDetalhesId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detalhes do Processo</h2>
              <button
                onClick={() => {
                  setMostraDetalhesProcesso(false);
                  setProcessoDetalhesId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              <DetalheProcesso
                processoId={processoDetalhesId}
                onVoltar={() => {
                  setMostraDetalhesProcesso(false);
                  setProcessoDetalhesId(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
