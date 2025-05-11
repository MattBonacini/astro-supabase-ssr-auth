# Astro + Supabase SSR Auth

Minimal starter boilerplate to use Astro with Supabase SSR, with Auth that actually works. While I'm publishing this repo, Supabase docs for Astro are recommending a broken setup with deprecated code that either doesn't work, or constantly logs users out.

This starter template solves these problems. I found several discussions with Supabase users that experienced the same issues and were stuck, so I hope this can help you save some hours of work with your next Astro & Supabase project.

NOTE: I'm using this stack for building an app to create LinkedIn post, so Oauth is currently configured to support LinkedIn. But this should work with any Oauth provider supported by [Supabase Auth](https://supabase.com/docs/guides/auth/social-login).

If you're using Supabase (especially the self-hosted version) and Astro for the first time, it's easy to get confused about redirect URLs and .env variables, so I recommend reading the instructions included in this page carefully, and then review Supabase docs depending on the Oauth providers you plan to support.

## ⭐ Main Features

- Astro 5.7.12
- Node
- Supabase SSR
- Supabase SSR Auth with PKCE flow
- Tailwind 4 + DaisyUI 5 for styling

## ⚡ How to use:

### In Astro

1. Clone this repository
2. Run `npm install`
3. Edit .env.sample with the correct information for your Supabase project (or install if you self host Supabase), then rename it to .env
4. Run `npm run dev`
5. Review the middleware file `src/middleware.ts` and set the routes that should be public in your project. Any route that isn't specified there will require authentication.
6. Only in production, you must set the env variable LINKEDIN_OIDC_CALLBACK_URL to the URL where your users will be redirected after logging in with LinkedIn.

### In Supabase

1. Make sure users are allowed to sign up on your Supabase DB. If you self host, you need to set the env variable: `GOTRUE_DISABLE_SIGNUP` to false.
2. You must add the redirect URL to the redirect allow list of Supabase. If you self host, you need to add it to the project's env variable: `GOTRUE_URI_ALLOW_LIST`. You can add "http://localhost:4321/**,https://yourlivedomain.com/**" or set it to something more precise. The URL that needs this permission is the one set in `src\pages\api\auth\signin.ts`.
3. In Supabase, you must also specify other information depending on the providers you plan to use for Oauth. This is slightly easier in Supabase cloud ([link to the docs](https://supabase.com/docs/guides/auth/social-login)). For self-hosted Supabase, you need to specify the required data with env variables. You can find a [complete list of these variables here](https://github.com/supabase/auth/blob/master/example.env). They all start with "GOTRUE_EXTERNAL". Here are the ones necessary for allowing users to login with LinkedIn:

```text
GOTRUE_EXTERNAL_LINKEDIN_OIDC_ENABLED=true
GOTRUE_EXTERNAL_LINKEDIN_OIDC_CLIENT_ID=client_id_from_your_linkedin_app
GOTRUE_EXTERNAL_LINKEDIN_OIDC_SECRET=client_secret_from_your_linkedin_app
GOTRUE_EXTERNAL_LINKEDIN_OIDC_REDIRECT_URI=https://yoursupabaseaddress.com/auth/v1/
```

### 🗄️ How to use Supabase client in the codebase

I recommend reading the comments in `src\lib\supabase.ts` to understand how to use Supabase SSR client in your codebase.

⚠️ Warning: similar Github repositories don't init the Supabase client every time it's used. I don't recommend this approach, as it currently causes all sorts of issues. The most frequent is that it causes some errors and logs users out multiple times per day. You need to init the Supabase SSR client every time your user interacts with the database. At this date, Supabase docs mention this [only in their guide for NextJS](https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app) but I think it's valid for Astro as well.

## 🚀 Project Structure

You will notice that the Sign Out process is handled with an Astro action while Register and Sign In are handled with Astro API Endpoints. This is done on purpose to show you two different approaches, so you can choose your favorite and edit the code base according to your needs.

Astro actions are server side and should be added to the `src/actions/` directory.

API endpoints should be added in the `src/pages/api/` directory.

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There are some security measures in the middleware to protect actions and API endpoints, and all routes except the ones you set as public: `src/middleware.ts`.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
