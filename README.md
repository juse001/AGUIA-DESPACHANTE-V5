# Águia Despachante - v1.0.0

## 🎯 Sistema de Gestão de Processos Administrativos

Um webapp moderno, 100% offline e local, desenvolvido para gerenciar e acompanhar processos administrativos com total privacidade e segurança.

### ✨ Funcionalidades

- **👥 Cadastro de Pessoas**: Gerenciar pessoas físicas com dados completos
- **📋 Gerenciamento de Processos**: Criar, editar e acompanhar diversos tipos de processos
- **📄 Controle de Documentação**: Marcar documentos como entregues ou pendentes
- **📊 Dashboard Inteligente**: Visualizar indicadores e status dos processos
- **💾 Armazenamento Local**: Todos os dados salvos no seu navegador (IndexedDB)
- **⚙️ Configurações Flexíveis**: Escolher onde e como os dados são armazenados
- **💾 Backup e Restauração**: Exportar e importar dados facilmente
- **🔒 Privacidade Total**: Nenhum dado sai do seu computador

### 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── db/               # Configuração do banco de dados
├── pages/            # Páginas da aplicação
├── stores/           # Gerenciamento de estado (Zustand)
├── types/            # Tipos TypeScript
├── utils/            # Utilitários e constantes
├── App.tsx           # Componente principal
├── main.tsx          # Ponto de entrada
└── index.css         # Estilos globais
```

### 🏗️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Estado**: Zustand
- **Banco de Dados**: Dexie.js (IndexedDB)
- **Icons**: Lucide React

### 💾 Persistência de Dados

O sistema utiliza **IndexedDB** para armazenamento offline:

- Todos os dados são salvos localmente no navegador
- Nenhum dado é enviado para servidores externos
- É possível configurar onde os dados são salvos
- Backup automático e manual disponível

### 📊 Modelos de Dados

#### Pessoa
- ID único
- Nome, CPF, Telefone
- Email e Endereço (opcionais)
- Senha Gov (armazenada localmente)
- Data de cadastro e atualização

#### Processo
- ID único
- Vinculado a uma pessoa
- Tipo de processo (11 tipos disponíveis)
- Status do processo
- Número identificador
- Data de abertura e prazo
- Lista de documentos requeridos

#### Documento
- ID único
- Vinculado a um processo
- Status (Pendente, Entregue, Rejeitado, Não Aplicável)
- Observações e data de entrega
- Referência a arquivo (quando aplicável)

### 🔧 Tipos de Processos

1. Aquisição de Arma de Fogo SINARM
2. Aquisição de Arma de Fogo CR (Acervo de Atirador)
3. Aquisição de Arma de Fogo CR (Acervo de Caçador)
4. CRAF CR
5. Guia de Tráfego (Caça)
6. Guia de Tráfego (Mudança de Acervo)
7. Guia de Tráfego (Recuperação)
8. Guia de Tráfego (Tiro)
9. Guia de Tráfego SINARM
10. Transferência de Arma de Fogo CR
11. CR Atirador e Caçador (Concessão e Apostilamento)

### 📈 Indicadores do Dashboard

- **Total de Pessoas**: Contagem de pessoas cadastradas
- **Total de Processos**: Quantidade de processos registrados
- **Processos Abertos**: Processos em andamento
- **Documentação Completa**: Processos com todos os documentos entregues
- **Taxa de Conclusão**: Percentual geral de conclusão

### ⚙️ Configurações

A aplicação permite configurar:

- Local de armazenamento dos dados
- Nome do banco de dados
- Versão do schema
- Pontos de backup e restauração
- Limpeza de dados (com confirmação)

### 🛡️ Segurança

- ✅ Dados armazenados localmente
- ✅ Sem transmissão de dados pela internet
- ✅ Sem necessidade de login ou autenticação
- ✅ Criptografia nativa do navegador (opcional)
- ✅ Backup em arquivo JSON protegido

### 🐛 Resolução de Problemas

**Dados desapareceram?**
- Verifique se o localStorage foi limpo
- Tente restaurar um backup anterior

**Página não carrega?**
- Verifique se o navegador suporta IndexedDB
- Tente limpar o cache do navegador
- Verifique o console (F12) para erros

### 📝 Roadmap v2.0

- [ ] Alertas automáticos de prazos
- [ ] Notificações por email
- [ ] Sincronização opcional com servidor
- [ ] Upload de documentos
- [ ] Relatórios em PDF
- [ ] Impressão de checklists
- [ ] Filtros avançados
- [ ] Temas customizáveis
- [ ] Modo escuro
- [ ] Suporte multi-idioma

### 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, faça um fork e envie um pull request.

### 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

### 👨‍💻 Autor

Desenvolvido com ❤️ para profissionais que trabalham com gestão de processos.

### 📞 Suporte

Para dúvidas ou sugestões, entre em contato ou abra uma issue no repositório.

---

**Versão**: 1.0.0  
**Última atualização**: Fevereiro de 2025  
**Modo**: 100% Offline  
**Status**: Produção ✅
