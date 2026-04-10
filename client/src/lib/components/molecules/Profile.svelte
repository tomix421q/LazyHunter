<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { dateTimmeUTCformatter } from '$lib/utils/help';

	const session = authClient.useSession();
</script>

{#if $session.data?.user}
	<main class="cardNormalize lg:min-w-[500px]">
		<section class="w-full space-y-2">
			<h1 class="mb-8 text-center text-4xl">Uzivatelsky profil</h1>
			<img
				src={$session.data.user.image}
				alt="fotka uzivatela"
				class="size-32 rounded-lg"
				onerror={(e) => {
					const target = e.currentTarget as HTMLImageElement;
					target.onerror = null;
					target.src = '/other/userTemplate.png';
				}}
				referrerpolicy="no-referrer"
			/>

			<p class="mt-6 flex items-center gap-2">
				<span class=" text-sm text-muted-foreground uppercase">Meno</span><span
					class="text-lg font-semibold text-primary">{$session.data.user.name}</span
				>
			</p>
			<p class="flex items-center gap-2">
				<span class=" text-sm text-muted-foreground uppercase">Vytvoreny:</span><span
					class="text-lg font-semibold text-primary"
					>{dateTimmeUTCformatter($session.data.user.createdAt)}</span
				>
			</p>
			<p class="flex items-center gap-2">
				<span class=" text-sm text-muted-foreground uppercase">Email:</span><span
					class="text-lg font-semibold text-primary">{$session.data.user.email}</span
				>
			</p>
		</section>
	</main>
{/if}
