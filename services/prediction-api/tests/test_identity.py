from playtoday_prediction_api.identity import SERVICE_NAME, service_identity


def test_service_identity_is_a_non_operational_placeholder() -> None:
    assert SERVICE_NAME == "playtoday-prediction-api"
    assert service_identity() == {
        "service": "playtoday-prediction-api",
        "status": "placeholder",
    }
