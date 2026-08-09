from playtoday_settlement_worker.identity import SERVICE_NAME, service_identity


def test_service_identity_is_a_non_operational_placeholder() -> None:
    assert SERVICE_NAME == "playtoday-settlement-worker"
    assert service_identity() == {
        "service": "playtoday-settlement-worker",
        "status": "placeholder",
    }
