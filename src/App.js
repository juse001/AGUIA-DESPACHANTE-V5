import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Dashboard, Pessoas, Processos, Configuracoes } from './pages';
function App() {
    const [paginaAtiva, setPaginaAtiva] = useState('dashboard');
    const [novoProcessoPessoaId, setNovoProcessoPessoaId] = useState(null);
    const [mostraMenu, setMostraMenu] = useState(false);
    const renderPagina = () => {
        switch (paginaAtiva) {
            case 'pessoas':
                return (_jsx(Pessoas, { onNovoProcesso: (pessoaId) => {
                        setNovoProcessoPessoaId(pessoaId);
                        setPaginaAtiva('processos');
                    } }));
            case 'processos':
                return (_jsx(Processos, { novoProcessoPessoaId: novoProcessoPessoaId, onConsumirNovoProcesso: () => setNovoProcessoPessoaId(null) }));
            case 'configuracoes':
                return _jsx(Configuracoes, {});
            case 'dashboard':
            default:
                return _jsx(Dashboard, { onNavigate: (page) => setPaginaAtiva(page) });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow sticky top-0 z-40", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-lg", children: "A" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "\u00C1guia Despachante" }), _jsx("p", { className: "text-xs text-gray-500", children: "Sistema de Gest\u00E3o de Processos" })] })] }), _jsxs("nav", { className: "hidden md:flex items-center gap-1", children: [_jsx("button", { onClick: () => setPaginaAtiva('dashboard'), className: `px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'dashboard'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'}`, children: "Dashboard" }), _jsx("button", { onClick: () => setPaginaAtiva('pessoas'), className: `px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'pessoas'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'}`, children: "Pessoas" }), _jsx("button", { onClick: () => setPaginaAtiva('processos'), className: `px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'processos'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'}`, children: "Processos" }), _jsx("button", { onClick: () => setPaginaAtiva('configuracoes'), className: `px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'configuracoes'
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'}`, children: "Configura\u00E7\u00F5es" })] }), _jsx("button", { onClick: () => setMostraMenu(!mostraMenu), className: "md:hidden p-2 rounded-lg hover:bg-gray-100", children: mostraMenu ? (_jsx(X, { className: "w-6 h-6 text-gray-700" })) : (_jsx(Menu, { className: "w-6 h-6 text-gray-700" })) })] }), mostraMenu && (_jsxs("nav", { className: "md:hidden mt-4 space-y-2 border-t border-gray-200 pt-4", children: [_jsx("button", { onClick: () => {
                                        setPaginaAtiva('dashboard');
                                        setMostraMenu(false);
                                    }, className: `block w-full text-left px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'dashboard'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'}`, children: "Dashboard" }), _jsx("button", { onClick: () => {
                                        setPaginaAtiva('pessoas');
                                        setMostraMenu(false);
                                    }, className: `block w-full text-left px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'pessoas'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'}`, children: "Pessoas" }), _jsx("button", { onClick: () => {
                                        setPaginaAtiva('processos');
                                        setMostraMenu(false);
                                    }, className: `block w-full text-left px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'processos'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'}`, children: "Processos" }), _jsx("button", { onClick: () => {
                                        setPaginaAtiva('configuracoes');
                                        setMostraMenu(false);
                                    }, className: `block w-full text-left px-4 py-2 rounded-lg transition-colors ${paginaAtiva === 'configuracoes'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'}`, children: "Configura\u00E7\u00F5es" })] }))] }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: renderPagina() }), _jsx("footer", { className: "bg-gray-100 border-t border-gray-200 mt-16", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Sobre" }), _jsx("p", { className: "text-sm text-gray-600", children: "\u00C1guia Despachante \u00E9 um sistema moderno para gest\u00E3o de processos administrativos com armazenamento 100% local." })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Funcionalidades" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2713 Cadastro de Pessoas" }), _jsx("li", { children: "\u2713 Gerenciamento de Processos" }), _jsx("li", { children: "\u2713 Controle de Documenta\u00E7\u00E3o" }), _jsx("li", { children: "\u2713 Armazenamento Local" })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Informa\u00E7\u00F5es" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "Vers\u00E3o: 1.0.0" }), _jsx("li", { children: "Modo: Offline" }), _jsx("li", { children: "Status: Online" }), _jsx("li", { children: "\u00A9 2025 - Todos os direitos reservados" })] })] })] }) }) })] }));
}
export default App;
