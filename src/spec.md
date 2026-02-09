# Specification

## Summary
**Goal:** Successfully publish the existing QA Management app to the Internet Computer (IC) mainnet and record/share the live public URL.

**Planned changes:**
- Fix the publish/deploy flow so the domain/app name used during publish is always valid (5–50 characters; only letters, numbers, and hyphens), including clear messaging and an example when an invalid name is provided.
- Run a successful IC mainnet deployment (`dfx deploy --network ic` or equivalent) and capture the frontend canister’s public URL in the form `https://<frontend_canister_id>.icp0.io`.
- Automatically update `frontend/DEPLOYMENT_LINKS.md` after deploy (via `frontend/scripts/recordDeploymentArtifact.js` or an equivalent automated step) with the latest frontend/backend canister IDs and the live application URL.

**User-visible outcome:** The app is accessible via a shareable `icp0.io` public link, and `frontend/DEPLOYMENT_LINKS.md` contains the current canister IDs plus the matching live URL.
