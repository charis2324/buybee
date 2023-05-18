import { getFirstXProductsByMainCategoryID } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ url, params }) => {
    const mainCategoryId = Number(params.main_category_id)
    const limit = Number(url.searchParams.get('limit'))
    getFirstXProductsByMainCategoryID(mainCategoryId, limit)
    return json({ product: getFirstXProductsByMainCategoryID(mainCategoryId, limit) });
}