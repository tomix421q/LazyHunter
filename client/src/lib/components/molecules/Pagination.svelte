<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import type { components } from '$lib/api/apiSchema';
	import { ArrowBigLeft, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from '@lucide/svelte';

	type MetaType = components['schemas']['PaginationMeta'];

	let { meta }: { meta: MetaType } = $props();

	function getPageUrl(pageNum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', pageNum.toString());
		return url.pathname + url.search;
	}
</script>

{#if meta && meta.totalPages > 1}
	<div class="mt-8 flex items-center justify-center gap-6">
		{#if meta.page > 1}
			<Button
				title="Späť na predchádzajúcu stranu"
				variant="secondary"
				size="icon-lg"
				href={getPageUrl(meta.page - 1)}
				class="border border-primary/30 px-12 shadow-2xl drop-shadow-2xl transition-all hover:bg-primary/10"
				><ChevronLeft class="size-6 stroke-primary" /></Button
			>
		{/if}

		<span class="text-sm text-muted-foreground">
			Strana <span class="font-bold">{meta.page}</span>
			z <span class="font-bold">{meta.totalPages}</span>
		</span>

		{#if meta.page < meta.totalPages}
			<Button
				title="Prejsť na nasledujúcu stranu"
				variant="secondary"
				size="icon-lg"
				href={getPageUrl(meta.page + 1)}
				class="animate-float border border-primary/30 px-12 shadow-2xl drop-shadow-2xl transition-all hover:bg-primary/10"
			>
				<ChevronRight class="size-6 stroke-primary" /></Button
			>
		{/if}
	</div>
{/if}
