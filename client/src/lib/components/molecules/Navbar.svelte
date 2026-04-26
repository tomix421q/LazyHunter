<script lang="ts">
	import { Menu, User, UserCheck, X } from '@lucide/svelte';
	import Separator from '../ui/separator/separator.svelte';
	import { Button } from '../ui/button';
	import { page } from '$app/state';
	import { blur } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();
	let actualPathName = $derived(page.url.pathname);
	let isActiveMobileMenu = $state(false);

	afterNavigate(() => {
		isActiveMobileMenu = false;
		window.scrollTo(0, 0);
	});

	const style_hover = `border-t-4 border-chart-5/30 hover:border-chart-2 ease-out text-chart-4! hover:text-primary! transition-colors duration-100 hover:drop-shadow-[5px_5px_10px_rgba(62,180,137,0.8)]`;

	function style_active(pathname: string) {
		return actualPathName === pathname
			? 'border-chart-2 border-chart-2! drop-shadow-[5px_5px_10px_rgba(62,180,137,0.9)]'
			: '';
	}

	// $inspect(isActiveMobileMenu);
</script>

<main
	class="z-50 mb-6 flex w-full justify-between bg-linear-to-b from-chart-5/30 to-background text-lg font-semibold"
>
	<div class={`${style_hover} ${style_active('/')}  flex`}>
		<a href="/" class="mr-3 flex items-center"
			><img src="/logo.png" alt="logo" class="size-12 lg:size-16" />
			<Separator orientation="vertical" class="my-auto mr-3 h-[50%]! bg-chart-5" />
			<p class="tracking-widest text-chart-4 text-shadow-lg">
				<span class="text-xl font-extrabold text-primary/70 lg:text-2xl">L</span>azy<span
					class="text-xl font-extrabold text-primary/70 lg:text-2xl">H</span
				>unter
			</p></a
		>
	</div>

	<!--  -->
	<!-- DESKTOP -->
	<div
		class="hidden justify-center text-sm tracking-wide uppercase **:flex **:items-center **:hover:text-primary lg:flex"
	>
		<a
			href="/allshops/all"
			class={`${style_hover} ${style_active('/allshops/all')}  relative h-full px-4 `}>Obchody</a
		>
		<a href="/lists" class={`${style_hover} ${style_active('/lists')}  h-full px-4 `}
			>Moje zoznamy</a
		>

		<Button
			href="/user"
			title="Uzivatel"
			variant="ghost"
			size="icon-sm"
			class={`${style_hover} ${style_active('/user')} h-full rounded-none bg-transparent! px-10`}
			>{#if $session.data?.user}
				<UserCheck class="size-8 stroke-primary stroke-3" />
			{:else}
				<User class="size-8 stroke-3" />
			{/if}</Button
		>
	</div>

	<!--  -->
	<!-- MOBILE -->
	<div class="flex gap-2 lg:hidden">
		<a href="/user" class={` ${style_active('/user')}`}
			><Button title="Uzivatel" variant="ghost" size="icon" class="size-12">
				{#if $session.data?.user}
					<UserCheck class="size-8 stroke-primary stroke-3" />
				{:else}
					<User class="size-8 stroke-3" />
				{/if}
			</Button></a
		>
		<Button
			variant="ghost"
			size="icon"
			class="size-12"
			onclick={() => {
				isActiveMobileMenu = !isActiveMobileMenu;
			}}><Menu class="size-full p-2" /></Button
		>
	</div>
	{#if isActiveMobileMenu}
		<nav
			transition:blur
			class="fixed inset-0 top-0 right-0 bottom-0 z-50 block h-full w-full bg-background lg:hidden"
		>
			<header class="flex items-center justify-between">
				<div class={`${style_hover} ${style_active('/')}  flex`}>
					<a href="/" class="mr-3 flex items-center"
						><img src="/logo.png" alt="logo" class="size-12 lg:size-16" />
						<Separator orientation="vertical" class="my-auto mr-3 h-[50%]! bg-chart-5" />
						<p class="tracking-widest text-chart-4 text-shadow-lg">
							<span class="text-xl font-extrabold text-primary/70 lg:text-2xl">L</span>azy<span
								class="text-xl font-extrabold text-primary/70 lg:text-2xl">H</span
							>unter
						</p></a
					>
				</div>

				<Button
					variant="destructive"
					size="icon"
					onclick={() => {
						isActiveMobileMenu = false;
						window.scrollTo(0, 0);
					}}
					class="mr-2"><X class="size-full" /></Button
				>
			</header>
			<section class="mt-3 px-2">
				<h1 class="text-start text-xl font-semibold">Menu</h1>
				<Separator class="bg-chart-5" />
				<div class="mt-12 flex flex-col gap-4 text-3xl font-extrabold text-primary">
					<a href="/" class={``}>Domov</a>
					<a href="/allshops/all" class={``}>Obchody</a>
					<a href="/lists" class={``}>Moje zoznamy</a>
				</div>
			</section>
		</nav>
	{/if}
</main>
