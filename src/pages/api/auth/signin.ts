import type { APIRoute } from "astro";
import { createClientSSR } from "@lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
	const formData = await request.formData();
	const email = formData.get("email")?.toString();
	const password = formData.get("password")?.toString();
	const provider = formData.get("provider")?.toString();

	const validProviders = ["linkedin_oidc"];

	const supabase = createClientSSR({
		request: request,
		cookies: cookies,
	});

	if (provider && validProviders.includes(provider)) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "linkedin_oidc",

			options: {
				scopes: 'openid profile email',
				/**
				 * ! This redirect URL should be added to the redirect allow list of Supabase in its env variables.
				 * ! https://supabase.com/docs/guides/auth/redirect-urls
				 */
				redirectTo: import.meta.env.DEV
					? "http://localhost:4321/api/auth/callback"
					: import.meta.env.LINKEDIN_OIDC_CALLBACK_URL,
			},
		});

		if (error) {
			console.error('error in /signin :', error);

			return new Response(error.message, { status: 500 });
		}

		return redirect(data.url);
	}

	if (!email || !password) {
		return new Response("Email and password are required", { status: 400 });
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return new Response(error.message, { status: 500 });
	}

	return redirect("/");
};