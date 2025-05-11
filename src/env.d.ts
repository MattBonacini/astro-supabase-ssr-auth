/// <reference types="astro/client" />

// Need to import setting type in this way otherwise here it won't work with regular modules imports
declare namespace App {
	interface Locals {
		user: import("@supabase/supabase-js").User;
	}
}