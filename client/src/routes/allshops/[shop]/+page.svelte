<script lang="ts">
	import CardProduct from '$lib/components/organism/CardProduct.svelte';
	import Pagination from '$lib/components/molecules/Pagination.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Frown, Loader } from '@lucide/svelte';
	import { listProductStore } from '$lib/store.svelte';
	import type { ListType } from '$lib/utils/types';

	export type ListItemInfo = {
		id: string;
		type: ListType;
	};

	let { data }: { data: PageData } = $props();
	let products = $derived(data.productsPromise.products || null);

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

	$inspect(products);
</script>

<main class="px-2 sm:px-4">
	<article class="mb-2 min-h-screen justify-between tracking-wider md:flex-col md:text-xl">
		<div class="flex space-x-1">
			<h2 class="">Aktuálne zľavy:</h2>
			<h2 class="font-semibold text-primary capitalize">
				{params === 'all' ? 'Vsetky dostupne' : params}
			</h2>
		</div>

		{#await data.productsPromise.products}
			<div class="my-22 text-center *:text-muted-foreground">
				<Loader class="mx-auto size-10 animate-spin" />
				<p class="text-sm md:text-lg">Hľadám Produkty</p>
			</div>
		{:then products}
			<!-- total -->
			<div class="mb-4">
				<span class="">Počet zliav:</span><span class="ml-1.5 font-semibold text-primary"
					>{products.meta?.total}</span
				>
			</div>

			<!-- products -->
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
		{:catch err}
			<p class="mt-24 text-center font-bold text-red-500">
				{err.body?.message || err.message || 'Neznáma chyba pri načítavaní'}
			</p>
		{/await}
	</article>
	
</main>
