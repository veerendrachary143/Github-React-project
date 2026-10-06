<<<<<<< HEAD
# GitHub Repository Analytics

Explore recently created GitHub repositories and inspect weekly commit, addition, and deletion activity.

## Run locally

```sh
npm install
npm run dev
```

GitHub limits unauthenticated API requests. To use the higher authenticated limit, create a fine-grained GitHub token with read access to public repository metadata and add it to `.env.local`:

```env
VITE_GITHUB_TOKEN=github_pat_your_token_here
```

Restart Vite after changing `.env.local`. The app reports the rate-limit reset time when GitHub provides it.

`VITE_` variables are bundled into browser code. This option is intended for local development only: never use a personal token in a public deployment. A deployed app should call GitHub through a server-side proxy that stores the token outside the browser.

## Checks

```sh
npm run lint
npm run build
```
=======
# Github-Project
>>>>>>> dc240937157aeeeb49d0e5dc9db41e2fafc6cb74
