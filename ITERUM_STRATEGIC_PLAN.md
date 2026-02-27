# Iterum Foods — Strategic Plan: Getting Both Programs Up and Running

**Role:** CEO-level operating plan  
**Horizon:** Next 12 months, with a 90-day execution focus  
**Programs:** (1) The Restauranteur App  (2) Iterum Consulting  

---

## 1. Company positioning

**Iterum Foods** helps restaurant owners and operators turn vision into reality—through **software** (the Restauranteur App) and **consulting** (Iterum Consulting). One brand, two ways to work with us.

- **The Restauranteur App:** Product. Self-serve planning, due diligence, financials, permits. Lead magnet: Free Restaurant Assessment. Revenue: subscriptions (trial → paid). **Lives on iterumfoods.xyz** and restaurant-startup-app.web.app.
- **Iterum Consulting:** Services. Expert consulting, operational excellence, culinary and cost optimization. Revenue: project fees, retainers. **Lives on iterumfoods.com.**

**Domain split:** Consulting = **iterumfoods.com**. App / tech / assessment = **iterumfoods.xyz** and restaurant-startup-app.web.app.

**Why both:** The app generates leads and proof of expertise; consulting delivers high-touch value and feeds case stories and credibility back into the app and content. They share the same audience and funnel.

---

## 2. How the two programs reinforce each other

| Flow | How it works |
|------|-------------------------------|
| **App → Consulting** | App users who want hands-on help (e.g. “build my plan with me,” “audit my numbers”) become consulting leads. Offer a “Consulting add-on” or “Implementation call” inside the app and on iterumfoods.xyz. |
| **Consulting → App** | Consulting clients use the app for ongoing planning, compliance, and updates. Include app access in consulting packages or recommend it as the “system” after the engagement. |
| **Content → Both** | One content funnel (assessment, blog, social) drives traffic. Some visitors take the assessment and sign up for the app; others fill the waitlist or contact form and become consulting leads. |
| **Brand → Both** | One website (iterumfoods.xyz), one set of outlets (LinkedIn, Instagram, Facebook, Medium, Google). Every piece of content can mention both “plan with the app” and “work with us 1:1.” |

**Implication:** One go-to-market motion (content + funnel + brand) serves both programs. Prioritize getting that motion running, then split conversion paths into “App” and “Consulting” and measure both.

---

## 3. Strategic pillars (what we drive on)

1. **Product (Restauranteur App)**  
   - Keep the app stable, trial → paid conversion clear, and assessment → signup flow smooth.  
   - Add or refine one “consulting bridge” (e.g. “Book a strategy call,” “Need help? Talk to us”) so app users can become consulting leads.

2. **Consulting (Iterum Consulting)**  
   - Define a simple offer (e.g. “Restaurant launch audit,” “Due diligence support,” “Cost reduction review”) and a clear way to say “yes” (contact form, Calendly, or “Book a call” on the site).  
   - Use the same content (assessment, blog, social) to generate consulting leads; tag them in CRM or a simple pipeline (e.g. “From assessment,” “From waitlist,” “From contact form”).

3. **Go-to-market (one motion for both)**  
   - Run the existing funnel: iterumfoods.xyz → assessment + blog + social → signup (app) or contact (consulting).  
   - Use the [Content Funnel Playbook](CONTENT_FUNNEL_PLAYBOOK.md), [Outlets & repost workflow](content-kit/OUTLETS_AND_REPOST_WORKFLOW.md), and [content kit](content-kit/README.md) so every piece of content is published and reposted with clear CTAs for both the app and consulting.

4. **Brand and trust**  
   - One story: “Iterum Foods = Restauranteur App + Iterum Consulting.”  
   - Update all owned properties (iterumfoods.xyz, LinkedIn, Instagram, Facebook, Medium, Google) so they mention both programs and link to the same next steps (assessment, app trial, contact/consulting).

---

## 4. 90-day priorities

### Restauranteur App (Months 1–3)

| Priority | Action | Owner / note |
|----------|--------|----------------|
| **Traffic** | Publish Week 1 content (2 Medium posts, 3 short videos) and repost across LinkedIn, Facebook, Instagram per [OUTLETS_AND_REPOST_WORKFLOW.md](content-kit/OUTLETS_AND_REPOST_WORKFLOW.md). | Use [week-1-full-posts-with-links.md](content-kit/week-1-full-posts-with-links.md) and [week-1-video-scripts.md](content-kit/week-1-video-scripts.md). |
| **Conversion** | Ensure assessment → signup → trial flow works end-to-end; fix any drop-off. | Check [MARKETING_FUNNEL_MAP.md](MARKETING_FUNNEL_MAP.md) and analytics. |
| **Consulting bridge** | Add one clear CTA in the app or on post-signup: “Need hands-on help? Book a call” → consulting. | Can be a link to a Calendly or contact form. |
| **Stripe and trial** | Confirm trial → paid works; fix Cloud Functions / IAM if still blocking. | See prior deployment notes. |
| **Attribution** | Ensure every outlet uses UTM (`utm_source=medium|linkedin|facebook|instagram|google`); review weekly by source. | Per [MEDIUM_PUBLISHING.md](content-kit/MEDIUM_PUBLISHING.md), [LINKEDIN_COMPANY_PAGE.md](content-kit/LINKEDIN_COMPANY_PAGE.md). |

### Iterum Consulting (Months 1–3)

| Priority | Action | Owner / note |
|----------|--------|----------------|
| **Offer** | Use the defined packages and website copy in [CONSULTING_PACKAGES.md](CONSULTING_PACKAGES.md). Set prices (or “Book a call”) and one booking link; add “Work with us” to iterumfoods.xyz. | One-pager or short sales page optional. |
| **Landing** | On iterumfoods.xyz, add a clear “Consulting” or “Work with us” section with CTA: contact form or “Book a call.” | Reuse same UTM structure for consulting links. |
| **Lead capture** | Ensure waitlist and contact form submissions are stored and reviewed weekly; tag “consulting interest” where possible. | Firestore/Cloud Function or existing capture. |
| **From assessment** | For assessment completions that don’t sign up for the app, add optional “Get a 30-min review of your results” (consulting lead). | Optional field or follow-up email. |
| **From app** | Add in-app or post-trial CTA: “Want this built with you? Book a strategy call.” | Links to same consulting booking/contact. |

### Go-to-market (shared, Months 1–3)

| Priority | Action | Owner / note |
|----------|--------|----------------|
| **Outlets** | Refresh LinkedIn company About, Instagram bio, and Facebook so they mention both App and Consulting and link to iterumfoods.xyz + assessment. | [LINKEDIN_COMPANY_PAGE.md](content-kit/LINKEDIN_COMPANY_PAGE.md); [content-kit README](content-kit/README.md) for links. |
| **Content cadence** | Publish at least 2 posts (blog or video) per month; repost to all outlets in the same week. | Follow [CONTENT_FUNNEL_PLAYBOOK.md](CONTENT_FUNNEL_PLAYBOOK.md) 30-day plan. |
| **One story** | Every piece of content ends with a dual CTA: “Try the free assessment / Start the app” and “Or work with us 1:1 — get in touch.” | Apply in Medium, captions, and website copy. |

---

## 5. Metrics to watch (company-wide)

| Metric | Why it matters |
|--------|----------------|
| **Website sessions** (by source) | Are we driving traffic from content and outlets? |
| **Assessment starts + completions** | Is the lead magnet working? |
| **App signups + trial starts** | Are we converting to the product? |
| **Trial → paid conversion** | Is the app monetizing? |
| **Consulting leads** (waitlist, contact form, “Book a call”) | Are we filling the consulting pipeline? |
| **Consulting proposals sent + closed** | Is consulting generating revenue? |

**Weekly:** Review sessions by `utm_source`, assessment completions, signups, and new consulting leads.  
**Monthly:** Review trial→paid rate, consulting pipeline, and content published/republished.

---

## 6. 90-day milestones (summary)

- **Month 1:** Week 1 content live on Medium + reposted everywhere; consulting offer defined and “Work with us” + booking/contact live on iterumfoods.com; iterumfoods.xyz links to .com for consulting; UTM and funnel tracking verified.
- **Month 2:** Second content batch live; first consulting lead(s) from funnel; app consulting bridge (e.g. “Book a call”) visible in app or post-signup.
- **Month 3:** Consistent cadence (2+ posts/month, full repost); trial→paid conversion and consulting pipeline reviewed; next quarter priorities set (e.g. paid search, partners, or new offer).

---

## 7. Where to start this week

1. **Publish** the two Week 1 blog posts on Medium using [week-1-full-posts-with-links.md](content-kit/week-1-full-posts-with-links.md) and [MEDIUM_PUBLISHING.md](content-kit/MEDIUM_PUBLISHING.md).  
2. **Repost** each post on LinkedIn, Facebook (both pages), and Instagram (feed + link in bio to assessment) with UTM.  
3. **Update** iterumfoods.xyz (or the Restauranteur landing) with one line: “Want hands-on help? [Contact us / Book a call]” linking to a consulting landing or contact form.  
4. **Define** the one primary consulting offer (name, one paragraph, one CTA) and add it to the website and to your internal “sales” one-pager.

---

## 8. Doc index (already in the repo)

- **App & site map:** [APP_AND_SITE_MAP.md](APP_AND_SITE_MAP.md) — all routes, dashboard features (tabs), and user workflows.
- **Consulting packages:** [CONSULTING_PACKAGES.md](CONSULTING_PACKAGES.md) — offers, deliverables, pricing approach, website copy, lead flow.
- **Funnel and tracking:** [MARKETING_FUNNEL_MAP.md](MARKETING_FUNNEL_MAP.md)  
- **Content and GTM:** [CONTENT_FUNNEL_PLAYBOOK.md](CONTENT_FUNNEL_PLAYBOOK.md)  
- **Where to post and repost:** [content-kit/OUTLETS_AND_REPOST_WORKFLOW.md](content-kit/OUTLETS_AND_REPOST_WORKFLOW.md)  
- **Ready content:** [content-kit/README.md](content-kit/README.md), [content-kit/week-1-full-posts-with-links.md](content-kit/week-1-full-posts-with-links.md)  
- **LinkedIn:** [content-kit/LINKEDIN_COMPANY_PAGE.md](content-kit/LINKEDIN_COMPANY_PAGE.md)  
- **Medium:** [content-kit/MEDIUM_PUBLISHING.md](content-kit/MEDIUM_PUBLISHING.md)  

Use this plan as the single “CEO view” of how the two programs get up and running and how the company moves forward; adjust 90-day tactics as you hit milestones or learn from data.
