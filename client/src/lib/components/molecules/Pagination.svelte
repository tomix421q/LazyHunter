<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import type { components } from '$lib/api/apiSchema';
	import { ArrowBigLeft, ArrowLeft, ArrowRight } from '@lucide/svelte';

	type MetaType = components['schemas']['PaginationMeta'];

	let { meta }: { meta: MetaType } = $props();

	function getPageUrl(pageNum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', pageNum.toString());
		return url.pathname + url.search;
	}
</script>

{#if meta && meta.totalPages > 1}
	<div class="mt-8 flex items-center justify-center gap-4">
		{#if meta.page > 1}
			<Button variant="outline" href={getPageUrl(meta.page - 1)}
				><ArrowLeft class="size-5" />Predchádzajúca</Button
			>
		{/if}

		<span class="text-sm font-medium text-muted-foreground">
			Strana <span class="font-bold text-foreground">{meta.page}</span>
			z <span class="font-bold text-foreground">{meta.totalPages}</span>
		</span>

		{#if meta.page < meta.totalPages}
			<Button variant="default" href={getPageUrl(meta.page + 1)}
				>Ďalšia <ArrowRight class="size-5 stroke-white" /></Button
			>
		{/if}
	</div>
{/if}
