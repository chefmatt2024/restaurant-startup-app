# Marketing Funnel Map and Event Schema

This defines the concrete funnel for Iterum Foods website-to-app conversion and the canonical event format used across web pages and the React app.

## Funnel: website_to_app

1. `landing_viewed`
2. `cta_click_start_trial`
3. `cta_click_assessment`
4. `waitlist_submitted`
5. `assessment_started`
6. `assessment_completed`
7. `signup_cta_clicked_from_assessment`
8. `signup_completed`
9. `login_completed`
10. `trial_started`
11. `subscription_started`
12. `subscription_renewed`

## Canonical Event

- Event name: `funnel_stage`
- Required params:
  - `funnel`: funnel name, currently `website_to_app`
  - `funnel_stage`: canonical stage value from the map above
  - `step_index`: ordered stage index (1-based) from `FUNNEL_MAP`
- Compatibility param:
  - `stage`: same value as `funnel_stage` for backward compatibility

## Recommended Context Fields

- Attribution:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
  - `source`, `medium`, `campaign`
  - `referrer`, `referrer_domain`, `landing_url`
- Page/session:
  - `url`, `page_path`, `sessionId`
- Conversion context:
  - `entryPoint`, `cta_text`, `capture_mode`, `authMethod`
  - `score`, `redFlagCount`, `applicable`

## Current Implementation Notes

- App tracking helper: `src/services/analytics.js`
  - `FUNNELS`, `FUNNEL_STAGES`, `FUNNEL_MAP`, `getFunnelStepIndex()`
  - `trackFunnelStage()` now emits `funnel_stage` and `step_index`
- Assessment page emits:
  - `assessment_started`, `assessment_completed`, `signup_cta_clicked_from_assessment`
- Auth flow emits:
  - `signup_completed`, `login_completed`
- Main website landing emits:
  - `cta_click_start_trial`, `cta_click_assessment`, `waitlist_submitted`

**See also:** [Outlets & repost workflow](content-kit/OUTLETS_AND_REPOST_WORKFLOW.md) — flow of all outlets and reposting (start → end).

## Traffic Sources / Channels (into funnel)

- **Website:** iterumfoods.xyz (app/tech), iterumfoods.com (consulting); restauranteur-app landing on .xyz
- **Medium:** Blog posts (UTM: `utm_source=medium`)
- **LinkedIn (company):** https://www.linkedin.com/company/iterum-foods-llc/ — use `utm_source=linkedin&utm_medium=social&utm_campaign=company_page` on all links to site/app
- **Facebook:** Chef Matthew McPherson, The Restauranteur App (see content-kit README)
- **Paid / organic search:** Use `utm_source=google` (or platform), `utm_medium=cpc` or `organic`

## Next Events to Wire (High Priority)

- Emit `landing_viewed` on main landing page load.
- Emit `trial_started` immediately after successful account creation + trial initialization.
- Emit `subscription_started` and `subscription_renewed` from Stripe webhook handling and/or confirmed client success screens.

