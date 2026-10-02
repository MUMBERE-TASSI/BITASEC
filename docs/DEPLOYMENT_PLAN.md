# BITASEC Deployment Plan

## Development
Keep frontend, backend and database projects together in the development workspace for convenience.

## Staging
Separate services logically:
- frontend
- backend
- database

Use test credentials and test data.

## Production

Recommended architecture:

1. Domain: bitasec.example
2. HTTPS certificate
3. Nginx reverse proxy
4. Frontend hosting
5. Django backend
6. Private PostgreSQL
7. Firewall
8. Backups
9. Monitoring

## Important

Do not upload the database folder as a live database server by itself.
The database layer should be provisioned on a secure PostgreSQL server and accessed only by the backend.

For stronger isolation, the frontend, backend and database can later be placed on separate VPS instances, private networks, or containers.
