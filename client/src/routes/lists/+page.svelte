<script lang="ts">
	import ButtonGroup from '$lib/components/ui/button-group/button-group.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageProps } from './$types';
	import ListProducts from '$lib/components/organism/ListProducts.svelte';
	import type { ListType } from '$lib/utils/types';

	let { data }: PageProps = $props();
	let listData = $derived(data.lists);

	let currentList = $state<ListType>('shoppingList');
	let displayShoppingL = $state<any | undefined>();
	let displayPersonL = $state<any | undefined>();
	let displayAiL = $state<any | undefined>();

	const selectedList = (selectedList: ListType) => {
		currentList = selectedList;
		setDisplayData();
	};

	function setDisplayData() {
		listData.ok &&
			listData.data?.forEach((lists: any) => {
				if (lists.type === ('shoppingList' as ListType)) {
					displayShoppingL = lists;
				}
				if (lists.type === ('customList' as ListType)) {
					displayPersonL = lists;
				}
				if (lists.type === ('aiList' as ListType)) {
					displayAiL = lists;
				}
			});
	}

	$effect(() => {
		setDisplayData();
	});

	// $inspect('');
</script>

<main class="flex min-h-screen flex-col">
	<ButtonGroup
		class="mx-auto mb-12 shadow-2xl drop-shadow-2xl *:border-1 *:border-black/10 *:text-lg *:font-semibold *:tracking-wider max-sm:*:px-2! max-sm:*:text-xs"
	>
		<!-- <Button
			onclick={() => selectedList('shoppingList')}
			size={`lg`}
			variant={currentList === 'shoppingList' ? 'default' : 'secondary'}>Položky v akcii</Button
		> -->
		<!-- <Button
			onclick={() => selectedList('customList')}
			size="lg"
			variant={currentList === 'customList' ? 'default' : 'secondary'}>Môj zoznam</Button
		>
		<Button
			onclick={() => selectedList('aiList')}
			size="lg"
			variant={currentList === 'aiList' ? 'default' : 'secondary'}>AI Asistent</Button
		> -->
	</ButtonGroup>

	<section>
		<!-- <p>{currentList}</p> -->

		{#if currentList === 'shoppingList'}
			<ListProducts list={displayShoppingL} />
		{:else if currentList === 'customList'}
			<ListProducts list={displayPersonL} />
		{:else if currentList === 'aiList'}
			<ListProducts list={displayAiL} />
		{/if}
	</section>
</main>
