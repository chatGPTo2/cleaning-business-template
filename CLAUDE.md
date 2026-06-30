# Cleaning Business Website Template — Project Brief for Claude

Read this at the start of every session.

---

## What This Is

This is a **reusable template** for building professional cleaning business websites. It is based on the Taspro Cleaning Solutions website and can be customised for any cleaning business in minutes.

The template is used by an AI routine agent that:
1. Asks the client for their business details
2. Updates `config/business.ts` with those details
3. Deploys a fully customised cleaning business website

---

## The Single Most Important File

**`config/business.ts`** — All business-specific content lives here. To customise this template for a new cleaning business, update ONLY this file (plus `lib/suburb-seo.ts` for suburb lists). Every page, email template, and SEO tag pulls from this config automatically.

---

## Tech Stack

| Thing | What it is |
|---|---|
| **Next.js 16** | Website framework (App Router, TypeScript) |
| **Tailwind CSS** | All styling |
| **Supabase** | Database (quotes, contacts, blog posts, reviews) |
| **Vercel** | Hosting and auto-deployment |
| **Resend** | Email (quote confirmations, contact alerts) |
| **OpenAI GPT-4o** | AI blog post writing |
| **Cloudflare Turnstile** | Anti-spam CAPTCHA |
| **Google Analytics 4** | Visitor tracking |

---

## Project Structure

```
config/
  business.ts           ← THE MAIN CONFIG FILE — edit this to customise

app/
  page.tsx              ← Homepage
  layout.tsx            ← Site-wide layout (nav, footer, analytics)
  globals.css           ← Global styles and CSS variables
  services/             ← Service pages
  locations/            ← City and suburb pages
  contact/              ← Contact form page
  quote/                ← Quote wizard
  blog/                 ← Blog listing and posts
  admin/                ← Admin panel (password protected)
  api/                  ← Backend API routes
  components/           ← Shared UI (Navigation, Footer, etc.)

lib/
  supabase.ts           ← Database client
  pricing.ts            ← Quote pricing logic
  suburb-seo.ts         ← City/suburb SEO configuration
  ai-seo-generate.ts    ← AI blog writing
  reviews.ts            ← Google Reviews sync
  emails/               ← Email templates

vercel.json             ← Cron job schedules
.env.example            ← All required environment variables
```

---

## How to Customise for a New Client

1. Update `config/business.ts` — name, phone, email, domain, services, cities, pricing
2. Update `lib/suburb-seo.ts` if the client has different suburbs/cities
3. Add environment variables to Vercel
4. Push — the site auto-deploys

---

## Key Rules

1. Never hardcode business names, phone numbers, or emails — always use `config/business.ts`
2. Always commit and push after every change
3. Always update CHANGELOG.md after every commit
4. Never use "NDIS registered provider" — say "NDIS services available"
5. Never show commercial pricing on the quote form — send via email only
6. Keep explanations in plain English — clients are not developers
