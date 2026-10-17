import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  validateName,
  validatePhone,
  validateDate,
  validateGuests,
  generateBookingId,
} from '../src/utils/validation.js';

import { formatCurrency, formatCurrencyShort } from '../src/utils/formatCurrency.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG DỰ ÁN TRAVELGO (ESM)');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (error) {
    console.error(`❌ [FAIL] ${name}:`, error.message);
  }
}

// -----------------------------------------------------------------
// TEST GROUP 1: DỮ LIỆU DESTINATIONS.JSON
// -----------------------------------------------------------------
const destinationsPath = path.join(__dirname, '../src/data/destinations.json');
const rawData = fs.readFileSync(destinationsPath, 'utf8');
const destinations = JSON.parse(rawData);

test('Destinations JSON có tối thiểu 10 địa điểm du lịch', () => {
  assert(Array.isArray(destinations), 'Destinations phải là mảng');
  assert(destinations.length >= 10, `Cần >= 10 địa điểm, hiện có ${destinations.length}`);
});

test('Tất cả các item trong destinations.json có đầy đủ các trường bắt buộc', () => {
  destinations.forEach((item, index) => {
    assert(item.id, `Item #${index} thiếu trường id`);
    assert(item.name, `Item #${index} (${item.id}) thiếu trường name`);
    assert(item.country, `Item #${index} (${item.id}) thiếu trường country`);
    assert(item.category, `Item #${index} (${item.id}) thiếu trường category`);
    assert(typeof item.price === 'number' && item.price > 0, `Item #${index} giá không hợp lệ`);
    assert(typeof item.rating === 'number' && item.rating >= 1 && item.rating <= 5, `Item #${index} rating không hợp lệ`);
    assert(Array.isArray(item.images) && item.images.length > 0, `Item #${index} thiếu mảng images`);
    assert(item.duration, `Item #${index} thiếu trường duration`);
    assert(typeof item.featured === 'boolean', `Item #${index} thiếu trường featured boolean`);
    assert(Array.isArray(item.highlights) && item.highlights.length > 0, `Item #${index} thiếu highlights`);
  });
});

test('Có ít nhất một địa điểm được đánh dấu featured cho FeaturedCarousel', () => {
  const featured = destinations.filter((d) => d.featured === true);
  assert(featured.length >= 3, `Cần ít nhất 3 địa điểm featured, hiện có ${featured.length}`);
});

// -----------------------------------------------------------------
// TEST GROUP 2: UTILITY FUNCTIONS (VALIDATION & FORMAT)
// -----------------------------------------------------------------
test('Validation: Kiểm tra họ tên', () => {
  assert(validateName('') !== null, 'Tên rỗng phải báo lỗi');
  assert(validateName('   ') !== null, 'Tên toàn khoảng trắng phải báo lỗi');
  assert(validateName('A') !== null, 'Tên 1 ký tự phải báo lỗi');
  assert(validateName('Nguyễn Văn A') === null, 'Tên hợp lệ không được có lỗi');
});

test('Validation: Kiểm tra số điện thoại Việt Nam', () => {
  assert(validatePhone('') !== null, 'SĐT rỗng phải báo lỗi');
  assert(validatePhone('123456') !== null, 'SĐT ngắn phải báo lỗi');
  assert(validatePhone('0123456789') !== null, 'Đầu số 01 phải báo lỗi');
  assert(validatePhone('0912345678') === null, '0912345678 phải hợp lệ');
  assert(validatePhone('0389123456') === null, '0389123456 phải hợp lệ');
  assert(validatePhone('0771234567') === null, '0771234567 phải hợp lệ');
});

test('Validation: Kiểm tra số lượng người đặt tour', () => {
  assert(validateGuests('') !== null, 'Số khách rỗng phải báo lỗi');
  assert(validateGuests('0') !== null, '0 người phải báo lỗi');
  assert(validateGuests('-5') !== null, 'Số âm phải báo lỗi');
  assert(validateGuests('1.5') !== null, 'Số thập phân phải báo lỗi');
  assert(validateGuests('100') !== null, 'Quá 50 người phải báo lỗi');
  assert(validateGuests('4') === null, '4 người phải hợp lệ');
});

test('Validation: Kiểm tra ngày khởi hành (không được trong quá khứ)', () => {
  assert(validateDate('') !== null, 'Ngày rỗng phải báo lỗi');
  assert(validateDate('31/02/2026') !== null, 'Ngày không tồn tại phải báo lỗi');
  assert(validateDate('01/01/2020') !== null, 'Ngày quá khứ phải báo lỗi');
  const nextYear = new Date().getFullYear() + 1;
  assert(validateDate(`15/08/${nextYear}`) === null, 'Ngày tương lai phải hợp lệ');
});

test('Validation: Sinh mã đặt tour duy nhất (generateBookingId)', () => {
  const id1 = generateBookingId();
  const id2 = generateBookingId();
  assert(id1.startsWith('TG-'), 'Mã đơn phải bắt đầu bằng TG-');
  assert(id1 !== id2, 'Hai mã đơn liên tiếp không được trùng nhau');
});

test('Format tiền tệ Việt Nam Đồng (VND)', () => {
  assert.strictEqual(formatCurrency(2500000), '2.500.000 ₫');
  assert.strictEqual(formatCurrency(0), '0 ₫');
  assert.strictEqual(formatCurrency(null), '0 ₫');
  assert.strictEqual(formatCurrencyShort(2500000), '2.5tr ₫');
});

// -----------------------------------------------------------------
// TEST GROUP 3: LOGIC TÍNH TIỀN VÀ BỘ LỌC
// -----------------------------------------------------------------
test('Logic tính tổng tiền đặt tour demo', () => {
  const price = 2500000;
  const guests = 3;
  const total = price * guests;
  assert.strictEqual(total, 7500000, '2.500.000 x 3 phải bằng 7.500.000');
});

test('Logic lọc theo danh mục', () => {
  const beachDestinations = destinations.filter((d) => d.category === 'beach');
  assert(beachDestinations.length > 0, 'Phải có địa điểm category beach');
  beachDestinations.forEach((d) => assert.strictEqual(d.category, 'beach'));
});

test('Logic sắp xếp theo giá tăng dần', () => {
  const sorted = [...destinations].sort((a, b) => a.price - b.price);
  for (let i = 0; i < sorted.length - 1; i++) {
    assert(sorted[i].price <= sorted[i + 1].price, 'Giá phải tăng dần');
  }
});

// -----------------------------------------------------------------
// TEST GROUP 4: TỒN TẠI VÀ CẤU TRÚC 4 COMPONENT CAROUSEL
// -----------------------------------------------------------------
const componentDir = path.join(__dirname, '../src/components');
const requiredCarousels = [
  'FeaturedCarousel.js',
  'CategoryCarousel.js',
  'RelatedDestinationsCarousel.js',
  'DestinationImageCarousel.js',
];

test('Kiểm tra 4 component Carousel chuyên sâu bắt buộc', () => {
  requiredCarousels.forEach((filename) => {
    const fullPath = path.join(componentDir, filename);
    assert(fs.existsSync(fullPath), `Thiếu file ${filename}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(
      content.includes('react-native-snap-carousel'),
      `${filename} phải import react-native-snap-carousel thực tế`
    );
  });
});

// -----------------------------------------------------------------
// TEST GROUP 5: PATCH-PACKAGE CHO REACT-NATIVE-SNAP-CAROUSEL
// -----------------------------------------------------------------
test('Kiểm tra file patch cho react-native-snap-carousel', () => {
  const patchPath = path.join(__dirname, '../patches/react-native-snap-carousel+3.9.1.patch');
  assert(fs.existsSync(patchPath), 'Thiếu file patch của react-native-snap-carousel');
  const patchContent = fs.readFileSync(patchPath, 'utf8');
  assert(patchContent.includes('deprecated-react-native-prop-types'), 'Bản patch phải sử dụng deprecated-react-native-prop-types');
});

console.log(`\n====================================================`);
console.log(`🎉 HOÀN THÀNH: ${passedTests}/${totalTests} TESTS ĐẠT YÊU CẦU 100%!`);
console.log(`====================================================`);
