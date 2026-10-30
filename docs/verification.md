# Implementation verification

Verified locally on 30 October 2026. The existing WordPress website and its DNS have not been changed.

## Content and routes

- The migration manifest accounts for all 703 published source URLs: 695 posts and eight pages.
- Imported posts reconcile to 41 consultations, 88 remedies and 566 educational articles.
- Migration verification found no broken migrated internal links, retained payment links, or outdated contact boilerplate.
- Every one of the 695 canonical content pages returned HTTP 200 with the expected heading, canonical address and description. Educational pages also contained Article structured data.
- 1,027 explicit legacy URL redirects and 884 image-address redirects returned the expected permanent destination. Additional parameterized category redirects are configured.
- Three retained tag archives, pagination, filters, search, missing-page responses and search/filter noindex metadata passed the production route check.
- The sitemap returned 719 canonical URLs; robots and the social preview image were available.
- All 884 referenced source image URLs and 983 previous local image URLs are preserved through direct redirects to 99 shared Sanity image assets. The local media folder has been removed. Per-page captions, alternative text and dimensions are retained. The introduction video has a local optimized copy and a private original backup.
- After cleanup, all 695 content pages, 884 original source-image redirects, 983 previous local image redirects and 99 Sanity CDN image responses passed the production route check. Next.js image optimization also returned a valid image for the shared portrait. Reprocessing all 884 cached source images reproduced the same shared files and dimensions.

## Build and enquiries

- Production build, TypeScript, ESLint and whitespace checks passed.
- Seven enquiry-validation tests and seven media-redirect tests passed. The image tests cover original WordPress paths, both generated filename forms, direct CDN destinations, unknown image paths, malformed optimizer inputs and older Next.js optimized-image URLs.
- Thirteen HTTP integration scenarios passed against the actual built enquiry endpoint and a local Formspree stand-in, intercepted through the Postman proxy. These covered all four enquiry types, validation, origin checks, malformed requests, provider failures, rate limits, unconfirmed responses and a timeout after acceptance. No live messages were sent.
- The production server also confirmed that the unconfigured public form reports its availability honestly.

## Browser checks

- Checked desktop and mobile layouts, with no horizontal overflow or broken loaded images on the sampled pages.
- Mobile navigation closes with Escape and restores focus to its toggle.
- A consultation enquiry carries the selected offering into the form.
- Invalid form submission focuses the first invalid field. Local simulated success displays “Enquiry received”; simulated delivery failure retains entered values and focuses the failure message.
- Unknown birth time disables the time field; approximate time enables it.
- Course curriculum sections expand on mobile. The certificate lightbox traps focus through its native dialog and restores focus when dismissed with Escape.
- Saved desktop and mobile homepage screenshots in `docs/screenshots/`.

Raw local route and HTTP evidence is saved in the Git-ignored `test-results/` directory. The repeatable checks and account connection steps are documented in the project README.

## Connected Sanity verification

The `production` dataset in project `xqbous5j` contains all 695 migrated content items, 99 shared image assets and 18 supporting records. Every article body, featured image, image occurrence, original date and preserved address was compared with the source archive. All twelve course sections are present. Local Studio origins allow authenticated requests. The read token was verified to reject writes, and neither token appears in the ordinary public homepage.

Disposable documents verified unpublished-draft isolation, invalid preview-secret rejection, authenticated non-indexable draft rendering, preview exit, publishing and unpublishing through the real local website and Sanity APIs. All disposable documents and preview secrets were removed. The private migration-records backup retains the original Sanity reconciliation evidence; `test-results/sanity-preview.json` records the connection checks. Sanity is now authoritative in the local configuration. The original JSON and source exports were subsequently removed from the repository after a fresh reconciliation. A private external backup retains migration records and originals; see `docs/migration-backup.md`.

The connected production build and all 695 content-page checks passed. The shared discovery index is fetched in batches of 100 records to stay within Next.js's data-cache limit; the final build reports no cache-size warnings. The production homepage uses Sanity images, its remote image optimization works, and public HTML contains neither saved API token.

## Archive removal

The 695 article JSON files, full-text JSON index, raw source exports, import cache and one-time import scripts have been removed from the repository. Published page discovery now queries Sanity, and the application no longer reads an article archive or uses a readiness flag to fall back to one. The private external backup and checksum are documented in [migration backup details](migration-backup.md).

With those files absent, TypeScript, ESLint, the test suite, both live CMS/migration checks and the production build passed. All 695 content pages, the 719-URL sitemap and legacy redirect/image paths passed the production route check. All 28 production tracing manifests were checked and contain no article archive files. The ordinary preview and Studio remain available. The six remaining `content/` JSON files contain only redirects, taxonomy IDs and image metadata.

## Work remaining before public launch

The owner still needs to verify the complete signed-in Studio editing and visual-overlay experience. Formspree inbox receipt and notification email require a connected, verified form. The source content is preserved; human review of sensitive claims, short articles, credential captions, fees and course wording remains necessary. Video captions, physical-device and full assistive-technology checks remain launch checks. Search rankings and field Core Web Vitals can only be established after deployment and observation.

See the [launch checklist](launch-checklist.md) for these remaining steps.

## Local image removal

All 99 optimized source files were checked against the stored Sanity asset hashes and file sizes before removal. Every public CDN response was checked for availability and matching dimensions. Sanity's public image pipeline may optimize the delivered rendition; the stored source hashes, rather than transformed response bytes, establish source preservation. See [Sanity image transformations](https://www.sanity.io/docs/content-lake/image-urls).

Site image metadata now uses CDN URLs, and both older generated image paths and the most recent shared local paths have direct permanent redirects. Older Next.js image-optimization requests are redirected to the CDN source while preserving width and quality settings. The retired media files, mappings and cleanup tools are preserved in a verified private backup outside the repository. The private migration-records backup retains its checksum and removal report.

With `public/media/` absent, the final production build, all fourteen tests, all 695 content-page checks, 1,867 legacy image redirects and all 99 CDN image responses passed. Homepage and article image sources were confirmed to use Sanity, including the homepage recognition photo and article-author portrait loaded from their CMS records. Older optimized-image requests also returned a valid image after redirecting. Image-response checks accept the format negotiated by the CDN instead of assuming WebP from the source filename.

## Migration tooling retirement

The completed `migration/` reports and both one-time migration verifiers have been removed from the project after a verified private backup. Current route checks read published Sanity content and the active URL mappings directly. They verify the nine canonical pages as well as content pages, metadata, image paths, redirects and sitemap without reading migration manifests. Ordinary enquiry checks and regression tests remain in the repository. See [backup details](migration-backup.md) for the archived reports and retired tooling.

With the migration directory absent, the production build, TypeScript, ESLint and all fourteen tests passed. The revised route checker reported no failures across 695 content pages, nine canonical pages, 1,027 legacy page redirects, 1,867 legacy image paths, 99 CDN images and the 719-URL sitemap.

## Dependency and unused-code cleanup

Verified on 31 October 2026. Removed five unused direct dependencies: the migration image helper, Vision plugin, HTML sanitizer and its types, and Tailwind Turbopack plugin. The offline dependency update pruned 91 installed packages. The route-check HTML parser is now a development dependency, and its Sanity client and Portable Text types are explicitly declared instead of relying on transitive packages.

Removed the unused local credential list, unused enquiry-button component and obsolete HTML/headings/video fields from the content interface. Credential rendering still reads Sanity; article content still uses Portable Text. Consolidated environment-file exclusions and kept restored migration records ignored. The production build generated all 725 static pages with no cache-size warnings; TypeScript, ESLint, the fourteen existing tests and lockfile consistency checks passed. No content or Sanity records were deleted during this cleanup.

## Formspree connection readiness

Verified on 31 October 2026. The local environment contains a form ID and enables enquiries. A read-only Postman check of the running contact page passed all three assertions (HTTP 200, form rendered, unavailable message absent; CLI exit 0), and a separate HTML check confirmed the submit button is enabled. A GET to the configured Formspree address returned HTTP 405 (CLI exit 1), which establishes reachability but does not verify that a submission will be accepted. No enquiry or notification email was sent. Provider settings, actual acceptance, private inbox storage and notification email remain to be verified through an intentional test submission. Sanitized local evidence is saved in `test-results/formspree-connection.json`.
