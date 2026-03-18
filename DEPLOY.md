# Azure VM Deployment Guide
VM IP: 20.40.41.165

---

## Step 1 — Local: Build frontend & push to Git

```bash
# Root directory mein
npm run build

# Git push
git add .
git commit -m "feat: production deployment setup"
git push
```

---

## Step 2 — VM pe SSH karo

```bash
ssh azureuser@20.40.41.165
```

---

## Step 3 — VM pe Node.js, Nginx, PM2 install karo (pehli baar)

```bash
# Node.js 20 install
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx install
sudo apt-get install -y nginx

# PM2 install
sudo npm install -g pm2
```

---

## Step 4 — Project clone karo VM pe

```bash
sudo mkdir -p /var/www/ishwar-rugs
sudo chown $USER:$USER /var/www/ishwar-rugs
cd /var/www/ishwar-rugs
git clone <YOUR_REPO_URL> .
```

---

## Step 5 — Dependencies install karo

```bash
# Root dependencies (frontend build ke liye)
cd /var/www/ishwar-rugs
npm install

# Server dependencies
cd server
npm install
cd ..
```

---

## Step 6 — .env file banao server mein

```bash
nano /var/www/ishwar-rugs/server/.env
```

Yeh content daalo:
```
PORT=5000
HOST=0.0.0.0
MONGO_URI=mongodb://fatmazainab071:zainab1*@iconicdb-shard-00-00.rzr7n.mongodb.net:27017,...
PASSWORD=dgxifjbbquqpgpns
GMAIL=adilshah25012@gmail.com
SECRET_KEY=JSIUHJNEFGSBNXEDYGXVBEDCYDH
RAZORPAY_KEY_ID=rzp_test_SLUVKNaHhGAsOd
RAZORPAY_KEY_SECRET=iZTqvbvamUufeyKKggE0QEsQ
CLIENT_URL=http://20.40.41.165
```

---

## Step 7 — Frontend build karo (agar locally nahi kiya)

```bash
cd /var/www/ishwar-rugs
npm run build
```

Build output: `/var/www/ishwar-rugs/dist/public/`

---

## Step 8 — Nginx configure karo

```bash
sudo cp /var/www/ishwar-rugs/nginx.conf /etc/nginx/sites-available/ishwar-rugs
sudo ln -s /etc/nginx/sites-available/ishwar-rugs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Step 9 — Backend PM2 se start karo

```bash
cd /var/www/ishwar-rugs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Startup command jo aayega usse run karo (sudo wala).

---

## Step 10 — Azure Firewall mein port 80 open karo

Azure Portal → IshwarRugsDev VM → Networking → Inbound port rules → Add rule:
- Port: 80
- Protocol: TCP
- Action: Allow

---

## Check karo

```bash
# Backend running hai?
pm2 status

# Nginx running hai?
sudo systemctl status nginx

# Backend directly test karo
curl http://localhost:5000/
```

Browser mein kholo: http://20.40.41.165

---

## Agar code update karna ho baad mein

```bash
cd /var/www/ishwar-rugs
git pull
npm install
npm run build        # frontend rebuild
pm2 restart ishwar-rugs-backend
```
