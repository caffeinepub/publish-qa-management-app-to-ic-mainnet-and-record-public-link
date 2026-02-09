# Specification

## Summary
**Goal:** Generate a comprehensive baseline dataset (test cases, bugs, corner/edge-case scenarios) for a website and ensure all pages display and edit real generated content (not mock placeholders).

**Planned changes:**
- Expand the backend template-based generator to produce a noticeably larger set of test cases, bugs, and corner cases covering common web-app areas (navigation, forms, auth/session, permissions, responsive/mobile, performance, accessibility, error states, etc.) without crawling the target URL.
- Fix backend ID assignment so generated TestCase/Bug/CornerCase items always receive unique IDs and the next-id counters increment correctly across generations.
- Update Bug/Test Case detail and edit pages to load and persist changes for the real items from the currently selected website (remove mock-data usage).
- Ensure Web App Testing, Bugs list, and Test Cases list render the full generated datasets with correct loading/empty states and scrollable, non-truncated lists.

**User-visible outcome:** After generating data for a website, users can see dozens of generated test cases, bugs, and corner cases across the app; open any item to view real details; edit and save changes; and browse full lists without missing/truncated content.
