#!/bin/bash

# -------------------------------
# Example deploy.sh
# -------------------------------

echo "Updating server..."
sudo apt update -y && sudo apt upgrade -y

echo "Installing Node, NGINX, Certbot..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

echo "Setting up your domain DNS:"
echo " -> Make sure *.yourcompany.com and @ point to this server's IP!"

echo "Placing your nginx.conf..."
sudo cp ./nginx.conf /etc/nginx/sites-available/yourcompany
sudo ln -s /etc/nginx/sites-available/yourcompany /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "Running Certbot to get wildcard cert..."
sudo certbot --nginx -d yourcompany.com -d "*.yourcompany.com"

echo "Starting backend..."
cd ../backend
npm install
nohup node src/server.js &

echo "DONE: Visit https://tenant1.yourcompany.com to test!"
