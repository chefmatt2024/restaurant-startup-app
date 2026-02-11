# Marketing Sources & Citations (Single Source of Truth)

This file is the **citation log** for any marketing/investor claims (numbers, stats, “free tier limits”, conversion uplifts, market sizes, etc.).

## How to use this file

- **If a claim appears anywhere** (landing page, investor page, blog, email, pitch deck, docs), it should have an entry here.
- Prefer **primary sources** (government, standards bodies, vendor pricing pages) over blogs.
- If a claim is an **internal estimate**, explicitly label it as such and explain the calculation and where the data lives.
- Include **Last verified** date whenever we check a source.

## Source log

| Claim / Figure | Where used | Source type | Source / Evidence | Notes | Last verified |
|---|---|---|---|---|---|
| “SendGrid has a free tier” | `MARKETING_PLAN.md`, `GO_TO_MARKET_PLAN.md` | External (vendor) | `https://sendgrid.com/pricing/` | **Do not hardcode daily send limits** in marketing docs unless verified on the pricing page. | TBD |
| “Mailchimp has a free tier” | `MARKETING_PLAN.md`, `GO_TO_MARKET_PLAN.md` | External (vendor) | `https://mailchimp.com/pricing/` | **Do not hardcode contact limits** in marketing docs unless verified on the pricing page. | TBD |
| “Social proof increases conversion rates by 15–30%” | `MARKETING_PLAN.md` (previously stated) | Heuristic / needs source | TBD | We removed the numeric range until we pick a source we trust. If we want a number, add a credible source here first. | N/A |
| “78% of restaurants fail in the first year” | `src/components/unified/RestaurantBusinessPlannerLanding.js`, `src/components/landing/InvestorLanding.js` (previously stated) | Needs source / risky claim | TBD | We removed this number from the UI copy. If we ever re-introduce a number, it must be sourced here first. | N/A |
| Investor page TAM/SAM/SOM: `$863B`, `$12.5B`, `$2.1B`, `8.2% CAGR` | `src/components/landing/InvestorLanding.js` | Internal estimate (needs verification) | Internal working assumption (replace with third-party market research before investor outreach) | Add a market research source (or methodology + spreadsheet link) before using these figures in external outreach. | N/A |



