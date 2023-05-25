<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppBar, AppShell, Avatar } from '@skeletonlabs/skeleton';

	import AvatarDropdown from '../lib/AvatarDropdown.svelte';

	import logo from '$lib/assets/buybee_logo_shrink.png';
	export let data;
	let itemInCart = 0;
	const userToken = data.userToken || '';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar regionRowMain="mx-auto w-full max-w-8xl lg:px-20 px-4">
			<svelte:fragment slot="lead">
				<a href="/"
					><div class="flex space-x-4">
						<img class="w-[40px] mx-auto" src={logo} alt="" />
						<h1 class="h1 text-left">BuyBee</h1>
					</div></a
				>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if userToken !== ''}
					<!-- <Avatar src="https://source.unsplash.com/YOErFW8AfkI/128x128" width="w-10" /> -->
					<AvatarDropdown />
					<div class="btn cursor-pointer relative inline-block">
						<span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10"
							>{itemInCart}</span
						>
						<svg
							class=" w-10 fill-[#DFE0E2]"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 576 512"
							><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path
								d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"
							/></svg
						>
					</div>
				{:else}
					<a class="btn variant-filled-tertiary tracking-wide uppercase" href="/login">Log in</a>
					<a class="btn variant-filled-tertiary tracking-wide uppercase" href="/register">Sign up</a
					>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
