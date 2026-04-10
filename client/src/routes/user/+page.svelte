<script lang="ts">
	import Login from '$lib/components/molecules/Login.svelte';
	import Profile from '$lib/components/molecules/Profile.svelte';
</script>

<main
	class=" flex min-h-screen flex-col gap-6 px-2 *:h-min lg:flex-row lg:justify-center lg:px-10 lg:*:min-h-[400px]"
>
	<Profile />
	<Login />
</main>
