import { defineMiddleware } from "astro:middleware";
import { createClientSSR } from "@lib/supabase";
import { getActionContext } from "astro:actions";

export const onRequest = defineMiddleware(async (context, next) => {

	const { locals, redirect, url } = context;

	const supabase = createClientSSR({
		request: context.request,
		cookies: context.cookies,
	});

	/**
	 * Do not run code between createServerClient and supabase.auth.getUser(). A simple mistake could make it very hard to debug issues with users being randomly logged out.
	 * 
	 * IMPORTANT: DO NOT REMOVE auth.getUser()
	 */

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		locals.user = user;
	}

	/**
	 * List of all routes that don't require authentication
	 */
	const publicRoutes = ['/signin', '/api/auth/signin', '/api/auth/callback', '/api/auth/signin-linkedin', '/register', '/api/register'];
	if (publicRoutes.includes(url.pathname)) {
		return next();
	}

	/**
	 * If user is logging out, just skip this middleware
	 */
	if (url.pathname === '/api/auth/signout' || url.pathname === '/_actions/auth.signOut/') {
		return next();
	}

	if (!user) {
		// For API routes, return 401 Unauthorized
		if (url.pathname.startsWith('/api')) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		return redirect('/signin');
	}

	/**
	 * In Astro, Actions are accessible as public endpoints based on the name of the action. 
	 * For example, the action  flows.instruct_then_draft() will be accessible from /_actions/flows.instruct_then_draft.
	 * This means we must use the same authorization checks that we would consider for API endpoints and on-demand rendered pages.
	 */
	const { action } = getActionContext(context);

	/**
	 * Check if the action was called from a client-side function
	 */
	if (action?.calledFrom === 'rpc') {
		// If so, check for a user session token, and if necessary, block the request
		if (!user) {
			return new Response('Forbidden', { status: 403 });
		}
	}


	return next();

});