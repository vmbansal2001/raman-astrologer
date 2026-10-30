# Retired WordPress migration archive

Sanity is the website's content source. The local article JSON, full-text index, original exports, import cache and one-time WordPress/Sanity import tools were removed after the complete migration was reconciled again with the live project.

A private machine-local backup is stored outside the repository:

`../raman-astrologer-backups/wordpress-migration-2026-10-30-a3f6f01a.tar.gz`

Its adjacent `.sha256` file records the checksum. The backup was checked to contain all 695 article files, the original source exports, comments, historic payment material, original media and migration scripts. It contains no `.env.local` file or environment secrets. The backup file is accessible only to its owner.

The backup is independent of the application and is not bundled or deployed. To inspect or restore migration material, extract it into a separate working directory. Website content changes should continue in Sanity Studio.

Redirects, image mappings and tag indexes remain in `content/` because the website uses them to support legacy URLs. Completed migration audit reports have been moved into the private records backup below.

## Optimized images

Before removing `public/media/`, a second private backup preserved its 99 optimized image files, previous mappings and retired cleanup tools:

`../raman-astrologer-backups/sanity-media-2026-10-30-63e277a0.tar.gz`

Its adjacent `.sha256` file records the checksum. All 99 source hashes match the uploaded Sanity assets. The website now renders those assets from Sanity, and old image URLs redirect to the CDN.

## Completed migration records

The final migration reports and manifests, including source URL outcomes, reconciliation evidence, image-storage checks and backup metadata, are preserved in:

`../raman-astrologer-backups/migration-records-182fdfe5.tar.gz`

The archive also contains the retired one-time verification scripts and their previous package commands. Its adjacent `.sha256` file records the checksum. The repository no longer contains a `migration/` directory, and current route/enquiry checks do not depend on these archived reports. No environment secrets are included.
