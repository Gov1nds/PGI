# PGI Hub — Frontend

React + Vite + Tailwind CSS application for the PGI Hub procurement platform.

## Quick Start

```bash
cp .env.example .env
# Set VITE_API_BASE_URL to your Platform API URL
npm install
npm run dev
```

## Build & Deploy

```bash
VITE_API_BASE_URL=https://your-api-url.com npm run build
```

Deploy `dist/` to Vercel, Netlify, or any static hosting.

## Key Pages
- `/bom-analyzer` — BOM upload and analysis
- `/dashboard` — Project overview
- `/project/:id` — Project workspace (strategy, vendors, RFQ, tracking, analytics)
- `/analytics` — Spend analytics
- `/login`, `/register` — Authentication

## Vercel Deployment

The `vercel.json` handles SPA routing. Set `VITE_API_BASE_URL` as a Vercel environment variable.
