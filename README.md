# VoiceVue Agent

**AI interview agent** — Next.js app with Prisma/Postgres for structured, voice-driven mock interview flows.

## Stack

- Next.js + TypeScript + Tailwind  
- Prisma + PostgreSQL (`@prisma/adapter-pg`)  
- Motion animations, shadcn UI, Sonner toasts  

## Getting started

```bash
git clone https://github.com/ANSHSINGH050404/voicevue-agent.git
cd voicevue-agent
npm install   # or bun install
cp .env.example .env  # if present — set DATABASE_URL
npx prisma migrate dev
npm run dev
```

## Author

[ANSHSINGH050404](https://github.com/ANSHSINGH050404)