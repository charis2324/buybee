<!-- UserProfile.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;
	let updateFailed = false;
	let updateSuccess = false;
	let form = writable({} as UserSafeInfo);
	if (data.userInfo) {
		form.set(data.userInfo);
	}

	async function updateUser() {
		const response = await fetch('/api/user/updateInfo', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify($form)
		});
		console.log($form);
		if (response.ok) {
			updateFailed = false;
			updateSuccess = true;
		} else {
			updateFailed = true;
			updateSuccess = false;
		}
	}
</script>

<div class="card max-w-[90%] min-h-[400px] p-10 variant-filled mx-auto my-10">
	{#if updateFailed}
		<div class="w-[70%] mx-auto text-center bg-red-300 rounded-lg py-3">
			<p class="text-red-800 uppercase text-xl">Profile update failed!</p>
		</div>
	{/if}
	{#if updateSuccess}
		<div class="w-[70%] mx-auto text-center bg-green-300 rounded-lg py-3">
			<p class="text-green-900 uppercase text-xl">Profile update successful!</p>
		</div>
	{/if}
	<h1 class="text-3xl mb-6">Profile</h1>
	<form class="grid grid-cols-2 gap-6" on:submit|preventDefault={updateUser}>
		<div>
			<label for="first_name" class="label block mb-2">First Name</label>
			<input
				id="first_name"
				type="text"
				class="input variant-filled border p-2 w-full"
				bind:value={$form.first_name}
			/>
		</div>
		<div>
			<label for="last_name" class="block mb-2">Last Name</label>
			<input
				id="last_name"
				type="text"
				class="input variant-filled border p-2 w-full"
				bind:value={$form.last_name}
			/>
		</div>
		<div>
			<label for="email" class="block mb-2">Email</label>
			<input
				id="email"
				type="email"
				class="input variant-filled border p-2 w-full"
				bind:value={$form.email}
			/>
		</div>
		<div>
			<label for="phone_number" class="block mb-2">Phone Number</label>
			<input
				id="phone_number"
				type="tel"
				class="input variant-filled border p-2 w-full"
				bind:value={$form.phone_number}
			/>
		</div>
		<div>
			<label for="address" class="block mb-2">Address</label>
			<input
				id="address"
				type="text"
				class="input variant-filled border p-2 w-full"
				bind:value={$form.address}
			/>
		</div>
		<div class="col-span-2">
			<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
				Update Profile
			</button>
		</div>
	</form>
</div>
