<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let email = '';
	let username = '';
	let password = '';
	let firstName = '';
	let lastName = '';
	let phoneNumber = '';
	let address = '';
	let formValid = false;
	export let errorMessage = '';

	const dispatch = createEventDispatcher();
	function onSubmit() {
		if (username && email && password) {
			dispatch('sumbit', {
				user: {
					email: email,
					username: username,
					password: password,
					firstName: firstName,
					lastName: lastName,
					phoneNumber: phoneNumber,
					address: address
				} as User
			});
		}
	}

	function validateForm() {
		formValid = username !== '' && email !== '' && password !== '';
	}
</script>

<form
	on:submit|preventDefault={onSubmit}
	method="POST"
	action="/"
	class="w-full mx-auto space-y-5 variant-filled"
>
	<div>
		<label for="username" class="label">
			<span>Username*</span>
			<input
				type="text"
				id="username"
				bind:value={username}
				on:input={validateForm}
				class="input variant-filled"
				placeholder="Enter your username"
				required
			/></label
		>
	</div>

	<div>
		<label for="email" class="label">
			<span>Email*</span>
			<input
				type="email"
				id="email"
				bind:value={email}
				on:input={validateForm}
				class="input variant-filled"
				placeholder="Enter your email"
				required
			/>
		</label>
	</div>

	<div>
		<label for="password" class="label"
			><span>Password*</span>
			<input
				type="password"
				id="password"
				bind:value={password}
				on:input={validateForm}
				class="input variant-filled"
				placeholder="Enter your password"
				required
			/>
		</label>
	</div>

	<div>
		<label for="first_name" class="label">
			<span>First Name</span>
			<input
				type="text"
				id="first_name"
				bind:value={firstName}
				class="input variant-filled"
				placeholder="Enter your first name"
			/>
		</label>
	</div>

	<div>
		<label for="last_name" class="label">
			<span>Last Name</span>
			<input
				type="text"
				id="last_name"
				bind:value={lastName}
				class="input variant-filled"
				placeholder="Enter your last name"
			/>
		</label>
	</div>

	<div>
		<label for="phone_number" class="label">
			<span>Phone Number</span>
			<input
				type="tel"
				id="phone_number"
				bind:value={phoneNumber}
				class="input variant-filled"
				placeholder="Enter your phone number"
			/>
		</label>
	</div>

	<div>
		<label for="address" class="label">
			<span>Address</span>
			<input
				type="text"
				id="address"
				bind:value={address}
				class="input variant-filled"
				placeholder="Enter your address"
			/>
		</label>
	</div>

	{#if errorMessage !== ''}
		<p class="text-error-900">** {errorMessage}</p>
	{/if}
	<div>
		<button type="submit" class="btn w-full py-2 px-4 variant-filled-primary" disabled={!formValid}>
			Register
		</button>
	</div>
</form>
