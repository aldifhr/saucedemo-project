import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.pages';
import { InventoryPage } from '../pages/inventory.pages';
import { CartPage } from '../pages/cart.pages';
import { CheckoutPage } from '../pages/checkout.pages';

test.describe('Checkout - Positive', () => {
    let authPage: AuthPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory\.html/);
    });

    // CHK001 - Positive - Checkout with valid info shows payment/shipping/total
    test('CHK001 - should show payment, shipping and total price after filling checkout info', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await cartPage.checkoutButton.click();
        await expect(page).toHaveURL(/checkout-step-one\.html/);

        await checkoutPage.fillInfo('John', 'Doe', '12345');
        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(/checkout-step-two\.html/);
        await expect(checkoutPage.paymentInfo).toBeVisible();
        await expect(checkoutPage.shippingInfo).toBeVisible();
        await expect(checkoutPage.totalPrice).toBeVisible();
        await expect(checkoutPage.totalPrice).toContainText('Total:');
    });

    // CHK002 - Positive - Cancel after filling info returns to cart
    test('CHK002 - should return to cart when clicking Cancel on checkout step one', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await cartPage.checkoutButton.click();
        await expect(page).toHaveURL(/checkout-step-one\.html/);

        await checkoutPage.fillInfo('John', 'Doe', '12345');
        await checkoutPage.cancelCheckout();

        await expect(page).toHaveURL(/cart\.html/);
        await expect(cartPage.cartItems).toHaveCount(1);
    });

    // CHK003 - Positive - Finish checkout shows Thank you
    test('CHK003 - should show Thank you message after finishing checkout', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await cartPage.checkoutButton.click();
        await checkoutPage.fillInfo('John', 'Doe', '12345');
        await checkoutPage.continueCheckout();
        await checkoutPage.finishCheckout();

        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(checkoutPage.completeHeader).toContainText('Thank you for your order!');
        await expect(checkoutPage.completeText).toContainText('Your order has been dispatched');
    });

    // CHK004 - Positive - Back Home after checkout returns to inventory
    test('CHK004 - should return to inventory via Back Home after checkout', async ({ page }) => {
        await inventoryPage.addProductByName('Sauce Labs Backpack');
        await cartPage.open();
        await cartPage.checkoutButton.click();
        await checkoutPage.fillInfo('John', 'Doe', '12345');
        await checkoutPage.continueCheckout();
        await checkoutPage.finishCheckout();
        await expect(page).toHaveURL(/checkout-complete\.html/);

        await checkoutPage.backHomeButton.click();
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.itemCards.first()).toBeVisible();
        // cart should be empty after checkout
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeHidden();
    });
});

test.describe('Checkout - Negative / Bug', () => {
    let authPage: AuthPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory\.html/);
    });

    // CHK005 - Negative - Checkout with empty cart should be prevented but currently succeeds (BUG - Critical)
    test('CHK005 - should demonstrate bug: checkout succeeds even with empty cart', async ({ page }) => {
        // Ensure cart is empty
        await cartPage.open();
        await expect(page).toHaveURL(/cart\.html/);
        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(cartPage.checkoutButton).toBeVisible();

        await cartPage.checkoutButton.click();
        await expect(page).toHaveURL(/checkout-step-one\.html/);

        await checkoutPage.fillInfo('John', 'Doe', '12345');
        await checkoutPage.continueCheckout();
        await expect(page).toHaveURL(/checkout-step-two\.html/);
        await expect(checkoutPage.paymentInfo).toBeVisible();

        await checkoutPage.finishCheckout();
        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(checkoutPage.completeHeader).toContainText('Thank you for your order!');

        // This documents the Critical bug: system should have blocked checkout with empty cart
        // but instead allows it. Annotate as bug.
        test.info().annotations.push({
            type: 'BUG-Critical',
            description: 'CHK005 FAILED expected: System should prevent checkout with empty cart (Your cart is empty) but currently succeeds',
        });
    });
});
