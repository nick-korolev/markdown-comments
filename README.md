# Markdown Review Tool

A local-first browser app for reviewing markdown plans and agent outputs. Paste raw markdown, edit it directly, comment on selected text, review anchors in a sidebar, and export the result back into another tool.

## Run

```bash
bun install
bun run dev
```

You can use npm instead:

```bash
npm install
npm run dev
```

Build and test:

```bash
bun run build
bun run test
```

## Deploy

GitHub Pages config is in [deploy-pages.yml](/Users/nkorolev/Documents/projects/planner/.github/workflows/deploy-pages.yml).

To enable deployment:

1. Push the repository to GitHub.
2. In repository settings open `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` or run the workflow manually.

## What it does

- Split layout with raw markdown editor and rendered preview
- Selection-based comments from the editor or preview
- Highlighted comment targets in the preview
- Sidebar for open, resolved, and detached comments
- Local persistence with automatic `localStorage` saves
- JSON session import and three export formats
- Clipboard copy actions for markdown, markdown plus review comments, and JSON export
- Metadata fields for title, source agent, task name, and created date

## Keyboard shortcuts

- `Cmd/Ctrl + S` saves immediately to local browser storage
- `Cmd/Ctrl + Shift + C` creates a comment from the current text selection

## Anchoring approach

Comments are anchored to rendered text, not line numbers.

Each comment stores:

- `selectedText`
- `textStart` and `textEnd`
- `sourceStart` and `sourceEnd` when they can be inferred
- `prefixContext`
- `suffixContext`
- `matchStrategy`
- `reliability`
- `isDetached`

Reattachment works in this order:

1. Reuse the previous exact text range when it still matches.
2. Search for the exact selected text elsewhere in the rendered document.
3. Rank duplicate matches with prefix and suffix context.
4. Fall back to whitespace-tolerant matching.
5. Mark the comment as detached if there is no reliable match.

Detached comments remain visible in the sidebar and exports.

## Project structure

- [`src/App/index.tsx`](/Users/nkorolev/Documents/projects/planner/src/App/index.tsx): app shell
- [`src/hooks/useReviewController/index.ts`](/Users/nkorolev/Documents/projects/planner/src/hooks/useReviewController/index.ts): review state and commands
- [`src/shared/review/anchors.ts`](/Users/nkorolev/Documents/projects/planner/src/shared/review/anchors.ts): anchor creation and resolution
- [`src/shared/review/export.ts`](/Users/nkorolev/Documents/projects/planner/src/shared/review/export.ts): markdown and JSON export builders
- [`src/components/PreviewPane/index.tsx`](/Users/nkorolev/Documents/projects/planner/src/components/PreviewPane/index.tsx): rendered markdown with clickable highlights

## Export formats

### Markdown only

Raw markdown exactly as edited.

### Markdown + review comments

The original markdown followed by:

```md
---

## Review Comments

1. [open] Target: "selected text"
   Comment: reviewer note
```

Detached comments use `Original target` in the output.

### JSON bundle

```json
{
  "meta": {},
  "markdown": "",
  "comments": []
}
```
