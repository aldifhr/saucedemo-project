import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.pages';

const LONG_STRING_256 = 'a'.repeat(256);

test.describe('Auth - Positive', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await page.goto('https://www.saucedemo.com');
    });

    // LGN001 - Positive - High
    test('LGN001 - should login successfully with valid credentials', async ({ page }) => {
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory.html/);
        await expect(page.getByText('Swag Labs')).toBeVisible();
    });
});

test.describe('Auth - Negative', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await page.goto('https://www.saucedemo.com');
    });

    // LGN002 - Negative - Medium - uppercase both
    test('LGN002 - should show error with uppercase credentials', async () => {
        await authPage.login('STANDARD_USER', 'SECRET_SAUCE');
        await expect(authPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });

    // LGN003 - Negative - Medium - uppercase username only
    test('LGN003 - should show error with uppercase username', async () => {
        await authPage.login('STANDARD_USER', 'secret_sauce');
        await expect(authPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });

    // LGN004 - Negative - Medium - uppercase password only
    test('LGN004 - should show error with uppercase password', async () => {
        await authPage.login('standard_user', 'SECRET_SAUCE');
        await expect(authPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });

    // LGN005 - Negative - Medium - invalid credentials
    test('LGN005 - should show error with invalid credentials', async () => {
        await authPage.login('standard_user', 'secret_saucerr');
        await expect(authPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });
});

test.describe('Auth - Validation', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await page.goto('https://www.saucedemo.com');
    });

    // LGN006 - Validation - High - empty password
    test('LGN006 - should show error when password is empty', async () => {
        await authPage.login('standard_user', '');
        await expect(authPage.errorMessage).toContainText('Epic sadface: Password is required');
    });

    // LGN007 - Validation - High - empty username
    test('LGN007 - should show error when username is empty', async () => {
        await authPage.login('', 'secret_sauce');
        await expect(authPage.errorMessage).toContainText('Epic sadface: Username is required');
    });

    // LGN008 - Validation - High - empty both
    test('LGN008 - should show error when username and password are empty', async () => {
        await authPage.login('', '');
        await expect(authPage.errorMessage).toContainText('Epic sadface: Username is required');
    });

    // LGN009 - Validation - Low - Boundary 256 char username
    test('LGN009 - should show error with 256 char username (boundary)', async () => {
        await authPage.login(LONG_STRING_256, 'secret_sauce');
        await expect(authPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });

    // LGN010 - Validation - Low - Boundary 256 char password
    test('LGN010 - should show error with 256 char password (boundary)', async () => {
        await authPage.login('standard_user', LONG_STRING_256);
        await expect(authPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });
});
