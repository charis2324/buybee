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
export function getPasswordByUsername(username: string) {
    try {
        const stmt = db.prepare('SELECT password FROM users WHERE username = ?');
        const result = stmt.get(username) as passwordResult | undefined;
        if (result) {
            return result.password;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}
export function getUserIdByUsername(username: string) {
    try {
        const stmt = db.prepare('SELECT id FROM users WHERE username = ?');
        const result = stmt.get(username) as idResult;
        if (result) {
            return result.id;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}
export function updateShoppingCart(userId: number, productId: number, quantity: number) {
    // check if the user already has a shopping cart
    const cartExists = db.prepare('SELECT id FROM shopping_carts WHERE user_id = ?').get(userId) as CartExists | undefined;
    if (cartExists) {
        // check if the product already exists in the user's cart
        const productExists = db.prepare('SELECT id FROM shopping_cart_items WHERE cart_id = ? AND product_id = ?').get(cartExists.id, productId);

        if (productExists) {
            // update the quantity of the product in the user's existing cart
            db.prepare('UPDATE shopping_cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?')
                .run(quantity, cartExists.id, productId);
        } else {
            // add the new product to the user's existing cart
            db.prepare('INSERT INTO shopping_cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)')
                .run(cartExists.id, productId, quantity);
        }
    } else {
        console.log('Cart does not exist. Making new cart for user.')
        // create a new shopping cart for the user
        const cart = db.prepare('INSERT INTO shopping_carts (user_id) VALUES (?)').run(userId);

        // add the product to the new cart
        db.prepare('INSERT INTO shopping_cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)')
            .run(cart.lastInsertRowid, productId, quantity);
    }
}
export function getUserShoppingCartStatus(userId: number) {
    // Get the user's shopping cart
    const cartExists = db.prepare('SELECT id FROM shopping_carts WHERE user_id = ?').get(userId) as CartExists | undefined;

    if (!cartExists) {
        console.log(`No shopping cart exists for userId: ${userId}`)
        return null;
    }

    // Get the items in the user's shopping cart
    const itemsQuery = db.prepare(`
      SELECT
        products.id AS product_id,
        products.product_name,
        products.selling_price,
        shopping_cart_items.quantity
      FROM shopping_cart_items
      JOIN products
        ON shopping_cart_items.product_id = products.id
      WHERE shopping_cart_items.cart_id = ?
    `);

    const items = itemsQuery.all(cartExists.id) as CartItem[];

    return { cartItems: items } as ShoppingCart;
}
export function getCartItemCount(userId: number) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM shopping_cart_items
      INNER JOIN shopping_carts ON shopping_carts.id = shopping_cart_items.cart_id
      WHERE shopping_carts.user_id = ?
    `);
    const result = stmt.get(userId) as CountResult;
    console.log(result)
    return result ? result.count : 0;;
}
export function removeItemFromCart(userId: number, productId: number) {
    // Find the user's shopping cart
    const cart = db
        .prepare('SELECT * FROM shopping_carts WHERE user_id = ?')
        .get(userId) as ShoppingCartRow | undefined;

    if (!cart) {
        console.warn(`User ${userId} does not have a shopping cart.`);
        return;
    }

    // Find the item in the shopping cart
    const item = db
        .prepare(
            'SELECT * FROM shopping_cart_items WHERE cart_id = ? AND product_id = ?'
        )
        .get(cart.id, productId) as ShoppingCartItemRow | undefined;

    if (!item) {
        console.warn(`Item ${productId} is not in the user's shopping cart.`);
        return;
    }

    // Remove the item from the shopping cart
    const result = db
        .prepare('DELETE FROM shopping_cart_items WHERE id = ?')
        .run(item.id);

    if (result.changes === 0) {
        console.warn(`Failed to remove item ${productId} from the shopping cart.`);
        return;
    }

    // Check if there are any items left in the cart
    const remainingItems = db
        .prepare('SELECT * FROM shopping_cart_items WHERE cart_id = ?')
        .all(cart.id) as ShoppingCartItemRow[];

    // If no items are left in the cart, delete the cart from the shopping_carts table
    if (remainingItems.length === 0) {
        const cartResult = db
            .prepare('DELETE FROM shopping_carts WHERE id = ?')
            .run(cart.id);

        if (cartResult.changes === 0) {
            console.warn(`Failed to remove empty shopping cart with id ${cart.id}.`);
            return;
        }
    }
}
export function getUserInfo(userId: number): UserSafeInfo | null {
    const statement = db.prepare(`
      SELECT email, first_name, last_name, phone_number, address
      FROM users
      WHERE id = ?
    `);

    const result = statement.get(userId) as UserSafeInfo;
    if (!result) {
        return null;
    }

    return {
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
        phone_number: result.phone_number,
        address: result.address,
    };
}

// Update user information by userId
export function updateUserInfo(userId: number, userInfo: UserSafeInfo): boolean {
    const statement = db.prepare(`
      UPDATE users
      SET email = ?, first_name = ?, last_name = ?, phone_number = ?, address = ?
      WHERE id = ?
    `);

    const result = statement.run(
        userInfo.email,
        userInfo.first_name,
        userInfo.last_name,
        userInfo.phone_number,
        userInfo.address,
        userId,
    );
    return result.changes > 0;
}