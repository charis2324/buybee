<script lang="ts">
	import CategorySection from '$lib/CategorySection.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let products = data.products;
	let mainCategories = data.categoryHierarchy.main_categories.map((main_category) => {
		return {
			id: main_category.main_category_id,
			name: main_category.main_category_name,
			showLoadMore: products[main_category.main_category_id].length == 3
		};
	});
	const handleClickLoadMore = async (event: CustomEvent) => {
		const mainCategoryId = event.detail.categoryId;
		const currentNumberOfPorduct = products[mainCategoryId].length;
		const limit = event.detail.numOfProducts + 3;
		const url = `/api/products/main_category/${mainCategoryId}?limit=${limit}`;
		const response = await fetch(url);
		const data = await response.json();
		const fetchProducts = data['product'];
		console.log(fetchProducts);
		products[mainCategoryId] = fetchProducts;
		// Update on whether to show the load more button or not.
		if (currentNumberOfPorduct == fetchProducts.length) {
			mainCategories = mainCategories.map((mainCategory) => {
				if (mainCategory.id == mainCategoryId) {
					return { ...mainCategory, showLoadMore: false };
				}
				return mainCategory;
			});
		}
	};
</script>

{#each mainCategories as mainCategory}
	<CategorySection
		on:loadmore={handleClickLoadMore}
		categoryName={mainCategory.name}
		categoryId={mainCategory.id}
		products={products[mainCategory.id]}
		showLoadMore={mainCategory.showLoadMore}
	/>
{/each}
