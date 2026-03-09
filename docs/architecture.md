# Architecture

Framework: **Next.js (App Router)**

---

## Core Rules

1. **Pages stay tiny**

```

< 50 lines

```

2. **Server components fetch data**

3. **Client components handle interaction**

4. **Never add `use client` to a page unless required**

---

## Tech Stack

| Layer         | Tool           |
| ------------- | -------------- |
| Framework     | Next.js        |
| API           | Orval          |
| Data          | TanStack Query |
| UI            | Radix UI       |
| Component Dev | Storybook      |
| Testing       | Vitest         |
| E2E           | Playwright     |
| Accessibility | axe-core       |
| CI/CD         | GitHub Actions |

---

## Folder Structure

```

src/

app/
layout.tsx
page.tsx

(auth)/
login/page.tsx
signup/page.tsx

(dashboard)/
listings/page.tsx
orders/page.tsx

components/
ui/
layout/
forms/

hooks/

lib/
api/
client.ts
generated/

services/
auth/
listings/
orders/

types/

```

---

## Layers

| Layer        | Purpose                     |
| ------------ | --------------------------- |
| generated    | Orval output (never edited) |
| api client   | API configuration           |
| services/api | domain API logic            |
| components   | UI                          |

---

## Environment Configuration

Environment variables are validated using **Zod**.
