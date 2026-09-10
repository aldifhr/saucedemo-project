import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.pages';
import { InventoryPage } from '../pages/inventory.pages';

test.describe('Inventory - Sorting', () => {
    let authPage: AuthPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory.html/);
    });

    // IVT001 - Positive - Sort A to Z
    test('IVT001 - should sort products from A to Z', async () => {
        await inventoryPage.sortBy('az');
        const names = await inventoryPage.getItemNames();
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sorted);
    });

    // IVT002 - Positive - Sort Z to A
    test('IVT002 - should sort products from Z to A', async () => {
        await inventoryPage.sortBy('za');
        const names = await inventoryPage.getItemNames();
        const sorted = [...names].sort((a, b) => b.localeCompare(a));
        expect(names).toEqual(sorted);
    });

    // IVT003 - Positive - Sort Price low to high
    test('IVT003 - should sort products by price low to high', async () => {
        await inventoryPage.sortBy('lohi');
        const prices = await inventoryPage.getItemPrices();
        const sorted = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sorted);
    });

    // IVT004 - Positive - Sort Price high to low
    test('IVT004 - should sort products by price high to low', async () => {
        await inventoryPage.sortBy('hilo');
        const prices = await inventoryPage.getItemPrices();
        const sorted = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sorted);
    });
});
