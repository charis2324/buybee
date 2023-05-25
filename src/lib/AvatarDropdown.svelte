<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';

	let closeDropDown = true;

	const handleClick = () => {
		closeDropDown = !closeDropDown;
	};
</script>

<div class="relative">
	<button class="btn" on:click={handleClick}>
		<Avatar src="https://source.unsplash.com/YOErFW8AfkI/128x128" width="w-10" />
	</button>
	<nav
		hidden={closeDropDown}
		class="card list-nav absolute dark w-48 right-0 top-14 text-center p-2"
	>
		<ul>
			<li><a class="btn" href="/api/logout"><span>Log out</span></a></li>
		</ul>
	</nav>
</div>
