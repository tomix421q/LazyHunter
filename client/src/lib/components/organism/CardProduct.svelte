<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import Button from '../ui/button/button.svelte';
	import { menuManager } from '$lib/store.svelte';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { ListItemInfo } from '../../../routes/allshops/[shop]/+page.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import type { components } from '$lib/api/apiSchema';
	import type { ListType } from '$lib/utils/types';
	import { Heart, Loader } from '@lucide/svelte';

	type ProductType = components['schemas']['Product'];

	let { item, inLists }: { item: ProductType; inLists: Set<ListItemInfo> } = $props();

	const session = authClient.useSession();

	let idProductIdListProduct = $state<string | null>();
	let productImage = $state('/noImg.png');
	let isSaving = $state(false);
	let choosedList = $state<Extract<ListType, 'shoppingList' | 'aiList'>>('shoppingList');
	let shoppingListData = $derived([...inLists].find((l) => l.type === 'shoppingList'));
	let aiListData = $derived([...inLists].find((l) => l.type === 'aiList'));

	function handleImageError() {
		productImage = '/noImg.png';
	}

	function whenActionEnd(validFrom: string, validUntil: string) {
		if (!validUntil) return 'Neznámy stav';

		const today = new Date();
		const startDate = new Date(validFrom);
		const endDate = new Date(validUntil);
		const msInDay = 1000 * 60 * 60 * 24;

		const diffToStart = Math.round((startDate.getTime() - today.getTime()) / msInDay);
		const diffToEnd = Math.ceil((endDate.getTime() - today.getTime()) / msInDay);

		if (diffToEnd < 0) {
			return 'Skončilo';
		}
		if (diffToStart > 0) {
			if (diffToStart === 1) return 'Začína zajtra';
			return `Začína o ${diffToStart} dni`;
		}

		if (diffToEnd === 0) return 'Končí dnes';
		if (diffToEnd === 1) return 'Končí zajtra';

		return `${diffToEnd} dni do konca`;
	}

	$effect(() => {
		productImage = item.linkToPhoto ? `${PUBLIC_API_URL}${item.linkToPhoto}` : '/noImg.png';
	});

	// $inspect(shoppingListData);
</script>

<main
	class="group relative flex h-full w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg ring-1 ring-chart-5 drop-shadow-2xl transition-all hover:shadow-md sm:max-h-[400px] sm:min-h-[300px] sm:flex-row"
>
	<!-- Action button -->
	<form
		method="POST"
		use:enhance={() => {
			isSaving = true;
			return async ({ update, result }) => {
				isSaving = false;
				if (result.type === 'success') {
					menuManager.closeAll();
					toast(result.data?.message as string);
					// console.log(result.data?.message);
				} else if (result.type === 'failure') {
					if (result.status === 409) {
						toast(result.data?.message as string);
					} else {
						toast(result.data?.message as string);
					}
				} else {
					if (result.type === 'redirect') {
						toast('Neautorizovaný uživatel ⚙️');
						goto('/user');
					} else {
						toast('Ups, niečo zlyhalo.');
					}
				}
				await update({ reset: false });
			};
		}}
		class="absolute top-1.5 left-1.5 z-50 **:stroke-3 **:transition-all **:duration-150 **:ease-in *:hover:bg-gray-900"
	>
		<input type="hidden" name="productId" value={idProductIdListProduct} />
		<input type="hidden" name="listType" value={choosedList} />

		<Button
			type="submit"
			size="icon"
			variant="secondary"
			title="Pridat do zoznamu"
			class="*:size-5!"
			formaction={shoppingListData ? '?/removeProduct' : '?/addToList'}
			onclick={() => {
				choosedList = 'shoppingList';
				if (shoppingListData) {
					idProductIdListProduct = shoppingListData.id;
				} else {
					idProductIdListProduct = item.id.toString();
				}
			}}
			disabled={isSaving}
		>
			{#if isSaving}
				<Loader />
			{:else if shoppingListData?.id}
				<Heart class="fill-destructive stroke-destructive" />
			{:else}
				<Heart class="stroke-destructive" />
			{/if}
		</Button>
	</form>
	<!--  -->
	<!-- Picture zone -->
	<div
		class="relative flex aspect-square w-[50%] shrink-0 items-center justify-center p-2 sm:h-full sm:p-4"
	>
		<img
			src={productImage}
			alt={item.productName}
			onerror={handleImageError}
			class=" h-full w-full rounded-sm object-contain drop-shadow-2xl"
		/>
	</div>

	<!--  -->
	<!-- Content -->
	<article class="flex h-full w-full flex-col justify-between p-2 max-sm:p-2">
		<!-- Header -->
		<section class="flex flex-col justify-between text-muted">
			<p class="text-[10px] font-bold tracking-tight text-muted-foreground sm:text-[11px]">
				<span class="tracking-wider text-chart-1 capitalize">{item.storeName} ·</span>
				<span class="text-destructive uppercase"
					>{whenActionEnd(item.validFrom, item.validUntil)}</span
				>
			</p>
			<p class="text-[10px] text-muted-foreground sm:text-[11px]">
				{item.category?.split('_').join(' ')}
			</p>
		</section>

		<!-- Name Core -->
		<section class="mt-1.5 h-full sm:mt-4">
			<p
				class="line-clamp-3 text-sm leading-5 font-extrabold text-chart-3 sm:text-xl"
				title={item.productName}
			>
				{item.productName}
			</p>
			<div class="text-xs font-normal text-muted-foreground sm:text-sm">
				<p>
					<span>
						{item.unit}
					</span>
					{#if item.amount !== null}
						<span>/{item.amount}ks</span>
					{/if}
				</p>

				<p class="">{item.unitPrice}</p>
			</div>
			<div class="relative mt-4 w-full gap-0.5 max-sm:flex">
				<div class="flex items-end justify-between">
					<h1 class="text-xl font-extrabold text-destructive font-stretch-150% sm:text-3xl">
						{item.price}<span class=" text-lg font-normal text-destructive">&euro;</span>
					</h1>
					<p class="absolute right-0 text-xs font-extrabold sm:text-sm">
						{item.discountPercentage}
					</p>
				</div>

				<p class="line-through decoration-destructive decoration-[2px] max-sm:text-sm">
					{item.originalPrice}
				</p>
			</div>
		</section>
		<span class="mb-1 text-xs text-muted-foreground capitalize max-sm:mt-2">{item.moreInfo}</span>
		<span class="text-right text-xs font-bold tracking-wider text-muted-foreground italic"
			>s.{item.page}
		</span>
	</article>
</main>

<!-- not used -->
{#snippet addListMenu(productId: number)}
	<article
		transition:fly={{ x: -300, duration: 600 }}
		class={`absolute top-0 left-0 z-40 h-full w-[50%]  bg-chart-2 p-2`}
	>
		<p class="mt-10 mb-4 text-center text-xs font-bold uppercase lg:text-sm">
			Pridat/Odstraňit zo zoznamu
		</p>
		<form
			method="POST"
			use:enhance={() => {
				isSaving = true;
				return async ({ update, result }) => {
					isSaving = false;
					if (result.type === 'success') {
						menuManager.closeAll();
						toast(result.data?.message as string);
						// console.log(result.data?.message);
					} else if (result.type === 'failure') {
						if (result.status === 409) {
							toast(result.data?.message as string);
						} else {
							toast(result.data?.message as string);
						}
					} else {
						console.error('Ups, niečo zlyhalo.');
						toast('Ups, niečo zlyhalo.');
					}

					await update({ reset: false });
				};
			}}
		>
			<input type="hidden" name="productId" value={idProductIdListProduct} />
			<input type="hidden" name="listType" value={choosedList} />

			<div class="flex flex-col gap-2 *:text-xs lg:*:text-sm">
				{#if shoppingListData}
					<Button
						type="submit"
						formaction="?/removeProduct"
						onclick={() => {
							choosedList = 'shoppingList';
							idProductIdListProduct = shoppingListData.id;
						}}
						variant="destructive"
						disabled={isSaving}
					>
						{isSaving ? 'Odstraňujem...' : 'Vymazať z Položky v akcii'}
					</Button>
				{:else}
					<Button
						type="submit"
						formaction="?/addToList"
						variant="secondary"
						onclick={() => {
							choosedList = 'shoppingList';
							idProductIdListProduct = productId.toString();
						}}
						disabled={isSaving}
						class=""
					>
						{isSaving ? 'Pridávam...' : 'Pridat do položky v akcii'}
					</Button>
				{/if}

				<!-- {#if aiListData}
					<Button
						type="submit"
						formaction="?/removeProduct"
						onclick={() => {
							choosedList = 'aiList';
							idProductIdListProduct = aiListData.id;
						}}
						variant="destructive"
						disabled={isSaving}
						class=""
					>
						{isSaving ? 'Odstraňujem...' : 'Vymazať z AI Asistent'}
					</Button>
				{:else}
					<Button
						type="submit"
						formaction="?/addToList"
						variant="secondary"
						onclick={() => {
							choosedList = 'aiList';
							idProductIdListProduct = productId.toString();
						}}
						disabled={isSaving}
						class=""
					>
						{isSaving ? 'Pridávam...' : 'Pridat do AI Asistent'}
					</Button>
				{/if} -->
			</div>
		</form>
	</article>
{/snippet}
