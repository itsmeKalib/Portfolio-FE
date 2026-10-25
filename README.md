# CJ Balateria — Portfolio

A responsive, interactive portfolio starter built with semantic HTML, CSS, and vanilla JavaScript. It has no build step or runtime dependencies.

## Keep the code readable

Prettier is included as a development dependency. Install it with `pnpm install`, then run `pnpm format` to organize the source files. Use `pnpm format:check` to check formatting without changing files. Formatting tools are only needed for editing; the portfolio itself still runs as static files.

## Run it

Open `index.html` in a browser, or serve this folder with any static file server.

## Personalize before publishing

The beginner introduction and learning topics are starter copy. Update them to match your own experience. The About layout uses your fixed profile photo. The contact form validates its fields, then opens a prefilled Gmail draft to `mizubalateria@gmail.com`; visitors must review and send the draft in Gmail. Facebook and email links are included. This works without a backend, but does not send messages silently from the portfolio.

### Replace the project pictures

Use the **Change image** button on a project card to pick a PNG, JPG, or WebP image. The selected project image is resized and saved in this browser, so it remains after refresh on this device. The About photo is a fixed image at `images/c12.png`. Project images are saved only in this browser and are not uploaded to a server. The included `images/project-01.png` and `images/project-02.png` are the starting project pictures.

Project tags get an accent color sampled from each card's image. To change the tag words, edit the matching `tags` list near the top of `app.js` so they describe that project.

## Interactions

- Responsive navigation with keyboard and Escape support.
- Light and dark theme preference saved in local storage.
- Section-aware navigation, scroll reveals, and replaceable project image cards.
- Filterable work gallery and accessible native project-detail dialogs.
- Reduced-motion support and keyboard focus styling.
- Validated contact form that opens a prefilled Gmail draft, plus direct Gmail and Facebook links.

## Files

- `index.html` — content and semantic page structure.
- `styles.css` — design system, responsive layout, artwork, and motion.
- `app.js` — navigation, theme, filtering, project details, and reveal behavior.
- `images/` — profile and project images.
