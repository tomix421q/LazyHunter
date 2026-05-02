<script lang="ts">
	import CardProduct from '$lib/components/organism/CardProduct.svelte';
	import Pagination from '$lib/components/molecules/Pagination.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Frown } from '@lucide/svelte';
	import { listProductStore } from '$lib/store.svelte';
	import type { ListType } from '$lib/utils/types';

	export type ListItemInfo = {
		id: string;
		type: ListType;
	};

	let { data }: { data: PageData } = $props();
	let products = $derived(data.productsResponse);

	let params = $derived(page.params.shop?.toLowerCase());

	let mapUserItemList = $derived.by(() => {
		const map = new Map<string, Set<ListItemInfo>>();

		listProductStore.items.forEach((item: any) => {
			if (!map.has(item.savedName)) {
				map.set(item.savedName, new Set());
			}
			map.get(item.savedName)?.add({ id: item.id, type: item.shoppingList.type as ListType });
		});

		return map;
	});

	$effect(() => {
		data.lazy?.userProductsList.then((res) => {
			if (res !== undefined && res.length > 0) {
				listProductStore.setItems(res);
			}
		});
	});

	// $inspect(mapUserItemList);
</script>

<main class="px-2 sm:px-4">
	<section class="mx-auto">
		<article class="mb-2 justify-between tracking-wider md:flex md:text-xl">
			<div class="flex space-x-1">
				<h2 class="">Aktuálne zľavy:</h2>
				<h2 class="font-semibold text-primary capitalize">
					{params === 'all' ? 'Vsetky dostupne' : params}
				</h2>
			</div>
			{#if products.ok && products.meta?.total}
				<div>
					<span class="">Počet zliav:</span><span class="ml-1.5 font-semibold text-primary"
						>{products.meta?.total}</span
					>
				</div>
			{/if}
		</article>
		<Separator class="mb-10" />

		{#if products.data.length === 0}
			<div
				class="mx-auto mt-12 flex w-fit flex-col items-center drop-shadow-sm drop-shadow-destructive lg:mt-36"
			>
				<Frown class="size-16 stroke-destructive lg:size-33 " />
				<p class="mt-4 text-xl font-bold text-destructive lg:text-3xl">
					Neboli nájdené žiadne produkty
				</p>
				<p class="text-xs tracking-wide text-muted-foreground/60 lg:text-lg">
					Skúste zadať iný výraz alebo zmeniť filter.
				</p>
			</div>
		{:else}
			<section
				class="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] sm:gap-8"
			>
				{#each products.data as item (item.id)}
					{@const inLists = mapUserItemList.get(item.productName) ?? new Set()}
					<CardProduct {item} {inLists} />
				{/each}
			</section>
			<!--  -->

			<Pagination meta={products.meta} />
		{/if}
	</section>
</main>
