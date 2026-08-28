# Sign Builder Demo Migration Checklist

Use this checklist to move this Laravel/Vue application from local `sbapp` to
`https://design.customsigncenter.com`. Check items off only after verifying them
on the live demo server.

## 1. Plan and back up

- [ ] Confirm the hosting environment supports PHP 8.2+ and the PHP extensions
      required by Laravel (PDO/MySQL, Mbstring, OpenSSL, Tokenizer, XML, Ctype,
      JSON, Fileinfo, BCMath, and GD/Imagick if image generation needs it).
- [ ] Record the server's PHP, Composer, Node/npm, web-server, and database
      versions.
- [ ] Choose a short maintenance window and a rollback owner.
- [ ] Back up the current production/demo database (if replacing an existing
      installation), application files, and `storage/app/public` uploads.
- [ ] Back up the local MariaDB database and `storage/app/public` before the
      first transfer. This app stores design/order previews, print images, and
      generated invoices on the `public` storage disk.
- [ ] Confirm whether the demo should contain real customer/order data. If not,
      prepare a sanitized database export and test accounts instead.

## 2. Prepare the server and DNS

- [ ] Point `design.customsigncenter.com` to the demo server and allow time for
      DNS propagation.
- [ ] Install a valid TLS certificate and verify the HTTPS virtual host.
- [ ] Configure the web-server document root as the application's `public/`
      directory, never the repository root.
- [ ] Ensure requests are passed to `public/index.php` and that static Vite
      assets under `public/build` are served directly.
- [ ] Set the application owner/group and make `storage/` and `bootstrap/cache/`
      writable by the web/PHP user. Keep all other application files read-only
      to that user where practical.
- [ ] Configure a trusted proxy/load-balancer setting if TLS terminates before
      PHP. The app currently applies `ForceHttps` to every request, so Laravel
      must correctly see the original HTTPS scheme or it can redirect in a loop.

## 3. Create production configuration

- [ ] Create the server `.env` from `.env.example`; do not upload the local
      `.env`, and do not commit the server `.env` to Git.
- [ ] Set `APP_NAME`, `APP_ENV=production`, `APP_DEBUG=false`, and
      `APP_URL=https://design.customsigncenter.com`.
- [ ] Generate a new `APP_KEY` for a fresh demo, or preserve the existing key
      when migrating an installation whose encrypted data/sessions must remain
      valid.
- [ ] Enter the server MariaDB credentials: `DB_CONNECTION=mysql`, `DB_HOST`,
      `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`.
- [ ] Use production-safe session settings, including
      `SESSION_DRIVER=database`, `SESSION_SECURE_COOKIE=true`, and an explicit
      `SESSION_DOMAIN=design.customsigncenter.com` (or the intended parent
      domain if cookies must be shared with sibling subdomains).
- [ ] Use a unique `CACHE_PREFIX` for this demo if its database/cache service is
      shared with another Laravel app.
- [ ] Replace the default logging/mail configuration with the intended
      production provider and sender identity; test that the provider accepts
      the server's outbound connection.
- [ ] Set PayPal credentials intentionally: `PAYPAL_MODE=live` only when the
      demo is meant to accept live payments; otherwise retain `sandbox` and use
      sandbox credentials. Update the PayPal app's allowed return/domain
      settings if required.
- [ ] Review any third-party credentials and storage settings before upload;
      the supplied template also includes AWS/S3 placeholders.

## 4. Build and transfer the release

- [ ] Start from a committed, reproducible release; review the current working
      tree so unfinished local changes are not accidentally omitted.
- [ ] Install PHP packages for production with
      `composer install --no-dev --prefer-dist --optimize-autoloader`.
- [ ] Build the frontend with `npm ci` followed by `npm run build`, and deploy
      the resulting `public/build/` directory. Do not run Vite's development
      server on the public host.
- [ ] Transfer the application code, `vendor/` (or install it on the host), the
      built `public/build/` assets, the database export, and the needed
      `storage/app/public/` files.
- [ ] Do not transfer local-only artifacts such as `.env`, `node_modules`,
      development logs, or Vite's `public/hot` file.

## 5. Activate safely

- [ ] Put the site in maintenance mode if the cutover needs data consistency:
      `php artisan down`.
- [ ] Import the approved database backup, then run
      `php artisan migrate --force`. Take a database backup immediately before
      this command; migrations may be irreversible.
- [ ] Create/verify the public-storage symlink:
      `php artisan storage:link`.
- [ ] Clear stale application cache, then optimize the production release:
      `php artisan optimize:clear` and `php artisan optimize`.
- [ ] If database queues are enabled (`QUEUE_CONNECTION=database`), run a
      persistent worker via Supervisor/systemd/hosting control panel, e.g.
      `php artisan queue:work --sleep=3 --tries=3 --max-time=3600`; confirm it
      restarts after deployment.
- [ ] Configure Laravel's scheduler (if any scheduled commands are added) to
      run every minute: `* * * * * cd /path/to/sbapp && php artisan schedule:run`.
- [ ] Bring the app back online with `php artisan up`.

## 6. Security checks before opening the demo

- [ ] Remove or protect the public `/clearall` and `/configcache` routes in
      `routes/web.php`. As currently written, they let any visitor clear/cache
      application configuration.
- [ ] Confirm directory listing is disabled and that `.env`, `storage/`,
      `vendor/`, `.git/`, backups, and logs cannot be requested over HTTP.
- [ ] Confirm `APP_DEBUG=false` and that errors do not reveal paths, secrets, or
      stack traces.
- [ ] Review admin users and passwords; remove development accounts and ensure
      the intended demo administrator can sign in.
- [ ] Check HTTPS redirects, secure session cookies, CSRF protection, and login,
      registration, password-reset, and logout flows.

## 7. Smoke-test `https://design.customsigncenter.com`

- [ ] Check `/up` returns healthy and the home page loads with no console errors
      or missing CSS/JS assets.
- [ ] Register/sign in, create and save a design, reload it, and confirm its
      preview is available through `/storage/...`.
- [ ] Create an order, generate a print image and invoice, and download the
      invoice.
- [ ] Test the admin dashboard, designs, orders, users, and add-ons pages with
      an admin account.
- [ ] Test the intended PayPal environment end-to-end. Verify the order status,
      capture details, and paid/abandoned email delivery.
- [ ] Check `storage/logs/laravel.log`, failed jobs, web-server logs, and browser
      network requests for errors after the smoke test.

## 8. Monitor and roll back

- [ ] Watch logs, queue health, disk usage, and database connections during the
      first day of demo use.
- [ ] Keep the prior release, database backup, and storage backup until the demo
      is accepted.
- [ ] If rollback is needed, enable maintenance mode, restore the prior release
      plus its matching database/storage backup, clear/rebuild caches, restart
      queue workers, and retest `/up` and sign-in.

## Deployment notes

- This repository uses Laravel 12, Vue/Inertia, Vite, MariaDB, database-backed
  sessions/cache/queues, local public storage, and PayPal configuration.
- The application includes recently changed, uncommitted order, invoice,
  middleware, database-migration, and UI files. Decide whether they belong in
  the demo release before making the deployment artifact.
