# PHÂN TÍCH VÀ ĐÁNH GIÁ PHẢN BIỆN AI (AI CRITIQUE)

> **Môn học:** CS423 / CSC15003 — Kiểm chứng Phần mềm  
> **Sinh viên:** HỒ GIA HUY  
> **MSSV:** 23127376  
> **Lớp:** 23KTPM2 / 23CLC  
> **Bài tập:** HW04 — Automation Testing (Playwright & AI-First Strategy)  

---

Trong quá trình thực hiện bài tập tự động hóa HW04 cho ứng dụng EShop, việc đồng hành cùng AI Agent đã giúp mình tiết kiệm rất nhiều thời gian viết code, nhưng đồng thời cũng bộc lộ nhiều điểm hạn chế mà nếu mình không tự tay rà soát thì bộ test sẽ không thể chạy đúng.

Cụ thể, khi phân tích tính năng **FR-06** và **FR-07**, AI ban đầu bị lỗi "đoán mò" selector theo cảm tính như `.product-image` hay `.quantity-input`. Đến khi mình tự lội mã nguồn React của ứng dụng SUT (`Cart.jsx`, `App.jsx`), mình mới phát hiện giao diện hiển thị số lượng giỏ hàng nằm trong ô thẻ `<td>` chứ không dùng ô `<input>`, buộc mình phải định hướng lại cho AI. 

Đặc biệt ở **FR-14 (Quản lý Danh mục)**, AI đã tạo ra locator `locator('table tbody tr').filter({ hasText: 'A' })` cho TC03. Lệnh này ngay lập tức dính lỗi **Strict Mode Violation** của Playwright vì ký tự 'A' bị trùng với chữ "Xóa" trên các dòng khác. Mình đã phải hướng dẫn AI sửa sang dùng lọc Regex exact `^A$` chính xác trên cột Tên danh mục `td:nth-child(2)`. Ngoài ra, AI còn bị nhầm cổng giữa trang Client (`port 5173`) và Web Admin (`port 5174`), làm script truy cập sai trang và không tìm thấy tab Sidebar "Danh mục". 

Chỉ khi mình yêu cầu AI làm đúng quy trình kỷ luật từng bước (Positive -> Negative -> Network Assertion -> Config) và tách 100% test data ra file JSON, bộ script mới chạy ổn định. Qua bài tập này, mình rút ra bài học là AI rất mạnh trong việc dựng khung code và gợi ý assertion pattern, nhưng sinh viên tụi mình mới là người làm chủ logic, phải kiểm tra mã nguồn thực tế và chịu trách nhiệm 100% cho kết quả kiểm thử.
