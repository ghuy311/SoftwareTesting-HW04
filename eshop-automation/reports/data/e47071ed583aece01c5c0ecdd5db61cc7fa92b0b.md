# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr07-shopping-cart.spec.js >> FR-07: Giỏ hàng (Shopping Cart) - Complete Data-Driven Test Suite >> TC11: Thêm vào giỏ hàng phải gửi request POST đến /api/cart
- Location: tests\fr07-shopping-cart.spec.js:181:3

# Error details

```
TimeoutError: page.waitForResponse: Timeout 4000ms exceeded while waiting for event "response"
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - link "EShop" [ref=f1e5]:
      - /url: /
    - navigation [ref=f1e6]:
      - link "Giỏ hàng" [ref=f1e7]:
        - /url: /cart
      - link "Đăng nhập" [ref=f1e8]:
        - /url: /login
      - link "Đăng ký" [ref=f1e9]:
        - /url: /register
  - main [ref=f1e10]:
    - generic [ref=f1e11]:
      - img "iPhone 15 Pro Max" [ref=f1e13]
      - generic [ref=f1e14]:
        - heading "iPhone 15 Pro Max" [level=1] [ref=f1e15]
        - paragraph [ref=f1e16]: 30,000,000 ₫
        - paragraph [ref=f1e17]: Điện thoại cao cấp của Apple
        - generic [ref=f1e18]:
          - generic [ref=f1e19]: "Số lượng:"
          - spinbutton [ref=f1e20]: "1"
        - button "Thêm vào giỏ hàng" [ref=f1e21] [cursor=pointer]
  - contentinfo [ref=f1e22]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  89  |     const quantityInput = page.locator('input[type="number"]');
  90  |     await quantityInput.fill(data.updatedQuantity.toString());
  91  | 
  92  |     // Bước 3: Click nút Thêm vào giỏ hàng (2 lần do bug clickCount ở ProductDetail.jsx)
  93  |     const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  94  |     await addToCartBtn.click();
  95  |     await addToCartBtn.click();
  96  | 
  97  |     // Bước 4: Click href chuyển sang trang giỏ hàng
  98  |     await page.locator('a[href="/cart"]').click();
  99  | 
  100 |     // Bước 5: Kiểm tra cột Số lượng (thẻ <td> thứ 3 trong bảng giỏ hàng)
  101 |     const quantityCell = page.locator('tbody tr td').nth(2);
  102 |     await expect(quantityCell).toHaveText(data.updatedQuantity.toString());
  103 |   });
  104 | 
  105 |   // TC05: Hiển thị giỏ hàng trống (Visibility Assertion)
  106 |   test('TC05: Hiển thị giao diện giỏ hàng trống khi chưa thêm sản phẩm', async ({ page }) => {
  107 |     const data = testData.emptyCart;
  108 |     await page.locator('a[href="/cart"]').click();
  109 | 
  110 |     // Assertion Pattern 1: Visibility assertion
  111 |     await expect(page.locator(`text=${data.expectedMessage}`)).toBeVisible();
  112 |   });
  113 | 
  114 |   // --- NHÓM 2: NEGATIVE TEST CASES (DATA-DRIVEN PARAMETERIZED) ---
  115 | 
  116 |   const invalidQuantities = testData.negativeCases.invalidQuantities;
  117 | 
  118 |   invalidQuantities.forEach((qty, index) => {
  119 |     const tcNumber = (6 + index).toString().padStart(2, '0');
  120 |     test(`TC${tcNumber}: Nhập số lượng không hợp lệ vào giỏ hàng (qty = "${qty}")`, async ({ page }) => {
  121 |       const singleData = testData.positiveCases.add_single;
  122 | 
  123 |       // Bước 1: Mở trang chi tiết sản phẩm
  124 |       await page.goto(`/product/${singleData.productId}`);
  125 | 
  126 |       // Bước 2: Nhập số lượng không hợp lệ tại ô input của trang chi tiết
  127 |       const quantityInput = page.locator('input[type="number"]');
  128 | 
  129 |       try {
  130 |         await quantityInput.fill(qty.toString());
  131 |         await quantityInput.blur();
  132 |       } catch (error) {
  133 |         console.log(`Bị chặn nhập liệu HTML5 cho giá trị: ${qty}`);
  134 |         return;
  135 |       }
  136 | 
  137 |       // Bước 3: Click thêm vào giỏ
  138 |       const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  139 |       await addToCartBtn.click();
  140 |       await addToCartBtn.click();
  141 | 
  142 |       // Bước 4: Chuyển sang giỏ hàng bằng link href
  143 |       await page.locator('a[href="/cart"]').click();
  144 | 
  145 |       // Assertion Pattern 2: State assertion (Kiểm tra xem số lượng trong giỏ có bị mang giá trị sai không)
  146 |       const quantityCell = page.locator('tbody tr td').nth(2);
  147 |       if (await quantityCell.isVisible()) {
  148 |         const val = await quantityCell.textContent();
  149 |         const isInvalid = (val === '0' || val === '-1' || val === 'abc' || val === '');
  150 |         expect(isInvalid, `Giá trị không hợp lệ "${qty}" không được phép giữ nguyên trong giỏ`).toBe(false);
  151 |       }
  152 |     });
  153 |   });
  154 | 
  155 |   // --- NHÓM 3: EDGE CASES & NETWORK ASSERTIONS ---
  156 | 
  157 |   // TC10: Xóa sản phẩm khỏi giỏ hàng phải hiển thị dialog xác nhận (Event Assertion)
  158 |   test('TC10: Xóa sản phẩm khỏi giỏ hàng phải hiển thị dialog xác nhận', async ({ page }) => {
  159 |     const data = testData.positiveCases.add_single;
  160 | 
  161 |     await page.goto(`/product/${data.productId}`);
  162 |     const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  163 |     await addToCartBtn.click();
  164 |     await addToCartBtn.click();
  165 |     await page.locator('a[href="/cart"]').click();
  166 | 
  167 |     let dialogTriggered = false;
  168 |     page.on('dialog', async dialog => {
  169 |       dialogTriggered = true;
  170 |       await dialog.accept();
  171 |     });
  172 | 
  173 |     const deleteBtn = page.locator('button:has-text("Xóa"), .delete-btn').first();
  174 |     await deleteBtn.click();
  175 | 
  176 |     // Assertion Pattern 2: State assertion (Yêu cầu có confirm dialog)
  177 |     expect(dialogTriggered, 'Phải hiển thị confirm dialog khi thực hiện xóa sản phẩm').toBe(true);
  178 |   });
  179 | 
  180 |   // TC11: Đẩy dữ liệu giỏ hàng qua API POST /api/cart (Network Assertion)
  181 |   test('TC11: Thêm vào giỏ hàng phải gửi request POST đến /api/cart', async ({ page }) => {
  182 |     const data = testData.positiveCases.add_single;
  183 |     const apiEndpoint = testData.apiEndpoints.cart;
  184 | 
  185 |     await page.goto(`/product/${data.productId}`);
  186 |     const addToCartBtn = page.locator('button', { hasText: 'Thêm vào giỏ' });
  187 | 
  188 |     // Assertion Pattern 3: Network assertion
> 189 |     const responsePromise = page.waitForResponse(
      |                                  ^ TimeoutError: page.waitForResponse: Timeout 4000ms exceeded while waiting for event "response"
  190 |       response => response.url().includes(apiEndpoint) && response.request().method() === 'POST',
  191 |       { timeout: 4000 }
  192 |     );
  193 | 
  194 |     await addToCartBtn.click();
  195 |     await addToCartBtn.click();
  196 | 
  197 |     const response = await responsePromise;
  198 |     expect(response.status()).toBe(200);
  199 |   });
  200 | 
  201 |   // TC12: Lấy dữ liệu giỏ hàng từ API GET /api/cart khi xem trang giỏ hàng (Network Assertion)
  202 |   test('TC12: Mở trang giỏ hàng phải tự động gọi API GET /api/cart để tải dữ liệu', async ({ page }) => {
  203 |     const apiEndpoint = testData.apiEndpoints.cart;
  204 | 
  205 |     // Assertion Pattern 3: Network assertion
  206 |     const responsePromise = page.waitForResponse(
  207 |       response => response.url().includes(apiEndpoint) && response.request().method() === 'GET',
  208 |       { timeout: 4000 }
  209 |     ).catch(() => null);
  210 | 
  211 |     await page.locator('a[href="/cart"]').click();
  212 | 
  213 |     const response = await responsePromise;
  214 |     if (response) {
  215 |       expect(response.status()).toBe(200);
  216 |     } else {
  217 |       console.log('TC12 Warning: Không phát hiện API GET /api/cart khi load trang giỏ hàng');
  218 |     }
  219 |   });
  220 | 
  221 | });
  222 | 
```