# Worktree local setup (WAMP)

## How the API is served

`http://api.ghosty.local:8000` is served by `php artisan serve`, launched from the worktree in use:

```powershell
cd C:\wamp64\www\ghosty-feature-{name}\backend
composer api
```

`composer api` runs `php artisan serve --host=127.0.0.1 --port=8000` without Composer's process
timeout. WAMP still provides MySQL: start it before the API.

The front points to it with `VITE_GHOSTY_API_URL=http://api.ghosty.local:8000/api/`. The auth
cookie keeps working: `app.ghosty.local:5173` and `api.ghosty.local:8000` are the same site, and
SameSite ignores ports.

### Why not the WAMP Apache vhost

The WAMP Apache serves several Laravel apps (findart, babyborn, hotel2for1…). On Windows, `mod_php`
runs every vhost in one multi-threaded process that shares its environment: Dotenv writes each
`.env` variable with `putenv()` and never overwrites an existing one, so an app can boot with the
`DB_DATABASE` or `APP_KEY` of another. `artisan serve` gives Ghosty its own PHP process.

Fixing it in code (`Env::disablePutenv()` in `bootstrap/app.php`) was rejected: a local
environment problem does not belong in code that ships to production, where PHP-FPM runs one pool
per site.

## Switching to another worktree

Stop `composer api` (Ctrl+C) and run it again from the other worktree's `backend` folder.

## Database

All worktrees share the database named in their `backend/.env` (`ghosty` by default).
`php artisan migrate:fresh --seed` in one worktree wipes the data of every other one. Give the
worktree its own `DB_DATABASE` before running a destructive migration on a schema that differs.

## When the front cannot reach the API

1. Network error on every endpoint: `composer api` is not running, or runs from a deleted worktree.
2. A request answers but the behaviour is not the expected one: `composer api` runs from another
   worktree. Check the folder of the terminal that launched it before debugging the code.
3. Every endpoint answers 500 with `SQLSTATE[HY000] [2002]`: MySQL is stopped. Start WAMP.
4. A `.env` change has no effect: Vite and `artisan serve` read `.env` only at startup. Restart
   the process.
