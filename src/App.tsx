import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Dashboard, Pessoas, Processos, Configuracoes } from './pages';

type PageType = 'dashboard' | 'pessoas' | 'processos' | 'configuracoes';

function App() {
  const [paginaAtiva, setPaginaAtiva] = useState<PageType>('dashboard');
  const [novoProcessoPessoaId, setNovoProcessoPessoaId] = useState<string | null>(null);
  const [mostraMenu, setMostraMenu] = useState(false);

  const renderPagina = () => {
    switch (paginaAtiva) {
      case 'pessoas':
        return (
          <Pessoas
            onNovoProcesso={(pessoaId) => {
              setNovoProcessoPessoaId(pessoaId);
              setPaginaAtiva('processos');
            }}
          />
        );
      case 'processos':
        return (
          <Processos
            novoProcessoPessoaId={novoProcessoPessoaId}
            onConsumirNovoProcesso={() => setNovoProcessoPessoaId(null)}
          />
        );
      case 'configuracoes':
        return <Configuracoes />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={(page) => setPaginaAtiva(page as PageType)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Águia Despachante</h1>
                <p className="text-xs text-gray-500">Sistema de Gestão de Processos</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setPaginaAtiva('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setPaginaAtiva('pessoas')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'pessoas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pessoas
              </button>
              <button
                onClick={() => setPaginaAtiva('processos')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'processos'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Processos
              </button>
              <button
                onClick={() => setPaginaAtiva('configuracoes')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'configuracoes'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Configurações
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMostraMenu(!mostraMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mostraMenu ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mostraMenu && (
            <nav className="md:hidden mt-4 space-y-2 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setPaginaAtiva('dashboard');
                  setMostraMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setPaginaAtiva('pessoas');
                  setMostraMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'pessoas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pessoas
              </button>
              <button
                onClick={() => {
                  setPaginaAtiva('processos');
                  setMostraMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'processos'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Processos
              </button>
              <button
                onClick={() => {
                  setPaginaAtiva('configuracoes');
                  setMostraMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  paginaAtiva === 'configuracoes'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Configurações
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPagina()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Sobre</h3>
              <p className="text-sm text-gray-600">
                Águia Despachante é um sistema moderno para gestão de processos administrativos com armazenamento 100% local.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Funcionalidades</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Cadastro de Pessoas</li>
                <li>✓ Gerenciamento de Processos</li>
                <li>✓ Controle de Documentação</li>
                <li>✓ Armazenamento Local</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informações</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Versão: 1.0.0</li>
                <li>Modo: Offline</li>
                <li>Status: Online</li>
                <li>© 2025 - Todos os direitos reservados</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
