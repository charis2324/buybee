import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

const db = new Database(DB_PATH, { verbose: console.log });

export const getMainCategories = (): MainCategory[] => {
    const sql =
        `SELECT id, name
    FROM main_categories;`
    const stmnt = db.prepare(sql)
    const rows = stmnt.all()
    return rows as MainCategory[]
}
export const getSideCategories = (): SideCategory[] => {
    const sql =
        `SELECT side_categories.id, side_categories.name, sub_categories.id AS sub_category_id, sub_categories.name AS sub_category_name, main_categories.id AS main_category_id, main_categories.name AS main_category_name
        FROM side_categories
        JOIN sub_categories ON side_categories.sub_category_id = sub_categories.id
        JOIN main_categories ON sub_categories.main_category_id = main_categories.id
        ORDER BY main_category_id, sub_category_id;`
    const stmnt = db.prepare(sql)
    const rows = stmnt.all()
    return rows as SideCategory[]
}
export const getCategoryHierarchy = (): CategoryHierarchy => {
    const sideCategories = getSideCategories()
    const hierarchyData = sideCategories.reduce<MainCategory[]>((acc, item) => {
        let mainCategory = acc.find(
            (cat) => cat.main_category_id === item.main_category_id
        );
        if (!mainCategory) {
            mainCategory = {
                main_category_id: item.main_category_id,
                main_category_name: item.main_category_name,
                sub_categories: [],
            };
            acc.push(mainCategory);
        }

        let subCategory = mainCategory.sub_categories.find(
            (sub) => sub.sub_category_id === item.sub_category_id
        );
        if (!subCategory) {
            subCategory = {
                sub_category_id: item.sub_category_id,
                sub_category_name: item.sub_category_name,
                side_categories: [],
            };
            mainCategory.sub_categories.push(subCategory);
        }

        subCategory.side_categories.push({
            id: item.id,
            name: item.name,
        });

        return acc;
    }, []);
    const hierarchy: CategoryHierarchy = { main_categories: hierarchyData };
    return hierarchy
}
const groupByMainCategoryId = (products: Product[]): { [key: number]: Product[] } => {
    const groupedProducts: { [key: number]: Product[] } = {};

    for (const product of products) {
        const mainCategoryId = product.main_category_id;

        if (!groupedProducts[mainCategoryId]) {
            groupedProducts[mainCategoryId] = [];
        }

        groupedProducts[mainCategoryId].push(product);
    }

    return groupedProducts;
}
export const getRandomProductsForAllMainCategories = (numOfProducts: number = 3) => {
    const sql =
        `SELECT products.*
        FROM products
        INNER JOIN main_categories ON products.main_category_id = main_categories.id
        WHERE products.id IN (
          SELECT id FROM (
            SELECT id, main_category_id, ROW_NUMBER() OVER (PARTITION BY main_category_id ORDER BY RANDOM()) AS row_num
            FROM products
          ) WHERE row_num <= ${numOfProducts}
        )
        ORDER BY main_categories.name;`
    const stmnt = db.prepare(sql)
    const rows = stmnt.all() as Product[]

    return groupByMainCategoryId(rows)
}
export const getfirstXProductsForAllMainCategories = (numOfProducts: number = 3) => {
    const sql =
        `SELECT products.*
        FROM products
        INNER JOIN main_categories ON products.main_category_id = main_categories.id
        WHERE products.id IN (
          SELECT id FROM (
            SELECT id, main_category_id, ROW_NUMBER() OVER (PARTITION BY main_category_id ORDER BY products.id) AS row_num
            FROM products
          ) WHERE row_num <= ${numOfProducts}
        )
        ORDER BY main_categories.name;`
    const stmnt = db.prepare(sql)
    const rows = stmnt.all() as Product[]
    return groupByMainCategoryId(rows);
}
export const getFirstXProductsByMainCategoryID = (mainCategoryID: number, numOfProducts: number = 3) => {
    const sql =
        `SELECT * FROM products
    WHERE main_category_id = ${mainCategoryID}
    ORDER BY id ASC
    LIMIT ${numOfProducts}`
    const stmnt = db.prepare(sql)
    const rows = stmnt.all() as Product[]
    return rows
}
export function checkIfUserExists(username: string, email: string) {
    const userExistsQuery = db.prepare(`
      SELECT 1
      FROM users
      WHERE username = ? OR email = ?
      LIMIT 1
    `);
    return userExistsQuery.get(username, email) !== undefined;
}
export const checkIfUsernameExists = (username: string) => { return db.prepare('SELECT 1 FROM users WHERE username = ?').get(username) !== undefined; }
export const checkIfEmailExists = (email: string) => { return db.prepare('SELECT 1 FROM users WHERE email = ?').get(email) !== undefined; }

export const addUser = (user: User) => {
    try {
        const query =
            `INSERT INTO users (email, username, password, first_name, last_name, phone_number, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(query)
        const info = stmt.run(user.email, user.username, user.password, user.firstName, user.lastName, user.phoneNumber, user.address)
        console.log(info)
    } catch (err) {
        console.error(err);
    }
}