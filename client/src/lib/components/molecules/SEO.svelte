<script lang="ts">
	import { page } from '$app/state';

	let {
		title = 'LazyHunter | Všetky aktuálne zľavy a letáky na jednom mieste',
		description = 'Sledujte najnovšie zľavy, akcie a letáky zo slovenských obchodov. Nájdite najlepšie ceny a ušetrite pri každom nákupe.',
		imageUrl = 'https://lazyhunter.eu/smallLogo.png'
	} = $props();

	let currentUrl = $derived(page.url.href);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<link rel="canonical" href={currentUrl.split('?')[0]} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
