# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr07-shopping-cart.spec.js >> FR-07: Giỏ hàng (Shopping Cart) - Positive Cases >> TC01: Thêm một sản phẩm vào giỏ hàng
- Location: tests\fr07-shopping-cart.spec.js:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Tổng cộng')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Tổng cộng')

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Giỏ Hàng" [level=2]
  - table:
    - rowgroup:
      - row "Sản phẩm Giá Số lượng Thành tiền Thao tác":
        - columnheader "Sản phẩm"
        - columnheader "Giá"
        - columnheader "Số lượng"
        - columnheader "Thành tiền"
        - columnheader "Thao tác"
    - rowgroup:
      - row "iPhone 15 Pro Max 30,000,000 ₫ 1 30,000,000 ₫ Xóa":
        - cell "iPhone 15 Pro Max"
        - cell "30,000,000 ₫"
        - cell "1"
        - cell "30,000,000 ₫"
        - cell "Xóa":
          - button "Xóa"
  - text: "Tổng tạm tính: 30,000,000 ₫"
  - link "← Mua tiếp":
    - /url: /
  - button "Tiến hành thanh toán"
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | const fs = require('fs');
  3   | const path = require('path');
  4   | 
  5   | // Đọc test data từ file JSON (Data-driven)
  6   | const testDataPath = path.join(__dirname, '../data/fr07.data.json');
  7   | const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
  8   | 
  9   | test.describe('FR-07: Giỏ hàng (Shopping Cart) - Positive Cases', () => {
  10  |     test.beforeEach(async ({ page }) => {
  11  |         // Giả định URL gốc là http://localhost:5173
  12  |         await page.goto('http://localhost:5173');
  13  |     });
  14  | 
  15  |     test('TC01: Thêm một sản phẩm vào giỏ hàng', async ({ page }) => {
  16  |         const data = testData.positiveCases.add_single;
  17  | 
  18  |         // Bước 1: Mở trang chi tiết sản phẩm (Cần review selector/url thật)
  19  |         await page.goto(`http://localhost:5173/product/${data.productId}`);
  20  | 
  21  |         // Bước 2: Bấm nút thêm vào giỏ.
  22  |         // LƯU Ý BUG FR-06: Nút "Thêm vào giỏ hàng" cần click 2 lần.
  23  |         // Tạm dùng click 2 lần ở đây để có dữ liệu cho FR-07. Sinh viên cần rà soát lại.
  24  |         const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  25  |         await addToCartBtn.click();
  26  |         await addToCartBtn.click();
  27  | 
  28  |         // Bước 3: Chuyển sang giỏ hàng
  29  |         await page.locator('a[href="/cart"]').click(); // Giả định có thẻ a href=/cart
  30  | 
  31  |         // Bước 4: Kiểm tra cơ bản
  32  |         await expect(page.locator('text=' + data.productName)).toBeVisible();
  33  |         // Kiểm tra nhãn "Tổng cộng" theo spec
> 34  |         await expect(page.locator('text=Tổng cộng')).toBeVisible();
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  35  |     });
  36  | 
  37  |     test('TC02: Thêm cùng một sản phẩm vào giỏ (Bug FR-07 trùng dòng)', async ({ page }) => {
  38  |         const data = testData.positiveCases.add_multiple_same;
  39  | 
  40  |         await page.goto(`http://localhost:5173/product/${data.productId}`);
  41  | 
  42  |         const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  43  | 
  44  |         // Lần 1
  45  |         await addToCartBtn.click();
  46  |         await addToCartBtn.click();
  47  | 
  48  |         // Đợi 3s sau lần bấm đầu tiên (Lưu ý: đây là hardcoded wait, dễ gây flaky test)
  49  |         await page.waitForTimeout(3000);
  50  | 
  51  |         // Lần 2
  52  |         await addToCartBtn.click();
  53  |         await addToCartBtn.click();
  54  | 
  55  |         await page.locator('a[href="/cart"]').click(); // Giả định có thẻ a href=/cart
  56  | 
  57  |         // Tạm assert theo spec (Cộng dồn số lượng)
  58  |         // Lưu ý: Test này sẽ fail trên hệ thống thật vì bug FR-07 tạo dòng mới.
  59  |         // Đây là minh chứng bắt lỗi (bug) tự động của test script.
  60  |         const quantityInput = page.locator('.quantity-input').first();
  61  |         await expect(quantityInput).toHaveValue(data.quantity.toString());
  62  |     });
  63  | 
  64  |     test('TC03: Hiển thị giỏ hàng trống', async ({ page }) => {
  65  |         const data = testData.emptyCart;
  66  |         await page.goto('http://localhost:5173/cart');
  67  |         await expect(page.locator(`text=${data.expectedMessage}`)).toBeVisible();
  68  |     });
  69  | 
  70  |     test('TC04: Nhập số lượng không hợp lệ vào giỏ hàng (Negative)', async ({ page }) => {
  71  |         const data = testData.positiveCases.add_single;
  72  |         const invalidQties = testData.negativeCases.invalidQuantities;
  73  | 
  74  |         // Setup: Có 1 SP trong giỏ
  75  |         await page.goto(`http://localhost:5173/product/${data.productId}`);
  76  |         const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  77  |         await addToCartBtn.click();
  78  |         await addToCartBtn.click();
  79  |         await page.goto('http://localhost:5173/cart');
  80  | 
  81  |         const quantityInput = page.locator('.quantity-input').first();
  82  | 
  83  |         for (const qty of invalidQties) {
  84  |             await quantityInput.fill(qty.toString());
  85  |             // Blur để kích hoạt event change nếu có
  86  |             await quantityInput.blur();
  87  | 
  88  |             // Assert State: Kiểm tra xem input có tự reset về 1 không, hoặc chặn giá trị sai.
  89  |             const value = await quantityInput.inputValue();
  90  |             // Nếu bị reset về giá trị hợp lệ, value phải là >= 1.
  91  |             const isInvalidState = (value === '0' || value === '-1' || value === 'abc' || value === '');
  92  |             expect(isInvalidState, `Giá trị nhập vào (${qty}) không được phép giữ nguyên`).toBe(false);
  93  |         }
  94  |     });
  95  | 
  96  |     test('TC05: Xóa sản phẩm phải hiển thị confirm dialog (Negative/Edge - Bắt Bug)', async ({ page }) => {
  97  |         const data = testData.positiveCases.add_single;
  98  |         await page.goto(`http://localhost:5173/product/${data.productId}`);
  99  |         const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  100 |         await addToCartBtn.click();
  101 |         await addToCartBtn.click();
  102 |         await page.locator('a[href="/cart"]').click(); // Giả định có thẻ a href=/cart
  103 | 
  104 |         let dialogTriggered = false;
  105 |         page.on('dialog', async dialog => {
  106 |             dialogTriggered = true;
  107 |             await dialog.accept();
  108 |         });
  109 | 
  110 |         // Giả định nút xóa có class .delete-item-btn hoặc text 'Xóa'
  111 |         const deleteBtn = page.locator('button:has-text("Xóa")').first();
  112 |         await deleteBtn.click();
  113 | 
  114 |         // Assert State: Sẽ fail tại đây do bug FR-07 đã biết (không có dialog)
  115 |         expect(dialogTriggered, 'Phải có confirm dialog khi xóa sản phẩm khỏi giỏ hàng').toBe(true);
  116 |     });
  117 | 
  118 |     test('TC06: Giỏ hàng phải gọi API để lưu dữ liệu (Network Assertion - Bắt Bug)', async ({ page }) => {
  119 |         const data = testData.positiveCases.add_single;
  120 |         await page.goto(`http://localhost:5173/product/${data.productId}`);
  121 | 
  122 |         const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  123 | 
  124 |         // Assert Network: Dựa vào docs/api_specification.md, phải có POST request đến /api/cart
  125 |         // Test này sẽ cố tình bắt lỗi (FAIL do Timeout) vì hệ thống hiện tại 
  126 |         // dính bug ở FR-07 (Chỉ lưu ở React state, không gọi API)
  127 |         const responsePromise = page.waitForResponse(
  128 |             response => response.url().includes('/api/cart') && response.request().method() === 'POST',
  129 |             { timeout: 4000 } // Để 3s cho nhanh fail, chứng minh API không được gọi
  130 |         );
  131 | 
  132 |         await addToCartBtn.click();
  133 |         await addToCartBtn.click(); // Bug FR-06: click 2 lần
  134 | 
```