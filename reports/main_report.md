# BÁO CÁO TỔNG HỢP HW04 — AUTOMATION TESTING (PLAYWRIGHT & AI-FIRST)

> **Môn học:** CS423 / CSC15003 — Kiểm chứng Phần mềm  
> **Họ và tên sinh viên:** HỒ GIA HUY  
> **Mã số sinh viên:** 23127376  
> **Lớp / Khóa:** 23KTPM2 / 23CLC  
> **Hệ thống SUT:** EShop (E-commerce Practice Application)  

---

## 1. Thông Tin Sinh Viên & Bảng Tự Đánh Giá

### 1.1 Bảng Tự Đánh Giá (Self-Assessment Table)

| STT | Tiêu chí đánh giá (Criteria) | Điểm tối đa | Điểm tự đánh giá |
| :---: | :--- | :---: | :---: |
| **1** | Task 1 — Feature A (FR-06: Xem chi tiết sản phẩm) | 25 | 25 |
| **2** | Task 1 — Feature B (FR-07: Giỏ hàng - Shopping Cart) | 25 | 25 |
| **3** | Task 1 — Feature C (FR-14: Quản lý danh mục - Category CRUD) | 25 | 25 |
| **4** | Task 2 — Demo Video (Thuyết minh giọng nói & Thao tác kiểm thử) | 15 | 15 |
| **5** | Agent Skill (Quy trình sinh script AI-First có kỷ luật) | 10 | 10 |
| **Tổng** | **TỔNG ĐIỂM (TOTAL)** | **100** | **100** |

---

## 2. Tổng Quan Các Tính Năng Đã Chọn (Selected Web Features)

Tương tự HW02, 3 tính năng web thuộc 3 nhóm (Pools A, B, C) được lựa chọn để thực hiện tự động hóa kiểm thử:

1. **Pool A — FR-06: Xem chi tiết sản phẩm (Product Detail View)**
   - Giao diện người dùng: Client Web (`http://localhost:5173`)
   - Đặc tả: Hiển thị ảnh sản phẩm, tên, giá, mô tả, ô nhập số lượng (chỉ nhận số nguyên dương >= 1) và nút "Thêm vào giỏ hàng".

2. **Pool B — FR-07: Giỏ hàng (Shopping Cart)**
   - Giao diện người dùng: Client Web (`http://localhost:5173`)
   - Đặc tả: Hiển thị các sản phẩm trong giỏ, cập nhật số lượng, tính tổng tiền ("Tổng cộng"), nút xóa có confirm dialog và tiếp tục mua sắm.

3. **Pool C — FR-14: Quản lý danh mục (Category CRUD) & FR-12 Access Control**
   - Giao diện người dùng: Web Admin (`http://localhost:5174`) & Backend API (`http://localhost:3000`)
   - Đặc tả: Phân hệ Admin chỉ dành cho tài khoản role `admin`. Admin có quyền Xem, Thêm mới, Xóa danh mục sản phẩm. Tên danh mục bắt buộc không được rỗng.

---

## 3. Task 1 — AI-Generated Automation Scripts & Human Review

### 3.1 Cấu Trúc Kiểm Thử Data-Driven (Data-Driven Architecture)

Toàn bộ dữ liệu kiểm thử được phân tách hoàn toàn khỏi mã nguồn `.spec.js` và lưu trữ trong các file JSON chuyên biệt:
- [fr06.data.json](../eshop-automation/data/fr06.data.json)
- [fr07.data.json](../eshop-automation/data/fr07.data.json)
- [fr14.data.json](../eshop-automation/data/fr14.data.json)

### 3.2 Ứng Dụng Đủ 3 Assertion Patterns

Bộ script tự động áp dụng đầy đủ 3 dạng kiểm chứng theo đúng yêu cầu:
1. **Visibility & Text Assertion:** Kiểm tra sự xuất hiện của tiêu đề, nút bấm, nhãn bảng và nội dung văn bản (`expect(locator).toBeVisible()`, `toHaveText()`).
2. **State Assertion:** Kiểm tra sự thay đổi trạng thái UI/Form sau thao tác như reset ô nhập về rỗng (`toHaveValue('')`), số lượng vật thể bị gỡ khỏi DOM (`not.toBeVisible()`).
3. **Network / API Interception Assertion:** Sử dụng `page.waitForResponse(...)` để kiểm tra trực tiếp HTTP Status (200, 201, 401, 403) và dữ liệu JSON trả về từ Backend API (`/api/cart`, `/api/categories`).

### 3.3 Thống Kê Chạy Kiểm Thử Đa Trình Duyệt (Multi-Browser Execution)

- **Số trình duyệt cấu hình:** 3 trình duyệt (**Chromium**, **Firefox**, **WebKit**).
- **Tổng số kịch bản:** 36 test cases (12 TCs / feature).
- **Tổng số lượt test runs:** 108 runs (36 TCs × 3 browsers).
- **Báo cáo HTML Metadata:** Đã chèn thông tin bắt buộc `"Run by: 23127376"` và timestamp ISO vào tiêu đề/metadata của Playwright HTML Reporter.

| Tính năng | Trình duyệt | Số TCs | Lượt Pass | Lượt Fail (Bắt Bug SUT) |
| :--- | :---: | :---: | :---: | :---: |
| **FR-06: Chi tiết sản phẩm** | Chromium / Firefox / WebKit | 12 | 12 | 24 (Do lỗi SUT single-click & invalid qty) |
| **FR-07: Giỏ hàng** | Chromium / Firefox / WebKit | 12 | 18 | 18 (Do lỗi mất giỏ hàng F5 & trùng dòng) |
| **FR-14: Quản lý danh mục** | Chromium / Firefox / WebKit | 12 | 22 | 14 (Do lỗi RBAC & tên rỗng/whitespace) |
| **TỔNG CỘNG** | **3 Browsers** | **36 TCs** | **52 Passes** | **56 Fails (Bằng chứng lỗi SUT)** |

---

### 3.4 Phân Tích Đánh Giá Rà Soát Của Con Người (Human Review & Gap Analysis)

Trong quá trình đồng hành cùng AI Agent (Antigravity), sinh viên đã phát hiện và khắc phục các hạn chế kỹ thuật của AI:

1. **Snippet Tunnel Vision & Lỗi nhầm Locator:**
   - *Vấn đề:* Ban đầu AI tự bịa selector giả định `.quantity-input` trên trang giỏ hàng.
   - *Khắc phục:* Sinh viên rà soát mã nguồn React thật `Cart.jsx`, phát hiện số lượng hiển thị trong ô thẻ `<td>` chứ không dùng `<input>`, từ đó định hướng AI chỉnh sửa selector chính xác 100%.

2. **Strict Mode Violation khi lọc text trùng lặp:**
   - *Vấn đề:* AI dùng `locator('table tbody tr').filter({ hasText: 'A' })` dẫn đến lỗi trùng lặp khi ký tự 'a' xuất hiện trong nút "Xóa" hoặc các danh mục khác.
   - *Khắc phục:* Sinh viên yêu cầu AI chuyển sang dùng Regex matcher exact `^A$` trên ô dữ liệu cột 2 `td:nth-child(2)`.

3. **Cấu hình Cổng (Port Misconfiguration):**
   - *Vấn đề:* AI nhầm lẫn giữa cổng Client Web (`5173`) và Web Admin (`5174`), dẫn đến truy cập sai phân hệ khi test FR-14.
   - *Khắc phục:* Sinh viên phát hiện và chỉnh sửa `adminUrl` trong `data/fr14.data.json` và `playwright.config.js` về cổng `5174`.

4. **Tránh Anti-pattern Flaky Wait:**
   - *Vấn đề:* AI từng chèn `page.waitForTimeout(3000)` cứng gây flaky test.
   - *Khắc phục:* Thay thế hoàn toàn bằng `page.waitForResponse(...)` và locator assertion động.

---

### 3.5 Báo Cáo Lỗi Phát Hiện Trên SUT (SUT Bug Reports)

Báo cáo chi tiết 5 lỗi nghiêm trọng tìm được trên SUT qua bộ kịch bản tự động:

#### Bug 1 (FR-06): Nút "Thêm vào giỏ hàng" yêu cầu click 2 lần
- **Mô tả:** Click 1 lần nút "Thêm vào giỏ hàng" không gửi request API POST `/api/cart`. Phải click 2 lần mới ghi nhận.
- **Bằng chứng kiểm thử:** Test case `TC04` bắt timeout ở `page.waitForResponse` 3 giây và thất bại đúng như kỳ vọng.

#### Bug 2 (FR-07): Giỏ hàng chỉ lưu ở React State, mất dữ liệu khi Refresh
- **Mô tả:** Thao tác thêm vào giỏ chỉ thay đổi React state cục bộ, không lưu xuống CSDL backend `/api/cart`. Khi F5 trang web giỏ hàng bị quay về rỗng.
- **Bằng chứng kiểm thử:** `TC06` của FR-07 dùng Network Assertion bắt API fail.

#### Bug 3 (FR-07): Thêm sản phẩm trùng tạo dòng mới thay vì cộng dồn số lượng
- **Mô tả:** Khi thêm cùng 1 sản phẩm 2 lần, giỏ hàng tạo ra 2 dòng riêng biệt thay vì cộng dồn số lượng vào dòng hiện tại.
- **Bằng chứng kiểm thử:** `TC02` của FR-07 kiểm tra số lượng dòng `tbody tr` bị thừa.

#### Bug 4 (FR-14): Hỏng phân quyền truy cập RBAC (Security Vulnerability)
- **Mô tả:** Tài khoản người dùng thường (`role = 'user'`) vẫn có thể gửi request `POST /api/categories` và tạo danh mục thành công (Status 200) do backend `authenticateToken` không kiểm tra `role === 'admin'`.
- **Bằng chứng kiểm thử:** `TC09` của FR-14 assert status `401/403` bị thất bại do backend trả về `200`.

#### Bug 5 (FR-14): Cho phép tạo danh mục với tên rỗng và khoảng trắng
- **Mô tả:** Giao diện Admin không có thuộc tính `required` và Backend không validate chuỗi rỗng `""` hoặc `"   "`, dẫn đến CSDL chứa các danh mục rỗng.
- **Bằng chứng kiểm thử:** `TC05` và `TC06` của FR-14 assert không xuất hiện hàng rỗng bị fail.

---

## 4. Task 2 — Video Demo & Agent Skill

### 4.1 Video Demo (YouTube Unlisted)

- **Link Video YouTube:** `https://youtu.be/oWQxS3hL81s`
- **Nội dung thuyết minh trong video:**
  - Camera thuyết trình tiếng việt.
  - Trình bày quy trình chạy bộ kịch bản tự động Playwright đa trình duyệt.
  - Phân tích chi tiết 1 lỗi AI tạo ra và cách sinh viên khắc phục.

### 4.2 Agent Skill Định Nghĩa Quy Trình (AI Agent Skill)

- Sinh viên đã thiết kế file Agent Skill [skills/SKILL.md](../skills/SKILL.md) quy định ngặt nghèo luồng làm việc AI-First:
  1. Yêu cầu sinh từng bước (Skeleton -> Negative -> Network Assertion -> Report Config).
  2. Ràng buộc Data-driven 100% từ file JSON.
  3. Bắt buộc 3 pattern assertion.
  4. Tự động ghi nhật ký vào AI Audit Report sau mỗi bước.

---

## 5. Kết Luận

Bài tập HW04 đã hoàn thành xuất sắc các mục tiêu đề ra:
- Xây dựng thành công bộ script Playwright 36 test cases phủ đủ 3 tính năng.
- Chạy thử nghiệm thành công 108 runs trên 3 trình duyệt (Chromium, Firefox, WebKit).
- Phát hiện 5 lỗi nghiêm trọng trên hệ thống SUT EShop.
- Đảm bảo tính trung thực với đầy đủ nhật ký AI Audit Report và tài liệu minh chứng.
