import { test, expect } from '@playwright/test';

test('1. Envío exitoso de dinero con el monto mínimo ($5.000 COP)', async ({ page }) => {
  await page.goto('https://makerspay.com');//ingreso a la pagina
  await page.locator('[data-test="username"]').fill('remitente_test');//usuario
  await page.locator('[data-test="password"]').fill('clave123');//contraseña
  await page.locator('[data-test="login-button"]').click();//seleccion Login
  await page.goto('https://makerspay.com');//navegación a la billetera
  await page.locator('[data-test="phone-input"]').fill('3101234567');//número de celular destinatario
  await page.locator('[data-test="amount-input"]').fill('5000');//monto mínimo permitido
  await page.locator('[data-test="send-button"]').click();//confirmar transferencia
  const successMessage = page.locator('[data-test="success-message"]');
  await expect(successMessage).toBeVisible();//espera mensaje de éxito
  await expect(successMessage).toContainText('Transacción exitosa');//Confirmación de envío
});

test('2. Envío fallido por monto inferior al mínimo permitido ($4.999 COP)', async ({ page }) => {
  await page.goto('https://makerspay.com');//ingreso a la pagina
  await page.locator('[data-test="username"]').fill('remitente_test');//usuario
  await page.locator('[data-test="password"]').fill('clave123');//contraseña
  await page.locator('[data-test="login-button"]').click();//seleccion Login
  await page.goto('https://makerspay.com');//navegación a la billetera
  await page.locator('[data-test="phone-input"]').fill('3101234567');//número de celular destinatario
  await page.locator('[data-test="amount-input"]').fill('4999');//monto por debajo de la regla de negocio
  await page.locator('[data-test="send-button"]').click();//Login
  const errorMessage = page.locator('[data-test="error-message"]');
  await expect(errorMessage).toBeVisible();//espera mensaje
  await expect(errorMessage).toContainText('El monto mínimo por transacción es $5.000 COP');//mensaje de regla de negocio rota
});

test('3. Envío fallido por monto superior al máximo permitido ($2.000.001 COP)', async ({ page }) => {
  await page.goto('https://makerspay.com');//ingreso a la pagina
  await page.locator('[data-test="username"]').fill('remitente_test');//usuario
  await page.locator('[data-test="password"]').fill('clave123');//contraseña
  await page.locator('[data-test="login-button"]').click();//seleccion Login
  await page.goto('https://makerspay.com');//navegación a la billetera
  await page.locator('[data-test="phone-input"]').fill('3101234567');//número de celular destinatario
  await page.locator('[data-test="amount-input"]').fill('2000001');//monto por encima del límite
  await page.locator('[data-test="send-button"]').click();//Login
  const errorMessage = page.locator('[data-test="error-message"]');
  await expect(errorMessage).toBeVisible();//espera mensaje
  await expect(errorMessage).toContainText('El monto máximo por transacción es $2.000.000 COP');//mensaje de límite máximo superado
});

test('4. Envío fallido por saldo insuficiente', async ({ page }) => {
  await page.goto('https://makerspay.com');//ingreso a la pagina
  await page.locator('[data-test="username"]').fill('remitente_sin_fondos');//usuario sin dinero suficiente
  await page.locator('[data-test="password"]').fill('clave123');//contraseña
  await page.locator('[data-test="login-button"]').click();//seleccion Login
  await page.goto('https://makerspay.com');//navegación a la billetera
  await page.locator('[data-test="phone-input"]').fill('3101234567');//número de celular destinatario
  await page.locator('[data-test="amount-input"]').fill('50000');//monto mayor al saldo disponible
  await page.locator('[data-test="send-button"]').click();//Login
  const errorMessage = page.locator('[data-test="error-message"]');
  await expect(errorMessage).toBeVisible();//espera mensaje
  await expect(errorMessage).toContainText('Saldo insuficiente para realizar la transacción');//mensaje de fondos insuficientes
});

test('5. Envío fallido al mismo número de celular del remitente', async ({ page }) => {
  await page.goto('https://makerspay.com');//ingreso a la pagina
  await page.locator('[data-test="username"]').fill('remitente_test');//usuario
  await page.locator('[data-test="password"]').fill('clave123');//contraseña
  await page.locator('[data-test="login-button"]').click();//seleccion Login
  await page.goto('https://makerspay.com');//navegación a la billetera
  await page.locator('[data-test="phone-input"]').fill('3001234567');//ingresa su propio número registrado
  await page.locator('[data-test="amount-input"]').fill('10000');//monto válido
  await page.locator('[data-test="send-button"]').click();//Login
  const errorMessage = page.locator('[data-test="error-message"]');
  await expect(errorMessage).toBeVisible();//espera mensaje
  await expect(errorMessage).toContainText('No se permiten envíos a su mismo número de celular');//mensaje de restricción propia
});
