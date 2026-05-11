<script lang="ts">
	import LandingChoice from '$lib/components/organism/LandingChoice.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowUpFromDot, CornerLeftUp, MoveUp } from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import { fly } from 'svelte/transition';
	import SEO from '$lib/components/molecules/SEO.svelte';

	let { data, children }: LayoutProps = $props();

	let scrollY = $state(0);
	let showButton = $derived(scrollY > 400);

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
</script>

<SEO title="LazyHunter" />
<main>
	<LandingChoice stores={data.stores} />
</main>
{@render children()}

{#if showButton}
	<div
		class="fixed right-6 bottom-6 z-50 lg:right-10 lg:bottom-10"
		transition:fly={{ y: 20, duration: 250 }}
	>
		<Button
			variant="secondary"
			size="icon"
			class="group size-12 rounded-full border border-primary/30 shadow-2xl drop-shadow-2xl"
			onclick={scrollToTop}
			title="Späť hore"
		>
			<MoveUp
				class="size-6 stroke-primary transition-transform duration-300 ease-out group-hover:-translate-y-1"
			/>
		</Button>
	</div>
{/if}
<svelte:window bind:scrollY />
