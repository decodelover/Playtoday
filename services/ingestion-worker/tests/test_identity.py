from playtoday_ingestion_worker.identity import SERVICE_NAME, service_identity


def test_service_identity_reports_operational_node_runtime() -> None:
    assert SERVICE_NAME == "playtoday-ingestion-worker"
    assert service_identity() == {
        "service": "playtoday-ingestion-worker",
        "status": "operational",
        "runtime": "nodejs",
    }
