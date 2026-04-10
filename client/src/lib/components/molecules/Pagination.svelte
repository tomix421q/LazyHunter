<script lang="ts">
	import { page } from '$app/state';
	import type { MetaProduct } from '$lib/api';
	import { Button } from '$lib/components/ui/button';

	let { meta }: { meta: MetaProduct } = $props();

	function getPageUrl(pageNum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', pageNum.toString());
		return url.pathname + url.search;
	}
</script>

{#if meta && meta.totalPages > 1}
	<div class="mt-8 flex items-center justify-center gap-4">
		{#if meta.page > 1}
			<Button variant="outline" href={getPageUrl(meta.page - 1)}>&larr; Predchádzajúca</Button>
		{:else}
			<Button variant="outline" disabled>&larr; Predchádzajúca</Button>
		{/if}

		<span class="text-sm font-medium text-muted-foreground">
			Strana <span class="font-bold text-foreground">{meta.page}</span>
			z <span class="font-bold text-foreground">{meta.totalPages}</span>
		</span>

		{#if meta.page < meta.totalPages}
			<Button variant="default" href={getPageUrl(meta.page + 1)}>Ďalšia &rarr;</Button>
		{:else}
			<Button variant="default" disabled>Ďalšia &rarr;</Button>
		{/if}
	</div>
{/if}
