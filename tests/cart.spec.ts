import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.pages';
import { InventoryPage } from '../pages/inventory.pages';
import { CartPage } from '../pages/cart.pages';
import { ProductPage } from '../pages/product.pages';

test.describe('Cart - Positive', () => {
    let authPage: AuthPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory\.html/);
    });

    // CRT001 - Positive - Add single product
    test('CRT001 - should add Sauce Labs Backpack to cart and show badge 1', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeVisible();
    });

    // CRT002 - Positive - Add multiple products
    test('CRT002 - should add 3 products and show badge 3', async () => {
        await inventoryPage.addProductsByNames([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);
        await expect(inventoryPage.cartBadge).toHaveText('3');
    });

    // CRT003 - Positive - Verify product appears in cart
    test('CRT003 - should display added product inside cart', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await expect(page).toHaveURL(/cart\.html/);
        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.itemNames.first()).toContainText('Sauce Labs Backpack');
    });

    // CRT004 - Positive - Remove from cart
    test('CRT004 - should remove product from cart', async () => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await expect(cartPage.cartItems).toHaveCount(1);
        await cartPage.removeFirstItem();
        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(cartPage.cartBadge).toBeHidden();
    });

    // CRT005 - Positive - Add from detail page
    test('CRT005 - should add product to cart from detail page', async ({ page }) => {
        const productPage = new ProductPage(page);
        await inventoryPage.itemNames.filter({ hasText: 'Sauce Labs Backpack' }).first().click();
        await expect(page).toHaveURL(/inventory-item\.html/);
        await productPage.addToCartButton.click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await expect(productPage.removeButton).toBeVisible();
    });

    // CRT006 - Positive - Continue Shopping
    test('CRT006 - should return to inventory via Continue Shopping', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await cartPage.continueShoppingButton.click();
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.itemCards.first()).toBeVisible();
    });

    // CRT007 - Positive - Checkout button
    test('CRT007 - should navigate to checkout step one via Checkout', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await cartPage.checkoutButton.click();
        await expect(page).toHaveURL(/checkout-step-one\.html/);
        await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    });
});


