# Storybook — Quick Start (design-system)

This quick-start file lives inside the `design-system` package so contributors can quickly run Storybook without opening the repo root docs.

## Run Storybook (development)

```bash
cd design-system
npm install
npm run storybook
```

If you hit peer-dependency issues, use the pinned runtime:

```bash
npx storybook@8.6.15 dev -p 6006
```

Storybook will start on: **http://localhost:6006**

## Build static Storybook

```bash
cd design-system
npm run build:storybook
# output: design-system/storybook-static/
```

## Quick troubleshooting

- Ensure `src/index.css` exists and is imported in `.storybook/preview.ts`.
- Tailwind is processed via the Vite plugin in this repo — do NOT add `tailwindcss` to `postcss.config.js` when using the Vite plugin.
- If PostCSS complains about missing modules, install autoprefixer:

```bash
npm install --save-dev autoprefixer --legacy-peer-deps
```

- Clear caches if you encounter issues:

```bash
rm -rf node_modules/.vite .storybook/.cache node_modules/.cache
npm run storybook
```

## Components documented

36 stories across 7 components:

- Button (8 stories)
- Input (6 stories)
- Card (4 stories)
- Alert (6 stories)
- Badge (6 stories)
- Dialog (3 stories)
- Label (3 stories)

For a fuller guide, troubleshooting steps, and component details, see the consolidated Storybook document at the repo root: `../STORYBOOK.md`.

# 🎨 Storybook Quick Start Guide
