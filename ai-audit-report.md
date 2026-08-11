# AI Audit Report — Mẫu 5 mục cho mỗi Artifact

*Phụ lục bắt buộc đính kèm cho mọi bài tập có dùng AI (HW#01–HW#06, Seminar).*
*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học.*
*Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

---

## 1. Thông tin Sinh viên

| Mục | Giá trị |
| :--- | :--- |
| **Họ tên sinh viên (in hoa):** |HỒ GIA HUY |
| **MSSV:** | 23127376 |
| **Lớp / Khoá:** |23KTPM2 / 23CLC |
| **Mã bài tập (ví dụ HW#00, HW#02):** |HW02 |
| **Ngày làm bài:** |07/08/2026 |
| **Công cụ AI đã dùng:** | Gemini, Antigravity |
| **Công cụ AI đã dùng:** | `[X] Có`  `[] Không` |

---

## 2. Hướng dẫn (đọc trước khi điền)
* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan…).
* Dán nguyên văn prompt — **KHÔNG** paraphrase.
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).
* Gắn nhãn: `VALID` / `INVALID` / `INCOMPLETE`.
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.
* Hiển thị bản sửa với phần thay đổi được tô sáng.
* *Hàng mẫu in nghiêng — thay trước khi nộp.*

---

## 3. Bảng Audit — 1 hàng / artifact

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB) | (5) Bản SV sửa |
| :--- | :--- | :--- | :--- | :--- |
| **Artifact #1**  Thời Gian : 07/08/2026 20:20 <br> Công cụ: Antigravity <br> Prompt: "Đọc file data/fr06.data.json và spec FR-06, viết skeleton Playwright test cho 3 case positive trước..."| AI sinh code test TC01, TC02_03 dùng data-driven, nhưng dùng các class selector giả định như `.product-image`. | INCOMPLETE | Code logic đúng, nhưng class giả định không khớp thực tế. Lỗi kinh điển của AI khi không thấy DOM. (Maintainability - ISTQB). | Giữ nguyên cấu trúc, tự review và yêu cầu AI sửa lại locator (`img.w-full.h-auto`) khi có web thật. |
| **Artifact #2**  Thời Gian : 07/08/2026 20:22 <br> Công cụ: Antigravity <br> Prompt: "Thêm case negative (5,6,7,8,9) — dùng cùng file test, thêm assertion..." | AI sinh vòng lặp cho các case nhập quantity sai, assert kết hợp bắt lỗi UI (`.error-message`) hoặc HTML5 `validationMessage`. | VALID | Cách viết assertion rất mạnh và bao quát (Robustness). Bắt được cả lỗi UI lẫn validation form. | Dùng luôn logic này. |
| **Artifact #3**  Thời Gian : 07/08/2026 20:23 <br> Công cụ: Antigravity <br> Prompt: "Thêm case 4 (single-click) và case 12 (robustness) — dùng page.waitForResponse..." | AI sinh TC04 dùng `waitForResponse` bắt POST API với timeout 3s để tự động fail test (chứng minh bug). TC12 test robustness. | VALID | Dùng API Intercept để bắt bug "click 2 lần" tự động, chuẩn nguyên lý Test Automation (Error Guessing/Regression). | Chỉ cần sửa lại route `/products/` thành `/product/`. |
| **Artifact #4**  Thời Gian : 07/08/2026 20:23 <br> Công cụ: Antigravity <br> Prompt: "Cấu hình playwright.config.js hiển thị 'Run by: 23127376'..." | AI thêm block `metadata: { 'Run by': '23127376' }` vào Playwright config. | VALID | Dùng metadata là giải pháp cấu hình chuẩn của Playwright để chèn tên vào Report. | Không cần sửa, dùng nguyên bản. |
| **Artifact #5**  Thời Gian : 07/08/2026 20:49 <br> Công cụ: Antigravity <br> Prompt: Sửa lại test chạy bị trắng trang do sai route /products/ và sai selector. | AI lội source code React, cập nhật URL thành `/product/:id` và tìm đúng các selector thật (`h1.text-3xl`, text="Đã thêm"). | VALID | Việc review thủ công phát hiện AI hiểu sai URL. Sau khi được định hướng, AI sửa lại code khớp 100% SUT. | Bản hoàn thiện cuối cùng của file `fr06-product-detail.spec.js`. |
| **Artifact #6** Thời Gian : 08/08/2026 23:35 <br> Công cụ: Antigravity <br> Prompt: "Đọc docs/eshop-spec.md (phần FR-XX) và data/frXX.data.json, viết skeleton Playwright test cho các case positive, dùng data-driven, chưa cần assertion phức tạp." | AI sinh file test data `fr07.data.json` và skeleton `fr07-shopping-cart.spec.js` với các test case positive cơ bản. Các selector là giả định, đã để lại lưu ý về bug ở FR-06 và FR-07 (trùng dòng/cộng dồn) để sinh viên quyết định cách assert. | VALID | Cung cấp khung test data và script ban đầu đúng định dạng JSON/Playwright. | Dùng nguyên bản skeleton. |
| **Artifact #7** Thời Gian : 08/08/2026 23:48 <br> Công cụ: Antigravity <br> Prompt: "Thêm case negative vào cùng file, assert input bị chặn hoặc có thông báo lỗi tương ứng." | AI sinh TC04 (nhập số lượng sai) và TC05 (xóa giỏ hàng cần confirm dialog). Đã ứng dụng logic assert State (check event dialog và value input bị chặn). | VALID | Áp dụng đúng State Assertion Pattern cho giao diện giỏ hàng. | Giữ lại các assertions. |
| **Artifact #8** Thời Gian : 08/08/2026 23:51 <br> Công cụ: Antigravity <br> Prompt: "tại tc02 thêm vào thời gian đợi 3s sau khi ấn thêm lần đầu vào giỏ hàng" | AI chèn `await page.waitForTimeout(3000);` vào TC02. Việc dùng wait cố định vi phạm rule 4 của AI-first strategy, sinh viên sẽ dùng đây làm case để review/fix trong Homework. | INCOMPLETE | Dùng sleep/waitForTimeout vi phạm best practices của Playwright (Flaky Test - ISTQB). | Sửa lại bằng cách dùng locator assertion chờ trạng thái hiển thị. |
| **Artifact #9** Thời Gian : 08/08/2026 23:53 <br> Công cụ: Antigravity <br> Prompt: "Đọc docs/api_specification.md để biết đúng endpoint, thêm case cần assert qua waitForResponse/page.route() để kiểm tra request nào thực sự được gọi (đối chiếu bug đã biết ở mục 5)." | AI sinh TC06 dùng `waitForResponse` bắt POST API `/api/cart` với timeout 3s để tự động fail test (chứng minh bug giỏ hàng chỉ lưu React state, không lưu xuống DB). Đảm bảo rule yêu cầu có Network Assertion Pattern. | VALID | Sử dụng Network Interception để kiểm tra tính toàn vẹn giữa FE và BE (API-Driven Testing - ISTQB). | Dùng nguyên bản logic. |
| **Artifact #10** Thời Gian : 10/08/2026 21:30 <br> Công cụ: Antigravity <br> Prompt: "hoàn thiện 12 test cases cho fr07 và sửa lỗi timeout tc04" | AI ban đầu tự giả định selector `.quantity-input` trên trang giỏ hàng. Sau khi tự lội source code React `Cart.jsx`, AI phát hiện trang giỏ hàng hiển thị số lượng dạng text `<td>` chứ không có `<input>`, từ đó sửa TC04 nhập số lượng ở trang chi tiết rồi chuyển bằng `a[href="/cart"]` và kiểm tra thẻ `<td>`. | INCOMPLETE | AI ban đầu bị "Snippet Tunnel Vision" khi giả định selector không có trong SUT. Sau khi đọc mã nguồn thật, AI sửa lại chính xác 100%. | Phê duyệt và áp dụng logic kiểm tra thẻ `<td>` cột số lượng trên giao diện thật. |
| **Artifact #11** Thời Gian : 10/08/2026 23:27 <br> Công cụ: Antigravity <br> Prompt: "dựa vào implementation_plan và Eshop SUT đã biết viết file data để test fr14" | AI đối chiếu file đặc tả `implementation_plan.md` và mã nguồn Admin FE `frontend-admin/src/App.jsx` để sinh file `data/fr14.data.json` chuẩn cấu trúc JSON. Bao gồm tài khoản Admin/User, mảng valid (chuẩn, 1 ký tự, ký tự đặc biệt, tên dài), mảng invalid (rỗng, khoảng trắng), danh mục ràng buộc sản phẩm và labels UI. | VALID | Phân tách dữ liệu kiểm thử đạt chuẩn Data-Driven (Separation of Concerns - ISTQB), bám sát 100% SUT. | Tiếp nhận file `data/fr14.data.json` để dùng cho kịch bản tự động hóa FR-14. |
| **Artifact #12** Thời Gian : 10/08/2026 23:33 <br> Công cụ: Antigravity <br> Prompt: "Áp dụng SKILL.md và data/fr14.data.json làm Fr14 với" (Bước 1: Skeleton + Positive Cases) | AI sinh skeleton Playwright test và các positive test cases (TC01 đến TC04) cho FR-14 Quản lý Danh mục trong file `eshop-automation/tests/fr14-category-management.spec.js`, đọc dữ liệu từ `data/fr14.data.json`. | INCOMPLETE | AI dùng sai URL mặc định (port 5173 thay vì 5174) và thiếu luồng login Admin ban đầu (Test Environment Configuration - ISTQB). | Rà soát SUT thực tế và chỉ đạo AI cập nhật đúng luồng đăng nhập Admin và URL ở Artifact #13. |
| **Artifact #13** Thời Gian : 10/08/2026 23:38 <br> Công cụ: Antigravity <br> Prompt: "TC01 sai với thực tế hãy xem lại SUT đã cung cấp để fix" | AI rà soát mã nguồn SUT `frontend-admin/src/App.jsx` và DB seed `backend/database.js`, cập nhật `adminUrl` (http://localhost:5174), thêm luồng đăng nhập Admin (`admin@eshop.com`), chuyển tab sidebar "Danh mục" và assert thẻ `h2` ("Quản lý Danh mục") cùng bảng danh mục thực tế. | VALID | Rà soát mã nguồn SUT giúp xác định chính xác locator và quy trình đăng nhập thực tế (Test Implementation & Execution - ISTQB). | Sử dụng bản sửa hoàn thiện này cho TC01 và setup `beforeEach`. |
| **Artifact #14** Thời Gian : 10/08/2026 23:45 <br> Công cụ: Antigravity <br> Prompt: "Locator: locator('table tbody tr').filter({ hasText: 'A' }) ... Error: strict mode violation..." | AI xử lý lỗi Strict Mode Violation ở TC03 bằng cách tinh chỉnh locator từ tìm kiếm chuỗi chứa (contains) trên toàn bộ hàng `tr` sang lọc chính xác Regex (`^A$`) trên ô dữ liệu `td:nth-child(2)` (cột Tên danh mục), loại bỏ xung đột ký tự 'a' trong chữ "Xóa" hoặc tên các danh mục khác. | VALID | Lọc Regex exact match đảm bảo tính ổn định và duy nhất của phần tử DOM trong Playwright (Test Automation Robustness - ISTQB). | Phê duyệt và áp dụng locator lọc Regex exact match cho TC03. |
| **Artifact #15** Thời Gian : 11/08/2026 10:22 <br> Công cụ: Antigravity <br> Prompt: "Sửa test case 5 đến 8 chuẩn Data-driven đọc hoàn toàn từ file fr14.data.json." | AI refactor 4 test cases Negative & Edge (TC05 đến TC08) trong `eshop-automation/tests/fr14-category-management.spec.js` sử dụng 100% dữ liệu động từ `data/fr14.data.json` (bao gồm `invalidCategories.empty`, `invalidCategories.whitespace`, `categoryToDelete`, `categoryWithProducts`), loại bỏ hoàn toàn các chuỗi hardcode. | VALID | Tách biệt hoàn toàn test data và logic kiểm thử tuân thủ nguyên lý Data-Driven Testing (Separation of Concerns - ISTQB). | Phê duyệt và áp dụng 100% mã nguồn testcase negative TC05 - TC08. |
| **Artifact #16** Thời Gian : 11/08/2026 10:32 <br> Công cụ: Antigravity <br> Prompt: "Đọc docs/api_specification.md để biết đúng endpoint, thêm case cần assert qua waitForResponse/page.route() (TC09-TC12) kiểm tra RBAC và API POST/DELETE." | AI bổ sung 4 test cases Network/API Assertion & Edge cases (TC09 đến TC12) chuẩn Data-driven bắt request `POST /api/categories` và `DELETE /api/categories/:id`, kết hợp kiểm tra hàng bị xóa biến mất khỏi UI (`not.toBeVisible()`) ở TC11. | VALID | Sử dụng Network Interception (`page.waitForResponse`) để bắt lỗi phân quyền RBAC và kiểm tra tính toàn vẹn giữa API BE và UI FE (Integration Testing & API Interception - ISTQB). | Tiếp nhận bản hoàn thiện 12 test cases FR-14 bằng Tiếng Việt có dấu. |




---

## 4. Tổng kết Độ chính xác AI
*Tổng hợp verdict từ Mục 3 và điền vào bảng dưới.*

| Chỉ số | Số lượng | Tỉ lệ |
| :--- | :---: | :---: |
| **Tổng artifact AI sinh đã audit** | 16 | 100% |
| **VALID** *(đúng, dùng nguyên)* | 12 | 75.0% |
| **INVALID** *(sai; loại bỏ)* | 0 | 0.0% |
| **INCOMPLETE** *(chấp nhận sau khi sửa)* | 4 | 25.0% |

---

## 5. Kết luận — Khi nào nên / không nên dùng AI?
*Viết 80–150 chữ mô tả pattern quan sát được. AI mạnh ở đâu? AI sai ở đâu? Khuyến nghị của bạn cho việc dùng AI trong loại công việc này?*

................................................................................................................................................................................................
................................................................................................................................................................................................
................................................................................................................................................................................................

---

## 6. Mandatory Disclosure (dán nguyên văn)

> "[Test case / script / dataset / báo cáo] này được sinh phiên bản đầu bởi [tên công cụ AI]; tôi đã rà soát và chỉnh sửa [phần X], bổ sung [edge case Y, Z]; [phần W] do tôi tự viết. AI Audit Report chi tiết đính kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm."

**Chữ ký:**

| | |
| :--- | :--- |
| **Họ tên sinh viên (in hoa):** |HỒ GIA HUY |
| **MSSV:** |23127376 |
| **Lớp / Khoá:** |23KTPM2 / 23CLC |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** |LÂM QUANG VŨ |
| **Ngày:** | |
| **Chữ ký:** | |

---

## Tham khảo
* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
* ISTQB Foundation Level Syllabus (latest version).
* Hardman, P. (2025). A Post-AI Learning Taxonomy.
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
* Anthropic (2025). Building reliable AI test agents — engineering blog.
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.