# 📋 Guia de Instalação - Águia Despachante v1.0.0 no Windows 11

## ⚠️ IMPORTANTE: Dados Sensíveis
Este aplicativo armazena dados sensíveis localmente. Siga este guia com cuidado para NÃO PERDER dados.

---

## 📋 Pré-requisitos

### 1️⃣ Instalar Node.js no Windows 11

1. Acesse: https://nodejs.org
2. **Baixe a versão LTS** (Long Term Support)
3. Execute o instalador e siga as instruções
4. **Deixe marcadas as opções:**
   - ✅ Node.js runtime
   - ✅ npm package manager
   - ✅ Add to PATH (importante!)
5. Reinicie o PC/PowerShell

**Verificar instalação:**
```powershell
node -v
npm -v
```

### 2️⃣ Instalar Git (Opcional, mas recomendado)
1. Acesse: https://git-scm.com
2. Execute o instalador
3. Deixe as opções padrão

---

## 🚀 Instalação do Águia Despachante

### Passo 1: Baixar o Projeto

**Opção A - Com Git (recomendado):**
```powershell
git clone https://github.com/juse001/AGUIA-DESPACHANTE-V5.git
cd AGUIA-DESPACHANTE-V5
```

**Opção B - Sem Git:**
1. Acesse: https://github.com/juse001/AGUIA-DESPACHANTE-V5
2. Clique em **"Code"** → **"Download ZIP"**
3. Extraia a pasta em um local seguro (ex: `C:\Users\SeuUsuario\Documentos\`)
4. Abra PowerShell nessa pasta

### Passo 2: Instalar Dependências

```powershell
npm install
```

Isso baixará todas as bibliotecas necessárias (React, Dexie, etc).

**⏱️ Isso pode levar 5-10 minutos na primeira vez.**

---

## 🏭 Gerar Versão de Produção

### Passo 3: Compilar para Produção

```powershell
npm run build
```

**Isso irá:**
- ✅ Compilar todo o código TypeScript
- ✅ Otimizar para performance
- ✅ Criar pasta `dist/` com os arquivos finais
- ✅ Geração completa leva 1-3 minutos

---

## ▶️ Rodar o Sistema Final

### Opção A: Servir Localmente (Recomendado para Desenvolvimento)

Após o build, rode:

```powershell
npm run preview
```

Acesse no navegador:
```
http://localhost:4173/
```

Este servidor mantém os dados salvos no IndexedDB do navegador.

### Opção B: Executar o Arquivo HTML Diretamente (Produção Pura)

Depois do `npm run build`, abra o Windows Explorer:

1. Navegar para a pasta do projeto
2. Abrir `dist/` → `index.html` (duplo clique)
3. Abre no navegador padrão

---

## 💾 Proteção de Dados - Backup e Recuperação

### ⚠️ CRÍTICO: Sua Estratégia de Backup

Como os dados ficam no navegador (IndexedDB), você precisa fazer backups regulares.

### Método 1: Exportar Dados (Dentro do App)

**Siga os passos no app:**
1. Abra o app, vá para **Configurações**
2. Clique em **"Exportar Dados"**
3. O app vai baixar um arquivo `.json` contendo TODOS os dados
4. **Salve esse arquivo em local seguro:**
   - ✅ Pasta do próprio projeto
   - ✅ Pendrive/Disco externo
   - ✅ OneDrive/Google Drive (criptografado)

### Método 2: Restaurar Dados

Se precisar recuperar:
1. Abra o app novamente
2. Vá para **Configurações**
3. Clique em **"Importar Dados"**
4. Selecione o arquivo `.json` salvo anteriormente
5. Os dados serão restaurados completamente

### Método 3: Fazer Backup Manual do IndexedDB

**Localizar arquivo do navegador:**

**Chrome/Edge/Brave:**
```
C:\Users\SEU_USUARIO\AppData\Local\[NAVEGADOR]\User Data\Default\IndexedDB
```

**Firefox:**
```
C:\Users\SEU_USUARIO\AppData\Roaming\Mozilla\Firefox\Profiles\[PERFIL].default-release\storage\to
```

---

## 🔒 Segurança para Dados Sensíveis

### Recomendações Importantes:

1. **Use Navegador Privado/Incógnito?** ❌ NÃO
   - IndexedDB NÃO funciona em modo privado
   - Os dados sumem ao fechar a janela

2. **Criptografe seus Backups:**
   - Use ferramentas como 7-Zip com senha
   - Ou guarde em pasta criptografada do Windows

3. **Desfaça Acesso ao PC:**
   - Coloque senha no Windows
   - Use BitLocker para criptografar disco (Windows Pro+)

4. **Não Sincronize com Nuvem Diretamente:**
   - O arquivo `dist/` pode ser copiado para outro PC
   - Mas NÃO sincronize a pasta inteira com OneDrive (pode corromper dados)

5. **Limpe Cache Periodicamente:**
   - Se notar lentidão, limpe cache do navegador (mas FAÇA BACKUP ANTES!)

---

## 📊 Fluxo de Uso Completo

```
1. npm install          → Download das dependências
                           ⏱️ Apenas na primeira vez
                           
2. npm run build        → Gerar versão otimizada
                           ⏱️ Sempre que atualizar código
                           
3. npm run preview      → Rodar localmente
                           http://localhost:4173/
                           
4. Usar o app           → Adicionar pessoas, processos, etc
                           Dados salvos automaticamente no navegador
                           
5. Exportar dados       → Dentro do app, em Configurações
                           Guardar backup seguro
                           
6. Fechar navegador     → Dados permanecem salvos!
```

---

## 🆘 Solução de Problemas

### ❌ "npm: comando não encontrado"
- Node.js não foi instalado ou não está no PATH
- **Solução:** Reinstale Node.js e reinicie o PowerShell

### ❌ "ERR! code E404" durante npm install
- Problema de internet ou repositório
- **Solução:** 
  ```powershell
  npm cache clean --force
  npm install
  ```

### ❌ Tela Branca Após Abrir o App
- Pode ser erro de compilação ou dados corrompidos
- **Passo 1: Verificar Console do Navegador**
  1. Abra o navegador no `http://localhost:4173/`
  2. Pressione `F12` (abrir DevTools)
  3. Vá para a aba **Console**
  4. Procure por mensagens de erro em vermelho
  5. Se houver erro, me informe o texto exato

- **Passo 2: Limpar Cache e Reconstruir**
  ```powershell
  # Parar o servidor (CTRL+C)
  npm cache clean --force
  rmdir /s node_modules
  npm install
  npm run build
  npm run preview
  ```

- **Passo 3: Se Continuar Branco**
  ```powershell
  # Limpar dados armazenados do navegador
  # No DevTools (F12) → Application → IndexedDB → AguiaDespachante → Deletar
  ```
  Depois recarregue a página (`Ctrl+R`)

- **Passo 4: Testar Arquivo HTML Direto**
  1. Feche o servidor (`CTRL+C`)
  2. Abra Windows Explorer
  3. Vá para: `dist/index.html` (duplo clique)
  4. Se abrir corretamente, o problema é do servidor

### ❌ Dados sumiram após atualizar navegador
- Você limpou o cache/cookies
- **Solução:** Importe backup se tiver

### ❌ npm run build dá erro
- Pode haver arquivos TypeScript incorretos
- **Solução:**
  ```powershell
  npm run build 2>&1 | more
  ```
  (mostra erro completo)

### ❌ Porta 4173 já está em uso
- Outro aplicativo está usando a porta
- **Solução:** Feche outros apps ou use outra porta
  ```powershell
  npm run preview -- --port 5000
  ```

### ❌ Execução de Scripts Desabilitada no PowerShell
- Windows bloqueou script `.ps1`
- **Solução:** Use o arquivo `.bat`
  ```
  Dê duplo clique em: iniciar.bat
  ```
  Ou use: `npm install` (linha de comando diretamente)

---

## 📱 Acessar de Outro PC na Mesma Rede

Se quiser compartilhar com outro PC:

```powershell
npm run preview -- --host
```

Depois acesse de outro PC:
```
http://[SEU_IP_LOCAL]:4173/
```

**⚠️ NÃO use externamente sem VPN/Firewall!**

---

## 🔄 Atualizar o Código

Se baixou atualizações do projeto:

**Com Git:**
```powershell
git pull
npm install
npm run build
npm run preview
```

**Manualmente:**
1. Baixe arquivo ZIP novo
2. Extraia em pasta nova
3. Copie o arquivo de backup dos dados
4. Coloque no novo projeto
5. Siga passos de instalação novamente

---

## 📞 Próximos Passos

- [ ] Instale Node.js
- [ ] Clone/Baixe o projeto
- [ ] Rode `npm install`
- [ ] Rode `npm run build`
- [ ] Rode `npm run preview`
- [ ] Abra http://localhost:4173/
- [ ] Customize em **Configurações**
- [ ] Faça primeiro backup dos dados
- [ ] Use o sistema!

---

**Versão do Guia:** 1.0.0  
**Data:** Fevereiro 2026  
**Plataforma:** Windows 11 + Node.js LTS
