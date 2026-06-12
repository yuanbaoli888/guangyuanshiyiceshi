# Database Migrations

Alembic migration files live here. Run them from the `backend/` directory:

```bash
alembic upgrade head
alembic downgrade -1
alembic revision --autogenerate -m "describe change"
```
