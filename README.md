# Obat — Ooredoo Business AI Assistant

> 🏆 **Hackathon submission** for the Ooredoo Enterprise AI use case
> *(B2B SME AI Assistant)*. Bilingual (English / Arabic with RTL) customer-service
> chatbot built in 24 hours.

### 🚀 [**Live demo — obat-chatbot.vercel.app**](https://obat-chatbot.vercel.app)

[![Live demo](https://img.shields.io/badge/🚀_Live_demo-Click_here-brightgreen?style=for-the-badge)](https://obat-chatbot.vercel.app)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://obat-chatbot.vercel.app)

A React + Vite + Tailwind front-end wired to a FastAPI / sentence-transformers
back-end. Designed to demo Ooredoo's path to a production-grade, multilingual
B2B support assistant on top of their existing CRM, ticket, product catalog,
and FAQ data.

![status](https://img.shields.io/badge/status-hackathon%20demo-red)
![lang](https://img.shields.io/badge/i18n-EN%20%7C%20AR%20(RTL)-blue)
![stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Tailwind-informational)

> **Try it in 30 seconds:** open the live demo → tap a topic card (e.g. *Connectivity*) → switch to **Desktop** view → toggle **AR** for the RTL Arabic layout.

---

## What's in this repo

This repository contains **only the front-end** of the Obat assistant — the
React UI, bilingual i18n + RTL layer, and the chat service abstraction that
talks to the hackathon back-end.

The back-end (vector store, intent classifier, FastAPI service) and the
hackathon dataset (CRM SQL, tickets, products, maintenance, FAQs) are **not**
part of this repo — they're distributed separately by the hackathon organizers.

If the back-end isn't reachable, the front-end falls back to a built-in
bilingual mock service so the demo always works.

## Hackathon features

- 🌐 **Bilingual EN / AR** with full RTL mirror, Noto Kufi Arabic font, and
  persisted language preference
- 💬 **Real-time chat** with typing indicator, auto-scroll, and message
  timestamps
- 🧠 **Intent insights chip** showing classified intent + confidence + the
  recommended action (solve / escalate / upgrade / inform)
- ⚡ **Contextual quick-reply chips** that refresh per intent so demos feel
  scripted
- 🎟️ **Escalation modal** with SLA-aware copy (Gold / Silver / Bronze /
  Platinum) and impact selection
- 📈 **Upsell offer card** with multi-term pricing (12 / 24 / 36 months) from
  the product catalog
- 👍 **Thumbs up / down feedback** on every bot message
- 🛟 **Graceful fallback**: if the back-end is unreachable, a built-in mock
  intent engine answers in both languages so the demo never breaks
- 🧪 **Guest session ID** generated on load (no auth required for the demo)

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`).

### Optional — connect the real ML back-end

```bash
cp .env.example .env.local
# .env.local will contain:
# VITE_API_BASE_URL=http://127.0.0.1:8787
```

If `VITE_API_BASE_URL` is set and `/health` responds, the chat hits the real
sentence-transformers retriever + scikit-learn intent classifier. Otherwise
the bundled mock kicks in.

See `docs/AI_ASSISTANT_RUNBOOK.md` in the hackathon dataset for instructions
on booting the FastAPI service, building the vector store, and training the
intent classifier.

## Security & privacy

This repo is safe to publish publicly:

- **No API keys, tokens, or credentials** are required by this front-end.
  The demo runs against a localhost back-end (or the bundled mock).
- `.env.local` (any local configuration) is git-ignored — only the
  `.env.example` template is committed and it contains a placeholder
  localhost URL.
- **No customer data** is bundled. The hackathon CRM SQL, tickets,
  maintenance records, and FAQs live in a separate distribution and are
  ignored by `.gitignore`.
- No auth flow, no PII collection, no analytics. Guest session IDs are
  generated client-side and used only for the demo.

If you fork this for your own backend that does require auth, **never** put
keys in source — use `.env.local` (already git-ignored) or your hosting
provider's secret manager.

## Project layout

```
src/
  main.tsx
  app/
    App.tsx                       # Shell + view switcher + LanguageProvider
    i18n/LanguageContext.tsx      # AR/EN context, dir/lang on <html>
    components/
      mobile/MobileChatView.tsx   # Mobile chat view
      desktop/DesktopDashboard.tsx# Desktop 3-panel dashboard
      shared/                     # WelcomeScreen, QuickReplies, LanguageToggle, ...
      ui/                         # shadcn / Radix primitives
  services/
    chatService.ts                # Real API + mock fallback
    mockKnowledge.ts              # Bilingual intent rules
    types.ts                      # Shared types
  styles/                         # Tailwind entry + globals + theme
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |

## Tech stack

- React 18, Vite 6, TypeScript 5
- Tailwind CSS v4 + tw-animate-css
- Radix UI + shadcn primitives, sonner toasts, lucide-react icons
- Custom bilingual i18n context with RTL handling
- FastAPI + sentence-transformers + scikit-learn back-end (separate repo)

## Credits

Built for the Ooredoo Enterprise AI hackathon. UI scaffold exported from
Figma Make; functionality, bilingual layer, chat service, and back-end
integration implemented in this repo.
