/* eslint-disable no-undef */
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Your setup code here
  await page.goto('http://localhost:5173/auth/login')
  await page.getByPlaceholder('john@gmail.com').click()
  await page.getByPlaceholder('john@gmail.com').fill('docent@howest.be')
  await page.getByPlaceholder('••••••••').click()
  await page.getByPlaceholder('••••••••').fill('123456')
  await page.getByRole('button', { name: 'Login' }).click()
})

test('Loaded Material', async ({ page }) => {
  await page.getByRole('link', { name: 'Materials' }).click()

  // Wait for the materials section to load
  await page.waitForSelector('.grid .col-span-1')

  // Count the number of material buttons in the grid
  const materialsCount = await page.$$eval(
    '.grid .col-span-1',
    items => items.length,
  )

  // Expect to find 50 materials (adjust the expected count as needed)
  expect(materialsCount).toBe(50)
})

test('Create Material', async ({ page }) => {
  await page.getByRole('link', { name: 'Materials' }).click()
  await page.getByRole('button', { name: 'Add New Material' }).click()
  await page.getByPlaceholder('Forklift').click()
  await page
    .locator('div')
    .filter({ hasText: 'Create MaterialNameSerial' })
    .first()
    .click()
  await page.getByPlaceholder('Forklift').click()
  await page.getByPlaceholder('Forklift').fill('lawn mower')
  await page.getByPlaceholder('123456789').click()
  await page.getByPlaceholder('123456789').fill('89452489456')
  await page.locator('#isLoan span').click()
  await page.getByRole('button', { name: 'Create Material' }).click()
})

test('Edit Material', async ({ page }) => {
  await page.getByRole('link', { name: 'Materials' }).click()
  await page.getByRole('button', { name: 'lawn mower Available' }).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByPlaceholder('123456789').click()
  await page.getByPlaceholder('123456789').fill('8945248545')
  await page.getByRole('button', { name: 'Update Material' }).click()
})

test('Delete Material', async ({ page }) => {
  await page.getByRole('link', { name: 'Materials' }).click()
  await page
    .getByRole('button', { name: 'lawn mower available' })
    .first()
    .click()
  await page.getByRole('button', { name: 'Delete' }).click()
})
