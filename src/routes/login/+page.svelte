<script lang="ts">
	import LoginForm from '$lib/LoginForm.svelte';

	let loginErrorMessage = '';
	const handleSubmit = async (event: CustomEvent) => {
		const username = event.detail.username;
		const password = event.detail.password;
		console.log(password);
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: username, password: password })
		});
		const data = await response.json();
		if (!response.ok) {
			loginErrorMessage = data.error;
		} else {
			//localStorage.setItem('token', data.token);
			//localStorage.setItem('userId', data.id);
			window.location.href = '/';
		}
	};
</script>

<div class="card max-w-lg p-4 variant-filled mx-auto mt-10">
	<h1 class="h1 mb-4">Log in</h1>
	<LoginForm on:submit={handleSubmit} errorMessage={loginErrorMessage} />
</div>
