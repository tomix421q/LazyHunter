<script lang="ts">
	import Header from '$lib/components/molecules/Header.svelte';
	import LandingChoice from '$lib/components/organism/LandingChoice.svelte';

	let { data } = $props();
</script>

<main class="mx-auto">
	<Header />

	<LandingChoice stores={data.stores} />
</main>
