import React, { useState, useEffect } from 'react';
import { Pessoa } from '../types';
import { usePessoasStore } from '../stores/pessoasStore';
import { Input, Button, Alert } from '../components';
import { formatarCPF, formatarTelefone } from '../utils/constants';
import { Plus, Edit2, Trash2, X, FilePlus2 } from 'lucide-react';

interface PessoasProps {
  onNavigate?: (page: string) => void;
  onNovoProcesso?: (pessoaId: string) => void;
}

export const Pessoas: React.FC<PessoasProps> = ({ onNovoProcesso }) => {
  const { pessoas, carregarPessoas, adicionarPessoa, atualizarPessoa, deletarPessoa, erro } = usePessoasStore();
  const [mostraModal, setMostraModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    senhaGov: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  useEffect(() => {
    carregarPessoas();
  }, []);

  const pessoasFiltradas = pessoas.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf.includes(busca)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editandoId) {
        await atualizarPessoa(editandoId, {
          ...formData,
          ativo: true,
        });
        setMensagem({ tipo: 'success', texto: 'Pessoa atualizada com sucesso!' });
      } else {
        await adicionarPessoa({
          ...formData,
          ativo: true,
        });
        setMensagem({ tipo: 'success', texto: 'Pessoa cadastrada com sucesso!' });
      }
      
      resetForm();
      setMostraModal(false);
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao salvar pessoa' });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      senhaGov: '',
      telefone: '',
      email: '',
      endereco: '',
    });
    setEditandoId(null);
  };

  const handleEditar = (pessoa: Pessoa) => {
    setFormData({
      nome: pessoa.nome,
      cpf: pessoa.cpf,
      senhaGov: pessoa.senhaGov || '',
      telefone: pessoa.telefone,
      email: pessoa.email || '',
      endereco: pessoa.endereco || '',
    });
    setEditandoId(pessoa.id);
    setMostraModal(true);
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
      try {
        await deletarPessoa(id);
        setMensagem({ tipo: 'success', texto: 'Pessoa deletada com sucesso!' });
      } catch (error) {
        setMensagem({ tipo: 'error', texto: 'Erro ao deletar pessoa' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pessoas</h1>
          <p className="text-gray-600 mt-1">Gerenciar cadastro de pessoas físicas</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setMostraModal(true); }}>
          <Plus className="w-4 h-4" />
          Nova Pessoa
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

      {/* Filtro */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {pessoasFiltradas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pessoasFiltradas.map((pessoa) => (
                  <tr key={pessoa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pessoa.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatarCPF(pessoa.cpf)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatarTelefone(pessoa.telefone)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pessoa.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      {onNovoProcesso && (
                        <button
                          onClick={() => onNovoProcesso(pessoa.id)}
                          className="text-green-700 hover:text-green-900 transition-colors"
                          title="Novo processo"
                        >
                          <FilePlus2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditar(pessoa)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletar(pessoa.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            Nenhuma pessoa cadastrada. Clique em "Nova Pessoa" para adicionar uma.
          </div>
        )}
      </div>

      {/* Modal */}
      {mostraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editandoId ? 'Editar Pessoa' : 'Nova Pessoa'}
              </h2>
              <button
                onClick={() => { setMostraModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
              
              <Input
                label="CPF"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatarCPF(e.target.value) })}
                placeholder="000.000.000-00"
                required
              />
              
              <Input
                label="Senha Gov"
                type="password"
                value={formData.senhaGov}
                onChange={(e) => setFormData({ ...formData, senhaGov: e.target.value })}
              />
              
              <Input
                label="Telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                placeholder="(00) 00000-0000"
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              
              <Input
                label="Endereço"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
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
    </div>
  );
};
