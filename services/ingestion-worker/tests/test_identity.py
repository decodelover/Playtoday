from playtoday_ingestion_worker.identity import SERVICE_NAME, service_identity


def test_service_identity_is_a_non_operational_placeholder() -> None:
    assert SERVICE_NAME == "playtoday-ingestion-worker"
    assert service_identity() == {
        "service": "playtoday-ingestion-worker",
        "status": "placeholder",
    }
