import { Page } from '@playwright/test';

export const ADMIN = { email: 'admin@osher.com', password: 'adminpassword' };
export const USER  = { email: 'user@osher.com',  password: 'userpassword'  };

/** Log in via the /auth page. Waits for redirect to home. */
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/auth');
  await page.getByPlaceholder('name@example.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('/');
}

/** Register a brand-new user. Waits for redirect to home. */
export async function registerUser(page: Page, name: string, email: string, password: string) {
  await page.goto('/auth');
  await page.getByText('Create an Account').click();
  await page.getByPlaceholder('John Doe').fill(name);
  await page.getByPlaceholder('name@example.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForURL('/');
}

/** Unique email to avoid conflicts between test runs. */
export function uniqueEmail() {
  return `test_${Date.now()}@e2e.com`;
}
