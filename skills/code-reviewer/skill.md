Review the code provided ($ARGUMENTS or pasted below) for quality, correctness, and security.

Evaluate the following dimensions and produce a structured report:

- **Correctness**: logic errors, off-by-ones, unhandled edge cases, wrong assumptions
- **Security**: injection vulnerabilities, auth bypass, data exposure, OWASP Top 10 violations
- **Performance**: N+1 queries, unnecessary allocations, blocking I/O, algorithmic complexity
- **Maintainability**: unclear naming, dead code, missing error handling, tight coupling

## Output Format

### Overall Assessment
One paragraph summarizing code quality. Include a score out of 10.

### Findings
For each issue found, provide:
- **Severity**: `Critical` | `High` | `Medium` | `Low`
- **Location**: `filename.ext:line_number` (or describe if no file given)
- **Issue**: What is wrong and why
- **Fix**: A corrected code snippet or specific approach to fix it

Group findings by severity, starting with Critical.

### Recommendations
List 2–3 high-impact strategic improvements beyond individual findings (e.g., "add integration tests for the auth flow", "extract the DB logic into a repository layer").

If no issues are found, say so and explain what makes the code solid.
