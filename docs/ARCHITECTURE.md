# BITASEC Architecture

## Three-layer separation

### 1. Frontend
Public-facing website:
- HTML
- CSS
- JavaScript
- Images
- User interface

### 2. Backend
Private application layer:
- Django
- Django REST Framework
- Business logic
- Authentication
- Contact/service-request processing
- API endpoints

### 3. Database
Private data layer:
- PostgreSQL
- Client requests
- Services
- Projects
- Training
- Users
- Future business data

## Production concept

Client
  |
  | HTTPS
  v
Nginx / CDN / WAF
  |
  v
Frontend
  |
  | HTTPS/API
  v
Django Backend
  |
  | Private DB connection
  v
PostgreSQL

The PostgreSQL service must not be directly exposed to the public Internet.
