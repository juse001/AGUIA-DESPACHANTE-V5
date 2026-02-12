import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { StatusProcesso } from '../types';
import { useProcessosStore } from '../stores/processosStore';
import { usePessoasStore } from '../stores/pessoasStore';
import { DetalheProcesso } from './DetalheProcesso';
import { Input, Button, Select, Alert } from '../components';
import { nomesTipoProcesso, nomesStatusProcesso, coresStatusProcesso, formatarData } from '../utils/constants';
import { Plus, Trash2, X, Eye, KeyRound, Copy } from 'lucide-react';
export const Processos = ({ novoProcessoPessoaId, onConsumirNovoProcesso, }) => {
    const { processos, carregarProcessos, adicionarProcesso, atualizarProcesso, deletarProcesso, erro } = useProcessosStore();
    const { pessoas, carregarPessoas } = usePessoasStore();
    const [mostraModal, setMostraModal] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [busca, setBusca] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [mensagem, setMensagem] = useState(null);
    const [mostraCredenciais, setMostraCredenciais] = useState(false);
    const [pessoaCredenciaisId, setPessoaCredenciaisId] = useState(null);
    const [processoCredenciaisId, setProcessoCredenciaisId] = useState(null);
    const [ultimoProcessoCredenciaisId, setUltimoProcessoCredenciaisId] = useState(null);
    const [mostraDetalhesProcesso, setMostraDetalhesProcesso] = useState(false);
    const [processoDetalhesId, setProcessoDetalhesId] = useState(null);
    const [ultimoProcessoDetalhesId, setUltimoProcessoDetalhesId] = useState(null);
    const [formData, setFormData] = useState({
        pessoaId: '',
        tipo: '',
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
        if (!novoProcessoPessoaId)
            return;
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
    const copiarTexto = async (texto) => {
        try {
            await navigator.clipboard.writeText(texto);
            setMensagem({ tipo: 'success', texto: 'Copiado!' });
        }
        catch {
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.pessoaId || !formData.tipo) {
                setMensagem({ tipo: 'error', texto: 'Preencha todos os campos obrigatórios' });
                return;
            }
            const dados = {
                ...formData,
                tipo: formData.tipo,
                dataAbertura: new Date(formData.dataAbertura),
                dataPrazo: formData.dataPrazo ? new Date(formData.dataPrazo) : undefined,
            };
            let processoId;
            if (editandoId) {
                await atualizarProcesso(editandoId, dados);
                processoId = editandoId;
                setMensagem({ tipo: 'success', texto: 'Processo atualizado com sucesso!' });
            }
            else {
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
        }
        catch (error) {
            setMensagem({ tipo: 'error', texto: 'Erro ao salvar processo' });
        }
    };
    const resetForm = () => {
        setFormData({
            pessoaId: '',
            tipo: '',
            numero: '',
            status: StatusProcesso.ABERTO,
            dataAbertura: new Date().toISOString().split('T')[0],
            dataPrazo: '',
        });
        setEditandoId(null);
    };
    const handleDeletar = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este processo?')) {
            try {
                await deletarProcesso(id);
                setMensagem({ tipo: 'success', texto: 'Processo deletado com sucesso!' });
            }
            catch (error) {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Processos" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gerenciar processos administrativos" })] }), _jsxs(Button, { variant: "primary", onClick: () => { resetForm(); setMostraModal(true); }, children: [_jsx(Plus, { className: "w-4 h-4" }), "Novo Processo"] })] }), mensagem && (_jsx(Alert, { type: mensagem.tipo, message: mensagem.texto, onClose: () => setMensagem(null) })), erro && (_jsx(Alert, { type: "error", message: erro, onClose: () => { } })), _jsx("div", { className: "bg-white rounded-lg shadow p-4 space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx("input", { type: "text", placeholder: "Buscar por n\u00FAmero ou pessoa...", value: busca, onChange: (e) => setBusca(e.target.value), className: "col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsxs("select", { value: filtroTipo, onChange: (e) => setFiltroTipo(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white", children: [_jsx("option", { value: "", children: "Todos os tipos" }), tiposProcessoOptions.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] }), _jsxs("select", { value: filtroStatus, onChange: (e) => setFiltroStatus(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white", children: [_jsx("option", { value: "", children: "Todos os status" }), statusProcessoOptions.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: processosFiltrados.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Pessoa" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Tipo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Data Abertura" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: processosFiltrados.map((processo) => {
                                    const pessoa = pessoas.find(p => p.id === processo.pessoaId);
                                    const statusColor = coresStatusProcesso[processo.status];
                                    const destaqueAtivo = ultimoProcessoCredenciaisId === processo.id || ultimoProcessoDetalhesId === processo.id;
                                    return (_jsxs("tr", { className: `hover:bg-gray-50 transition-colors ${destaqueAtivo ? 'bg-blue-50' : ''}`, children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: pessoa?.nome || 'Desconhecido' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: nomesTipoProcesso[processo.tipo] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`, children: nomesStatusProcesso[processo.status] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: formatarData(processo.dataAbertura) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm flex gap-2", children: [pessoa?.cpf && (_jsx("button", { onClick: () => {
                                                            setPessoaCredenciaisId(processo.pessoaId);
                                                            setProcessoCredenciaisId(processo.id);
                                                            setUltimoProcessoCredenciaisId(processo.id);
                                                            setMostraCredenciais(true);
                                                        }, className: "text-gray-700 hover:text-gray-900 transition-colors", title: "Ver CPF e Senha Gov", children: _jsx(KeyRound, { className: "w-5 h-5" }) })), _jsx("button", { onClick: () => {
                                                            setProcessoDetalhesId(processo.id);
                                                            setUltimoProcessoDetalhesId(processo.id);
                                                            setMostraDetalhesProcesso(true);
                                                        }, className: "text-green-600 hover:text-green-900 transition-colors", title: "Ver Detalhes do Processo", children: _jsx(Eye, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => handleDeletar(processo.id), className: "text-red-600 hover:text-red-900 transition-colors", children: _jsx(Trash2, { className: "w-5 h-5" }) })] })] }, processo.id));
                                }) })] }) })) : (_jsx("div", { className: "p-6 text-center text-gray-600", children: "Nenhum processo encontrado. Clique em \"Novo Processo\" para adicionar um." })) }), mostraModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: editandoId ? 'Editar Processo' : 'Novo Processo' }), _jsx("button", { onClick: () => { setMostraModal(false); resetForm(); }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsx(Select, { label: "Pessoa *", options: pessoasOptions, value: formData.pessoaId, onChange: (e) => setFormData({ ...formData, pessoaId: e.target.value }) }), _jsx(Select, { label: "Tipo de Processo *", options: tiposProcessoOptions, value: formData.tipo, onChange: (e) => setFormData({ ...formData, tipo: e.target.value }) }), _jsx(Input, { label: "N\u00FAmero do Processo", value: formData.numero, onChange: (e) => setFormData({ ...formData, numero: e.target.value }), placeholder: "Ex: PROC-2025-001" }), _jsx(Select, { label: "Status", options: statusProcessoOptions, value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }) }), _jsx(Input, { label: "Data de Abertura", type: "date", value: formData.dataAbertura, onChange: (e) => setFormData({ ...formData, dataAbertura: e.target.value }) }), _jsx(Input, { label: "Data de Prazo", type: "date", value: formData.dataPrazo, onChange: (e) => setFormData({ ...formData, dataPrazo: e.target.value }) }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "secondary", className: "flex-1", onClick: () => { setMostraModal(false); resetForm(); }, children: "Cancelar" }), _jsx(Button, { variant: "primary", className: "flex-1", type: "submit", children: editandoId ? 'Atualizar' : 'Salvar' })] })] })] }) })), mostraCredenciais && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "CPF e Senha Gov" }), _jsx("button", { onClick: () => {
                                        setMostraCredenciais(false);
                                        setPessoaCredenciaisId(null);
                                        setProcessoCredenciaisId(null);
                                    }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [pessoaCredenciais && (_jsxs("div", { className: "pb-4 border-b border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Pessoa" }), _jsx("p", { className: "text-sm text-gray-900 mt-1", children: pessoaCredenciais.nome })] })), processoCredenciais && (_jsxs("div", { className: "pb-4 border-b border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Data de Abertura" }), _jsx("p", { className: "text-sm text-gray-900 mt-1", children: new Date(processoCredenciais.dataAbertura).toLocaleDateString('pt-BR') })] })), processoCredenciais && (_jsxs("div", { className: "pb-4 border-b border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Tipo de Processo" }), _jsx("p", { className: "text-sm text-gray-900 mt-1", children: nomesTipoProcesso[processoCredenciais.tipo] })] })), processoCredenciais && (_jsxs("div", { className: "pb-4 border-b border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Status" }), _jsx("select", { value: processoCredenciais.status, onChange: async (e) => {
                                                const novoStatus = e.target.value;
                                                try {
                                                    await atualizarProcesso(processoCredenciais.id, { status: novoStatus });
                                                    setMensagem({ tipo: 'success', texto: 'Status atualizado!' });
                                                }
                                                catch (error) {
                                                    setMensagem({ tipo: 'error', texto: 'Erro ao atualizar status' });
                                                }
                                            }, className: "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white", children: Object.values(StatusProcesso).map(status => (_jsx("option", { value: status, children: nomesStatusProcesso[status] }, status))) })] })), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "CPF" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900", children: pessoaCredenciais?.cpf || '-' }), _jsxs(Button, { variant: "secondary", type: "button", onClick: () => copiarTexto(pessoaCredenciais?.cpf || ''), disabled: !pessoaCredenciais?.cpf, children: [_jsx(Copy, { className: "w-4 h-4" }), "Copiar"] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Senha Gov" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900", children: pessoaCredenciais?.senhaGov ? '••••••••' : '-' }), _jsxs(Button, { variant: "secondary", type: "button", onClick: () => copiarTexto(pessoaCredenciais?.senhaGov || ''), disabled: !pessoaCredenciais?.senhaGov, children: [_jsx(Copy, { className: "w-4 h-4" }), "Copiar"] })] }), _jsx("p", { className: "text-xs text-gray-500", children: "A senha \u00E9 copiada, mas n\u00E3o \u00E9 exibida na tela." })] }), processoCredenciais && (_jsxs("div", { className: "pb-4 border-b border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Descri\u00E7\u00E3o" }), _jsx("textarea", { value: processoCredenciais.observacoes || '', onChange: async (e) => {
                                                const novasObserv = e.target.value;
                                                try {
                                                    await atualizarProcesso(processoCredenciais.id, { observacoes: novasObserv });
                                                    setMensagem({ tipo: 'success', texto: 'Descrição atualizada!' });
                                                }
                                                catch (error) {
                                                    setMensagem({ tipo: 'error', texto: 'Erro ao atualizar descrição' });
                                                }
                                            }, placeholder: "Adicione uma descri\u00E7\u00E3o para este processo...", className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none", rows: 4 })] })), _jsx("div", { className: "pt-2", children: _jsx(Button, { variant: "primary", className: "w-full", type: "button", onClick: () => {
                                            setMostraCredenciais(false);
                                            setPessoaCredenciaisId(null);
                                            setProcessoCredenciaisId(null);
                                        }, children: "Fechar" }) })] })] }) })), mostraDetalhesProcesso && processoDetalhesId && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-4xl my-8", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Detalhes do Processo" }), _jsx("button", { onClick: () => {
                                        setMostraDetalhesProcesso(false);
                                        setProcessoDetalhesId(null);
                                    }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-6 max-h-[calc(100vh-300px)] overflow-y-auto", children: _jsx(DetalheProcesso, { processoId: processoDetalhesId, onVoltar: () => {
                                    setMostraDetalhesProcesso(false);
                                    setProcessoDetalhesId(null);
                                } }) })] }) }))] }));
};
