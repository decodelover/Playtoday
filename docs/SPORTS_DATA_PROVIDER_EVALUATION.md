# Sports Data Provider Evaluation Matrix — PlayToday Phase 4A

## Overview

This evaluation matrix analyzes official primary documentation for leading football and sports odds data providers to determine the optimal provider architecture for PlayToday.

---

## Candidate Provider Matrix

| Evaluation Criteria            | Sportmonks Football API                                 | API-Football (API-SPORTS)                       | Football-Data.org                                        | The Odds API (Odds)                              | Sportradar                               |
| :----------------------------- | :------------------------------------------------------ | :---------------------------------------------- | :------------------------------------------------------- | :----------------------------------------------- | :--------------------------------------- |
| **Official Documentation**     | `https://docs.sportmonks.com/football/`                 | `https://www.api-football.com/documentation-v3` | `https://www.football-data.org/documentation/quickstart` | `https://the-odds-api.com/live-odds-api/`        | `https://developer.sportradar.com/`      |
| **1. Football Coverage**       | Top 5 Europe, UEFA, CAF, NPFL (Nigeria), 2,000+ leagues | Top 5 Europe, UEFA, CAF, NPFL, 1,000+ leagues   | Top 5 Europe, UEFA, Tier 1 cups (No NPFL)                | Top 5 Europe, major international (Odds focused) | Complete global coverage                 |
| **2. Fixture Schedules**       | Scheduled, live, postponements, reschedules             | Scheduled, live, postponements, reschedules     | Scheduled, completed, live                               | Scheduled pre-match & live odds windows          | Full enterprise schedule feeds           |
| **3. Live Data Methods**       | Live scores, events, short polling & webhooks           | Live scores, events, short polling, webhooks    | Short polling (min 60s delay on free)                    | Polling (10s–60s) & WebSocket (paid)             | Enterprise WebSockets / Push             |
| **4. Match Details**           | Lineups, stats, events, cards, venue, officials         | Lineups, stats, events, cards, venue, officials | Basic events, goals, cards, lineups (paid)               | N/A (Odds & market lines only)                   | Complete granular telemetry              |
| **5. Team / Competition**      | Logos, standings, squads, venues, historical            | Logos, standings, squads, venues, historical    | Logos, standings, basic squads                           | Team names, competition keys                     | Full enterprise assets                   |
| **6. Historical Depth**        | 15+ years statistics                                    | 10+ years statistics                            | 3–10 years depending on tier                             | Historical odds snapshots (paid tier)            | Decades of historical depth              |
| **7. Injuries / Availability** | Detailed player injuries & suspensions                  | Player injuries & suspensions                   | Limited                                                  | N/A                                              | Full availability & squad reports        |
| **8. Pre-Match & Live Odds**   | Integrated odds (select bookmakers)                     | Integrated odds (select bookmakers)             | N/A                                                      | Specialized multi-bookmaker odds                 | Enterprise odds & trading feeds          |
| **9. Target Bookmakers**       |                                                         |                                                 |                                                          |                                                  |                                          |
| — **SportyBet**                | _Target Bookmaker Coverage Not Verified_                | _Target Bookmaker Coverage Not Verified_        | _Not Available_                                          | _Target Bookmaker Coverage Not Verified_         | _Target Bookmaker Coverage Not Verified_ |
| — **Bet9ja**                   | _Target Bookmaker Coverage Not Verified_                | _Target Bookmaker Coverage Not Verified_        | _Not Available_                                          | _Target Bookmaker Coverage Not Verified_         | _Target Bookmaker Coverage Not Verified_ |
| — **MSport**                   | _Target Bookmaker Coverage Not Verified_                | _Target Bookmaker Coverage Not Verified_        | _Not Available_                                          | _Target Bookmaker Coverage Not Verified_         | _Target Bookmaker Coverage Not Verified_ |
| **10. API Quality**            | REST OpenAPI, JSON, stable IDs, rate headers            | REST OpenAPI, JSON, stable IDs, rate headers    | REST JSON, simple schema                                 | REST JSON, clean bookmaker mapping               | Enterprise SDKs / REST / Push            |
| **11. Commercial Fit**         | Free trial, structured tiers                            | Free tier (100 req/day), affordable plans       | Free tier (10 req/min), paid tiers                       | Free tier (500 req/month), paid tiers            | Enterprise pricing ($$$$)                |
| **12. Operational Fit**        | Excellent (Node.js/Python server-only)                  | Excellent (Node.js/Python server-only)          | Good for basic schedules                                 | Excellent for Odds role                          | Requires enterprise agreement            |

---

## Provider Architecture Strategy & Recommendation

1. **Core Sports Data Provider**:
   - **Primary Recommendation**: **Sportmonks Football API** or **API-Football**. Both supply comprehensive fixture schedules, lineups, live match events, standings, and historical data with server-friendly REST endpoints and rate-limit headers.
2. **Odds Data Provider**:
   - **Primary Recommendation**: **The Odds API** as a dedicated odds provider role. Decoupling odds from core fixture ingestion allows PlayToday to ingest bookmaker price movements independently.
3. **Target Bookmaker Mapping Notice**:
   - Exact API coverage for **SportyBet**, **Bet9ja**, and **MSport** is marked **TARGET BOOKMAKER COVERAGE NOT VERIFIED**. PlayToday does not claim partnership or verified odds feeds for these specific bookmakers until API contracts or authorized feeds are established.
