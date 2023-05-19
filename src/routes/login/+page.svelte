<script lang="ts">
	import LoginForm from '$lib/LoginForm.svelte';
	const handleSubmit = (event: CustomEvent) => {
		const username = event.detail.username;
		const password = event.detail.password;
		console.log(password);
	};
</script>

<div class="card max-w-lg p-4 variant-filled mx-auto mt-10">
	<h1 class="h1 mb-4">Log in</h1>
	<LoginForm on:submit={handleSubmit} />
</div>
