#!/bin/bash
set -e

echo "=========================================="
echo "  DEPLOY — Jovens Sarados (js.newflowsys.cloud)"
echo "=========================================="

APP_DIR="/var/www/jovens-sarados"
REPO="https://github.com/rfnhaia-boop/jovens-sarados.git"
DB_NAME="jovens_sarados"
DB_USER="js_user"
DB_PASS="JS_SENHA_FORTE"  # <-- TROQUE ESSA SENHA!

# ── 1. Dependências do sistema ──
echo ">>> Instalando dependências..."
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# Node.js 20 (se não tiver)
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

# pnpm
if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
fi

# PM2
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

# ── 2. PostgreSQL ──
echo ">>> Configurando banco de dados..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# ── 3. Clonar/atualizar repo ──
echo ">>> Clonando repositório..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull origin main
else
  sudo mkdir -p "$APP_DIR"
  sudo chown $USER:$USER "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# ── 4. Instalar dependências ──
echo ">>> Instalando dependências do projeto..."
pnpm install --frozen-lockfile

# ── 5. Configurar .env da API ──
cat > apps/api/.env <<EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
NODE_ENV=production
PORT=3021
EOF

# ── 6. Configurar .env do Web ──
cat > apps/web/.env <<EOF
NEXT_PUBLIC_SITE_URL=https://js.newflowsys.cloud
NEXT_PUBLIC_API_URL=https://js.newflowsys.cloud/api
NEXTAUTH_URL=https://js.newflowsys.cloud
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# ── 7. Migrations + Build ──
echo ">>> Rodando migrations..."
cd apps/api
pnpm exec prisma migrate deploy 2>/dev/null || pnpm exec prisma db push
cd ../..

echo ">>> Buildando projeto..."
pnpm build

# ── 8. PM2 ──
echo ">>> Iniciando com PM2..."
pm2 delete js-web js-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup 2>/dev/null || true

# ── 9. Nginx ──
echo ">>> Configurando Nginx..."
sudo cp deploy/nginx-js.conf /etc/nginx/sites-available/js.newflowsys.cloud
sudo ln -sf /etc/nginx/sites-available/js.newflowsys.cloud /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# ── 10. SSL ──
echo ">>> Gerando certificado SSL..."
sudo certbot --nginx -d js.newflowsys.cloud --non-interactive --agree-tos -m new.company.sys@gmail.com

echo ""
echo "=========================================="
echo "  PRONTO! Site no ar em:"
echo "  https://js.newflowsys.cloud"
echo "=========================================="
echo ""
echo "Comandos úteis:"
echo "  pm2 logs js-web     — ver logs do frontend"
echo "  pm2 logs js-api     — ver logs da API"
echo "  pm2 restart all     — reiniciar tudo"
echo "  cd $APP_DIR && git pull && pnpm build && pm2 restart all  — redeploy"
