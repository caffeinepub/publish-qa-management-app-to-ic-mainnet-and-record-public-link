# Specification

## Summary
**Goal:** Add a URL-based “Web App Testing” generator that creates a baseline test plan (test cases, bug list, and corner/edge cases) for a pasted website URL, with an “Auto + Manual” workflow and saved history.

**Planned changes:**
- Add a new “Web App Testing” generator page with a URL input, client-side validation (http/https + valid hostname), and a primary “Generate” action.
- Implement deterministic, template-based backend generation (no crawling/fetching and no external AI/APIs) that returns 20+ test cases, 10+ bug suggestions, and 10+ corner cases per URL with clear English titles and step-by-step content where applicable.
- Add backend persistence for target websites (id, url, createdAt, updatedAt) and their generated artifacts, scoped per user, so results can be revisited after refresh.
- Add an “Auto + Manual” results workflow: users can add/edit/delete test cases and bugs and have those changes persist without being overwritten; UI distinguishes generated vs user-created/edited items.
- Integrate the generator into navigation/routing and allow selecting previously created target websites (history) to view their test cases, bugs, and corner cases in the selected target context.

**User-visible outcome:** Users can paste a website URL, generate a saved baseline set of test cases/bugs/corner cases, revisit prior URLs from history, and manually refine (add/edit/delete) test cases and bugs with changes preserved.
