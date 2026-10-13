# Windows frontend redesign plan

Product: Scan My Disk for Windows 10/11 x64, version 0.1.5.

## Audit findings

- The hero says Windows, but feature/view images, FAQs, toolkit descriptions and guides still describe Mac, Finder, APFS and Xcode.
- The hero and social preview do not match the current Windows interface.
- Product copy needs to distinguish saved size snapshots from full file backups, and reviewed cleanup from automatic deletion.
- Age Map is based on modification dates, not proof that a file was never opened. Windows app-data discovery is reviewed and does not guarantee identification of every leftover.
- The current app requires a valid licence before its main window opens. Do not advertise a free tier that the app does not provide.

## Changes included now

Remove active Grok frontend chrome and public branding assets. Replace the hero with a real scan of a public Windows system folder. Redact the username and publish no personal paths or licence keys. Use that real screenshot as the 1200x630 Open Graph/Twitter preview. Preserve Dodo checkout, verified purchase delivery, Customer Portal and installer downloads.

## 1. Hero and product proof

Use a compact Windows-only headline, a blue Get Pro button matching the app, and an Already purchased link. Place a wide screenshot below the copy so map labels remain legible. Display Windows 10/11 x64, $5 once, one PC at a time, and current version. Avoid invented testimonials, speed claims and savings figures.

## 2. Five features matching the app

- Explore: scaled treemap, folder/list browsing, search, inspector, alternative visualizations and PC/Home/folder scanning. Use real captures for each shown mode.
- Duplicates: match contents, show potential logical savings, keep one copy and stage others for Cleanup Queue review. Never imply automatic deletion.
- Applications: installed app icons, Windows/vendor uninstall handoff and reviewed keep/remove app-data choices. Do not promise to detect every leftover.
- Monitor: CPU, memory, network, system-drive usage and process filtering/sorting. Show actual live measurements, not mock values.
- Snapshots: save scan sizes locally and compare the same location across dates. Explain that this does not back up files.

Add remembered last scan, in-app updates and secure licence recovery as supporting benefits. Explain local processing, protected paths, review before cleanup and Windows Recycle Bin.

## 3. Purchase and recovery

Use one lifetime purchase card describing the actual activation requirement. Explain Dodo checkout, purchase email, licence entry, the one-PC limit, transferring activation, 14-day offline grace and updates. Keep Get Pro and Already purchased actions consistent. Provide a manual installer link when automatic downloading is blocked. Downloading the installer and activating it are separate steps.

## 4. Windows content cleanup

Rewrite Mac-specific FAQs, tool descriptions, unsupported themes/free-tier claims and feature labels. Replace the 16 Mac-oriented guides with useful Windows guides; map old indexed URLs to matching replacement topics before changing URLs. Align legal/support content with the actual refund policy. Use Explorer, Recycle Bin and AppData terminology correctly.

## 5. Visual design and validation

Use charcoal surfaces, restrained blue accents, readable typography, consistent buttons and clear spacing. Show full app captures and optional enlarged details without altering their measurements. Check desktop and 390px mobile, feature tabs, keyboard access, checkout/recovery/download links, image sizes, canonical URLs, social metadata and absence of Grok branding/scripts. Typecheck, build and browser-check production before publishing.

Screenshot provenance is recorded in public/windows-screenshot-info.json. Demo/test graphs must not be published as real scans. Full layout and copy redesign remains the proposed next phase; this pass implements branding, the real hero image and share preview.
