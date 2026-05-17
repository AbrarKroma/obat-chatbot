# Obat — Ooredoo Business AI Assistant

Bilingual (English / Arabic, RTL) customer-service chatbot for Ooredoo B2B SME
support. Built for the Ooredoo Enterprise AI hackathon.

- React 18 + Vite 6 + Tailwind CSS v4
- Radix UI / shadcn primitives, sonner toasts, lucide-react icons
- Pluggable chat service: connects to the hackathon FastAPI backend
  (`/chat/respond`) when reachable, falls back to a built-in bilingual mock
  otherwise so the demo always works.
- Full RTL layout, Noto Kufi Arabic font, language toggle persisted to
  `localStorage`, intent insights, quick replies, offer cards, message
  feedback, escalation modal.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`).

### Optional: point at the real ML backend

```bash
cp .env.example .env.local
# .env.local already contains:
# VITE_API_BASE_URL=http://127.0.0.1:8787
```

If `VITE_API_BASE_URL` is set and the server responds on `/health`, the chat
hits the real classifier + vector store. Otherwise the bundled mock kicks in.

See the hackathon dataset's `docs/AI_ASSISTANT_RUNBOOK.md` for instructions on
booting the FastAPI service.

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
      ui/                         # shadcn/Radix primitives
  services/
    chatService.ts                # Real API + mock fallback
    mockKnowledge.ts              # Bilingual intent rules
    types.ts                      # Shared types
  styles/                         # Tailwind entry + globals + theme
```

## Features

- Real-time messaging with typing indicator + auto-scroll
- Bilingual welcome screen with 5 topic cards
- Contextual quick-reply chips per intent (refresh on every bot turn)
- AI Insights chip showing intent + confidence + recommended action
- Offer card + upgrade sheet (24/36-month pricing tiers)
- Escalation modal with SLA-aware copy
- Thumbs up/down feedback on every bot message
- Error banner with retry on API failure
- AR/EN language toggle with RTL mirror + Noto Kufi Arabic font
- Guest session ID generated on load
- Configurable backend via `VITE_API_BASE_URL`, mock fallback baked in

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
