# BITASEC Database Layer

Recommended production database: PostgreSQL.

## Initial logical entities

- Service
- Project
- TrainingProgram
- ServiceRequest
- User/Admin
- BlogPost (planned)
- Testimonial (planned)
- TeamMember (planned)

## Separation strategy

For production, the database should NOT be publicly exposed to the Internet.

Recommended:

Internet
  -> Nginx / reverse proxy
  -> Django application
  -> private PostgreSQL network

The database server should accept connections only from the backend server or private network.

## Backups

Plan for:
- Daily encrypted database backups
- Retention policy
- Off-server backup copy
- Restore testing
- Restricted database credentials

Never place real database passwords in Git.
