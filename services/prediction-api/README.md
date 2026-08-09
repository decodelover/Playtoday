# Prediction API placeholder

This non-operational Python package reserves the boundary for PlayToday’s future statistical prediction service. A later roadmap step will add evaluated models, calibrated probability outputs, and an API after data and model-governance requirements are approved.

Step 1C includes no FastAPI dependency, machine-learning library, prediction implementation, database access, or external integration.

Run quality checks from the repository root:

```sh
python -m ruff format services/prediction-api
python -m ruff format --check services/prediction-api
python -m ruff check services/prediction-api
python -m pytest services/prediction-api/tests
```
