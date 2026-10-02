# BITASEC Security Checklist

BITASEC is a cybersecurity-focused enterprise, so security must be part of the website from the beginning.

## Development
- Keep secrets in environment variables.
- Never commit `.env`.
- Validate all user input.
- Use Django CSRF protection.
- Use secure password hashing.
- Keep dependencies updated.
- Do not expose Django DEBUG in production.

## Production
- HTTPS only.
- Secure cookies.
- HSTS after HTTPS is correctly configured.
- Restrict ALLOWED_HOSTS.
- Restrict CORS to trusted frontend origins.
- Put PostgreSQL on a private network.
- Use least-privilege database accounts.
- Configure firewall rules.
- Rate-limit public forms/APIs.
- Back up the database.
- Monitor logs.
- Regularly test restore procedures.

## Deployment separation

Suggested future servers/containers:

Frontend server:
- Public web assets

Backend server:
- Django/Gunicorn

Database server:
- PostgreSQL, private network only

Security monitoring:
- Wazuh/SIEM

Do not assume physical server separation is required on day one; logical/network isolation can be used initially.
