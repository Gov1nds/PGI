# Padanilath — React (JavaScript) Multi‑Page Website

Built with **Vite + React (JS) + React Router + Tailwind**.
Green theme is already applied.

## Pages
- Home: `/`
- Services: `/services`
- Outdoor Works: `/outdoor-works`
- Insights: `/insights` and `/insights/:slug`
- News: `/news` and `/news/:slug`
- About: `/about` (Mission, Vision, Values)
- Contact: `/contact`

## Hero KPIs (already added)
- **17+ Years of experience**
- **700+ Completed projects**

Update these in: `src/content/siteData.js`

## Update content frequently (easy)
Edit:
- `src/content/siteData.js` (services, outdoor works, insights, news, contact)

## Replace images
Put your images in:
- `public/images`

Keep the same filenames:
- hero.jpg
- about-hero.jpg
- service-planning.jpg
- service-design.jpg
- service-cost.jpg
- service-quality.jpg
- service-procurement.jpg
- service-reporting.jpg
- outdoor-construction.jpg
- outdoor-landscape.jpg
- outdoor-utilities.jpg
- outdoor-living.jpg
- insight-1.jpg
- insight-2.jpg
- insight-3.jpg
- news-1.jpg
- news-2.jpg

## Run locally
```bash
npm install
npm run dev
```

## Deploy (Vercel)
- Import this repo in Vercel
- Build command: `npm run build`
- Output: `dist`
