<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let username: string = '';
	let password: string = '';
	let formValid: boolean = false;
	$: formValid = username !== '' && password != '';
	export let errorMessage: string = '';

	const dispatch = createEventDispatcher();
	const onSubmit = () => {
		dispatch('submit', {
			username: username,
			password: password
		});
	};
</script>

<form class="w-full mx-auto space-y-5 variant-filled">
	<div>
		<label for="username" class="label">
			<span>Username*</span>
			<input
				type="text"
				id="username"
				bind:value={username}
				class="input variant-filled"
				placeholder="Enter your username"
				required
			/>
		</label>
	</div>
	<div>
		<label for="password" class="label">
			<span>Password*</span>
			<input
				type="text"
				id="username"
				bind:value={password}
				class="input variant-filled"
				placeholder="Enter your username"
				required
			/>
		</label>
	</div>
	{#if errorMessage !== ''}
		<p class="text-error-900">** {errorMessage}</p>
	{/if}
	<div>
		<button
			on:click={onSubmit}
			class="btn w-full py-2 px-4 variant-filled-primary"
			disabled={!formValid}>Log in</button
		>
	</div>
</form>
