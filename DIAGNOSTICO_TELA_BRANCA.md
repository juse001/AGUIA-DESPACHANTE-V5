# 🔍 Diagnóstico - Tela Branca

Se você está vendo uma **tela completamente branca** após seguir o guia, siga estes passos:

## Passo 1: Verificar Erros no Navegador (IMPORTANTE!)

1. **Abra o navegador** em `http://localhost:4173/`
2. **Pressione `F12`** para abrir DevTools
3. Clique na aba **Console**
4. Procure por **mensagens em vermelho** (erros)
5. **Copie o erro e envie para suporte**

Exemplo de erro comum:
```
Uncaught TypeError: Cannot read property 'xxx' of undefined
```

---

## Passo 2: Reconstruir do Zero (Nuclear Option)

Se não vir erro no console, tente limpar tudo:

```powershell
# 1. Parar o servidor (pressione CTRL+C)

# 2. Limpar cache npm
npm cache clean --force

# 3. Deletar pasta node_modules
rmdir /s /q node_modules

# 4. Deletar package-lock.json
del package-lock.json

# 5. Reinstalar tudo
npm install

# 6. Compilar novamente
npm run build

# 7. Rodar servidor
npm run preview
```

⏱️ Isso leva 10-15 minutos, mas resolve a maioria dos problemas.

---

## Passo 3: Limpar Dados Armazenados

Às vezes IndexedDB fica corrompido:

1. Na página branca, pressione `F12`
2. Vá para **Application tab**
3. No menu esquerdo: **IndexedDB**
4. Clique em **AguiaDespachante**
5. Clique com botão direito → **Delete database**
6. Recarregue a página: `Ctrl+R`

---

## Passo 4: Testar Arquivo HTML Direto

Se o servidor está causando problema:

1. **Feche o servidor**: `CTRL+C` no PowerShell
2. **Abra Windows Explorer**
3. Navigate para sua pasta do projeto
4. Abra a pasta `dist/`
5. **Dê duplo clique em `index.html`**

Se abrir corretamente, o problema é do servidor `npm run preview`.

---

## Passo 5: Verificar Build

Certifique-se que a pasta `dist/` existe com arquivos:

```powershell
# Verificar se dist/ foi criado
dir dist/

# Deve mostrar algo como:
# - index.html
# - assets/ (pasta)
# - vite.svg
```

Se `dist/` não existir, o build falhou.

---

## Passo 6: Reexecução Limpa

```powershell
# Fechar servidor (CTRL+C)

# Executar tudo de novo
npm run build
npm run preview
```

Aguarde aparecer:
```
VITE v5.x.x ready in XXX ms
Local:   http://localhost:4173/
```

---

## 📞 Se Ainda Não Funcionar

Me informe:
1. ✅ Resultado do console.log (passo 1)
2. ✅ Se tela aparece em `dist/index.html` (passo 4)
3. ✅ Versão do Node.js: `node -v`
4. ✅ Mensagem de erro completa (se houver)

---

**Dica:** A maioria dos problemas resolve com o "Passo 2 - Reconstruir do Zero" 🚀
