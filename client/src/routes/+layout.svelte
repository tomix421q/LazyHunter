<script lang="ts">
	import '$lib/styles/layout.css';
	import Navbar from '$lib/components/molecules/Navbar.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { children } = $props();
</script>

<svelte:head
	><link rel="icon" type="image/png" href="/smallLogo.png" />
	<link rel="apple-touch-icon" href="/smallLogo.png" />
</svelte:head>
<main class="">
	<Navbar />

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
