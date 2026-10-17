# 🌴 TravelGo — Khám Phá Địa Điểm Du Lịch Việt Nam
> **Đồ án môn học: Lập trình di động (Mobile App Development)**  
> **Công nghệ trọng tâm:** React Native, Expo, NativeWind (Tailwind CSS) & **`react-native-snap-carousel`**.

---

## 📖 1. Giới thiệu dự án

**TravelGo** là ứng dụng di động khám phá tour du lịch tại Việt Nam dành cho giới trẻ, sinh viên và khách du lịch. Ứng dụng lấy thư viện **`react-native-snap-carousel` làm công nghệ cốt lõi**, mang lại trải nghiệm vuốt chạm, hiệu ứng thị giác hiện đại và mượt mà.

### Các màn hình chức năng:
1. **Khám phá (Explore / Home):**
   - Header chào mừng & thanh tìm kiếm điểm đến.
   - **`FeaturedCarousel`**: Carousel tour nổi bật (ảnh lớn, parallax scale, center snap, tự động cuộn autoplay, pagination dots).
   - **`CategoryCarousel`**: Carousel danh mục du lịch (Biển đảo, Núi rừng, Nghỉ dưỡng, Văn hóa...).
   - Danh sách "Dành cho bạn" với khả năng yêu thích trực tiếp.
2. **Chi tiết tour (Details):**
   - **`DestinationImageCarousel`**: Album ảnh chất lượng cao dạng slider full-width kèm dot pagination & bộ đếm ảnh.
   - Thông tin hành trình: Giá, thời lượng, mô tả, trải nghiệm nổi bật (highlights), lưu ý đặt tour.
   - **`RelatedDestinationsCarousel`**: Carousel các tour tương tự cùng danh mục.
   - Nút chia sẻ, thêm/bỏ yêu thích tức thì và nút "Đặt tour ngay".
3. **Tìm kiếm & Bộ lọc nâng cao (Search):**
   - Tìm kiếm thời gian thực theo tên địa điểm, quốc gia, mô tả.
   - Lọc theo danh mục và khoảng giá (min - max).
   - Sắp xếp: Giá tăng dần, giá giảm dần, đánh giá cao nhất.
4. **Yêu thích (Favorites):**
   - Lưu trữ danh sách yêu thích vĩnh viễn qua `AsyncStorage`.
   - Trạng thái đồng bộ tự động với trang chủ và trang chi tiết.
5. **Đặt tour Demo & Lịch sử (Booking):**
   - Form đặt tour xác thực: Họ tên (>= 2 ký tự), SĐT Việt Nam (đầu số 03, 05, 07, 08, 09), Ngày khởi hành (DD/MM/YYYY không trong quá khứ), Số khách (1 - 50).
   - Tự động nhân đơn giá x số lượng khách để ra tổng tiền.
   - Sinh mã đặt tour duy nhất định dạng `TG-TIMESTAMP-RANDOM`.
   - Lưu lịch sử vào `AsyncStorage`, hỗ trợ hủy đặt tour có hộp thoại xác nhận.
6. **Cá nhân (Profile):**
   - Thống kê số lượng tour yêu thích, số đơn đặt tour.
   - Hộp thoại giới thiệu thông tin đồ án & phiên bản.

---

## 🎯 2. Chuyên sâu về `react-native-snap-carousel`

Dự án triển khai **4 loại Carousel riêng biệt** với các thuộc tính kỹ thuật chuyên sâu:

| Tên Component | Mục đích | Thuộc tính kỹ thuật chính |
|---|---|---|
| **`FeaturedCarousel`** | Tour nổi bật trang chủ | `inactiveSlideScale={0.88}`, `inactiveSlideOpacity={0.65}`, `autoplay={true}`, `loop={true}`, `Pagination` |
| **`CategoryCarousel`** | Danh mục trải nghiệm | `activeSlideAlignment="start"`, `inactiveSlideScale={1}`, `itemWidth={125}`, `enableSnap={true}` |
| **`RelatedDestinationsCarousel`** | Tour liên quan trang chi tiết | `activeSlideAlignment="start"`, `inactiveSlideScale={0.94}`, `itemWidth={240}` |
| **`DestinationImageCarousel`** | Album ảnh chi tiết | `itemWidth={width}`, `sliderWidth={width}`, `Pagination` đồng bộ dots & counter |

### Giải thích các thuộc tính quan trọng:
- **`sliderWidth`**: Chiều rộng của toàn bộ container slider (thường lấy từ `useWindowDimensions().width` hoặc `Dimensions.get('window').width`).
- **`itemWidth`**: Chiều rộng thực tế của mỗi slide. Đối với `FeaturedCarousel`, `itemWidth` được đặt bằng `82% sliderWidth` để tạo khoảng trống nhìn thấy 2 slide bên cạnh.
- **`inactiveSlideScale`** (VD: `0.88`): Tỷ lệ thu nhỏ của các slide ở hai bên so với slide trung tâm. Giúp slide ở giữa nổi bật hẳn lên.
- **`inactiveSlideOpacity`** (VD: `0.65`): Độ trong suốt của các slide không active, tạo hiệu ứng chiều sâu 3D (depth effect).
- **`onSnapToItem`**: Callback được gọi mỗi khi carousel chuyển slide và "snap" vào vị trí mới. Dùng để cập nhật `activeSlide` state, đồng bộ với `Pagination`.
- **`Pagination`**: Component cung cấp thanh chấm tròn (dots) biểu diễn trang hiện tại, hỗ trợ click vào dot để chuyển slide (`tappableDots={true}`).
- **Quản lý vòng đời (Lifecycle):** Component sử dụng `useRef(isMounted)` và ngắt `loop`/`autoplay` khi unmount hoặc khi dữ liệu chỉ có 1 phần tử để tránh memory leak.

---

## 🛠️ 3. Xử lý tương thích `react-native-snap-carousel` trên React Native mới

### Vấn đề kỹ thuật:
`react-native-snap-carousel` phiên bản gốc (3.9.1) sử dụng `ViewPropTypes` từ module `'react-native'`. Từ React Native 0.69 trở đi (và Expo SDK 50+), `ViewPropTypes` đã bị loại bỏ khỏi core, dẫn đến lỗi:  
`TypeError: Cannot read properties of undefined (reading 'style')`

### Giải pháp kỹ thuật trong dự án:
1. Cài đặt thư viện chính thức thay thế: `deprecated-react-native-prop-types`.
2. Áp dụng công cụ **`patch-package`**:
   - Tự động thay thế import `ViewPropTypes` trong `Carousel.js`, `Pagination.js`, `PaginationDot.js`, `ParallaxImage.js`.
   - File patch lưu tại: `patches/react-native-snap-carousel+3.9.1.patch`.
   - Cấu hình `"postinstall": "patch-package"` trong `package.json` để mọi môi trường khi chạy `npm install` đều được tự động vá lỗi 100%.
3. Bổ sung lớp polyfill an toàn tại đầu file `App.js`.

---

## 🚀 4. Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu môi trường:
- Node.js >= 18 (Khuyến nghị LTS)
- NPM >= 9
- Thiết bị thật đã cài ứng dụng **Expo Go** (Android / iOS) HOẶC Android Emulator / iOS Simulator.

### Bước 1: Di chuyển vào thư mục dự án
```bash
cd TravelGo
```

### Bước 2: Cài đặt dependencies (patch tự động được áp dụng)
```bash
npm install
```

### Bước 3: Khởi chạy dự án với cache sạch
```bash
npx expo start -c
```

### Bước 4: Trải nghiệm ứng dụng
- **Trên Android Emulator:** Nhấn phím `a` trên terminal.
- **Trên iOS Simulator:** Nhấn phím `i` trên terminal (chỉ dành cho macOS).
- **Trên điện thoại thật:** Mở camera (iOS) hoặc app **Expo Go** (Android) quét mã QR hiển thị trên terminal.

---

## 🧪 5. Kết quả kiểm thử tự động (Unit Test)

Dự án tích hợp bộ kiểm thử tự động tại `tests/verify-app.mjs`:
```bash
node tests/verify-app.mjs
```

**Kết quả kiểm thử: 14/14 tests PASS 100%:**
- ✅ Destinations JSON có đầy đủ 12 địa điểm du lịch Việt Nam hợp lệ.
- ✅ Tất cả item có đầy đủ `id`, `name`, `country`, `category`, `price`, `rating`, `images`, `duration`, `highlights`.
- ✅ Validation: Kiểm tra họ tên (rỗng, ký tự ngắn).
- ✅ Validation: Định dạng số điện thoại Việt Nam (03, 05, 07, 08, 09).
- ✅ Validation: Số lượng người đặt tour (1 - 50 người, số nguyên dương).
- ✅ Validation: Ngày khởi hành (DD/MM/YYYY không trong quá khứ).
- ✅ Validation: Sinh mã đơn ngẫu nhiên duy nhất `TG-XXXXX`.
- ✅ Định dạng tiền tệ VND (`formatCurrency` -> `2.500.000 ₫`).
- ✅ Logic tính tổng tiền tour: `price * guests`.
- ✅ Logic lọc theo danh mục & sắp xếp theo giá / đánh giá.
- ✅ Kiểm tra sự tồn tại của 4 component `react-native-snap-carousel` chuyên sâu.
- ✅ Kiểm tra tính toàn vẹn của bản vá `patches/react-native-snap-carousel+3.9.1.patch`.

---

## 📦 6. Hướng dẫn đóng gói file APK Android

Nếu muốn xuất file cài đặt APK độc lập không cần Expo Go:

1. Cài đặt EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Đăng nhập tài khoản Expo:
   ```bash
   eas login
   ```
3. Cấu hình build:
   ```bash
   eas build:configure
   ```
4. Build file APK:
   ```bash
   eas build -p android --profile preview
   ```
Sau khi hoàn tất, hệ thống sẽ trả về đường dẫn tải trực tiếp file `.apk`.
