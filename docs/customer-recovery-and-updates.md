# Customer recovery and Windows updates

- `/license` offers the latest Windows installer and Dodo Customer Portal.
- Production `DODO_CUSTOMER_PORTAL_URL` must be the Live static email login URL: `https://customer.dodopayments.com/login/BUSINESS_ID`. Never use a customer-specific magic link as a public recovery link.
- Dodo handles email proof, licence retrieval and invoices. Installer download is public; app activation still requires a valid paid licence. No keys are returned merely from knowing an email address.
- `LICENSE_INSTALLER_URL` is used by checkout delivery and `/api/download`.

## Publishing a Windows update

1. Bump the native csproj and Inno Setup version together, then publish and compile the installer.
2. Run `node scripts/publish-update-manifest.mjs VERSION INSTALLER PRIVATE_PEM_PATH`. Use the local signing key that matches the app's embedded public key. Never commit the private key.
3. Upload that exact installer to GitHub release `windows-vVERSION` with asset name `ScanMyDisk-Setup-x64.exe` and verify its SHA-256/size against the signed manifest before publishing.
4. Set production `LICENSE_INSTALLER_URL` to the new release asset. Commit `public/update.json` and deploy the site.
5. Verify `/update.json`, `/api/download`, and the app's Updates screen. Test cancellation, corrupted installer rejection, current-version state and upgrades without losing scans/licences.

The app accepts only RSA-SHA256 signed manifests with audience `ScanMyDisk.Windows.Update`, an approved GitHub release URL and bounded installer size. It streams the download, verifies size/hash, and verifies again before launching the interactive installer. Users choose installation. Scanning, cleanup, uninstall and snapshot saving prevent installation until finished. The installer updates the program directory; licence and scan data stay in the user's LocalAppData folder. This manifest signature does not replace Windows Authenticode signing.
