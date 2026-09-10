import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.pages';
import { UIPage } from '../pages/ui.pages';

test.describe('UI - Sidebar & Footer', () => {
    let authPage: AuthPage;
    let uiPage: UIPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        uiPage = new UIPage(page);
        await page.goto('https://www.saucedemo.com');
        await authPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory\.html/);
    });

    // UI001 - Positive - Sidebar displays correctly
    test('UI001 - should display sidebar with complete navigation menu', async () => {
        await expect(uiPage.burgerButton).toBeVisible();
        await uiPage.openSidebar();

        await expect(uiPage.sidebarMenu).toBeVisible();
        await expect(uiPage.allItemsLink).toBeVisible();
        await expect(uiPage.allItemsLink).toContainText('All Items');
        await expect(uiPage.aboutLink).toBeVisible();
        await expect(uiPage.aboutLink).toContainText('About');
        await expect(uiPage.logoutLink).toBeVisible();
        await expect(uiPage.logoutLink).toContainText('Logout');
        await expect(uiPage.resetLink).toBeVisible();
        await expect(uiPage.resetLink).toContainText('Reset App State');

        // close and verify hidden
        await uiPage.closeSidebar();
        await expect(uiPage.sidebarMenu).toBeHidden();
    });

    // UI002 - Positive - Footer displays correctly
    test('UI002 - should display footer with social media', async () => {
        await expect(uiPage.footer).toBeVisible();
        await expect(uiPage.footerCopy).toBeVisible();
        await expect(uiPage.footerCopy).toContainText('Sauce Labs');
        await expect(uiPage.socialTwitter).toBeVisible();
        await expect(uiPage.socialFacebook).toBeVisible();
        await expect(uiPage.socialLinkedin).toBeVisible();
    });

    // UI003 - Validation - Social media links open correct URLs
    test('UI003 - should have correct social media links in footer', async ({ page, context }) => {
        await expect(uiPage.footer).toBeVisible();

        // Verify href attributes (no need to actually navigate)
        await expect(uiPage.socialTwitter).toHaveAttribute('href', 'https://twitter.com/saucelabs');
        await expect(uiPage.socialFacebook).toHaveAttribute('href', 'https://www.facebook.com/saucelabs');
        await expect(uiPage.socialLinkedin).toHaveAttribute('href', 'https://www.linkedin.com/company/sauce-labs/');

        // Verify clicking opens new tab with correct URL (handle popup)
        const [twitterPage] = await Promise.all([
            context.waitForEvent('page'),
            uiPage.socialTwitter.click(),
        ]);
        await expect(twitterPage).toHaveURL(/(twitter|x)\.com\/saucelabs/);
        await twitterPage.close();

        const [facebookPage] = await Promise.all([
            context.waitForEvent('page'),
            uiPage.socialFacebook.click(),
        ]);
        await expect(facebookPage).toHaveURL(/facebook\.com\/saucelabs/);
        await facebookPage.close();

        const [linkedinPage] = await Promise.all([
            context.waitForEvent('page'),
            uiPage.socialLinkedin.click(),
        ]);
        await expect(linkedinPage).toHaveURL(/linkedin\.com\/company\/sauce-labs/);
        await linkedinPage.close();
    });
});
