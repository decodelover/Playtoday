"""Identity metadata for repository verification."""

from typing import Final

SERVICE_NAME: Final = "playtoday-ingestion-worker"


def service_identity() -> dict[str, str]:
    """Return the worker service identity and active runtime."""
    return {"service": SERVICE_NAME, "status": "operational", "runtime": "nodejs"}
