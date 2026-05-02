<script lang="ts">
	import { Info } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import ListProductCard from './ListProductCard.svelte';

	let { list }: { list: any } = $props();
</script>

<main>
	<div class="mx-auto grid max-w-7xl justify-center gap-3 px-2 lg:max-h-48 lg:gap-6">
		{#if !list || list.items.length === 0}
			<div class="cardNormalize mx-auto mt-14 flex flex-col items-center justify-center lg:mt-44">
				<p class="flex items-center gap-2">
					<span class="text-2xl font-bold tracking-wider lg:text-4xl lg:text-destructive"
						>Žiadne produkty</span
					>
					<span class=""> <Info class="size-10 stroke-destructive" /></span>
				</p>
				<Button variant="link" size="sm" href="/allshops/all" class="">Pridat produkt</Button>
			</div>
		{:else}
			{#each list.items as item (item.id)}
				<ListProductCard product={item} />
			{/each}
		{/if}
	</div>
</main>
