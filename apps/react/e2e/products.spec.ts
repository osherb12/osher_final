import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('products page loads and shows grid', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h3').first()).toBeVisible({ timeout: 10_000 });
  });

  test('shows category filter tabs including "All"', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('button', { name: /^all$/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('search filters products', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('h3', { timeout: 10_000 });

    await page.getByPlaceholder('Search products...').fill('Keyboard');
    await page.getByPlaceholder('Search products...').press('Enter');
    await page.waitForTimeout(800);

    const cards = page.locator('h3');
    expect(await cards.count()).toBeGreaterThan(0);
    const firstTitle = await cards.first().textContent();
    expect(firstTitle?.toLowerCase()).toContain('keyboard');
  });

  test('category filter shows products for selected category', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('h3', { timeout: 10_000 });

    await page.getByRole('button', { name: /electronics/i }).first().click();
    await page.waitForTimeout(800);

    expect(await page.locator('h3').count()).toBeGreaterThan(0);
  });

  test('clicking a product name navigates to detail page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('h3', { timeout: 10_000 });

    // Click the Link wrapping the first product's h3
    const firstProductLink = page.locator('a[href^="/product/"]').first();
    const href = await firstProductLink.getAttribute('href');
    await firstProductLink.click();

    await expect(page).toHaveURL(href!, { timeout: 10_000 });
    await expect(page.locator('text=/\\$[0-9]+/').first()).toBeVisible();
  });

  test('product detail page shows price', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('h3', { timeout: 10_000 });

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.click();

    await expect(page).toHaveURL(/\/product\//, { timeout: 10_000 });
    await expect(page.locator('text=/\\$[0-9]+/').first()).toBeVisible();
  });

  test('404 page shown for unknown route', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.locator('text=/404|not found/i').first()).toBeVisible();
  });
});
