# Phase 2G — Refined Desktop & Mobile Auth Layout Plan

## Reference UI Pattern Alignment

- **Top Segmented Tab Switcher**: Sliding `[ Sign In ]` | `[ Create Account ]` toggle pill at the top of the form panel.
- **Desktop Left Hero Card (`.authHeroCard`)**: Elevated floating card with top border gradient glow (`linear-gradient(90deg, #4ed8a0, #ff0f50)`), PlayToday brand badge, bold headline, feature subtext, and a bottom `← Back to Home` button.
- **Form Inputs with Icons**: Email (`✉`), Password (`🔑` + `👁`), Name (`👤`) leading icons with required red asterisks (`*`).
- **Company Public Palette**: Navy Blue (`#01002c`, `#04193b`), White (`#ffffff`), Mint (`#4ed8a0`), and Crimson (`#ff0f50`) with `playtoday-hero-bg.png`.
- **Mobile Viewport**: Clean single-column stacked layout (no 2-column split grid) with mobile brand header and tab switcher.

## Quality Gates

1. `pnpm --filter @playtoday/web typecheck`
2. `pnpm --filter @playtoday/web test -- --pool=forks`
3. `pnpm format:check`
4. `pnpm lint`
5. `pnpm build`
