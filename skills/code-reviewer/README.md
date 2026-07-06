# Code Reviewer

Performs a thorough code review covering bugs, security vulnerabilities, performance issues, and style — and outputs structured findings.

## Usage

```
/code-reviewer
/code-reviewer src/auth.ts
/code-reviewer "the payment processing logic"
```

Paste code directly after invoking, or pass file paths or a description as arguments.

## What It Checks

- **Correctness** — logic errors, off-by-ones, unhandled edge cases
- **Security** — injection, auth bypass, data exposure (OWASP Top 10)
- **Performance** — N+1 queries, blocking I/O, unnecessary allocations
- **Maintainability** — unclear naming, dead code, missing error handling

## Output

Returns a structured report with:

- Overall assessment and quality score (1–10)
- Findings grouped by severity (Critical → High → Medium → Low)
- 2–3 strategic recommendations
