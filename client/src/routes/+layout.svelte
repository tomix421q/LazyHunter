<script lang="ts">
	import '$lib/styles/layout.css';
	import Navbar from '$lib/components/molecules/Navbar.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { menuManager, userProfileStore } from '$lib/store.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { authClient } from '$lib/auth-client';
	import SEO from '$lib/components/molecules/SEO.svelte';

	let { children } = $props();

	const currentYear = new Date().getFullYear();
	const session = authClient.useSession();

	$effect(() => {
		userProfileStore.setUser($session.data?.session);
	});
</script>

<SEO title="LazyHunter" />

<main>
	<Navbar />
	<Toaster />

	<section class="mx-auto w-full max-w-full">
		{@render children()}
	</section>

	<footer class="mx-auto mt-36 max-w-[1600px] lg:mt-72">
		<Separator class="mx-auto max-w-[80%]" />

		<!-- down -->
		<div
			class="absolute flex w-full justify-between px-2 pt-24 *:text-[9px] *:text-muted-foreground md:*:text-[11px]"
		>
			<span class="">Version 1.3</span>
			<p class="">
				&copy; {currentYear} Created by
				<a href="https://zilka-tomas.com" target="_blank" class="underline hover:text-black"
					>wwww.zilka-tomas.com</a
				>
			</p>
		</div>
	</footer>
</main>

<svelte:window onclick={() => menuManager.closeAll()} />
