# Worktree local setup (WAMP)

## How the API is served

`http://api.ghosty.local` (port 80) is served by a single WAMP vhost pointing to
`C:\wamp64\www\ghosty-active\backend\public`. `ghosty-active` is a Windows junction to the
worktree currently in use. No per-worktree port, no Apache edit when switching.

## Switching to another worktree

```powershell
Remove-Item C:\wamp64\www\ghosty-active
New-Item -ItemType Junction -Path C:\wamp64\www\ghosty-active -Target C:\wamp64\www\ghosty-feature-{name}
```

The front keeps `VITE_GHOSTY_API_URL=http://api.ghosty.local/api/`.

## Database

All worktrees share the database named in their `backend/.env` (`ghosty` by default).
`php artisan migrate:fresh --seed` in one worktree wipes the data of every other one. Give the
worktree its own `DB_DATABASE` before running a destructive migration on a schema that differs.

## When the front cannot reach the API

1. CORS error "no Access-Control-Allow-Origin" on every endpoint: Apache answers 404 because the
   junction target no longer exists (worktree deleted after merge). Check `ghosty-active` first.
2. A request answers but the behaviour is not the expected one: the junction points to another
   checkout. Check its target before debugging the code.
3. A `.env` change has no effect: Vite reads `.env` only at startup. Compare the file's
   modification time with the start time of the dev process, then restart it.
4. Restarting Apache requires admin rights (WAMP tray icon).
