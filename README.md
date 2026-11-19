# BioLum — Marriage Biodata Creator

> Create beautiful matrimonial biodata in minutes. 10+ designer templates, live preview, AI-powered bio writing, and instant PDF + WhatsApp-ready image export.

---

## ✨ Features

- **Multi-step form** — 6 sections covering all biodata needs
- **Live preview** — see changes instantly as you type
- **10+ templates** — traditional, modern, elegant & minimal
- **Photo upload** — with in-browser crop
- **AI Bio Writer** — Gemini AI writes your "About Me"
- **Export options** — WhatsApp-ready image, print PDF
- **Privacy first** — data stays on your device
- **No login required** — create and download instantly

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in GEMINI_API_KEY in .env.local for AI features
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google AI Studio API key for AI bio writer | Optional |
| `RAZORPAY_KEY_ID` | Razorpay key for payments | Phase 2 |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Phase 2 |

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **State:** Zustand (persisted to localStorage)
- **Image Export:** dom-to-image
- **AI:** Google Gemini API (`gemini-4-hydrogen`)
- **Payments:** Razorpay _(Phase 2)_

## 📁 Structure

```
src/
├── app/           # Next.js routes
│   ├── page.tsx   # Landing page
│   ├── create/    # Form builder (split-pane)
│   ├── templates/ # Template gallery
│   └── api/       # generate-bio, payment
├── components/
│   ├── form/      # 6 form section components
│   ├── templates/ # TemplatePicker
│   └── preview/   # LivePreview + ExportPanel
├── lib/
│   ├── store/     # Zustand biodata store
│   ├── constants.ts
│   └── utils.ts
└── types/biodata.ts
```

## 🗓️ Roadmap

- [x] Multi-step form (all 6 sections)
- [x] Live split-pane preview
- [x] 10 designer templates
- [x] Photo upload
- [x] Image export (WhatsApp-ready)
- [x] AI bio writer (Gemini)
- [x] Landing page + template gallery
- [ ] Razorpay payment integration
- [ ] User accounts (Supabase)
- [ ] Shareable QR biodata link
- [ ] Hindi language support
