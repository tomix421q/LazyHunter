<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { ProductItem } from '$lib/api';
	import { dateTimmeUTCformatter2 } from '$lib/utils/help';
	import { ListPlus } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';

	let { item }: { item: ProductItem } = $props();

	let productImage = $state('/noImg.png');

	$effect(() => {
		productImage = item.linkToPhoto ? `${PUBLIC_API_URL}${item.linkToPhoto}` : '/noImg.png';
	});

	function handleImageError() {
		productImage = '/noImg.png';
	}

	function whenActionEnd(validUntil: string) {
		if (validUntil) {
			let dateValidUntilDay = dateTimmeUTCformatter2(new Date(validUntil)).slice(0, 2);
			let nowDateDay = new Date().getDate();
			return Number(dateValidUntilDay) - nowDateDay;
		}
	}

	// $inspect(item);
</script>

<main
	class="group relative flex h-full w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg ring-1 ring-chart-5 drop-shadow-2xl transition-all hover:shadow-md sm:max-h-[400px] sm:min-h-[300px] sm:flex-row"
>
	<!-- Action button -->
	<Button
		variant="secondary"
		size="icon"
		class="absolute top-1.5 left-1.5 z-50 *:duration-100 *:ease-in *:transform-stroke hover:scale-105 hover:*:stroke-3"
		title="Pridat do zoznamu"><ListPlus class="size-5  stroke-primary" /></Button
	>
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
	<article class=" flex h-full w-full flex-col justify-between p-2 max-sm:p-2">
		<!-- Header -->
		<section class="flex flex-col justify-between text-muted">
			<p class="text-[10px] font-bold tracking-tight text-muted-foreground sm:text-[11px]">
				<span class="tracking-wider text-chart-1 capitalize">{item.storeName} ·</span>
				<span class="text-destructive uppercase">Dokonca {whenActionEnd(item.validUntil)} dni</span>
				<!-- <span
					>{dateTimmeUTCformatter2(new Date(item.validFrom))} - {dateTimmeUTCformatter2(
						new Date(item.validUntil)
					)}</span
				> -->
			</p>
			<p class="text-[10px] text-muted-foreground sm:text-[11px]">
				{item.category?.split('_').join(' ')}
			</p>
		</section>

		<!-- Name Core -->
		<section class="mt-1.5 h-full sm:mt-4">
			<p class="line-clamp-3 text-sm leading-5 font-extrabold text-chart-3 sm:text-xl">
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
	</article>
</main>
