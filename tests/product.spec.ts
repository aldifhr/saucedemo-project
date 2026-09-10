import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.pages';
import { InventoryPage } from '../pages/inventory.pages';
import { ProductPage } from '../pages/product.pages';

test.describe('Product - Positive', () => {
    let authPage: AuthPage;
    let inventoryPage: InventoryPage;
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        inventoryPage = new InventoryPage(page);
        productPage = new ProductPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory.html/);
    });

    // PROD001 - Positive - Click product redirect to detail
    test('PROD001 - should redirect to detail when clicking a product', async ({ page }) => {
        await inventoryPage.clickFirstItemByTitle();
        await expect(page).toHaveURL(/inventory-item\.html\?id=/);
        await expect(productPage.detailName).toBeVisible();
    });

    // PROD002 - Positive - Inventory shows all product info
    test('PROD002 - should display all product information on inventory', async () => {
        const count = await inventoryPage.itemCards.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            await expect(inventoryPage.itemCards.nth(i).locator('[data-test="inventory-item-name"]')).toBeVisible();
            await expect(inventoryPage.itemCards.nth(i).locator('[data-test="inventory-item-desc"]')).toBeVisible();
            await expect(inventoryPage.itemCards.nth(i).locator('[data-test="inventory-item-price"]')).toBeVisible();
            await expect(inventoryPage.itemCards.nth(i).locator('.inventory_item_img img')).toBeVisible();
            await expect(inventoryPage.itemCards.nth(i).locator('button[data-test^="add-to-cart"], button[data-test^="remove"]')).toBeVisible();
        }
    });

    // PROD003 - Positive - Click title to detail
    test('PROD003 - should redirect to detail when clicking title', async ({ page }) => {
        const firstName = await inventoryPage.itemNames.first().textContent();
        await inventoryPage.itemNames.first().click();
        await expect(page).toHaveURL(/inventory-item\.html\?id=/);
        await expect(productPage.detailName).toContainText(firstName!.trim());
    });

    // PROD004 - Positive - Click image to detail
    test('PROD004 - should redirect to detail when clicking image', async ({ page }) => {
        await inventoryPage.clickFirstItemByImage();
        await expect(page).toHaveURL(/inventory-item\.html\?id=/);
        await expect(productPage.detailName).toBeVisible();
        await expect(productPage.detailImage).toBeVisible();
    });

    // PROD005 - Positive - Add to cart from inventory
    test('PROD005 - should add product to cart from inventory', async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(page.locator('button[data-test^="remove"]').first()).toBeVisible();
        // verify cart contains item
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart\.html/);
        await expect(page.locator('[data-test="inventory-item-name"]').first()).toBeVisible();
    });

    // PROD006 - Positive - Detail data matches inventory
    test('PROD006 - should show matching data between inventory and detail', async () => {
        const inventoryData = await inventoryPage.getFirstItemData();
        await inventoryPage.clickFirstItemByTitle();
        const detailData = await productPage.getDetailData();
        expect(detailData.name?.trim()).toBe(inventoryData.name?.trim());
        expect(detailData.desc?.trim()).toBe(inventoryData.desc?.trim());
        expect(detailData.price?.trim()).toBe(inventoryData.price?.trim());
    });

    // PROD007 - Positive - Add to cart from detail
    test('PROD007 - should add product to cart from detail page', async ({ page }) => {
        await inventoryPage.clickFirstItemByTitle();
        await productPage.addToCartButton.click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await expect(productPage.removeButton).toBeVisible();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL(/cart\.html/);
    });

    // PROD008 - Positive - Back to products
    test('PROD008 - should return to inventory when clicking Back to products', async ({ page }) => {
        await inventoryPage.clickFirstItemByTitle();
        await expect(page).toHaveURL(/inventory-item\.html\?id=/);
        await productPage.backButton.click();
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.itemCards.first()).toBeVisible();
    });

    // PROD011 - Positive - Remove from inventory (complement PROD005)
    test('PROD011 - should remove product from inventory and badge disappears', async ({ page }) => {
        await inventoryPage.addFirstItemToCart();
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(page.locator('button[data-test^="remove"]').first()).toBeVisible();
        await page.locator('button[data-test^="remove"]').first().click();
        await expect(page.locator('button[data-test^="add-to-cart"]').first()).toBeVisible();
        await expect(inventoryPage.cartBadge).toBeHidden();
    });
});

test.describe('Product - Negative', () => {
    // PROD009 - Negative - Click with expired session
    test('PROD009 - should redirect to login when session expired', async ({ page }) => {
        const authPage = new AuthPage(page);
        const inventoryPage = new InventoryPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory\.html/);

        // simulate session expired
        await page.context().clearCookies();
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });

        await inventoryPage.itemNames.first().click();
        // should redirect to login
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    // PROD010 - Negative - Invalid ID via URL while logged in
    test('PROD010 - should handle invalid product ID gracefully', async ({ page }) => {
        const authPage = new AuthPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory\.html/);

        await page.goto('https://www.saucedemo.com/inventory-item.html?id=9999');
        // Saucedemo shows ITEM NOT FOUND error page but stays on same URL
        await expect(page).toHaveURL(/inventory-item\.html\?id=9999/);
        await expect(page.getByText('ITEM NOT FOUND')).toBeVisible();
    });

    // PROD012 - Negative - Direct access without login
    test('PROD012 - should redirect to login when accessing detail without login', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/inventory-item.html?id=4');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toContainText("You can only access '/inventory-item.html' when you are logged in");
    });
});
