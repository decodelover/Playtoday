# Settlement worker placeholder

This non-operational Python package reserves the boundary for PlayToday’s future deterministic settlement worker. A later roadmap step will apply versioned market rules to verified results and preserve auditable settlement history.

Step 1C includes no settlement rules, result feed, queue, database access, correction workflow, or generative-AI dependency.

Run quality checks from the repository root:

```sh
python -m ruff format services/settlement-worker
python -m ruff format --check services/settlement-worker
python -m ruff check services/settlement-worker
python -m pytest services/settlement-worker/tests
```
