#!/bin/bash

set -e

APP_DIR="/var/www/edupay"
APP_USER="$USER"
DB_NAME="edupay"
DB_USER="edupay_user"
DB_PASSWORD="CHANGE_THIS_PASSWORD"

echo "Updating system..."
sudo apt update

echo "Installing packages..."
sudo apt install -y \
  nginx \
  redis-server \
  postgresql \
  postgresql-contrib \
  git \
  curl \
  ufw

echo "Installing Node"
curl -fsSL https:\/\/deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

echo "Installing PM2..."
sudo npm install -g pm2

echo "Creating app directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $APP_USER:$APP_USER $APP_DIR

echo "Setting up PostgreSQL..."

sudo -u postgres psql <<EOF
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
REVOKE ALL ON DATABASE $DB_NAME FROM PUBLIC;
GRANT ALL ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo "Creating schema_migrations table..."

sudo -u postgres psql -d $DB_NAME <<EOF
CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
EOF

echo "Enabling Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

echo "Installing Chromium dependencies..."

sudo apt install -y \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libasound2 \
  libnss3 \
  libnspr4 \
  libgtk-3-0 \
  ca-certificates \
  fonts-liberation

echo "Configuring firewall..."

sudo ufw allow 22/tcp || true
sudo ufw allow 'Nginx Full' || true
sudo ufw --force enable

echo "Setup complete."
