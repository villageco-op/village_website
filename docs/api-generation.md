# API Client Generation

Frontend clients are generated automatically from the backend OpenAPI spec.

---

## Source of Truth

Backend:

```

Hono routes + Zod schemas

```

---

## Workflow

1. Backend generates OpenAPI spec
2. CI fetches `doc.json`
3. Saved as:

```

openapi.json

```

4. Client generation runs

---

## Web

Tool:

```

Orval

```

Output:

- typed API client
- TanStack Query hooks

Generated code is stored in:

```

src/lib/api/generated

```

Never edit generated files.
