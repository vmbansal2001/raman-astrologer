# Raman Astrologer

A Next.js website for Acharya Raman Kamra, with an ivory and burgundy design and Sanity content management.

## Local preview

Use Node.js 24 (`.nvmrc`), install with `npm ci`, and copy `.env.example` to `.env.local` if the file does not already exist. Configure the Sanity project and Viewer token, then run `npm run dev` and open [localhost:3000](http://localhost:3000).

**Sanity is required for builds and public content.** The site no longer includes a local article archive or falls back to WordPress JSON. Keep tokens out of Git and chat. Formspree is configured locally and the enquiry form is enabled; actual inbox receipt and email delivery still require verification. Without the enquiry settings, the form displays its unavailable state.

## Sanity

The website uses **astrologer-raman (`xqbous5j`), dataset `production`**. It contains 41 consultations, 88 remedies, 566 educational articles, 99 shared image assets and 18 supporting records for settings, biography, credentials, course and editorial topics.

For local development or deployment, set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID=xqbous5j`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_READ_TOKEN` to a Viewer token for protected draft previews.

The application does not need an Editor token. Studio uses the editor's authenticated Sanity session. Add exact local/deployment origins to Sanity CORS settings with credentials enabled for the embedded Studio.

Open [Studio](http://localhost:3000/studio/) and sign in to edit. Published content drives the public website. Draft previews require verified preview secrets and are non-indexable; the SDK supplies the browser preview token only during verified draft mode. A content-service failure produces an error instead of resurrecting an old article. Search uses full substantive text in bounded cached requests. Build-time page discovery reads published routes directly from Sanity.

The migration, private preview, Viewer write restrictions, publishing and unpublishing were verified against the connected project. Complete the owner's signed-in Studio authoring and visual-overlay check before launch.

## Content and migration records

- `content/` now contains only image metadata, redirects, attachment mappings and retained tag indexes needed by the application. It contains no article bodies or full-text archive.
- Completed migration manifests, reports and one-time verification tools have been retired from the repository and preserved in a private external backup.
- All 99 shared images are served from Sanity. The local `public/media/` folder has been removed. All 884 original WordPress image URLs and 983 previous local image URLs redirect directly to their Sanity CDN assets; older Next.js optimized-image URLs retain their sizing options.
- The optimized introduction video remains public. Its original, old comments, historic payment information, source exports and the retired migration tools are preserved in a private backup outside this repository.

The 695 article files, full-text JSON index, raw exports, upload cache and one-time WordPress/Sanity import tools have been removed from the project. See [backup details](docs/migration-backup.md) for the verified backup locations and checksum files. No environment secrets are included in that backup.

The ongoing route checker reads current published content directly from Sanity and validates pages, metadata, sitemap, redirects and image URLs. Permanent URL changes should be reflected in the runtime redirect maps in `content/`.

New images should be uploaded in Sanity Studio. Local image deduplication tools have been retired. The verified optimized-image backup is documented in `docs/migration-backup.md`.

## Connect enquiry delivery

1. Create the practice's Formspree form and verify `ramanjiastrologer@gmail.com` as its inbox destination.
2. For the current server-forwarded integration, leave **Restrict to Domain** blank and disable Formspree's interactive reCAPTCHA. The server does not forward a browser `Referer` or CAPTCHA token. Keep provider spam filtering and the website's validation, honeypot and request guard active. See [domain restrictions](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain) and [CAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings).
3. Set `FORMSPREE_FORM_ID` and `ENQUIRIES_ENABLED=true`.
4. Confirm private inbox storage and notification email for consultation, remedy, course and general enquiries before enabling production submissions.

The form validates contact details, consent and offering IDs, preserves entered values on failure, and provides WhatsApp alternatives. Success requires confirmed provider acceptance. Ambiguous timeouts are not automatically retried. The bounded per-instance request guard supplements provider-wide spam controls.

## Optional measurement

Set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` to enable Vercel Analytics and contact/enquiry events. Only event type and public offering ID are recorded; messages and birth details are excluded. `GOOGLE_SITE_VERIFICATION` configures Search Console verification.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` uses the supported Webpack builder and standard Tailwind/PostCSS integration. Fonts are served locally.

The HTML parser and standalone Sanity client used by the checks are development dependencies. The website renders Sanity Portable Text directly; the retired HTML sanitizer, migration image helper, unused Vision plugin and Tailwind Turbopack plugin are no longer installed as direct dependencies.

Run the production server on port 3001, then verify its content, metadata, image paths and redirects:

```sh
TEST_SITE_URL=http://127.0.0.1:3001 node scripts/check-routes.mjs
```

### Form-service simulation

`docs/formspree.openapi.yaml` records the JSON dependency contract. The local Postman stand-in models acceptance, errors, rate limiting, malformed responses and a timeout after acceptance.

```sh
postman simulation run postman/simulations/enquiries/enquiries.sim.yaml --proxy --proxy-port 7001 --no-history
```

Use a separate test-server process with the displayed temporary proxy/CA settings, `NODE_USE_ENV_PROXY=1`, `NO_PROXY=127.0.0.1,localhost`, `FORMSPREE_FORM_ID=preview-test`, and `ENQUIRIES_ENABLED=true`. Start production Next.js on port 3001, then run `npm run test:api`. Only `formspree.io` is intercepted; content still comes from Sanity. Keep test proxy/CA settings out of shell profiles and production settings. Git-ignored `test-results/` stores local evidence.

## Public launch

Follow the [launch checklist](docs/launch-checklist.md). Final editorial approval, live form delivery, the owner's Studio workflow check and domain cutover remain launch steps. The existing WordPress deployment is unchanged. Search performance and field Core Web Vitals require observation after deployment.
