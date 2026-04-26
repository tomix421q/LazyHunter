<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="-mt-44 flex h-screen flex-col items-center justify-center">
	<img src="/other/error.png" alt="error obrazok" class="size-44" />
	<h1 class="text-5xl font-extrabold tracking-wider lg:text-9xl">
		{page.status}
	</h1>
	<p class="text-xl font-semibold text-destructive">{page.error?.message}</p>
	<Button variant="link" size="lg" href="/">Späť na domov</Button>
</div>
