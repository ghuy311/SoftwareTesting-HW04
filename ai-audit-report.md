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
| **Artifact #6** | | | | |
| **Artifact #7** | | | | |
| **Artifact #8** | | | | |
| **Artifact #9** | | | | |
| **Artifact #10** | | | | |

---

## 4. Tổng kết Độ chính xác AI
*Tổng hợp verdict từ Mục 3 và điền vào bảng dưới.*

| Chỉ số | Số lượng | Tỉ lệ |
| :--- | :---: | :---: |
| **Tổng artifact AI sinh đã audit** | | 100\% |
| **VALID** *(đúng, dùng nguyên)* | | % |
| **INVALID** *(sai; loại bỏ)* | | % |
| **INCOMPLETE** *(chấp nhận sau khi sửa)* | | % |

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