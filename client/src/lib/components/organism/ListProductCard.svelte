<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { Loader, toast } from 'svelte-sonner';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { ListItem, ProductItem } from '$lib/api';

	let { product }: { product: ListItem } = $props();

	let productImage = $state('/noImg.png');
	let isRemoving = $state(false);
	let removeItemMes = $state<'Produkt vymazany 🧹' | 'Nieco sa pokazilo skuste neskor 🙁' | ''>('');

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

	function handleImageError() {
		return '/noImg.png';
	}

	$effect(() => {
		if (product.productPriceId) {
			productImage = product.productPrice!.linkToPhoto
				? `${PUBLIC_API_URL}${product.productPrice!.linkToPhoto}`
				: '/noImg.png';
		}
	});

	// $inspect(typeof(product.));
</script>

<article
	class={`cardNormalize overflow-hidden p-5 lg:w-2xl lg:min-w-2xl ${product.productPriceId ?? 'border-destructive bg-destructive/30'}`}
>
	<!-- Remove item -->
	{@render removeProduct()}

	<article class="gap-6 sm:flex">
		<!-- Content -->
		<section class="flex gap-2 sm:w-[60%]">
			<img
				src={productImage}
				alt={product.savedName}
				onerror={handleImageError}
				class="h-[120px] max-w-[99px] rounded-sm object-contain drop-shadow-2xl"
			/>
			<!-- First col -->
			<div class="flex w-full flex-col text-muted">
				<p class="text-[10px] font-bold tracking-tight text-muted-foreground sm:text-[11px]">
					<span class="tracking-wider text-chart-1 capitalize">{product.savedStore} ·</span>
					{#if product.productPriceId}
						<span class="text-destructive uppercase"
							>{whenActionEnd(
								product.productPrice!.validFrom,
								product.productPrice!.validUntil
							)}</span
						>
					{:else}
						<span class="rounded bg-gray-800 p-2 text-secondary uppercase">Akcia sa skoncila</span>
					{/if}
				</p>
				{#if product.productPriceId}
					<p class="text-[10px] text-muted-foreground sm:text-[11px]">
						{product.productPrice!.category?.split('_').join(' ')}
					</p>
				{/if}
				<p class="text-md mt-2 line-clamp-3 leading-5 font-extrabold text-chart-3 sm:text-xl">
					{product.savedName}
				</p>
				<div class="sm:text-md text-sm font-normal text-muted-foreground">
					{#if product.productPriceId}
						{product.productPrice!.unit}
						{#if product.productPrice!.amount !== null}
							<span>/{product.productPrice!.amount}ks</span>
						{/if}
						<p>{product.productPrice!.unitPrice}</p>
					{/if}
				</div>
			</div>
		</section>

		<!-- Second col -->
		<section class="mt-1 w-max gap-0.5 sm:mt-6">
			<div>
				<div class="flex items-end gap-2">
					<h1 class=" text-3xl font-extrabold text-destructive font-stretch-150%">
						{product.savedPrice}<span class=" text-lg font-normal text-destructive">&euro;</span>
					</h1>
					{#if product.productPriceId}
						<p class="mb-1 text-xs font-extrabold sm:text-sm">
							{product.productPrice!.discountPercentage}
						</p>
					{/if}
				</div>

				<p class="line-through decoration-destructive decoration-[2px] max-sm:text-sm">
					{product.savedPrice}
				</p>
			</div>

			{#if product.productPriceId}
				<span class="mb-1 text-xs text-muted-foreground capitalize max-sm:mt-2"
					>{product.productPrice!.moreInfo}</span
				>
			{/if}
		</section>
	</article>
</article>

{#snippet removeProduct()}
	<div class="absolute top-2 left-2 z-40">
		<form
			method="POST"
			action="?/removeProduct"
			use:enhance={() => {
				isRemoving = true;

				return async ({ update, result }) => {
					isRemoving = false;
					if (result.type === 'success') {
						removeItemMes = 'Produkt vymazany 🧹';
						toast(removeItemMes);
					} else {
						console.error(result.status);
						removeItemMes = 'Nieco sa pokazilo skuste neskor 🙁';
						toast(removeItemMes);
					}
					await update({ reset: true, invalidateAll: true });
				};
			}}
		>
			<input type="hidden" name="productId" value={product.id} />
			<Button
				type="submit"
				size="icon"
				class="bg-gray-700 transition-all duration-200 ease-in  hover:bg-destructive hover:*:stroke-secondary"
				title="Vymazat"
				disabled={isRemoving}
			>
				{#if !isRemoving}
					<Trash class="stroke-destructive stroke-3" />
				{:else}
					<Loader class="animate-spin" visible={isRemoving} />
				{/if}
			</Button>
		</form>
	</div>
{/snippet}
