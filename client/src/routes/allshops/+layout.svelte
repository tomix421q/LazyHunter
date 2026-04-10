<script lang="ts">
	import LandingChoice from '$lib/components/organism/LandingChoice.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<main>
	<LandingChoice stores={data.stores} />
</main>
{@render children()}
