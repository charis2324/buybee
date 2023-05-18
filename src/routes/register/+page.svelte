<script lang="ts">
	import RegisterForm from '$lib/RegisterForm.svelte';

	const handleSubmit = async (event: CustomEvent) => {
		const userInfo = event.detail.user as User;
		const response = await fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ user: userInfo })
		});
		const data = await response.json();
		if (!response.ok) {
			registerErrorMessage = data.error;
		} else {
		}
	};
	let registerErrorMessage = '';
</script>

<div class="card max-w-lg p-4 variant-filled mx-auto mt-10">
	<h1 class="h1 mb-4">Create account</h1>
	<RegisterForm on:sumbit={handleSubmit} errorMessage={registerErrorMessage} />
</div>
