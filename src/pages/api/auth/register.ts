import { createClientSSR } from "@lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
	const formData = await request.formData();
	const email = formData.get("email")?.toString();
	const password = formData.get("password")?.toString();

	if (!email || !password) {
		return new Response("Email and password are required", { status: 400 });
	}

	const supabase = createClientSSR({
		request: request,
		cookies: cookies,
	});

	const { data: { user }, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		return new Response(error.message, { status: 500 });
	}

	return redirect("/signin");
};