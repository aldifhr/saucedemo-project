import { Page } from "@playwright/test"

export class UIPage {
    readonly page: Page;
    // Sidebar
    readonly burgerButton;
    readonly burgerCloseButton;
    readonly sidebarMenu;
    readonly allItemsLink;
    readonly aboutLink;
    readonly logoutLink;
    readonly resetLink;
    // Footer
    readonly footer;
    readonly footerCopy;
    readonly socialTwitter;
    readonly socialFacebook;
    readonly socialLinkedin;

    constructor(page: Page) {
        this.page = page;
        this.burgerButton = page.locator('#react-burger-menu-btn');
        this.burgerCloseButton = page.locator('#react-burger-cross-btn');
        this.sidebarMenu = page.locator('.bm-menu');
        this.allItemsLink = page.locator('#inventory_sidebar_link');
        this.aboutLink = page.locator('#about_sidebar_link');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.resetLink = page.locator('#reset_sidebar_link');
        this.footer = page.locator('.footer');
        this.footerCopy = page.locator('[data-test="footer-copy"]');
        this.socialTwitter = page.locator('[data-test="social-twitter"]');
        this.socialFacebook = page.locator('[data-test="social-facebook"]');
        this.socialLinkedin = page.locator('[data-test="social-linkedin"]');
    }

    async openSidebar() {
        await this.burgerButton.click();
    }

    async closeSidebar() {
        await this.burgerCloseButton.click();
    }
}
