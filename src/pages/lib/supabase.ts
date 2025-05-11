import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { AstroCookies } from "astro";

/**
 * supabaseAdmin should be used mostly for server to server communication
 * ! Probably this shouldn't be used to create content on DB on behalf of a logged-in user
 */
export const supabaseAdmin = createClient(
	import.meta.env.SUPABASE_URL,
	import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
			detectSessionInUrl: false,
		},
	}
)

/**
 * Should be initialized for every action the user needs to perform on the DB
 * ! It's highly recommended to configure RLS policies on Supabase, so the user can only read, create, edit and delete only their own data
 */
export function createClientSSR({
	request,
	cookies,
}: {
	request: Request;
	cookies: AstroCookies;
}) {
	return createServerClient(
		import.meta.env.SUPABASE_URL,
		import.meta.env.SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "").map(cookie => ({
						name: cookie.name,
						value: cookie.value ?? ''
					}));
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookies.set(name, value, options)
					);
				},
			},
		}
	);
}