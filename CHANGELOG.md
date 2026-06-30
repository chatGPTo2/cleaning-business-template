# Changelog — Cleaning Business Website Template

All changes are written in plain English for easy reading.

---

## 1 July 2026 — 1:30 PM AEST

**Wired up the config file — the template now actually works as a template.**

Updated the navigation, footer, header, WhatsApp chat button, confirmation emails, and pricing logic so they all pull their information from `config/business.ts` instead of having Taspro's details hardcoded throughout.

What this means practically:
- The **navigation** now automatically shows whichever cities and services are listed in the config
- The **footer** shows the right phone number, social media links, locations, and business name from the config — and only shows social icons for platforms that have a URL set
- The **WhatsApp button** uses the WhatsApp number from the config
- **Confirmation emails** sent to customers and the admin now reference the right business name, email, phone, and website domain
- **Pricing** (base price, bedroom/bathroom add-ons, hourly rates, frequency discounts) all come from the config
- The **page titles and SEO descriptions** are generated automatically from the business name and city list in the config

Also added Melbourne and Sydney to the city list in the config (as recurring-only cities, same as the original Taspro site), and added all social media fields (TikTok, YouTube, X/Twitter, Pinterest) to the config so they can be filled in or left blank.

---

## 1 July 2026 — 12:50 PM AEST

**Initial template created and pushed to GitHub.**

Built a complete, ready-to-use website template for cleaning businesses. This is based on the Taspro Cleaning Solutions website and is designed so that a new cleaning business website can be set up in minutes just by updating one file (`config/business.ts`).

What's included:
- Full website with homepage, service pages, city/suburb pages, contact page, quote wizard, and blog
- Admin panel for managing blog posts, quotes, customers, and Google Reviews
- AI blog writing (powered by GPT-4o) that automatically generates SEO content
- Quote system that calculates prices and sends confirmation emails
- Google Reviews sync that pulls in reviews automatically each day
- Anti-spam protection on all forms
- Google Analytics tracking

The key innovation is `config/business.ts` — a single file where you enter the business name, phone, email, services, cities, and pricing. Every page on the site automatically uses those details, so there's no need to hunt through hundreds of files to customise it.

