# Testing

Tests run automatically on pull requests and block merges if failing.

---

## Test Types

### Unit Tests

Framework:

```

Vitest

```

Test:

- hooks
- utilities
- complex components

Rules:

- mock API calls
- test one behavior per test
- clear naming

Example:

```

should_display_user_name_when_data_loaded

```

---

### Component Tests

Framework:

- Vitest
- React Testing Library

Test:

- complex interactions
- forms
- state logic

---

### E2E Tests

Framework:

```

Playwright

```

Test critical flows:

- login
- signup
- checkout
- payments

---

## CI Execution

Pull Request:

```

unit tests
component tests

```

Merge to `main`:

```

E2E tests

```
