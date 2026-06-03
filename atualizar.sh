#!/bin/bash

# Configura o script para parar caso algum comando falhe
set -e

echo "=================================================="
echo "🚀 Iniciando Atualização do VogaisApp..."
echo "=================================================="

# 1. Adicionar todos os arquivos (novos, modificados e deletados)
echo "📦 Adicionando novos arquivos ao Git..."
git add -A

# 2. Criar commit das alterações
echo "✍️ Criando commit..."
COMMIT_MSG="Upgrade: Interface premium, suporte multilíngue (PT/EN), contagem até 10, frases para cores e 40 áudios MP3 offline"
git commit -m "$COMMIT_MSG"

# 3. Enviar para a branch gh-pages no GitHub
echo "📤 Enviando atualizações para o GitHub (gh-pages)..."
git push origin gh-pages

echo "=================================================="
echo "✅ Sucesso! O aplicativo foi atualizado!"
echo "👉 Acesse em: https://idiogolima.github.io/vogaisapp/"
echo "=================================================="
