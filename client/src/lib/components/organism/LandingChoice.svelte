<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Search, X } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import { fade } from 'svelte/transition';

	let { stores } = $props();

	let pathName = $derived(page.params.shop);
	let searchValue = $state(page.url.searchParams.get('search') || '');

	function updateSearch(value: string) {
		const newUrl = new URL(page.url);
		if (value) {
			newUrl.searchParams.set('search', searchValue);
		} else {
			newUrl.searchParams.delete('search');
		}
		console.log(pathName);
		if (pathName === undefined && value === '') {
			goto('/');
		} else {
			const storeSelected = pathName ? pathName : 'all';
			newUrl.searchParams.set('page', '1');
			goto('/allshops/' + storeSelected + newUrl.search, { keepFocus: true, noScroll: true });
		}
	}

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		updateSearch(searchValue);
	}

	function cleanSearch() {
		searchValue = '';
		updateSearch('');
	}

	const imgCard_style =
		'size-[80px] bg-gray-100 object-contain duration-100 ease-out hover:scale-[110%] hover:shadow-lg lg:size-[120px] rounded-lg';

	// $inspect();
</script>

<main class="relative mt-4 mb-8 flex flex-col items-center p-1 lg:mt-10 lg:p-8 px-2">
	<!--  -->
	<!-- Filter -->
	<section
		class="stores mb-8 grid w-full snap-x snap-mandatory grid-flow-col grid-rows-2 justify-start gap-x-4 overflow-x-auto scroll-auto pb-8 *:min-w-[90px] *:snap-center *:drop-shadow-md md:mb-16 lg:grid-rows-1 lg:justify-center-safe lg:gap-5 lg:*:min-w-[150px]"
	>
		<!-- All btn -->
		<Button
			class={`relative flex h-auto flex-col overflow-hidden max-sm:p-2 ${pathName === 'all' ? 'underline decoration-dashed decoration-[3px] underline-offset-6' : ''}`}
			href={`/allshops/all${searchValue ? '?search=' + searchValue : ''}`}
			variant="link"
		>
			<img class={imgCard_style} src={`/AllShops.webp`} alt="vsetky obchody" />
			<h4 class="font-semibold md:text-lg">Vsetko</h4>
		</Button>
		{#each stores as store}
			{@const storeCapitalize : string = store.charAt(0) + store.slice(1).toLowerCase()}
			<Button
				class={`relative flex h-auto flex-col overflow-hidden max-sm:p-2  ${pathName === store ? 'underline decoration-dashed decoration-[3px] underline-offset-6' : ''}`}
				href={`/allshops/${store}${searchValue ? '?search=' + searchValue : ''}`}
				variant="link"
			>
				<img class={imgCard_style} src={`/stores/${storeCapitalize}Logo.png`} alt="logo obchodu" />
				<h4 class="font-semibold md:text-lg">{storeCapitalize}</h4>
			</Button>
		{/each}
	</section>

	<!--  -->
	<!-- Search Input -->
	<form
		onsubmit={handleSearch}
		class="mx-auto mb-6 flex w-full justify-center gap-1.5 px-4 lg:w-5xl"
	>
		<!-- Input Text -->
		<div class="relative w-full md:w-lg">
			<Input
				type="text"
				placeholder="Vyhľadaj produkt..."
				bind:value={searchValue}
				class="inputNormalize2"
			/>

			{#if searchValue}
				{@render inputKeyboardUi()}
			{/if}
		</div>

		<!-- Enter Search -->
		<div class="flex gap-1.5">
			<Button
				variant="secondary"
				size="icon-lg"
				type="submit"
				class="group size-12 bg-background shadow-2xl drop-shadow-2xl"
			>
				<Search
					class="size-6 stroke-3 duration-300 ease-in group-hover:rotate-360 group-hover:stroke-[4px]"
				/>
			</Button>
			<!-- Clean Search -->
			<Button
				size="icon-sm"
				variant="destructive"
				onclick={cleanSearch}
				class={`${searchValue ? 'flex' : 'pointer-events-none opacity-0 max-sm:hidden'} group size-12 shadow-2xl drop-shadow-2xl duration-300 ease-in`}
				><X
					class="size-6 stroke-3 duration-300 group-hover:rotate-360 group-hover:stroke-[4px]"
				/></Button
			>
		</div>
	</form>
</main>

{#snippet inputKeyboardUi()}
	<div
		transition:fade
		class="pointer-events-none absolute inset-y-0 right-3 hidden items-center gap-1 overflow-hidden opacity-40 select-none sm:flex"
	>
		<span class="text-xs tracking-tight">Zrušiť</span>
		<span class="animate-pulse pl-1 text-3xl"> ⃕ </span>

		<kbd class="flex items-center rounded border px-1.5 font-sans text-[11px] font-medium">
			Esc
		</kbd>
	</div>
{/snippet}

<svelte:window
	on:keydown={(e) => {
		e.key === 'Escape' && cleanSearch();
	}}
/>
