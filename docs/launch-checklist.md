# Launch checklist

The current website runs locally with imported content in Sanity project `xqbous5j`, dataset `production`. Formspree is configured locally and the enquiry form is enabled; actual submission acceptance, inbox storage and notification delivery still need verification. No DNS records or existing WordPress deployment have been changed.

## Content and business review

- Approve main-page copy, consultation descriptions and credential captions. Confirm ambiguous qualification/event details before expanding claims.
- Review medical, legal, financial, deterministic and accuracy claims using Sanity's editorial review status and the archived migration manifest. Reading-page context does not replace a substantive editorial review.
- Review short articles individually; retain the actual published set instead of inventing missing planetary combinations.
- Confirm current fees and inclusions. Until then, pages use “Enquire for fees”; historic payment information stays private.
- Confirm course availability, format, dates and certification wording. Advanced study accepts enquiries without invented details.
- Verify the street address before displaying a map pin. The website currently shows Gurugram only.
- Approve privacy/service information, service-provider settings and retention arrangements.
- Review the introduction video for caption/transcript requirements before claiming full WCAG conformance. Its source had no caption tracks.

## Connections and operational checks

- The Sanity import, source reconciliation, draft isolation, private preview endpoint, publishing/unpublishing and Sanity-only content configuration are verified. Complete an owner-signed-in Studio authoring and visual-overlay check, and configure the deployed environment with the same project and tokens.
- Verify actual Formspree inbox entries and notification delivery for all four enquiry types. Configure account-wide spam controls before enabling production enquiries.
- Check WhatsApp and both phone numbers on a physical phone.
- Enable privacy-aware analytics and the Search Console property when ready. Save a pre-cutover search/traffic baseline where available.

## Deployment and cutover

- Configure Vercel environment variables, deploy a preview, and run the route checker against it.
- Complete physical-device, keyboard, screen-reader and zoom checks. Browser screenshots and automated checks do not establish complete assistive-technology conformance.
- Verify canonicals, sitemap, robots, structured data, social previews and non-indexable draft/search/filter pages.
- Preserve redirects indefinitely where practical, for at least one year.
- Keep the private external WordPress/source/media backup described in `docs/migration-backup.md` and a working rollback configuration.
- Attach `ramanastrologer.com` to the approved deployment and change only necessary website DNS records.
- Submit the sitemap and monitor errors, redirects, enquiries and organic landing pages daily for one week, then weekly for the next month.
- After the rollback window and media verification, stop the old WordPress copy from remaining an independently indexable duplicate.

## Evidence boundaries

Local content imports, builds, route checks and HTTP simulations establish local behavior. Live Sanity API checks establish migration integrity, authenticated preview and publishing behavior. They do not establish live inbox delivery, the owner's complete Studio authoring workflow, production rankings, field Core Web Vitals, or a completed human editorial review.
