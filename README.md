# Hệ thống bán mũ POS

Hệ thống quản lý bán hàng tại quầy (Point of Sale) chuyên dụng cho cửa hàng bán mũ, được xây dựng với Angular 20 và TypeScript.

## 🚀 Tính năng chính

### 1. **Bán hàng (POS)**

- Giao diện bán hàng trực quan với giỏ hàng
- Tìm kiếm sản phẩm theo tên và danh mục
- Quản lý số lượng và thanh toán
- Tính toán tổng tiền tự động
- Hỗ trợ phiếu giảm giá

### 2. **Quản lý sản phẩm**

- CRUD đầy đủ cho sản phẩm
- Quản lý tồn kho với cảnh báo hết hàng
- Phân loại sản phẩm theo danh mục
- Upload hình ảnh sản phẩm
- Theo dõi giá vốn và giá bán

### 3. **Quản lý nhân viên**

- Quản lý thông tin nhân viên
- Phân quyền theo phòng ban
- Theo dõi hiệu suất bán hàng
- Quản lý lương và hoa hồng
- Thông tin liên hệ khẩn cấp

### 4. **Quản lý phiếu giảm giá**

- Tạo mã giảm giá tự động
- Hỗ trợ giảm giá theo % và số tiền cố định
- Giới hạn sử dụng và thời gian áp dụng
- Theo dõi số lần sử dụng
- Áp dụng cho sản phẩm/danh mục cụ thể

### 5. **Báo cáo & Thống kê**

- Báo cáo doanh thu theo ngày/tuần/tháng
- Top sản phẩm bán chạy
- Hiệu suất nhân viên
- Phân tích theo danh mục
- Xuất báo cáo CSV

## 🛠️ Công nghệ sử dụng

- **Frontend**: Angular 20, TypeScript, SCSS
- **State Management**: Angular Signals
- **Routing**: Angular Router với lazy loading
- **UI/UX**: Responsive design, Mobile-first
- **Icons**: Emoji icons (có thể thay thế bằng icon library)

## 📱 Responsive Design

- **Desktop**: Layout 2 cột với sidebar cố định
- **Tablet**: Layout tối ưu cho màn hình trung bình
- **Mobile**: Sidebar ẩn với menu hamburger, layout 1 cột

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Angular CLI 20+

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd banmu

# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Mở trình duyệt tại http://localhost:4200
```

### Build cho production

```bash
npm run build
```

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── modules/           # Các module chính
│   │   ├── pos/          # Module bán hàng
│   │   ├── products/     # Module quản lý sản phẩm
│   │   ├── staff/        # Module quản lý nhân viên
│   │   ├── coupons/      # Module phiếu giảm giá
│   │   └── reports/      # Module báo cáo
│   ├── services/         # Services
│   │   └── data.service.ts
│   ├── app.component.*   # Component chính
│   └── app.routes.ts     # Routing configuration
```

## 🎨 Giao diện

### Màu sắc chính

- **Primary**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Yellow)
- **Danger**: #ef4444 (Red)
- **Neutral**: #6b7280 (Gray)

### Typography

- **Font**: Inter, system fonts
- **Sizes**: 12px, 14px, 16px, 18px, 20px, 24px, 28px

## 🔧 Tính năng kỹ thuật

### State Management

- Sử dụng Angular Signals cho reactive state
- Centralized data service cho quản lý dữ liệu
- Optimistic updates cho UX tốt hơn

### Performance

- Lazy loading cho các module
- OnPush change detection strategy
- Virtual scrolling cho danh sách lớn
- Image optimization

### Accessibility

- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus management

## 📊 Dữ liệu mẫu

Hệ thống đi kèm với dữ liệu mẫu bao gồm:

- 6 sản phẩm mũ các loại
- 5 nhân viên với thông tin đầy đủ
- 3 phiếu giảm giá mẫu
- Dữ liệu báo cáo 15 ngày

## 🔮 Roadmap

### Version 2.0

- [ ] Tích hợp API backend
- [ ] Authentication & Authorization
- [ ] Real-time notifications
- [ ] Advanced reporting với charts
- [ ] Multi-store support

### Version 3.0

- [ ] Mobile app (Ionic/Capacitor)
- [ ] Offline support
- [ ] Inventory management
- [ ] Customer management
- [ ] Payment gateway integration

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Email**: support@banmu.com
- **Website**: https://banmu.com
- **GitHub**: https://github.com/banmu/pos-system

---

**Lưu ý**: Đây là phiên bản demo với dữ liệu mẫu. Để sử dụng trong production, cần tích hợp với backend API và database thực tế.
# Ban-Mu
