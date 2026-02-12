import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { StatusDocumento, StatusProcesso } from '../types';
import { useDocumentosStore } from '../stores/documentosStore';
import { useProcessosStore } from '../stores/processosStore';
import { db } from '../db/database';
import { Button, Alert } from '../components';
import { coresStatusDocumento, nomesTipoProcesso, nomesStatusProcesso } from '../utils/constants';
import { Trash2, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
// Mapeamento de documentos requeridos por tipo de processo
const documentosPorTipo = {
    AQUISICAO_ARMA_SINARM: [
        'Certidão de Antecedentes Criminais',
        'Comprovante bancário de pagamento da taxa',
        'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
        'Comprovante de Ocupação Lícita',
        'Comprovante de Residência Fixa',
        'Documento de Identificação Pessoal',
        'EFETIVA NECESSIDADE',
        'Foto 3x4 recente',
        'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
        'Procuração',
        'Requerimento SINARM Assinado',
    ],
    AQUISICAO_ARMA_CR_ATIRADOR: [
        'Certidão de Antecedentes Criminais',
        'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
        'Comprovante de Ocupação Lícita',
        'Comprovante de Residência Fixa (5 ANOS)',
        'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
        'Declaração de Segurança do Acervo (ESPECIFICO PARA COMPRA)',
        'Documento de Identificação Pessoal',
        'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
        'Modelo, Marca e loja',
        'Comprovante de habitualidade na forma da norma vigente',
    ],
    AQUISICAO_ARMA_CR_CACADOR: [
        'Certidão de Antecedentes Criminais',
        'Comprovante da necessidade de abate de fauna invasora expedido pelo Ibama',
        'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
        'Comprovante de filiação a entidade de tiro desportivo',
        'Comprovante de Ocupação Lícita',
        'Comprovante de Residência Fixa (5 ANOS)',
        'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
        'Declaração de Segurança do Acervo (ESPECIFICO PARA COMPRA)',
        'Documento de Identificação Pessoal',
        'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
        'Modelo, Marca e loja',
    ],
    CRAF_CR: [
        'Documento de Identificação Pessoal',
        'Autorizar aquisição de arma de fogo',
        'Nota Fiscal',
    ],
    GUIA_TRAFEGO_CACA: [
        'Comprovante de filiação a entidade de tiro desportivo',
        'Dados da arma correspondentes à respectiva guia',
        'Documento de Identificação Pessoal',
        'Autorização de manejo de caça emitida pelo IBAMA, acompanhada do CAR da respectiva fazenda',
    ],
    GUIA_TRAFEGO_MUDANCA_ACERVO: [
        'Comprovante de Residência Fixa',
        'Dados da arma correspondentes à respectiva guia',
        'Dados, Endereço de origem e endereço de destino',
        'Documento de Identificação Pessoal',
    ],
    GUIA_TRAFEGO_RECUPERACAO: [
        'Dados da arma correspondentes à respectiva guia',
        'Documento de Identificação Pessoal',
        'Documento de regularização ou restituição da arma de fogo',
    ],
    GUIA_TRAFEGO_TIRO: [
        'Dados da arma correspondentes à respectiva guia',
        'Documento de Identificação Pessoal',
        'Dados do clube de destino',
    ],
    GUIA_TRAFEGO_SINARM: [
        'Comprovante de Residência Fixa',
        'Documento de Identificação Pessoal',
        'Documento que comprove a necessidade da emissão da guia',
        'Registro da arma',
    ],
    TRANSFERENCIA_ARMA_CR: [
        'Certidão de Antecedentes Criminais',
        'Comprovante de Capacidade Técnica para o manuseio de arma de fogo',
        'Comprovante de Ocupação Lícita',
        'Comprovante de Residência Fixa (5 ANOS)',
        'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
        'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
        'Anexo M de transferência - assinada pelas partes',
        'Termo de transferência de propriedade da arma de fogo',
    ],
    CR_ATIRADOR_CACADOR: [
        'Certidão de Antecedentes Criminais',
        'Comprovante de Ocupação Lícita',
        'Comprovante de Residência Fixa (5 ANOS)',
        'Declaração de não estar respondendo a inquérito policial ou a processo criminal',
        'Documento de Identificação Pessoal',
        'Laudo de Aptidão Psicológica para o manuseio de arma de fogo',
    ],
};
export const DetalheProcesso = ({ processoId, onVoltar }) => {
    const { buscarProcesso, atualizarStatusProcesso, atualizarProcesso } = useProcessosStore();
    const { documentosProcesso, carregarDocumentosPorProcesso, adicionarDocumentoProcesso, deletarDocumentoProcesso, atualizarStatusDocumento, atualizarDocumentoProcesso, } = useDocumentosStore();
    const [processo, setProcesso] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState(null);
    useEffect(() => {
        carregarDados();
    }, [processoId]);
    // Sincronizar descrição quando o modal é reaberto
    useEffect(() => {
        if (processoId && processo) {
            // Recarregar dados do processo para garantir descrição atualizada
            carregarDados();
        }
    }, [processoId]);
    useEffect(() => {
        if (!processo)
            return;
        // Reavalia automaticamente quando o checklist muda
        void avaliarStatusAutomatico(processo);
    }, [documentosProcesso, processo?.id]);
    const normalizarNomeDocumento = (nome) => {
        return nome
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };
    // Obtém chave normalizada para comparação
    const obterChaveNormalizada = (nome) => {
        return normalizarNomeDocumento(nome);
    };
    const obterRecomendadosUnicos = (tipo) => {
        const recomendadosBrutos = documentosPorTipo[tipo] || [];
        const unicos = [];
        const chaveVistas = new Set();
        for (const nome of recomendadosBrutos) {
            const chave = obterChaveNormalizada(nome);
            if (chaveVistas.has(chave))
                continue;
            chaveVistas.add(chave);
            unicos.push(nome.trim());
        }
        return unicos;
    };
    const carregarDados = async () => {
        try {
            setCarregando(true);
            const proc = await buscarProcesso(processoId);
            setProcesso(proc || null);
            if (proc) {
                await carregarDocumentosPorProcesso(processoId);
                await removerDuplicados(proc.id);
                await sincronizarChecklist(proc);
                await carregarDocumentosPorProcesso(processoId);
            }
        }
        catch (error) {
            setMensagem({ tipo: 'error', texto: 'Erro ao carregar processo' });
        }
        finally {
            setCarregando(false);
        }
    };
    const avaliarStatusAutomatico = async (proc) => {
        const docs = documentosProcesso.filter((d) => d.processoId === proc.id);
        if (docs.length === 0)
            return;
        const concluidos = docs.filter((d) => d.status === StatusDocumento.ENTREGUE || d.status === StatusDocumento.NAO_APLICAVEL).length;
        const completo = concluidos === docs.length;
        if (!completo)
            return;
        // Não sobrescreve status finais
        if (proc.status === StatusProcesso.FINALIZADO ||
            proc.status === StatusProcesso.REJEITADO ||
            proc.status === StatusProcesso.APROVADO) {
            return;
        }
        if (proc.status !== StatusProcesso.PRONTO_PARA_PROTOCOLO) {
            await atualizarStatusProcesso(proc.id, StatusProcesso.PRONTO_PARA_PROTOCOLO);
            setProcesso((prev) => (prev ? { ...prev, status: StatusProcesso.PRONTO_PARA_PROTOCOLO } : prev));
        }
    };
    const sincronizarChecklist = async (proc) => {
        const recomendados = obterRecomendadosUnicos(proc.tipo);
        if (recomendados.length === 0)
            return;
        // Busca documentos diretamente do banco
        let processoDocs = await db.documentosProcesso
            .where('processoId')
            .equals(proc.id)
            .toArray();
        // Mapeia chaves normalizadas dos documentos que já existem
        const chavasExistentes = new Set();
        for (const doc of processoDocs) {
            const chave = obterChaveNormalizada(doc.nome);
            chavasExistentes.add(chave);
        }
        // Adiciona documentos faltantes (se a chave normalizada não existe)
        for (const nome of recomendados) {
            const chave = obterChaveNormalizada(nome);
            if (!chavasExistentes.has(chave)) {
                await adicionarDocumentoProcesso({
                    processoId: proc.id,
                    documentoId: `req_${proc.tipo}_${chave.replace(/\s+/g, '_')}`,
                    nome: nome.trim(),
                    status: StatusDocumento.PENDENTE,
                });
                // Marca chave como adicionada para evitar duplicatas nesta sessão
                chavasExistentes.add(chave);
            }
        }
        // Verifica e remove qualquer duplicata que possa ter sido criada
        await removerDuplicados(proc.id);
    };
    const removerDuplicados = async (procId) => {
        // Busca documentos diretamente do banco (não depende do state do React)
        const docs = await db.documentosProcesso
            .where('processoId')
            .equals(procId)
            .toArray();
        if (docs.length <= 1)
            return;
        // Agrupa por chave normalizada
        const grupos = {};
        for (const doc of docs) {
            const chave = obterChaveNormalizada(doc.nome);
            if (!grupos[chave]) {
                grupos[chave] = [];
            }
            grupos[chave].push(doc);
        }
        // Remove duplicadas em cada grupo
        const pesoStatus = (status) => {
            switch (status) {
                case StatusDocumento.ENTREGUE:
                    return 3;
                case StatusDocumento.NAO_APLICAVEL:
                    return 2;
                case StatusDocumento.PENDENTE:
                case StatusDocumento.REJEITADO:
                default:
                    return 1;
            }
        };
        for (const [, itens] of Object.entries(grupos)) {
            if (itens.length <= 1)
                continue;
            // Mantém o item "mais avançado" (OK > Não precisa > Pendente)
            const ordenados = [...itens].sort((a, b) => {
                const diff = pesoStatus(b.status) - pesoStatus(a.status);
                if (diff !== 0)
                    return diff;
                const da = a.dataEntrega ? new Date(a.dataEntrega).getTime() : 0;
                const db = b.dataEntrega ? new Date(b.dataEntrega).getTime() : 0;
                return db - da;
            });
            const manter = ordenados[0];
            const remover = ordenados.slice(1);
            // Remove duplicados extras
            for (const extra of remover) {
                await deletarDocumentoProcesso(extra.id);
            }
            // Se algum duplicado tinha uma data de entrega e o mantido não tem, preserva
            if (manter.status === StatusDocumento.ENTREGUE && !manter.dataEntrega) {
                const comData = ordenados.find((d) => d.status === StatusDocumento.ENTREGUE && d.dataEntrega);
                if (comData?.dataEntrega) {
                    await atualizarDocumentoProcesso(manter.id, { dataEntrega: comData.dataEntrega });
                }
            }
        }
    };
    const handleAtualizarStatus = async (docId, novoStatus) => {
        try {
            await atualizarStatusDocumento(docId, novoStatus);
            setMensagem({ tipo: 'success', texto: 'Status do documento atualizado!' });
        }
        catch (error) {
            setMensagem({ tipo: 'error', texto: 'Erro ao atualizar status' });
        }
    };
    const handleDeletarDocumento = async (docId) => {
        if (window.confirm('Deletar este documento?')) {
            try {
                await deletarDocumentoProcesso(docId);
                setMensagem({ tipo: 'success', texto: 'Documento deletado!' });
            }
            catch (error) {
                setMensagem({ tipo: 'error', texto: 'Erro ao deletar documento' });
            }
        }
    };
    const documentosRecomendados = processo ? obterRecomendadosUnicos(processo.tipo) : [];
    // Deduplicação na renderização para garantir sem duplicatas
    const documentosUnicos = Array.from(documentosProcesso.reduce((mapa, doc) => {
        const chave = obterChaveNormalizada(doc.nome);
        const existente = mapa.get(chave);
        // Mantém o documento com status mais avançado
        const pesoStatus = (d) => {
            switch (d.status) {
                case StatusDocumento.ENTREGUE: return 3;
                case StatusDocumento.NAO_APLICAVEL: return 2;
                default: return 1;
            }
        };
        if (!existente || pesoStatus(doc) > pesoStatus(existente)) {
            mapa.set(chave, doc);
        }
        return mapa;
    }, new Map())
        .values());
    const documentosPendentes = documentosUnicos.filter((d) => d.status === StatusDocumento.PENDENTE).length;
    const documentosEntregues = documentosUnicos.filter((d) => d.status === StatusDocumento.ENTREGUE).length;
    const documentosNaoPrecisa = documentosUnicos.filter((d) => d.status === StatusDocumento.NAO_APLICAVEL).length;
    const documentosConcluidos = documentosEntregues + documentosNaoPrecisa;
    const percentualConclusao = documentosUnicos.length > 0 ? (documentosConcluidos / documentosUnicos.length * 100).toFixed(1) : 0;
    if (carregando) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Carregando..." })] }) }));
    }
    if (!processo) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 text-center", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-900 font-semibold mb-4", children: "Processo n\u00E3o encontrado" }), _jsx(Button, { variant: "secondary", onClick: onVoltar, children: "Voltar" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx(Button, { variant: "secondary", onClick: onVoltar, className: "mb-4", children: "\u2190 Voltar" }), _jsx("h1", { className: "text-4xl font-bold text-gray-900 mt-2", children: "Detalhes do Processo" })] }) }), mensagem && (_jsx(Alert, { type: mensagem.tipo, message: mensagem.texto, onClose: () => setMensagem(null) })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-8 border-l-4 border-primary-600", children: [_jsx("p", { className: "text-gray-500 text-xs font-semibold uppercase tracking-wide", children: "Tipo de Processo" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-3", children: nomesTipoProcesso[processo.tipo] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600", children: [_jsx("p", { className: "text-gray-500 text-xs font-semibold uppercase tracking-wide", children: "Status" }), _jsx("div", { className: "mt-3", children: _jsx("span", { className: `px-4 py-2 rounded-full text-sm font-bold ${coresStatusDocumento[StatusDocumento.PENDENTE]}`, children: nomesStatusProcesso[processo.status] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-8 border-l-4 border-green-600", children: [_jsx("p", { className: "text-gray-500 text-xs font-semibold uppercase tracking-wide", children: "Data de Abertura" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-3", children: new Date(processo.dataAbertura).toLocaleDateString('pt-BR') })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Descri\u00E7\u00E3o" }), _jsx("textarea", { value: processo.observacoes || '', onChange: async (e) => {
                            const novasObserv = e.target.value;
                            setProcesso((prev) => (prev ? { ...prev, observacoes: novasObserv } : prev));
                            try {
                                await atualizarProcesso(processo.id, { observacoes: novasObserv });
                                setMensagem({ tipo: 'success', texto: 'Descrição atualizada!' });
                            }
                            catch (error) {
                                setMensagem({ tipo: 'error', texto: 'Erro ao atualizar descrição' });
                            }
                        }, placeholder: "Adicione uma descri\u00E7\u00E3o para este processo...", className: "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none", rows: 4 })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-8", children: "Progresso da Documenta\u00E7\u00E3o" }), _jsxs("div", { className: "grid grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "text-center bg-green-50 rounded-lg p-6 border border-green-200", children: [_jsx("p", { className: "text-4xl font-bold text-green-600", children: documentosConcluidos }), _jsxs("p", { className: "text-sm text-green-700 flex items-center justify-center gap-2 mt-2 font-semibold", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), " Conclu\u00EDdos"] })] }), _jsxs("div", { className: "text-center bg-yellow-50 rounded-lg p-6 border border-yellow-200", children: [_jsx("p", { className: "text-4xl font-bold text-yellow-600", children: documentosPendentes }), _jsxs("p", { className: "text-sm text-yellow-700 flex items-center justify-center gap-2 mt-2 font-semibold", children: [_jsx(Clock, { className: "w-5 h-5" }), " Pendentes"] })] }), _jsxs("div", { className: "text-center bg-blue-50 rounded-lg p-6 border border-blue-200", children: [_jsxs("p", { className: "text-4xl font-bold text-blue-600", children: [percentualConclusao, "%"] }), _jsxs("p", { className: "text-sm text-blue-700 flex items-center justify-center gap-2 mt-2 font-semibold", children: [_jsx(FileText, { className: "w-5 h-5" }), " Progresso"] })] })] }), _jsx("div", { className: "w-full bg-gray-300 rounded-full h-4", children: _jsx("div", { className: "bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500 shadow-md", style: { width: `${percentualConclusao}%` } }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Documentos Requeridos" }), documentosUnicos.length === 0 && documentosRecomendados.length > 0 && (_jsxs("div", { className: "mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-blue-900", children: [_jsx("p", { className: "font-bold mb-3 text-lg", children: "\uD83D\uDCCB Documentos Recomendados para este Tipo de Processo:" }), _jsx("ul", { className: "list-disc list-inside space-y-2 text-sm", children: documentosRecomendados.map((doc, idx) => (_jsx("li", { className: "text-blue-800", children: doc }, idx))) })] })), documentosUnicos.length > 0 ? (_jsx("div", { className: "space-y-4", children: documentosUnicos.map((doc) => (_jsxs("div", { className: "flex items-center justify-between p-5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all", children: [_jsxs("div", { className: "flex items-center gap-4 flex-1", children: [_jsx(FileText, { className: "w-5 h-5 text-primary-600" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: doc.nome }), _jsx("p", { className: "text-sm text-gray-500", children: doc.status === StatusDocumento.ENTREGUE && doc.dataEntrega
                                                        ? `Marcado como OK em ${new Date(doc.dataEntrega).toLocaleDateString('pt-BR')}`
                                                        : doc.status === StatusDocumento.NAO_APLICAVEL
                                                            ? 'Não precisa'
                                                            : 'Pendente' })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 select-none", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500", checked: doc.status === StatusDocumento.ENTREGUE, onChange: (e) => handleAtualizarStatus(doc.id, e.target.checked ? StatusDocumento.ENTREGUE : StatusDocumento.PENDENTE) }), _jsx("span", { className: `px-2 py-1 rounded-md text-xs font-semibold ${coresStatusDocumento[StatusDocumento.ENTREGUE]}`, children: "OK" })] }), _jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-gray-700 select-none", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500", checked: doc.status === StatusDocumento.NAO_APLICAVEL, onChange: (e) => handleAtualizarStatus(doc.id, e.target.checked ? StatusDocumento.NAO_APLICAVEL : StatusDocumento.PENDENTE) }), _jsx("span", { className: `px-2 py-1 rounded-md text-xs font-semibold ${coresStatusDocumento[StatusDocumento.NAO_APLICAVEL]}`, children: "N\u00E3o precisa" })] })] }), _jsx("button", { onClick: () => handleDeletarDocumento(doc.id), className: "text-red-600 hover:text-red-900 transition-colors p-2", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, doc.id))) })) : (_jsxs("div", { className: "text-center py-8 text-gray-600", children: [_jsx(FileText, { className: "w-12 h-12 mx-auto mb-2 opacity-30" }), _jsx("p", { children: "Nenhum documento vinculado ainda" })] }))] })] }));
};
