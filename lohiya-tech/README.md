# ⬡ Lohiya Tech — Full-Stack Web Application

A production-ready, full-stack web platform with dark tech aesthetics, user authentication, dashboard, and admin panel.

---

## 🗂 Project Structure

```
lohiya-tech/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT protect + adminOnly
│   ├── models/
│   │   └── User.js             # Mongoose User schema
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Me, Update, Logout
│   │   └── admin.js            # Admin user management
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Express entry point
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css       # Global dark-tech styles
│   │   ├── js/
│   │   │   └── app.js          # Auth, API, Toast utilities
│   │   └── index.html          # Home / Landing page
│   └── pages/
│       ├── login.html          # Login page
│       ├── register.html       # Registration page
│       ├── dashboard.html      # User dashboard
│       └── admin.html          # Admin panel
├── .gitignore
├── package.json
├── Procfile                    # For Railway / Heroku
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | JWT tokens, bcrypt hashing (salt=12), HTTP-only ready |
| 🛡️ Security | Helmet.js, CORS, rate limiting, input validation |
| 👤 User Profiles | Username, email, bio, role, last login |
| 📊 Dashboard | Stats, activity feed, profile editor |
| ⚙️ Admin Panel | User list, toggle active/inactive, promote to admin, delete |
| 📱 Responsive | Mobile-first, works on all screen sizes |
| 🎨 UI | Dark tech theme, Oxanium + JetBrains Mono fonts, cyan accents |

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (choose one):
  - Local: https://www.mongodb.com/try/download/community
  - Cloud (recommended): https://www.mongodb.com/atlas (free tier)

---

### Step 1 — Clone / Download the Project

```bash
# If using git:
git clone https://github.com/yourusername/lohiya-tech.git
cd lohiya-tech

# Or just unzip the downloaded folder and cd into it
cd lohiya-tech
```

---

### Step 2 — Install Dependencies

```bash
cd backend
npm install
```

---

### Step 3 — Configure Environment Variables

```bash
# Inside the backend/ folder:
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lohiyatech
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/lohiyatech

JWT_SECRET=change_this_to_a_long_random_string_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5000
```

**Generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### Step 4 — Start the Server

```bash
# From the backend/ folder:

# Development (auto-restart on file changes):
npm run dev

# OR Production:
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Lohiya Tech Server running on port 5000
🌐 http://localhost:5000
```

---

### Step 5 — Open in Browser

Visit: **http://localhost:5000**

| Page | URL |
|---|---|
| Home | http://localhost:5000/ |
| Register | http://localhost:5000/register |
| Login | http://localhost:5000/login |
| Dashboard | http://localhost:5000/dashboard |
| Admin Panel | http://localhost:5000/admin |
| API Health | http://localhost:5000/api/health |

---

### Step 6 — Create Your First Admin User

Register normally at `/register`, then in MongoDB shell or Compass:

```js
// MongoDB Compass or mongosh:
use lohiyatech
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Now log in and visit `/admin` to access the Admin Panel.

---

## 📡 API Reference

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/update-profile` | ✅ | Update username/bio |
| POST | `/api/auth/logout` | ✅ | Logout |

### Admin Endpoints (admin role required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | All users (paginated) |
| PUT | `/api/admin/users/:id/toggle-status` | Activate/deactivate |
| PUT | `/api/admin/users/:id/make-admin` | Promote to admin |
| DELETE | `/api/admin/users/:id` | Delete user |

---

## ☁️ Deploy Live

---

### Option A — Railway (Recommended, Free Tier)

1. Create account at https://railway.app
2. Click **New Project → Deploy from GitHub Repo**
3. Connect your GitHub and select your repo
4. In Railway dashboard → **Variables**, add:
   ```
   PORT=5000
   MONGODB_URI=<your Atlas URI>
   JWT_SECRET=<your secret>
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.railway.app
   ```
5. In **Settings → Start Command**, set:
   ```
   cd backend && node server.js
   ```
6. Railway auto-deploys on every `git push` 🚀

---

### Option B — Render (Free Tier)

1. Create account at https://render.com
2. Click **New → Web Service** → connect GitHub repo
3. Set:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
4. Add all environment variables in the **Environment** tab
5. Click **Create Web Service**

---

### Option C — VPS (DigitalOcean / AWS / Linode)

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
npm install -g pm2

# 4. Clone and install
git clone https://github.com/yourname/lohiya-tech.git
cd lohiya-tech/backend
npm install

# 5. Create .env file
nano .env
# (paste your env variables)

# 6. Start with PM2
pm2 start server.js --name lohiya-tech
pm2 save
pm2 startup

# 7. Install Nginx as reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/lohiyatech
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/lohiyatech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. SSL with Let's Encrypt (HTTPS)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### MongoDB Atlas (Cloud DB — required for deployment)

1. Go to https://www.mongodb.com/atlas → Create free account
2. Create a **Free Cluster (M0)**
3. Under **Database Access** → Add a user with password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect → Drivers** → Copy the connection string
6. Replace `<password>` in the string with your DB user password
7. Use this as your `MONGODB_URI` in environment variables

---

## 🔒 Security Checklist (Production)

- [ ] Change `JWT_SECRET` to a strong 64-char random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas with IP allowlist instead of open access
- [ ] Enable HTTPS (SSL certificate via Let's Encrypt)
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Never commit `.env` to git (it's in `.gitignore`)
- [ ] Regularly rotate JWT secrets

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Security | Helmet, CORS, express-rate-limit, express-validator |
| Fonts | Oxanium, JetBrains Mono (Google Fonts) |

---

## 📄 License

MIT License — Free to use and modify for personal and commercial projects.

---

**Built with ⚡ by Lohiya Tech Team**
