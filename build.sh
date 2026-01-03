#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Navigate to classic directory
cd classic

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci --prefer-offline --no-audit --silent
else
  echo "✅ node_modules found, skipping installation"
fi

# Run prebuild (fetch content)
echo "📥 Running prebuild..."
npm run fetch-content || true

# Build Docusaurus
echo "🏗️  Building Docusaurus..."
NODE_OPTIONS='--max-old-space-size=4096' npm run build

echo "✅ Build completed successfully!"

