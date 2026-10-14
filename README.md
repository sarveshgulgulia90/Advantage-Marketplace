# Advantage Silchar — Computer Store Website

A full-stack MERN platform for **Advantage Silchar**, Silchar's trusted computer store since 1995.

> **Store:** Anand Arcade, Opposite Civil Hospital, Hospital Road, Silchar – 788001
> **Phone:** 03842-230952 / 9435070738 | **Email:** advantage.it@gmail.com | **Hours:** Mon–Sat, 10AM–8PM

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail) |
| AI | Google Gemini 2.0 Flash Lite |
| PWA | Service Worker + Web App Manifest |

---

## Folder Structure

```
advantage-silchar/
├── index.html
├── manifest.json
├── sw.js
├── favicon.svg
├── sitemap.xml
├── robots.txt
├── vercel.json
├── src/
│   ├── App.jsx
│   ├── Admin.jsx
│   ├── PCBuilder.jsx
│   └── main.jsx
└── server/
    ├── server.js
    ├── middleware/
    │   └── auth.js
    └── routes/
        ├── products.js
        ├── inquiries.js
        ├── components.js
        ├── auth.js
        ├── email.js
        ├── reviews.js
        └── ai.js
```

---

## Installation

```bash
# Clone
git clone <repository-url>
cd advantage-silchar

# Frontend
npm install

# Backend
cd server
npm install
```

---

## Environment Variables

Create `server/.env` — ask the project owner for actual values:

```
MONGO_URI=
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_TOKEN=
JWT_SECRET=
GEMINI_API_KEY=
EMAIL_USER=
EMAIL_PASS=
```

Create `advantage-silchar/.env.local`:

```
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_TOKEN=
```

---

## Running the Application

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd advantage-silchar
npm run dev
```

| URL | Description |
|---|---|
| http://localhost:5173 | Customer website |
| http://localhost:5000 | API server |
| http://localhost:5173/#admin | Admin panel |

---

## Features

### Customer Website

| Feature | Description |
|---|---|
| Homepage | Hero carousel, category grid, product grid, services section |
| Mega Menu | Brand and price filters |
| Use-case Filter | Shop by Student / Gaming / Office Work / Video Editing |
| Product Search | Live search by name, spec, category |
| Product Page | Specs, image gallery, FAQ accordion, reviews |
| Product Reviews | Star ratings, review form, average rating on cards |
| Wishlist | Heart icon, persists across sessions |
| Recently Viewed | Last 6 products shown above footer |
| Compare | Side-by-side comparison with AI recommendation |
| WhatsApp Share | One-tap to share any product via WhatsApp |
| Enquiry Form | Saved to MongoDB |
| Repair Booking | Form → Job ID → track repair status |
| Service Tracker | Track repair by Job ID |
| Accessories Strip | Relevant accessories shown on laptop/desktop pages |
| PC Builder | Database-driven, admin controls all components |
| Bulk Quote | For schools, offices, government orders |
| Customer Login | Register/login, view enquiry history |
| Newsletter | Email collection |
| Google Maps | Store location with directions |
| PWA | Full offline support, installable on mobile |

### Admin Panel (`/#admin`, password in `.env`)

| Tab | Description |
|---|---|
| Products | Add/edit/delete, stock toggle, inline price edit, image gallery |
| Add Product | Specs, highlights, FAQ, use-case tags, multi-image upload, badge |
| Enquiries | View all, mark read, WhatsApp reply, Generate Invoice |
| PC Prices | Manage components with compatibility specs |
| Service Jobs | Search, update status, technician notes thread, generate invoice |
| Reviews | View and moderate customer reviews |
| Customers | All registered accounts |
| Quotation | Generate formal institutional quotation PDF |
| Analytics | KPI cards, daily chart, top products, stock alerts |
| Banner | Edit scrolling promo text |

### Invoice Generator
- Editable line items with auto-totals
- GST toggle (CGST 9% + SGST 9%)
- Amount in words
- Print / Save PDF
- Send via email or WhatsApp

### Institutional Quotation
- Formal A4 PDF with store letterhead
- Organisation details, GSTIN support
- Items table, GST breakup, amount in words
- Terms & conditions, signature areas
- Suitable for school/government purchase approval

---

## API Routes

```
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
GET   /api/auth/my-enquiries
GET   /api/auth/all-users

GET   /api/products
POST  /api/products/seed

POST  /api/inquiries
GET   /api/inquiries
PUT   /api/inquiries/:id/read
DELETE /api/inquiries/:id

GET   /api/components
PUT   /api/components/:cat/:id
DELETE /api/components/:cat/:id
POST  /api/components/seed

POST  /api/reviews
GET   /api/reviews/:productName
GET   /api/reviews
DELETE /api/reviews/:id

GET   /api/service/track/:jobId
GET   /api/service/all
POST  /api/service/create
PUT   /api/service/:jobId/status
POST  /api/service/:jobId/note
DELETE /api/service/:jobId

POST  /api/email/invoice
POST  /api/ai/compare
```

---

## PWA (Offline Support)

The site works fully offline after first load:
- All pages, images, and assets cached on first visit
- API calls go to network; if offline, UI still loads
- Install prompt appears on Chrome/Android/Edge
- No app store needed

---

