# Tanguar Haor Houseboats – MVP

A Redbus-style booking marketplace for **houseboats in Tanguar Haor**. Built with **Next.js 14 (App Router) + Prisma + Tailwind**.  
This MVP focuses on search, listing, **live availability**, **checkout with manual transfer and 30-min hold**, **owner date-blocking**, basic owner/admin pages, i18n (Bangla default).

## Quick start (local)

```bash
npm i
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open http://localhost:3000

### Demo users

- Admin: `admin@demo.local` / `admin123`  
- Owner: `owner1@demo.local` / `owner123`  
- Guest: `guest1@demo.local` / `guest123`

## What’s included

- App Router pages: Home, Search, Listing, Checkout, Success, Owner Dashboard (+ Blocks), Admin
- API routes: login/logout, language toggle, bookings (create + hold), blocks, invoice (PDF)
- Prisma schema for users, boats, photos, add-ons, blocks, bookings, coupons, payouts, reviews, audit logs
- Seed data: 5 boats (with photos, add-ons, blocks), 3 users, 1 paid booking
- i18n: Bangla (default) + English toggle (cookie)
- Basic JWT cookie session & middleware to protect `/owner` and `/admin`

## Notes

- Payments: only **Manual transfer with 30-min hold** is implemented in MVP. Real bKash/Nagad/Stripe can be added later.
- Availability: blocks & (paid/active holds) are excluded from search.
- Invoice PDF: generated with `pdfkit`.
- DB: SQLite for local demo; switch `DATABASE_URL` to Postgres in production.

## Roadmap (V2)

- Per-cabin & per-seat flows
- Seasonal pricing engine
- Owner payouts automation
- Reviews and moderation
- Analytics funnel & charts
- Better auth & KYC flows
- Coupons & service/commission fees management UI
- ICS calendar export & WhatsApp template messages
