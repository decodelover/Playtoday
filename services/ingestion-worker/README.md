# Ingestion worker placeholder

This non-operational Python package reserves the boundary for PlayToday’s future ingestion worker. A later roadmap step may import licensed sports data after provider rights, schemas, provenance, freshness, and security controls are approved.

Step 1C includes no provider client, network call, database access, credential, scheduler, or normalization logic.

Run quality checks from the repository root:

```sh
python -m ruff format services/ingestion-worker
python -m ruff format --check services/ingestion-worker
python -m ruff check services/ingestion-worker
python -m pytest services/ingestion-worker/tests
```
