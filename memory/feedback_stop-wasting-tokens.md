---
name: stop-wasting-tokens
description: Stop running unnecessary verification commands, grep checks, and syntax validations after completing work - just wait for user feedback
metadata:
  type: feedback
---

Do not run unnecessary verification commands after completing work. No grep checks, no syntax validations, no "let me verify" steps. Just do the work and wait for user feedback.

**Why:** User is extremely frustrated by wasted tokens and time on busywork commands that add no value. Anthropic's default behavior of verifying everything is seen as resource waste.

**How to apply:** After making changes, stop. Don't run validation commands. Don't check references. Don't verify syntax unless something actually broke. Wait for the user to tell you what's wrong.
