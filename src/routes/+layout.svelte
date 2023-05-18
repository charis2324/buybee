<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<h1 class="h1 text-left">BuyBee</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn variant-filled-tertiary tracking-wide uppercase" href="/">Log in</a>
				<a class="btn variant-filled-tertiary tracking-wide uppercase" href="/register">Sign up</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
