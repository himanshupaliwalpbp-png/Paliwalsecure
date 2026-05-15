#!/bin/bash
# ── Vercel Build Script ──────────────────────────────────────────────────
# This script runs during Vercel build to:
# 1. Switch Prisma schema from SQLite to PostgreSQL (for Vercel's serverless environment)
# 2. Generate Prisma Client
# 3. Run Next.js build

set -e

echo "🔧 Building for Vercel (PostgreSQL)..."

# The main schema.prisma already has provider = "postgresql"
# Just generate the client and build

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Running Next.js build..."
npx next build

echo "✅ Vercel build complete!"
