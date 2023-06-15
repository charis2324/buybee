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
			registerSuccess = true;
			setTimeout(function () {
				window.location.href = '/login';
			}, 1000);
		}
	};
	let registerErrorMessage = '';
	let registerSuccess = false;
</script>

<div class="card max-w-lg p-4 variant-filled mx-auto mt-10">
	{#if registerSuccess}
		<div class="w-[90%] mx-auto text-center bg-green-300 rounded-lg py-3">
			<p class="text-green-900 uppercase text-xl">Profile update successful!</p>
		</div>
	{/if}
	<h1 class="h1 mb-4">Create account</h1>
	<RegisterForm on:sumbit={handleSubmit} errorMessage={registerErrorMessage} />
</div>
