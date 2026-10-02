# BITASEC Local Setup — Ubuntu

## 1. Check Python

```bash
python3 --version
```

## 2. Create a virtual environment

```bash
cd BITASEC/backend
python3 -m venv .venv
source .venv/bin/activate
```

## 3. Install dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## 4. Create environment file

```bash
cp .env.example .env
nano .env
```

Set a local PostgreSQL password and other values.

## 5. Create database and user

Example:

```bash
sudo -u postgres psql
```

Then:

```sql
CREATE DATABASE bitasec;
CREATE USER bitasec WITH PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE bitasec TO bitasec;
\q
```

For newer PostgreSQL versions, additional schema privileges may be needed depending on configuration.

## 6. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## 7. Create admin

```bash
python manage.py createsuperuser
```

## 8. Start backend

```bash
python manage.py runserver 127.0.0.1:8000
```

Frontend can initially be opened separately from `frontend/index.html`.
In the integration phase, it will call the Django API.

## Production warning

Do not use `runserver` as the production web server.
Use Gunicorn behind Nginx and HTTPS.
