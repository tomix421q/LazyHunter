<script lang="ts">
	import Separator from '../ui/separator/separator.svelte';
</script>

<main class="mx-auto mb-8 justify-center gap-22 px-2 drop-shadow-2xl lg:mb-16 lg:flex">
	<div class="flex">
		<article class="my-auto">
			<h1
				class="bg-gradient-to-b from-primary/90 to-primary bg-clip-text p-1 text-5xl text-transparent
           drop-shadow-[0_0_25px_rgba(62,180,137,0.4)] [text-shadow:0_0_20px_rgba(62,180,137,0.6),0_0_40px_rgba(62,180,137,0.3)] lg:text-6xl"
			>
				Prehľad všetkých zliav<br class="max-lg:hidden" /> na jednom mieste
			</h1>
			<h1
				class="mt-1 px-1 text-xl font-semibold text-muted-foreground text-shadow-lg lg:mt-4 lg:text-3xl"
			>
				Ponuky popredných reťazcov <br class="lg:hidden" /> pod jednou strechou
			</h1>
		</article>
	</div>
	<div class="hidden lg:block">
		<img
			src="landingImage.png"
			alt="uvitaci obrazok"
			class=" mt-4 w-[350px] animate-float drop-shadow-lg!"
		/>
	</div>
</main>
<Separator class="mx-auto w-[90%]! lg:w-[80%]!" />
