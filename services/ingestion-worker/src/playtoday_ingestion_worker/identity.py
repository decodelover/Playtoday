"""Identity metadata for foundation verification."""

from typing import Final

SERVICE_NAME: Final = "playtoday-ingestion-worker"


def service_identity() -> dict[str, str]:
    """Return non-operational service identity metadata."""
    return {"service": SERVICE_NAME, "status": "placeholder"}
