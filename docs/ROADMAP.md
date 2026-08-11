# PlayToday Engineering Roadmap

## Completed Phases

- [x] **Phase 1**: Monorepo Foundation, Architecture & Package Boundaries
- [x] **Phase 2A**: Design System Tokens, CSS Architecture & Theme Variables
- [x] **Phase 2B**: Shared UI Component Library
- [x] **Phase 2C**: Domain Layer Architecture & Type Definitions
- [x] **Phase 2D**: Web Shell, Navigation & Layout Infrastructure
- [x] **Phase 2E**: Public Presentation, Landing Pages & Help Center
- [x] **Phase 2F**: Public Contact Infrastructure & Database Persistence
- [x] **Phase 2G**: Production Supabase Authentication & Session Protection
- [x] **Phase 2H**: Production User Onboarding, Preferences & Responsible Play

## Upcoming Phase

- [ ] **Phase 3A**: Core Supabase Data Architecture and Account Security Hardening
  - Implementation is complete in the repository.
  - Local migration replay, pgTAP, advisors, and remote drift checks remain blocked until a container runtime and an explicitly identified Supabase target are available.
- [ ] **Phase 3B**: Production Account Settings, Security, and User Data Management
  - Repository implementation is complete, including authenticated settings, password and session controls, canonical preference editing, scoped data export, and truthful deletion deferral.
  - Local CI passes. Release verification remains open until Phase 3A migrations and pgTAP run against a local Supabase stack and authenticated browser persistence is exercised against the intended project.
- [ ] **Phase 4**: Sports Data and Intelligence Systems
