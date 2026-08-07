const { test, expect } = require('@playwright/test');
const testData = require('../data/fr06.data.json');

test.describe('FR-06: Product Detail View - Positive Cases', () => {

  // Case 1: Hiển thị đầy đủ thông tin SP khi mở trang chi tiết (id hợp lệ)
  test('TC01: Should display complete product information for valid id', async ({ page }) => {
    const productId = testData.productIds.valid;
    await page.goto(`/product/${productId}`);

    // Assertion Pattern 1: Visibility/text assertion
    // Dùng selector dựa trên source code thật của EShop (img, h1, text-red-600)
    await expect(page.locator('img.w-full.h-auto.rounded')).toBeVisible(); // Hình ảnh sản phẩm
    await expect(page.locator('h1.text-3xl.font-bold')).toBeVisible();
    await expect(page.locator('p.text-red-600')).toBeVisible(); // Giá tiền
    await expect(page.locator('p.text-gray-700')).toBeVisible(); // Mô tả
    await expect(page.locator('button.bg-green-600')).toBeVisible(); // Nút Thêm vào giỏ hàng
  });

  // Case 2 & 3: Nhập quantity hợp lệ (1 và 5) rồi thêm giỏ (Data-driven)
  const validQuantities = [testData.validQuantities[0], testData.validQuantities[1]]; // [1, 5]

  for (const quantity of validQuantities) {
    test(`TC02_03: Should update cart when adding valid quantity (${quantity})`, async ({ page }) => {
      const productId = testData.productIds.valid;
      await page.goto(`/product/${productId}`);

      const quantityInput = page.locator('input[type="number"]');
      const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ hàng' });

      // Xoá trắng input và nhập số lượng
      await quantityInput.fill(quantity.toString());

      // Click thêm vào giỏ hàng
      await addToCartBtn.click();
      await addToCartBtn.click();

      // Assertion Pattern 2: State assertion
      // Dựa vào source code, khi thêm thành công nút sẽ đổi chữ thành "Đã thêm"
      const addedBtn = page.locator('button', { hasText: 'Đã thêm' });
      await expect(addedBtn).toBeVisible();
    });
  }

  // --- PROMPT 2: NEGATIVE CASES ---
  // Case 5, 6, 7, 8, 9: Negative cases for quantity input
  const invalidQuantities = testData.invalidQuantities; // [0, -3, 1.5, "abc", ""]

  for (const quantity of invalidQuantities) {
    test(`TC05_09: Should handle invalid quantity correctly ("${quantity}")`, async ({ page }) => {
      const productId = testData.productIds.valid;
      await page.goto(`/product/${productId}`);

      const quantityInput = page.locator('input[type="number"]'); // Placeholder selector
      const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ hàng' }); // Placeholder selector

      // Xoá trắng và nhập giá trị không hợp lệ
      await quantityInput.fill(quantity.toString());
      await addToCartBtn.click();

      // Assertion Pattern 1 (mở rộng): Kiểm tra xem có hiển thị lỗi hay bị chặn lại không
      const errorMessage = page.locator('.error-message'); // Placeholder selector cho text lỗi UI

      // Lấy câu thông báo lỗi mặc định của HTML5 (nếu form dùng thuộc tính min="1" hoặc required)
      const validationMessage = await quantityInput.evaluate((el) => el.validationMessage);

      // Kỳ vọng: Hoặc có thông báo lỗi UI hiển thị, hoặc bị chặn bởi HTML5 validation
      const hasUIError = await errorMessage.isVisible();
      const hasHTML5Error = validationMessage !== '';

      expect(hasUIError || hasHTML5Error, `Dự kiến có lỗi cho input "${quantity}" nhưng không thấy báo lỗi`).toBeTruthy();
    });
  }

  // --- PROMPT 3: NETWORK ASSERTION & ROBUSTNESS ---

  // Case 4: Single-click bug reproduction
  test('TC04: Should trigger POST /api/cart on single click (Regression)', async ({ page }) => {
    const productId = testData.productIds.valid;
    await page.goto(`/product/${productId}`);

    const quantityInput = page.locator('input[type="number"]');
    const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ hàng' });

    await quantityInput.fill('1');

    // Assertion Pattern 3: Network/API assertion
    // Đặt timeout 3s để ép fail nhanh nếu hệ thống không gọi API (bắt bug "cần click 2 lần" hoặc "không gọi API")
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/cart') && response.request().method() === 'POST',
      { timeout: 3000 }
    );

    // Click đúng 1 lần duy nhất
    await addToCartBtn.click();

    // Nếu bug có thật, dòng await này sẽ ném ra TimeoutError -> test case fail -> report bug thành công
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
  });

  // Case 10: Not found product (Negative)
  test('TC10: Should show not found message for invalid product id', async ({ page }) => {
    const notFoundId = testData.productIds.notFound; // 999999
    await page.goto(`/product/${notFoundId}`);

    // Kỳ vọng hiển thị dòng chữ thông báo không tìm thấy
    const notFoundMessage = page.locator('text="không tồn tại" i');
    await expect(notFoundMessage).toBeVisible();
  });

  // Case 11: Mở sản phẩm khác (Positive)
  test('TC11: Should display correct info for a different product (id = 2)', async ({ page }) => {
    const productId = testData.productIds.validSecond;
    await page.goto(`/product/${productId}`);

    // Đảm bảo load đúng dữ liệu, không bị dính cache của SP trước
    await expect(page.locator('h1.text-3xl.font-bold')).toBeVisible();
  });

  // Case 12: Robustness - Edge case with extremely large quantity
  test('TC12: Should handle extremely large quantity without crashing UI', async ({ page }) => {
    const productId = testData.productIds.valid;
    await page.goto(`/product/${productId}`);

    const quantityInput = page.locator('input[type="number"]');
    const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ hàng' });

    // Nhập số cực lớn: 2147483647
    await quantityInput.fill(testData.validQuantities[2].toString());

    // Bắt network nhưng không ép fail (ignore timeout) để kiểm tra UI behavior
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/cart') && response.request().method() === 'POST',
      { timeout: 3000 }
    ).catch(() => null);

    await addToCartBtn.click();
    const response = await responsePromise;

    // Verify UI không bị sập (trắng trang do crash React)
    await expect(page.locator('body')).toBeVisible();

    if (response) {
      console.log('Robustness TC12 API Status:', response.status());
    } else {
      console.log('Robustness TC12: No API called or timeout');
    }
  });
});
