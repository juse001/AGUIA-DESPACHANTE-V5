import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { usePessoasStore } from '../stores/pessoasStore';
import { Input, Button, Alert } from '../components';
import { formatarCPF, formatarTelefone } from '../utils/constants';
import { Plus, Edit2, Trash2, X, FilePlus2 } from 'lucide-react';
export const Pessoas = ({ onNovoProcesso }) => {
    const { pessoas, carregarPessoas, adicionarPessoa, atualizarPessoa, deletarPessoa, erro } = usePessoasStore();
    const [mostraModal, setMostraModal] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [busca, setBusca] = useState('');
    const [mensagem, setMensagem] = useState(null);
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
    const pessoasFiltradas = pessoas.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.cpf.includes(busca));
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editandoId) {
                await atualizarPessoa(editandoId, {
                    ...formData,
                    ativo: true,
                });
                setMensagem({ tipo: 'success', texto: 'Pessoa atualizada com sucesso!' });
            }
            else {
                await adicionarPessoa({
                    ...formData,
                    ativo: true,
                });
                setMensagem({ tipo: 'success', texto: 'Pessoa cadastrada com sucesso!' });
            }
            resetForm();
            setMostraModal(false);
        }
        catch (error) {
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
    const handleEditar = (pessoa) => {
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
    const handleDeletar = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
            try {
                await deletarPessoa(id);
                setMensagem({ tipo: 'success', texto: 'Pessoa deletada com sucesso!' });
            }
            catch (error) {
                setMensagem({ tipo: 'error', texto: 'Erro ao deletar pessoa' });
            }
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Pessoas" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gerenciar cadastro de pessoas f\u00EDsicas" })] }), _jsxs(Button, { variant: "primary", onClick: () => { resetForm(); setMostraModal(true); }, children: [_jsx(Plus, { className: "w-4 h-4" }), "Nova Pessoa"] })] }), mensagem && (_jsx(Alert, { type: mensagem.tipo, message: mensagem.texto, onClose: () => setMensagem(null) })), erro && (_jsx(Alert, { type: "error", message: erro, onClose: () => { } })), _jsx("div", { className: "bg-white rounded-lg shadow p-4", children: _jsx("input", { type: "text", placeholder: "Buscar por nome ou CPF...", value: busca, onChange: (e) => setBusca(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: pessoasFiltradas.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Nome" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "CPF" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Telefone" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: pessoasFiltradas.map((pessoa) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: pessoa.nome }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: formatarCPF(pessoa.cpf) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: formatarTelefone(pessoa.telefone) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: pessoa.email || '-' }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm flex gap-2", children: [onNovoProcesso && (_jsx("button", { onClick: () => onNovoProcesso(pessoa.id), className: "text-green-700 hover:text-green-900 transition-colors", title: "Novo processo", children: _jsx(FilePlus2, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => handleEditar(pessoa), className: "text-blue-600 hover:text-blue-900 transition-colors", title: "Editar", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeletar(pessoa.id), className: "text-red-600 hover:text-red-900 transition-colors", title: "Deletar", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, pessoa.id))) })] }) })) : (_jsx("div", { className: "p-6 text-center text-gray-600", children: "Nenhuma pessoa cadastrada. Clique em \"Nova Pessoa\" para adicionar uma." })) }), mostraModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: editandoId ? 'Editar Pessoa' : 'Nova Pessoa' }), _jsx("button", { onClick: () => { setMostraModal(false); resetForm(); }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsx(Input, { label: "Nome", value: formData.nome, onChange: (e) => setFormData({ ...formData, nome: e.target.value }), required: true }), _jsx(Input, { label: "CPF", value: formData.cpf, onChange: (e) => setFormData({ ...formData, cpf: formatarCPF(e.target.value) }), placeholder: "000.000.000-00", required: true }), _jsx(Input, { label: "Senha Gov", type: "password", value: formData.senhaGov, onChange: (e) => setFormData({ ...formData, senhaGov: e.target.value }) }), _jsx(Input, { label: "Telefone", value: formData.telefone, onChange: (e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) }), placeholder: "(00) 00000-0000", required: true }), _jsx(Input, { label: "Email", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) }), _jsx(Input, { label: "Endere\u00E7o", value: formData.endereco, onChange: (e) => setFormData({ ...formData, endereco: e.target.value }) }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "secondary", className: "flex-1", onClick: () => { setMostraModal(false); resetForm(); }, children: "Cancelar" }), _jsx(Button, { variant: "primary", className: "flex-1", type: "submit", children: editandoId ? 'Atualizar' : 'Salvar' })] })] })] }) }))] }));
};
