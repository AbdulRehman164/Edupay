#!/bin/bash

set -e

APP_DIR="/var/www/edupay"

echo "Starting deployment..."

cd $APP_DIR || exit

echo "Pulling latest code..."
git pull origin main

echo "Installing server dependencies..."
cd server
npm install

echo "Installing client dependencies..."
cd ../client
npm install

echo "Building client..."
npm run build

echo "Configuring nginx..."
sudo cp ../deployment/nginx.conf /etc/nginx/sites-available/edupay

sudo ln -sf /etc/nginx/sites-available/edupay \
/etc/nginx/sites-enabled/edupay

sudo rm -f /etc/nginx/sites-enabled/default

echo "Testing nginx..."
sudo nginx -t

echo "Reloading nginx..."
sudo systemctl reload nginx

echo "Starting PM2..."
cd ../deployment

pm2 start ecosystem.config.cjs || pm2 restart ecosystem.config.cjs

pm2 save

echo "Deployment complete."
