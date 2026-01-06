# Citizen Complaint Webapp

A modern web application for citizens to report complaints and track their status, built with React and Laravel.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Radix UI, Leaflet (Maps)
- **Backend**: Laravel 10 (PHP)
- **Database**: MySQL / SQLite (configurable in Laravel)

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16+ recommended) & npm
- [PHP](https://www.php.net/) (v8.1+)
- [Composer](https://getcomposer.org/) (PHP Dependency Manager)
- [MySQL](https://www.mysql.com/) (v8.0+ recommended) or SQLite

### PHP Extensions Required

Install these PHP extensions:

```bash
# Ubuntu/Debian
sudo apt install php-mysql php-sqlite3 php-mbstring php-xml php-curl php-zip php-bcmath php-json php-tokenizer php-fileinfo php-openssl

# CentOS/RHEL
sudo yum install php-mysql php-sqlite php-mbstring php-xml php-curl php-zip php-bcmath php-json php-tokenizer php-fileinfo php-openssl

# macOS with Homebrew
brew install php@8.1

# Windows
# 1. Download PHP from https://windows.php.net/download/
# 2. Add PHP to your system PATH
# 3. Edit php.ini and uncomment the following extensions:
extension=pdo_mysql
extension=sqlite3
extension=mbstring
extension=xml
extension=curl
extension=zip
extension=bcmath
extension=json
extension=tokenizer
extension=fileinfo
extension=openssl
```

## 🗄️ Database Setup

### Option 1: MySQL (Recommended)

1. **Start MySQL service:**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mysql
   
   # On macOS with Homebrew
   brew services start mysql
   
   # On Windows (if installed as service)
   net start mysql
   ```

2. **Create database and set password:**
   ```bash
   # Connect to MySQL and create database
   mysql -u root -p
   CREATE DATABASE laravel;
   
   # If root has no password, set one:
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
   EXIT;
   ```

3. **Update .env file:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=root
   DB_PASSWORD=password
   ```

### Option 2: SQLite (Alternative)

For simpler setup, you can use SQLite:

1. **Update .env file:**
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=/absolute/path/to/your/project/backend/database/database.sqlite
   ```

2. **Create SQLite file:**
   ```bash
   cd backend
   touch database/database.sqlite
   ```

## 🛠️ Installation & Setup

### 1. Backend Setup (Laravel)

Navigate to the backend directory and set up the server:

```bash
# Go to the backend folder
cd backend

# Install PHP dependencies
composer install

# Create the environment file (if not exists)
cp .env.example .env

# Generate the application key
php artisan key:generate

# Configure your database in .env file (see Database Setup section above)
# Make sure DB_PASSWORD matches your MySQL root password

# Run database migrations
php artisan migrate

# Seed the database with demo users and initial data
php artisan db:seed --class=DemoUserSeeder

# Start the Backend Server
php artisan serve
```

**Note:** If you encounter "Access denied" errors, ensure:
- MySQL service is running
- Database credentials in `.env` match your MySQL setup
- The `laravel` database exists in MySQL

The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup (React + Vite)

Open a new terminal, navigate to the project root (if not already there), and set up the client:

```bash
# Ensure you are in the root directory (where package.json 'frontend' is located)
# cd "Citizen Complaint Webapp"

# Install JavaScript dependencies
npm install

# Start the Frontend Development Server
npm run dev
```

The frontend application will be available at `http://localhost:5173` (or the port shown in your terminal).

## 🏃 Running the Application

To run the full application, you need **two active terminal windows**:

1.  **Terminal 1 (Backend)**: `cd backend && php artisan serve`
2.  **Terminal 2 (Frontend)**: `npm run dev`

## 🔑 Default Credentials

After seeding the database, you can log in with the following demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Citizen** | `citizen@test.com` | `password` |
| **Officer** | `officer@test.com` | `password` |
| **Admin** | `admin@test.com` | `password` |

## 📁 Project Structure

- **`/` (Root)**: Contains the Frontend React application code.
- **`/backend`**: Contains the Laravel Backend API code.
- **`/frontend`**: Contains source files for the frontend application (components, pages, etc.).

## 📝 Common Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the frontend dev server |
| `npm run build` | Builds the frontend for production |
| `php artisan serve` | Starts the backend dev server |
| `php artisan migrate` | Runs database migrations |
| `php artisan db:seed` | Seeds the database with test data |
| `php artisan route:list` | Lists all registered backend routes |
| `composer install` | Install PHP dependencies |
| `composer update` | Update PHP dependencies |
| `mysql -u root -p` | Connect to MySQL database |
| `systemctl start mysql` | Start MySQL service (Linux) |
| `brew services start mysql` | Start MySQL service (macOS) |
| `net start mysql` | Start MySQL service (Windows) |

## 🚀 Quick Start (All Commands)

```bash
# 1. Install PHP extensions (Ubuntu/Debian)
sudo apt install php-mysql php-mbstring php-xml php-curl php-zip php-bcmath

# 2. Start MySQL
sudo systemctl start mysql

# 3. Setup database
mysql -u root -p -e "CREATE DATABASE laravel; ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';"

# 4. Backend setup
cd backend
composer install
cp .env.example .env
# Edit .env: Set DB_PASSWORD=password
php artisan key:generate
php artisan migrate
php artisan db:seed --class=DemoUserSeeder
php artisan serve &

# 5. Frontend setup (new terminal)
cd ..
npm install
npm run dev
```

## 🔧 Troubleshooting

### Database Connection Issues

**Error: "Access denied for user 'root'@'localhost'"**
- Ensure MySQL is running: `systemctl status mysql`
- Check if root password is set correctly in `.env`
- Create database: `mysql -u root -p -e "CREATE DATABASE laravel;"`

**Error: "Database does not exist"**
- Create the database manually: `mysql -u root -p -e "CREATE DATABASE laravel;"`
- Or switch to SQLite (see Database Setup section)

**Error: "Connection refused"**
- Start MySQL service: `sudo systemctl start mysql`
- Check if MySQL is listening on port 3306: `netstat -tlnp | grep 3306`
"# CITIZEN-COMPALINT-WEBAPP" 
