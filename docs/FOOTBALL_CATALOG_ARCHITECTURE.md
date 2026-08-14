# Football Catalog Architecture — PlayToday Phase 4B

## Overview

PlayToday's football catalog manages canonical sports entities (`sports`, `competitions`, `seasons`, `teams`, `venues`) decoupled from third-party data provider DTO schemas.

## Canonical Data Structure

1. **`sports`**: Top-level classification (`key = 'football'`).
2. **`competitions`**: Operational football tournaments (`canonical_key`, `name`, `type`).
3. **`seasons`**: Competition years and operational windows.
4. **`teams`**: Stable canonical team records with provider entity resolution.
5. **`venues`**: Nullable stadium metadata.
6. **`provider_entity_mappings`**: Lookup map enforcing `(provider, entity_type, provider_entity_id)` uniqueness.

## Provider Abstraction

- Third-party IDs map to stable internal PlayToday UUIDs.
- Multiple providers can be linked to the same canonical team or fixture record via `provider_entity_mappings`.
