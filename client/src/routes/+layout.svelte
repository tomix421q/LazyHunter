<script lang="ts">
	import '$lib/styles/layout.css';
	import Navbar from '$lib/components/molecules/Navbar.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { menuManager, userProfileStore } from '$lib/store.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { authClient } from '$lib/auth-client';

	let { children } = $props();

	const session = authClient.useSession();

	$effect(() => {
		userProfileStore.setUser($session.data?.session);
	});
</script>

<svelte:head
	><link rel="icon" type="image/png" href="/smallLogo.png" />
	<link rel="apple-touch-icon" href="/smallLogo.png" />
</svelte:head>
<main class="">
	<Navbar />

	<Toaster />
	<section class="mx-auto w-full max-w-full">
		{@render children()}
	</section>

	<footer class="mx-auto mt-36 max-w-[1600px] lg:mt-72">
		<Separator class="mx-auto max-w-[80%]" />
		<div class="p-24">
			<p class="text-center">Footer text</p>
		</div>
	</footer>
</main>

<svelte:window onclick={() => menuManager.closeAll()} />
