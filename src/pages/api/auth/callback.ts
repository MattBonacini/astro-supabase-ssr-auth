import type { APIContext, APIRoute } from "astro";
import { createClientSSR } from "@lib/supabase";

export const GET: APIRoute = async ({
	request,
	cookies,
	redirect,
}: APIContext) => {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	if (!code) {
		console.error("No code provided in URL params");
		return redirect("/");
	}

	const supabase = createClientSSR({ request, cookies });
	const { data, error } = await supabase.auth.exchangeCodeForSession(code);

	if (error) {
		console.error("Auth exchange error details:", {
			message: error.message,
			status: error.status,
			name: error.name,
			stack: error.stack
		});
		return new Response(JSON.stringify({
			error: error.message,
			status: error.status
		}), {
			status: 401,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	/**
	 * NOTE: with some providers like LinkedIn, you will need the provider_token to be allowed to post on behalf of the user.
	 * You can get this token from data.session
	 * 
	 * Depending on the provider you may need to edit the scopes in the signInWithOAuth (in src\pages\api\auth\signin.ts) as well to request the correct permissions during sign up in the Oauth flow.
	 */
	const { access_token, refresh_token, provider_token, expires_in } = data.session;

	return redirect("/");
};