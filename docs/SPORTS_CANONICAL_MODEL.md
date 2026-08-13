# Canonical Football Model Specification — PlayToday

## Entities & Schemas

### 1. `sports`

- Top-level sport key (`football`).

### 2. `areas`

- Geographical regions and countries.

### 3. `competitions`

- Leagues, tournaments, and cups. Canonical key format: `{provider}-{external_id}`.

### 4. `seasons`

- Season windows linked to competitions.

### 5. `teams`

- Canonical team definitions.

### 6. `venues`

- Stadiums and match locations.

### 7. `fixtures`

- Primary football match entity:
  - `kickoff_at`: UTC timestamp (`timestamptz`).
  - `status`: Canonical status (`scheduled`, `live`, `halftime`, `extra_time`, `penalties`, `finished`, `postponed`, `cancelled`, `suspended`, `abandoned`, `awarded`, `unknown`).
  - `home_team_id`, `away_team_id`: Must satisfy constraint `home_team_id <> away_team_id`.
  - `home_score`, `away_score`: Nullable integer scores.

### 8. `provider_entity_mappings`

- Unique mapping table tracking `(provider, entity_type, provider_entity_id) -> canonical_entity_id`. Ensures idempotent ingestion across multiple runs.
