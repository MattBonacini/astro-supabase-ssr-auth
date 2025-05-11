import { createClientSSR } from "@lib/supabase";
import { defineAction } from "astro:actions";

/**
 * All actions in your project must be exported from the server object in the src/actions/index.ts file.
 * You can define actions inline or you can move action definitions to separate files and import them.
 * You can even group related functions in nested objects.
 * 
 * https://docs.astro.build/en/guides/actions/#organizing-actions
 * 
 * Official Actions docs: https://docs.astro.build/en/guides/actions/
 */
export const server = {
	signOut: defineAction({
		handler: async (_, context) => {
			const supabase = createClientSSR({
				request: context.request,
				cookies: context.cookies,
			});
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Sign out error", error);
				return {
					success: false,
					message: error.message,
				};
			}
			return {
				success: true,
				message: "Successfully signed out",
			};
		},
	}),
}