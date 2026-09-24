# Wii Ops Starter Showcase

> Public portfolio showcase of agentic operations governance. The canonical Wii Ops Center and its operational policies remain private.

**Wii Ops Starter Showcase** demonstrates a simple control plane for AI-assisted work: tasks are classified, constrained, executed only within bounded authority, independently checked, and closed only when evidence exists.

## Problem

Agentic systems often fail in one of two directions:

1. too little control — agents execute beyond their authority; or
2. too much control — every small task becomes a bureaucratic approval process.

The design goal is **proportional autonomy**:

> automate low-risk, well-bounded work; escalate consequential or ambiguous actions; require evidence before declaring completion.

## Public showcase flow

```text
Task
  -> Preflight
  -> Risk + Authority
  -> Route
  -> Worker
  -> Verifier
  -> Evidence
  -> Closure
```

Possible public-demo routes:

```text
ASSESSMENT
AUTO_ELIGIBLE
BOUNDED_AUTONOMY
HUMAN_GATE
BLOCKED
```

These are simplified showcase concepts, not a publication of the canonical WOC policy.

## What this demonstrates

- task preflight before execution;
- separation of change risk from execution authority;
- proportional autonomy;
- fail-closed external actions;
- independent verification;
- explicit evidence requirements;
- completion states that distinguish done, blocked and human-gated work;
- deterministic routing logic with tests.

## What is intentionally not public

- canonical WOC routing thresholds;
- provider configuration and credentials;
- internal automation endpoints;
- production runners;
- real tasks, projects or incident data;
- private governance rules;
- operational memory;
- auto-merge implementation details;
- protected deployment or release logic.

See [docs/PUBLICATION_BOUNDARY.md](docs/PUBLICATION_BOUNDARY.md).

## Synthetic demo

The live interface uses fictional tasks only.

No button performs an external action.

## Live demo

After GitHub Pages deployment:

`https://flavio459.github.io/wii-ops-starter-showcase/`

## Run locally

No build step is required.

```bash
node test.js
```

Then serve the directory with any static HTTP server and open `index.html`.

## Tech

HTML · CSS · JavaScript · JSON · GitHub Actions

## Author

Flávio Souza Barros  
Engineering × AI × Automation × Project Systems

## License / reuse

Source-visible for portfolio evaluation only. It is **not released under an open-source license**. See [LICENSE](LICENSE).
