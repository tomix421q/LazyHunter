<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Loader, Loader2, LogIn, LogOut } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';

	let isLoading = $state(false);
	const session = authClient.useSession();

	async function loginWithGoogle() {
		isLoading = true;

		try {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL: window.location.origin
			});
		} catch (error) {
			console.error('Prihlásenie zlyhalo:', error);
		} finally {
			isLoading = false;
		}
	}

	async function loginWithFacebook() {
		isLoading = true;
		try {
			await authClient.signIn.social({
				provider: 'facebook',
				callbackURL: window.location.origin
			});
		} catch (error) {
			console.error('Prihlasenie zlyhalo', error);
		} finally {
			isLoading = false;
		}
	}

	async function logout() {
		isLoading = true;
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/');
				}
			}
		});
	}

	// $inspect($session.data);
</script>

<main class="cardNormalize flex flex-col lg:min-w-[400px]">
	<div class="mb-8 w-full text-center">
		<h1 class=" text-4xl">
			{$session.data?.user?.name ? 'Odhlasit sa' : 'Prihlasit sa'}
		</h1>
	</div>

	{#if $session.data?.user}
		<Button
			onclick={logout}
			disabled={isLoading}
			size="lg"
			variant="destructive"
			class="mx-auto flex justify-between"
			><LogOut class="stroke-secondary opacity-70" />
			{#if isLoading}
				<span class="flex items-center gap-2">
					<Loader class="animate-spin" /> Loading...
				</span>
			{:else}
				Odhlasit
			{/if}
		</Button>
		<LogOut class="mx-auto mt-2 size-48 stroke-destructive opacity-10" />
	{:else}
		<div>
			<Button
				onclick={loginWithGoogle}
				disabled={isLoading}
				class="relative mx-auto flex min-w-[280px] justify-between gap-8 overflow-hidden border border-sky-400 bg-sky-200/30 py-6 hover:bg-sky-400/20"
				variant="outline"
				size="lg"
				><img src="/other/googleLogo.png" alt="google logo" class="size-8" />
				<span>
					{#if isLoading}
						<span class="flex items-center gap-2">
							<Loader class="animate-spin" /> Loading...
						</span>
					{:else}
						Prihlasit sa cez Google
					{/if}
				</span>
			</Button>
			<Button
				onclick={loginWithFacebook}
				disabled={isLoading}
				class="relative mx-auto mt-4 flex min-w-[280px] justify-between gap-8 overflow-hidden border border-blue-400 bg-blue-200/30 py-6 hover:bg-blue-400/20"
				variant="outline"
				size="lg"
				><img src="/other/facebookLogo.png" alt="google logo" class="size-8" />
				<span>
					{#if isLoading}
						<span class="flex items-center gap-2">
							<Loader class="animate-spin" /> Loading...
						</span>
					{:else}
						Prihlasit sa cez Facebook
					{/if}
				</span>
			</Button>
			<LogIn class="mx-auto mt-2 size-48 stroke-green-500 opacity-10" />
		</div>
	{/if}
</main>
