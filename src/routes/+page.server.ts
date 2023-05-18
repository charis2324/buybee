import { getMainCategories, getSideCategories, getCategoryHierarchy, getfirstXProductsForAllMainCategories } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load = (() => {
    //const mainCategories = getMainCategories()
    const categoryHierarchy = getCategoryHierarchy()
    const products = getfirstXProductsForAllMainCategories();
    return {
        //mainCategories
        categoryHierarchy,
        products
    }
}) satisfies PageServerLoad;