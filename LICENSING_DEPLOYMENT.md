# Dodo licensing deployment

This branch replaces demo checkout/free key generation with Dodo hosted checkout and verified automatic Dodo license keys. The Windows companion app verifies signed device-bound certificates and stores them using Windows DPAPI. A certificate permits up to 14 days offline; a refund is rejected on the next online check, or when that certificate expires.

## Vercel server environment

- `DATABASE_URL`: Neon connection string.
- `DODO_PAYMENTS_API_KEY`: server-only key with Checkout Sessions Write, Payments Read and License Keys Read.
- `DODO_PRODUCT_ID`: `pdt_0NpZhrg9Cf6iCL20eyVnl` for the current test build.
- `DODO_PAYMENTS_ENV`: `test_mode` for this build; never use test keys to sell a live release.
- `DODO_PAYMENTS_WEBHOOK_KEY`: signing secret for this endpoint.
- `LICENSE_SIGNING_PRIVATE_KEY`: complete PKCS#8 RSA PEM, matching the public key embedded in the Windows build. A matching private key has already been generated locally at `C:/Users/CYBERCITY/Downloads/scanmydisk_landing/.local-license/private.pem`. Keep this secret outside GitHub and outside VITE-prefixed variables. Back it up securely; do not regenerate without rebuilding the app.
- `LICENSE_INSTALLER_URL`: HTTPS URL of the final Windows installer. The verified purchase page only shows a download when configured. The installer itself can be copied; license activation is the entitlement check.

Configure `https://www.scanmydisk.com/api/dodo/webhook` for `payment.succeeded`, `license_key.created`, and `refund.succeeded`. Enable automatic license fulfillment, no expiration and one activation in the Dodo product. Checkout and the purchase page must use the production scanmydisk.com domain; capability cookies intentionally do not work on unrelated preview domains.

`npm run build` runs additive migrations 0003 and 0004 against Neon. It must have DATABASE_URL at build time. Without a database, local checks use PGLite; this does not migrate production.

## Before release

1. Deploy this branch with the server environment above; inspect migration and function logs.
2. Make a Dodo test purchase. Confirm the purchase email key matches the verified thank-you page.
3. Install the matching Windows test build, activate the key, restart, and check that a second device is refused. Deactivate on the first device before transferring.
4. Refund the test purchase and confirm the next online startup rejects it. An already issued offline certificate has the documented 14-day limit.
5. For live sales, create/configure the live product, use live API/webhook credentials, and rebuild Windows with that exact live product ID and `live_mode`. Publish a real installer and set LICENSE_INSTALLER_URL before opening sales.

## Validation and maintenance

`node --experimental-strip-types --test scripts/license-security.test.mjs` checks webhook authenticity and signed certificates. `node --experimental-strip-types scripts/licensing-integration.mjs` runs provider fixtures with a local database and refuses real credentials. It does not prove a real Dodo checkout works.

License-key detail lookup currently uses Dodo's supported but deprecated `/license_keys/{id}` adapter. Migrate this isolated adapter to entitlement grants before Dodo removes the endpoint, with the corresponding API permission. Interrupted first activations that consumed a provider slot but failed before local persistence may require support to clear that slot. Email-only recovery intentionally never reveals license keys; use the Dodo purchase email or support.
