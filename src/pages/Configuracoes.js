import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useConfiguracoesStore } from '../stores/configuracoesStore';
import { Button, Alert, Input } from '../components';
import { Settings, Database, Download, Upload } from 'lucide-react';
import { db } from '../db/database';
export const Configuracoes = () => {
    const { carregarConfiguracoes, salvarConfiguracao, erro } = useConfiguracoesStore();
    const [caminhoBD, setCaminhoBD] = useState('IndexedDB (Navegador)');
    const [mensagem, setMensagem] = useState(null);
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            setMensagem({ tipo: 'error', texto: 'Erro ao exportar dados' });
        }
    };
    const handleImportarDados = async (e) => {
        try {
            const file = e.target.files?.[0];
            if (!file)
                return;
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
        }
        catch (error) {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Configura\u00E7\u00F5es" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gerenciar configura\u00E7\u00F5es do sistema e armazenamento de dados" })] }), mensagem && (_jsx(Alert, { type: mensagem.tipo, message: mensagem.texto, onClose: () => setMensagem(null) })), erro && (_jsx(Alert, { type: "error", message: erro, onClose: () => { } })), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Database, { className: "w-5 h-5 text-primary-600" }), _jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "Armazenamento de Dados" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Local de Armazenamento", value: caminhoBD, onChange: (e) => setCaminhoBD(e.target.value), helperText: "Onde os dados ser\u00E3o salvos (padr\u00E3o: IndexedDB do navegador)" }), _jsx(Input, { label: "Nome do Banco de Dados", value: nomeBD, onChange: (e) => setNomeBD(e.target.value), helperText: "Nome identificador do banco de dados" }), _jsx(Input, { label: "Vers\u00E3o do Banco", type: "number", value: versaoBD, onChange: (e) => setVersaoBD(e.target.value), helperText: "Vers\u00E3o do schema do banco de dados" }), _jsxs(Button, { variant: "primary", onClick: handleSalvarConfiguracoes, className: "w-full", children: [_jsx(Settings, { className: "w-4 h-4" }), "Salvar Configura\u00E7\u00F5es"] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-4", children: "Backup e Restaura\u00E7\u00E3o" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Exportar todos os dados para arquivo" }), _jsxs(Button, { variant: "success", onClick: handleExportarDados, className: "w-full", children: [_jsx(Download, { className: "w-4 h-4" }), "Exportar Dados"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Importar dados de um arquivo anterior" }), _jsxs(Button, { variant: "primary", onClick: handleClickImportar, className: "w-full", children: [_jsx(Upload, { className: "w-4 h-4" }), "Importar Dados"] }), _jsx("input", { id: "import-file-input", type: "file", accept: ".json", onChange: handleImportarDados, className: "hidden" })] })] }), _jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "\uD83D\uDCA1 Dica de Seguran\u00E7a:" }), _jsx("p", { children: "Fa\u00E7a backups regulares dos seus dados. Os dados s\u00E3o armazenados localmente no seu navegador e n\u00E3o podem ser recuperados se voc\u00EA limpar o cache." })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-4", children: "Informa\u00E7\u00F5es do Sistema" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Vers\u00E3o da App" }), _jsx("p", { className: "text-lg font-semibold text-gray-900 mt-1", children: "1.0.0" })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Modo de Opera\u00E7\u00E3o" }), _jsx("p", { className: "text-lg font-semibold text-gray-900 mt-1", children: "Offline" })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Banco de Dados" }), _jsx("p", { className: "text-lg font-semibold text-gray-900 mt-1", children: "IndexedDB" })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Estado" }), _jsx("p", { className: "text-lg font-semibold text-green-600 mt-1", children: "Online" })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Navegador" }), _jsx("p", { className: "text-lg font-semibold text-gray-900 mt-1", children: "Suportado" })] }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Storage Local" }), _jsx("p", { className: "text-lg font-semibold text-gray-900 mt-1", children: "Dispon\u00EDvel" })] })] })] }), _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-red-900 mb-4", children: "\u26A0\uFE0F Zona de Perigo" }), _jsx("p", { className: "text-red-800", children: "As a\u00E7\u00F5es abaixo s\u00E3o irrevers\u00EDveis. Use com cuidado!" }), _jsx(Button, { variant: "danger", onClick: handleLimparDados, className: "w-full", children: "Limpar Todos os Dados" })] })] }));
};
