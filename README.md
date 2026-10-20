# Percy POC (Playwright + static HTML)

Six static pages. `main` is the visual baseline; `feature/visual-changes` introduces one kind of
visual change per page so you can confirm Percy catches each one.

| Snapshot                 | Page          | Change on feature branch                          |
|--------------------------|---------------|---------------------------------------------------|
| Home - layout            | index.html    | LAYOUT: hero reversed + features 3-col -> 1-col   |
| Pricing - color          | pricing.html  | COLOR: buttons + featured card blue -> orange     |
| About - font             | about.html    | FONT: Arial -> Georgia serif, bigger body text    |
| Products - removed el.   | products.html | ELEMENT REMOVED: badges + Add to cart on item 2   |
| Contact - spacing/text   | contact.html  | SPACING + COPY: padding, heading and button text  |
| FAQ - control            | faq.html      | NO CHANGE (should show 0 diffs)                   |

## Setup
```bash
npm install
npx playwright install chromium
export PERCY_TOKEN=<project token from percy.io>   # Windows PowerShell: $env:PERCY_TOKEN="..."
```

## Workflow
```bash
# 1. Baseline build from main
git checkout main
npm run snapshot

# 2. Candidate build from the feature branch
git checkout feature/visual-changes
npm run snapshot
```
Open the build in Percy: Home / Pricing / About / Products / Contact should show diffs, FAQ should not.
Review and Approve/Request changes. For PR-based flow push both branches and open a PR; the GitHub Action
in `.github/workflows/percy.yml` runs the same command (add `PERCY_TOKEN` as a repo secret).

`npm run snapshot:dry` lists snapshots without uploading (no token required).
