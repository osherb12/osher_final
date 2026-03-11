import { test, expect, Page } from '@playwright/test';
import { loginAs, ADMIN } from './helpers';

/** Navigate to /admin via page.goto — works now that ProtectedRoute waits for auth loading */
async function gotoAdmin(page: Page) {
  await loginAs(page, ADMIN.email, ADMIN.password);
  await page.goto('/admin');
  await expect(page.getByText('Admin Dashboard')).toBeVisible({ timeout: 10_000 });
}

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAdmin(page);
  });

  test('admin can access /admin dashboard', async ({ page }) => {
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
  });

  test('inventory tab is shown by default with product form', async ({ page }) => {
    await expect(page.getByText('Add Product')).toBeVisible();
    await expect(page.getByPlaceholder('Premium Mech Keyboard')).toBeVisible();
  });

  test('can switch to Orders tab', async ({ page }) => {
    await page.getByRole('button', { name: /Orders/i }).click();
    await expect(page.getByText('System Orders')).toBeVisible({ timeout: 5_000 });
  });

  test('can switch to Categories tab', async ({ page }) => {
    await page.getByRole('button', { name: /Categories/i }).click();
    await expect(page.getByPlaceholder('Category Name')).toBeVisible({ timeout: 5_000 });
  });

  test('can switch to Analytics tab', async ({ page }) => {
    await page.getByRole('button', { name: /Analytics/i }).click();
    await expect(page.getByText(/Orders Processed/i)).toBeVisible({ timeout: 5_000 });
  });

  test('admin can create a new category', async ({ page }) => {
    await page.getByRole('button', { name: /Categories/i }).click();

    const catName = `E2E-Cat-${Date.now()}`;
    await page.getByPlaceholder('Category Name').fill(catName);
    await page.getByRole('button', { name: 'Add Category' }).click();

    await expect(page.getByText(catName)).toBeVisible({ timeout: 5_000 });
  });

  async function fillProductForm(page: Parameters<typeof loginAs>[0], name: string) {
    // Wait for category options to load from the backend
    await page.waitForFunction(
      () => (document.querySelector('select') as HTMLSelectElement)?.options.length > 1,
      { timeout: 10_000 }
    );
    await page.getByPlaceholder('Premium Mech Keyboard').fill(name);
    await page.getByPlaceholder('Detailed product info...').fill('E2E test description for this product');
    await page.locator('input[type="number"]').nth(0).fill('29.99');
    await page.locator('input[type="number"]').nth(1).fill('10');
    // Text input order on /admin: nth(0)=navbar search, nth(1)=product name, nth(2)=image URL
    await page.locator('input[type="text"]').nth(2).fill('https://images.unsplash.com/photo-1587829741301-dc798b83add3');
    await page.locator('select').first().selectOption({ index: 1 });
  }

  test('admin can create a new product', async ({ page }) => {
    const productName = `E2E Product ${Date.now()}`;
    await fillProductForm(page, productName);
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 5_000 });
  });

  test('admin can delete a product', async ({ page }) => {
    const productName = `Delete-Me-${Date.now()}`;
    await fillProductForm(page, productName);
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 5_000 });

    // Product should now be in the table
    const row = page.locator('tr').filter({ hasText: productName });
    await expect(row).toBeVisible({ timeout: 5_000 });
    // handleDelete shows a confirm() dialog — accept it
    page.once('dialog', dialog => dialog.accept());
    await row.locator('button').first().click(); // Trash2 icon button (no text label)

    await expect(page.getByText(productName)).not.toBeVisible({ timeout: 5_000 });
  });

  test('can change order status', async ({ page }) => {
    await page.getByRole('button', { name: /Orders/i }).click();
    await expect(page.getByText('System Orders')).toBeVisible({ timeout: 5_000 });

    const selects = page.locator('select');
    const count = await selects.count();
    if (count > 0) {
      const firstSelect = selects.first();
      await firstSelect.selectOption('shipped');
      await expect(firstSelect).toHaveValue('shipped');
    }
  });
});
