#!/bin/sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌿 Flora Depok — Backend Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "🔄 Menjalankan migrasi database..."
npx prisma migrate deploy

echo ""
echo "🌱 Menjalankan seeder (idempotent, aman dijalankan ulang)..."
npx tsx prisma/seed.ts

echo ""
echo "🚀 Memulai server..."
exec node dist/index.js
